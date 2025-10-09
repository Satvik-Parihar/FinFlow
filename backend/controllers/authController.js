const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/user');
const Company = require('../models/company');
const PasswordReset = require('../models/PasswordReset');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const signup = asyncHandler(async (req, res) => {
    const { companyName, adminName, email, password, country } = req.body;
    if (!companyName || !adminName || !email || !password || !country) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    if (await User.findOne({ email })) {
        res.status(400);
        throw new Error('This email is already in use.');
    }
    if (await Company.findOne({ name: companyName })) {
        res.status(400);
        throw new Error('A company with this name is already registered.');
    }
    let defaultCurrency = 'USD';
    try {
        const { data } = await axios.get(`https://restcountries.com/v3.1/name/${country}?fields=currencies`);
        const currencyCode = Object.keys(data[0].currencies)[0];
        if (currencyCode) {
            defaultCurrency = currencyCode;
        }
    } catch (error) {
        console.warn(`Could not fetch currency for country: ${country}. Defaulting to USD.`);
    }
    const newCompany = await Company.create({ name: companyName, country, defaultCurrency });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = await User.create({
        name: adminName, email, password: hashedPassword, role: 'Admin',
        isTemporaryPassword: false, company_id: newCompany._id,
    });
    if (newAdmin) {
        res.status(201).json({
            message: 'Company and Admin created successfully.',
            token: generateToken(newAdmin._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id, name: user.name, email: user.email, role: user.role,
            company_id: user.company_id, isTemporaryPassword: user.isTemporaryPassword,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

const setPassword = asyncHandler(async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404); throw new Error('User not found.');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        res.status(400); throw new Error('Incorrect temporary password.');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isTemporaryPassword = false;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully.' });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        const temporaryPassword = crypto.randomBytes(8).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(temporaryPassword, salt);
        user.password = hashedPassword;
        user.isTemporaryPassword = true;
        await user.save();

        await PasswordReset.create({
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            temporaryPassword: temporaryPassword,
            company_id: user.company_id,
        });
    }
    res.status(200).json({ message: 'If an account with that email exists, a password reset has been initiated. Please contact your administrator for the new temporary password.' });
});

module.exports = { signup, signin, setPassword, forgotPassword };