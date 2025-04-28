const express = require('express');
const multer = require('multer');
const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee.controller'); // Ensure the import path is correct

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// POST route to create employee
router.post('/employees', upload.fields([
  { name: 'resume', maxCount: 1 }, 
  { name: 'profileImage', maxCount: 1 }
]), createEmployee);  

// GET route to fetch all employees
router.get('/employees', getAllEmployees);

// PUT route to update employee
router.put('/employees/:id', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]), updateEmployee);

//DELETE route
router.delete('/employees/:id', deleteEmployee);

module.exports = router;
