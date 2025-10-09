const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordResetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    temporaryPassword: { type: String, required: true },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);