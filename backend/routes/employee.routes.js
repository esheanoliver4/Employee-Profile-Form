const express = require('express');
const multer = require('multer');
const employeeController = require('../controllers/employee.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/employees', upload.fields([
  { name: 'resume', maxCount: 1 }, 
  { name: 'profileImage', maxCount: 1 }
]), employeeController.createEmployee);

module.exports = router;
