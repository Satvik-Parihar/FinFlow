const asyncHandler = require('express-async-handler');
const Expense = require('../models/expense');
const User = require('../models/user');

const createExpense = asyncHandler(async (req, res) => {
    const { description, originalAmount, originalCurrency, category, otherReason, expenseDate } = req.body;
    if (!description || !originalAmount || !originalCurrency) {
        res.status(400);
        throw new Error('Please provide description, amount, and currency.');
    }
    if (category === 'Other' && (!otherReason || otherReason.trim() === '')) {
        res.status(400);
        throw new Error('Please provide a reason for the "Other" category.');
    }

    let firstApproverId = null;
    
    // --- THIS IS THE CORRECTED LOGIC ---
    // Find the employee who is creating the expense.
    const employee = await User.findById(req.user.id);

    // Check if the employee has any managers assigned in their manager_ids array.
    if (employee && employee.manager_ids && employee.manager_ids.length > 0) {
        // If they do, assign the expense to the first manager in the list.
        firstApproverId = employee.manager_ids[0];
    }
    
    const newExpense = await Expense.create({
        description, originalAmount, originalCurrency, category,
        otherReason: category === 'Other' ? otherReason : undefined,
        expenseDate,
        user_id: req.user.id,
        company_id: req.user.company_id,
        // The status will now correctly be 'In Progress' if a manager is found.
        status: firstApproverId ? 'In Progress' : 'Pending',
        // The approver ID will now be correctly set to the manager's ID.
        currentApprover_id: firstApproverId,
    });
    res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
});

const getUserExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
});

const uploadReceipt = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400); throw new Error('Please upload a file');
    }
    console.log('File uploaded to server:', req.file.path);
    res.status(200).json({
        message: "File uploaded, OCR processing would happen here.",
        extractedData: {
            amount: 125.50,
            date: "2025-10-04",
            description: "Dinner at The Grand Restaurant"
        },
        receiptUrl: `/uploads/${req.file.filename}`
    });
});

module.exports = { createExpense, getUserExpenses, uploadReceipt };