const express = require('express');
const router = express.Router();
const {
    createEmployee, updateUser, getEmployees, deleteEmployee,
    getApprovalQueue, decideOnExpense,
    getTeamExpenses, getAllCompanyExpenses, resetPassword,
    getPasswordResets, resolvePasswordReset
} = require('../controllers/adminController');
const { protect, adminOrManager } = require('../middleware/authMiddleware');

router.use(protect, adminOrManager);

router.route('/employees').post(createEmployee).get(getEmployees);
router.route('/employees/:id').put(updateUser).delete(deleteEmployee);
router.post('/employees/:id/reset-password', resetPassword);

router.route('/approvals').get(getApprovalQueue);
router.route('/approvals/:id').put(decideOnExpense);

router.get('/team-expenses', getTeamExpenses);
router.get('/all-expenses', getAllCompanyExpenses);

router.route('/password-resets').get(getPasswordResets);
router.delete('/password-resets/:id', resolvePasswordReset);

module.exports = router;