// backend/models/approvalRule.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const approverStepSchema = new Schema({
    sequence: { type: Number, required: true },
    approver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const approvalRuleSchema = new Schema({
    name: { type: String, required: true },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    isManagerApprover: { type: Boolean, default: true },
    sequentialApprovers: [approverStepSchema],
    conditionalLogic: {
        percentage: { type: Number, min: 1, max: 100 },
        specificApprover_id: { type: Schema.Types.ObjectId, ref: 'User' },
        ruleType: { type: String, enum: ['Percentage', 'Specific', 'HybridOr', 'HybridAnd'] }
    },
}, { timestamps: true });

module.exports = mongoose.model('ApprovalRule', approvalRuleSchema);