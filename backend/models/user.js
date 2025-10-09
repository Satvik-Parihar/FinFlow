const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Employee'], required: true },
    isTemporaryPassword: { type: Boolean, default: true },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    manager_ids: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);