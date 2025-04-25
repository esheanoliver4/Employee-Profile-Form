const Employee = require('../models/employee.model');

const createEmployeeProfile = async (data) => {
  try {
    const newEmployee = new Employee(data);
    await newEmployee.save();
    return newEmployee;
  } catch (error) {
    throw new Error('Error creating employee profile');
  }
};

module.exports = { createEmployeeProfile };
