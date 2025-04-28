const Employee = require('../models/employee.model');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all employees from the database

    if (!employees || employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees found' });
    }

    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employees' });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phoneNumber,
      dob,
      gender,
      skills,
      department,
      address,
      isActive,
    } = req.body;
    let parsedSkills = [];
    if (skills) {
      try {
        parsedSkills = JSON.parse(skills); // Try parsing the skills field
      } catch (error) {
        // If skills is not a valid JSON string, assume it's a comma-separated string and split it
        parsedSkills = skills.split(',').map(skill => skill.trim());
      }
    }

    const updateFields = {
      name,
      email,
      phoneNumber,
      dob,
      gender,
      skills: parsedSkills,
      department,
      address,
      isActive,
    };

    // If resume or profileImage files are uploaded, update them too
    if (req.files) {
      if (req.files['resume']) {
        updateFields.resume = req.files['resume'][0].path;
      }
      if (req.files['profileImage']) {
        updateFields.profileImage = req.files['profileImage'][0].path;
      }
    }

    const employee = await Employee.findByIdAndUpdate(id, updateFields, { new: true });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, phoneNumber, dob, gender, skills, department, address, isActive } = req.body;
    if (!name || !email || !dob || !skills || !department) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const resume = req.files['resume'] ? req.files['resume'][0].path : null;
    const profileImage = req.files['profileImage'] ? req.files['profileImage'][0].path : null;

    const employee = new Employee({
      name,
      email,
      phoneNumber,
      dob,
      gender,
      skills: JSON.parse(skills),
      department,
      address,
      isActive,
      resume,
      profileImage,
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: "Profile Created Successfully",
      data: employee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Failed to delete employee.'
    });
  }
};
module.exports = {
  getAllEmployees,
  updateEmployee,
  createEmployee,
  deleteEmployee,
};
