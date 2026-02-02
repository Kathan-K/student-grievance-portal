const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { verifyToken } = require('../middlewares/authMiddleware');

// USER: Raise grievance
router.post('/raise', verifyToken, grievanceController.raiseGrievance);

// USER: View own grievances
router.get('/my', verifyToken, grievanceController.getMyGrievances);

// ADMIN: View all grievances
router.get('/all', verifyToken, grievanceController.getAllGrievances);

// ADMIN: Give solution
router.put('/solution/:id', verifyToken, grievanceController.giveSolution);

// USER: Satisfied / Not satisfied
router.put('/response/:id', verifyToken, grievanceController.respondToSolution);

module.exports = router;
