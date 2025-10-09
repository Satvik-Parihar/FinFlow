const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/user');
const Expense = require('../models/expense');
const Company = require('../models/company');
const PasswordReset = require('../models/PasswordReset');

const createEmployee = asyncHandler(async (req, res) => {
    const { name, email, role, manager_ids } = req.body;
    if (await User.findOne({ email })) {
        res.status(400);
        throw new Error('A user with this email already exists.');
    }
    const temporaryPassword = crypto.randomBytes(8).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);
    const newUser = await User.create({
        name, email, role, manager_ids,
        password: hashedPassword,
        company_id: req.user.company_id,
        isTemporaryPassword: true,
    });
    console.log(`Temporary Password for ${email}: ${temporaryPassword}`);
    res.status(201).json({
        message: `Employee account for ${name} created.`,
        employee: { _id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        temporaryPassword: temporaryPassword
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { role, manager_ids } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (role) {
        user.role = role;
    }
    if (manager_ids !== undefined) {
        user.manager_ids = manager_ids;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
});

const getEmployees = asyncHandler(async (req, res) => {
    const employees = await User.find({
        company_id: req.user.company_id,
    }).select('-password').sort({ name: 1 });
    res.status(200).json(employees);
});

const deleteEmployee = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    if (req.user.id === employeeId) {
        res.status(400); throw new Error("You cannot remove your own account.");
    }
    const deletedUser = await User.findByIdAndDelete(employeeId);
    if (!deletedUser) { res.status(404); throw new Error('User not found.'); }
    await Expense.deleteMany({ user_id: employeeId });
    res.status(200).json({ message: `User ${deletedUser.name} and their expenses removed.` });
});

const getTeamExpenses = asyncHandler(async (req, res) => {
    const teamMembers = await User.find({ manager_ids: req.user.id });
    const teamMemberIds = teamMembers.map(member => member._id);
    const expenses = await Expense.find({ user_id: { $in: teamMemberIds } })
        .populate('user_id', 'name email')
        .sort({ createdAt: -1 });
    res.status(200).json(expenses);
});

const getAllCompanyExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ company_id: req.user.company_id })
        .populate('user_id', 'name email')
        .sort({ createdAt: -1 });
    res.status(200).json(expenses);
});

const getApprovalQueue = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ currentApprover_id: req.user.id, status: 'In Progress' })
        .populate('user_id', 'name email');
    const company = await Company.findById(req.user.company_id);
    const baseCurrency = company.defaultCurrency;

    const expensesWithConvertedAmount = await Promise.all(expenses.map(async (expense) => {
        let convertedAmount = expense.originalAmount;
        if (expense.originalCurrency !== baseCurrency) {
            try {
                const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${expense.originalCurrency}`);
                const rate = data.conversion_rates[baseCurrency];
                convertedAmount = rate ? (expense.originalAmount * rate).toFixed(2) : 'N/A';
            } catch (error) {
                console.error('Currency conversion failed:', error.message);
                convertedAmount = 'N/A';
            }
        }
        return { ...expense.toObject(), convertedAmount, baseCurrency };
    }));
    res.json(expensesWithConvertedAmount);
});

const decideOnExpense = asyncHandler(async (req, res) => {
    const { decision, comment } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense || !expense.currentApprover_id || expense.currentApprover_id.toString() !== req.user.id) {
        res.status(404);
        throw new Error('Expense not found or you are not the current approver.');
    }

    expense.approvalHistory.push({
        approverId: req.user.id,
        approverName: req.user.name,
        status: decision,
        comment: comment,
    });

    if (decision === 'Rejected') {
        expense.status = 'Rejected';
    } else {
        expense.status = 'Approved';
    }
    
    expense.currentApprover_id = null;

    await expense.save();
    res.json(expense);
});

const resetPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const temporaryPassword = crypto.randomBytes(8).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);
    user.password = hashedPassword;
    user.isTemporaryPassword = true;
    await user.save();
    console.log(`Admin (${req.user.name}) reset password for ${user.email}.`);
    res.status(200).json({ temporaryPassword });
});

const getPasswordResets = asyncHandler(async (req, res) => {
    const requests = await PasswordReset.find({ company_id: req.user.company_id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
});

const resolvePasswordReset = asyncHandler(async (req, res) => {
    const request = await PasswordReset.findById(req.params.id);
    if (!request) {
        res.status(404);
        throw new Error('Reset request not found.');
    }
    if (request.company_id.toString() !== req.user.company_id.toString()) {
        res.status(403);
        throw new Error('Not authorized to resolve this request.');
    }
    await request.deleteOne();
    res.status(200).json({ message: 'Request marked as resolved.' });
});

module.exports = {
    createEmployee,
    updateUser,
    getEmployees,
    deleteEmployee,
    getApprovalQueue,
    decideOnExpense,
    getTeamExpenses,
    getAllCompanyExpenses,
    resetPassword,
    getPasswordResets,
    resolvePasswordReset,
};