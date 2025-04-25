import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './EmployeeProfileForm.css';
import departmentsData from './data/departments.json';
import skillsData from './data/skills.json';

const EmployeeProfileForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    skills: [],
    department: '',
    resume: null,
    profileImage: null,
    isActive: false,
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;

    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'file') {
      setForm((prev) => ({
        ...prev,
        [name]: e.target.files[0],
      }));
    } else if (type === 'select-multiple') {
      const selectedValues = Array.from(selectedOptions).map(option => option.value);
      setForm((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); 

  
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phoneNumber', form.phoneNumber);
    formData.append('dob', form.dob);
    formData.append('gender', form.gender); 
    formData.append('skills', form.skills);
    formData.append('department', form.department);
    formData.append('resume', form.resume); 
    formData.append('profileImage', form.profileImage); 
    formData.append('isActive', form.isActive);
    formData.append('address', form.address);

    try {
      const response = await axios.post('http://localhost:5000/api/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      setIsLoading(false); 
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Profile created successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message || 'Something went wrong.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: 'Error!',
        text: 'Submission failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div>
      <div className='header'>
        <h1>Employee Profile Form</h1>
      </div>
    <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="name">Name:</label>
      <input id="name" name="name" placeholder="Enter name" onChange={handleChange} required />
    </div>
  
    <div>
      <label htmlFor="email">Email:</label>
      <input id="email" type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
    </div>
  
    <div>
      <label htmlFor="phoneNumber">Phone Number:</label>
      <input id="phoneNumber" type="text" name="phoneNumber" placeholder="Enter phone number" onChange={handleChange} required />
    </div>
  
    <div>
      <label htmlFor="dob">Date of Birth:</label>
      <input id="dob" type="date" name="dob" onChange={handleChange} required />
    </div>
  
    <div>
      <label>Gender:</label>
      <div className="gender-options">
        <label>
          <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleChange} required /> Male
        </label>
        <label>
          <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleChange} /> Female
        </label>
        <label>
          <input type="radio" name="gender" value="other" checked={form.gender === 'other'} onChange={handleChange} /> Other
        </label>
      </div>
    </div>
  
    <div>
      <label htmlFor="skills">Skills:</label>
      <select id="skills" name="skills" multiple onChange={handleChange}>
        {skillsData.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
    </div>
  
    <div>
      <label htmlFor="department">Department:</label>
      <select id="department" name="department" onChange={handleChange}>
        <option value="">Select Department</option>
        {departmentsData.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>
    </div>
  
    <div>
      <label htmlFor="resume">Resume:</label>
      <input id="resume" type="file" name="resume" onChange={handleChange} />
    </div>
  
    <div>
      <label htmlFor="profileImage">Profile Image:</label>
      <input id="profileImage" type="file" name="profileImage" onChange={handleChange} />
    </div>
  
    <div>
      <label htmlFor="isActive">Is Active:</label>
      <label className="switch">
        <input id="isActive" type="checkbox" name="isActive" onChange={handleChange} />
        <span className="slider"></span>
      </label>
    </div>
  
    <div>
      <label htmlFor="address">Address:</label>
      <textarea id="address" name="address" placeholder="Enter address" onChange={handleChange}></textarea>
    </div>
  
    <button type="submit">Submit</button>
  
    {isLoading && (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )}
  </form>
  </div>
  );
};

export default EmployeeProfileForm;
