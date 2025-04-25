const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
  },
  skills: [{
    type: String,
    required: [true, 'Skills are required'],
  }],
  department: {
    type: String,
    required: [true, 'Department is required'],
  },
  resume: {
    type: String,
    required: [true, 'Resume is required'],
  },
  profileImage: {
    type: String, 
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
}, {
  timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
