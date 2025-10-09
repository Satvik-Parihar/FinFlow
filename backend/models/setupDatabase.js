// backend/models/setupDatabase.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./user');
const Company = require('./company');
const Expense = require('./expense');
const ApprovalRule = require('./approvalRule');

const MONGO_URI = 'mongodb://localhost:27017/finflow';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected for seeding.');

        await User.deleteMany({});
        await Company.deleteMany({});
        await Expense.deleteMany({});
        await ApprovalRule.deleteMany({});
        console.log('Cleared existing data.');

        const company = await Company.create({
            name: 'Innovate Corp', country: 'USA', defaultCurrency: 'USD'
        });

        const hashedPassword = await bcrypt.hash('Password123!', 10);

        const manager = await User.create({
            name: 'Alice Manager', email: 'alice@innovate.corp', password: hashedPassword,
            role: 'Manager', isTemporaryPassword: false, company_id: company._id
        });

        const employee = await User.create({
            name: 'Bob Employee', email: 'bob@innovate.corp', password: hashedPassword,
            role: 'Employee', isTemporaryPassword: false, company_id: company._id,
            manager_id: manager._id
        });

        await ApprovalRule.create({
            name: 'Standard Manager Approval',
            company_id: company._id,
            isManagerApprover: true,
        });

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedDatabase();