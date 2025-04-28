import React, { useState, useRef, useEffect } from 'react';
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
    countryCode: '+91',
    dob: '',
    gender: '',
    skills: [],
    department: '',
    resume: null,
    profileImage: null,
    isActive: false,
    address: '',
  });

  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);


  // References for form fields
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const dobRef = useRef();
  const genderMaleRef = useRef();
  const genderFemaleRef = useRef();
  const genderOtherRef = useRef();
  const skillsRef = useRef();
  const departmentRef = useRef();
  const resumeRef = useRef();
  const profileImageRef = useRef();
  const isActiveRef = useRef();
  const addressRef = useRef();
  const countryCodeRef = useRef();


  const getDepartmentName = (id) => {
    const department = departmentsData.find(dept => dept.id === id);
    return department ? department.name : 'Unknown Department';
  };

  const validateForm = () => {
    const errors = [];
  
    if (!form.name.trim()) errors.push("Name is required.");
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.push("Valid email is required.");
    if (!form.phoneNumber.trim() || !/^\d{10}$/.test(form.phoneNumber)) errors.push("Valid 10-digit phone number is required.");
    if (!form.dob) errors.push("Date of birth is required.");
    if (!form.gender) errors.push("Gender is required.");
    if (form.skills.length === 0) errors.push("Select at least one skill.");
    if (!form.department) errors.push("Department is required.");
    if (!form.address.trim()) errors.push("Address is required.");
    if (!isEditing && !form.resume) errors.push("Resume file is required.");
    if (!isEditing && !form.profileImage) errors.push("Profile image is required.");
  
    return errors;
  };
  

  const handleChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;
  
    if (name === 'name') {
      // Allow only alphabetic characters
      const alphabeticValue = value.replace(/[^A-Za-z ]/g, ''); 
      setForm({ ...form, [name]: alphabeticValue });
    } else if (type === 'checkbox') {
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
  

  const resetForm = () => {
    setForm({
      name: '', 
      email: '',
      phoneNumber: '',
      countryCode: '+91',
      dob: '',
      gender: '',
      skills: [],
      department: '',
      resume: null,
      profileImage: null,
      isActive: false,
      address: '',
    });

    nameRef.current.value = '';
    emailRef.current.value = '';
    phoneRef.current.value = '';
    dobRef.current.value = '';
    genderMaleRef.current.checked = false;
    genderFemaleRef.current.checked = false;
    genderOtherRef.current.checked = false;
    skillsRef.current.selectedIndex = -1;
    departmentRef.current.value = '';
    resumeRef.current.value = '';
    profileImageRef.current.value = '';
    isActiveRef.current.checked = false;
    addressRef.current.value = '';
    countryCodeRef.current.value = '+91';
    setIsEditing(false);           
    setEditingEmployeeId(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateForm();
    if (errors.length > 0) {
      Swal.fire({
        title: 'Form Incomplete',
        html: `<ul style="text-align: left;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phoneNumber', form.phoneNumber);
    formData.append('dob', form.dob);
    formData.append('gender', form.gender);
    formData.append('skills', JSON.stringify(form.skills));
    formData.append('department', form.department);
    formData.append('isActive', form.isActive);
    formData.append('address', form.address);
  
    if (form.resume && !isEditing) {
      formData.append('resume', form.resume);
    }
  
    if (form.profileImage && !isEditing) {
      formData.append('profileImage', form.profileImage);
    }
  
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:5000/api/employees/${editingEmployeeId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('http://localhost:5000/api/employees', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      setIsLoading(false);
  
      if (response.data.success) {
        Swal.fire('Success!', isEditing ? 'Profile updated successfully!' : 'Profile created successfully!', 'success');
        resetForm();
        fetchEmployees();
        setIsEditing(false);
        setEditingEmployeeId(null);
      } else {
        Swal.fire('Error!', response.data.message || 'Something went wrong.', 'error');
      }
    } catch (err) {
      console.error('Error during submission:', err);
      setIsLoading(false);
      Swal.fire('Error!', 'Submission failed. Please try again.', 'error');
    }
  };
  
  
  const handleEdit = (employee) => {
    setForm({
      name: employee.name || '',
      email: employee.email || '',
      phoneNumber: employee.phoneNumber || '',
      countryCode: employee.countryCode || '+91',
      dob: employee.dob ? employee.dob.split('T')[0] : '',
      gender: employee.gender || '',
      skills: employee.skills || [],
      department: employee.department || '',
      resume: null,
      profileImage: null,
      isActive: employee.isActive || false,
      address: employee.address || '',
    });
    setIsEditing(true);
    setEditingEmployeeId(employee._id);
  };
  
  const fetchEmployees = async () => {
    setFetchLoading(true);
    setFetchError(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      if (response.data && Array.isArray(response.data.data)) {
        setEmployees(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setFetchError('Error: Unexpected data format received');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setFetchError(`Failed to load employee data: ${error.message}`);
    } finally {
      setFetchLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this employee?');
    if (!confirm) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      Swal.fire('Deleted!', 'Employee profile has been deleted.', 'success');
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      Swal.fire('Error!', 'Failed to delete employee.', 'error');
    }
  };
  // Auto-refresh employee data every 60 seconds
  useEffect(() => {
    fetchEmployees();
    const intervalId = setInterval(() => {
      fetchEmployees();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
    <div className="container">
      <div className="left-panel">
        <div className="header">
          <h1>Employee Profile Form</h1>
        </div>
        <button type="button" className='reset-button' onClick={resetForm}>Reset Form</button>
        <form onSubmit={handleSubmit}>
  <div>
    <label>Name:</label>
    <input
      name="name"
      placeholder="Enter name"
      value={form.name}
      onChange={handleChange}
      ref={nameRef}
    />
  </div>

  <div>
    <label>Email:</label>
    <input
      type="email"
      name="email"
      placeholder="Enter email"
      value={form.email}
      onChange={handleChange}
      ref={emailRef}
    />
  </div>

  <div>
    <label>Phone Number:</label>
    <div className="phone-input-wrapper">
      <select
        name="countryCode"
        value={form.countryCode}
        onChange={handleChange}
        ref={countryCodeRef}
        className="country-code-select"
      >
        <option value="+91">🇮🇳 +91</option>
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
        <option value="+61">🇦🇺 +61</option>
        <option value="+81">🇯🇵 +81</option>
      </select>
      <input
        type="text"
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        className="phone-number-input"
        maxLength="10"
        ref={phoneRef}
      />
    </div>
  </div>

  <div>
    <label>Date of Birth:</label>
    <input
      type="date"
      name="dob"
      value={form.dob}
      onChange={handleChange}
      ref={dobRef}
    />
  </div>

  <div>
    <label>Gender:</label>
    <div className="gender-options">
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={form.gender === 'male'}
          onChange={handleChange}
          ref={genderMaleRef}
        />
        Male
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={form.gender === 'female'}
          onChange={handleChange}
          ref={genderFemaleRef}
        />
        Female
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="other"
          checked={form.gender === 'other'}
          onChange={handleChange}
          ref={genderOtherRef}
        />
        Other
      </label>
    </div>
  </div>

  <div>
    <label>Skills:</label>
    <select name="skills" multiple value={form.skills} onChange={handleChange} ref={skillsRef}>
      {skillsData.map((skill) => (
        <option key={skill.id} value={skill.id}>{skill.name}</option>
      ))}
    </select>
  </div>

  <div>
    <label>Department:</label>
    <select name="department" value={form.department} onChange={handleChange} ref={departmentRef}>
      <option value="">Select Department</option>
      {departmentsData.map((department) => (
        <option key={department.id} value={department.id}>{department.name}</option>
      ))}
    </select>
  </div>

  <div>
    <label>Resume:</label>
    <input
      type="file"
      name="resume"
      onChange={handleChange}
      ref={resumeRef}
      accept=".pdf , image/*"
    />
    {form.resume && (
      <p>Current Resume: {form.resume.name}</p> 
    )}
  </div>

  <div>
    <label>Profile Image:</label>
    <input
      type="file"
      name="profileImage"
      onChange={handleChange}
      ref={profileImageRef}
      accept="image/*"
    />
  </div>

  <div>
    <label>Is Active:</label>
    <label className="switch">
      <input
        type="checkbox"
        name="isActive"
        checked={form.isActive}
        onChange={handleChange}
        ref={isActiveRef}
      />
      <span className="slider"></span>
    </label>
  </div>

  <div>
    <label>Address:</label>
    <textarea
      name="address"
      value={form.address}
      placeholder="Enter address"
      onChange={handleChange}
      ref={addressRef}
    ></textarea>
  </div>

  <button type="submit">{isEditing ? 'Update Details' : 'Submit'}</button>
</form>

      </div>

      <div className="right-panel">
        <div className="employee-header">
          <h2>Employee Profiles</h2>
          <button onClick={fetchEmployees} className="refresh-button">
            Refresh Data
          </button>
        </div>
        
        {fetchLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading employee data...</p>
          </div>
        )}
        
        {fetchError && (
          <div className="error-message">
            <p>{fetchError}</p>
            <button onClick={fetchEmployees}>Try Again</button>
          </div>
        )}
        
        {!fetchLoading && !fetchError && employees.length === 0 && (
          <div className="no-data-message">
            <p>No employee profiles found. Add a new employee using the form.</p>
          </div>
        )}
        
        <div className="cards-container">
            {employees.map((emp) => (
            <div key={emp._id || emp.id} className="employee-card">
            <div className="employee-info">
               <h3>{emp.name}</h3>
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Phone:</strong> {emp.countryCode || ''} {emp.phoneNumber}</p>
                <p><strong>DOB:</strong> {new Date(emp.dob).toLocaleDateString()}</p>
                <p><strong>Gender:</strong> {emp.gender}</p>
                <p><strong>Department:</strong> {getDepartmentName(emp.department)}</p>
                <p><strong>Skills:</strong> {Array.isArray(emp.skills) ? emp.skills.join(', ') : JSON.parse(emp.skills || '[]').join(', ')}</p>
                <p><strong>Status:</strong> {emp.isActive ? 'Active' : 'Inactive'}</p>
                {emp.address && <p><strong>Address:</strong> {emp.address}</p>}
            <div className="card-buttons">
            <button className="edit-button" onClick={() => handleEdit(emp)}>Edit</button>
            <button className="delete-button" onClick={() => handleDelete(emp._id)}>Delete</button>
            </div>
            </div>
            </div>
             ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default EmployeeProfileForm;