const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeRoutes = require('./routes/employee.routes'); // Import employee routes

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://esheanoliver:gapluse5566@cluster0.4p8fq0r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected successfully'))
.catch((err) => console.error('Database connection error:', err));

// Log every incoming request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);  // Log request details
  next();
});

// Register employee routes
app.use('/api', employeeRoutes);  // This makes /api/employees available

// Adding GET route to fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all employees from the database
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employees' });
  }
});

// Handle 404 (Route not found)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Server export
module.exports = app;
