const Employee = require('../models/employee.model');

exports.createEmployee = async (req, res) => {
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
      skills,
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
