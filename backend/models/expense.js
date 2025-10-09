const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const approvalHistorySchema = new Schema({
    approverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approverName: { type: String, required: true },
    status: { type: String, enum: ['Approved', 'Rejected'], required: true },
    comment: { type: String },
    approvedAt: { type: Date, default: Date.now }
});

const expenseSchema = new Schema({
    description: { type: String, required: true, trim: true },
    expenseDate: { type: Date, default: Date.now },
    originalAmount: { type: Number, required: true },
    originalCurrency: { type: String, required: true, uppercase: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: ['Flights', 'Hotels', 'Meals', 'Transport', 'Software', 'Office Supplies', 'Client Entertainment', 'Utilities', 'Health', 'Other'],
        default: 'Other'
    },
    otherReason: { type: String, trim: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'In Progress'], default: 'Pending' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    receiptUrl: { type: String },
    approvalRule_id: { type: Schema.Types.ObjectId, ref: 'ApprovalRule' },
    currentApprover_id: { type: Schema.Types.ObjectId, ref: 'User' },
    approvalHistory: [approvalHistorySchema],
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);