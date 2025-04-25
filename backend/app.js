const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeRoutes = require('./routes/employee.routes'); // Make sure the path is correct

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

// Register routes
app.use('/api', employeeRoutes);  // This makes /api/employees available

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Server export
module.exports = app;
