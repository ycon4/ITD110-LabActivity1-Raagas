import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';
import Papa from 'papaparse';
import Login from './Login'; // Import the Login component
import GenderDistributionChart from './GenderDistributionChart';
import AgeDistributionChart from './AgeDistributionChart';
import IncomeDistributionChart from './IncomeDistributionChart';
import CivilStatusChart from './CivilStatusChart';

const API_URL = 'http://localhost:5000/students';

function App() {
  // Original state
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    civilStatus: '',
    occupation: '',
    address: '',
    income: '',
  });
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch students when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchStudents();
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Original functions from your App.js
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success('Record added successfully!');
      fetchStudents();
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        civilStatus: '',
        occupation: '',
        address: '',
        income: '',
      });
      setPopupVisible(false);
    } catch (error) {
      toast.error('Error adding record!');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData);
      toast.success('Record updated successfully!');
      fetchStudents();
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        civilStatus: '',
        occupation: '',
        address: '',
        income: '',
      });
      setIsEditing(false);
      setPopupVisible(false);
    } catch (error) {
      toast.error('Error updating record!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Record deleted!');
      fetchStudents();
    } catch (error) {
      toast.error('Error deleting record!');
    }
  };
  
  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
    setPopupVisible(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: async (results) => {
          const parsedData = results.data;
          const validData = parsedData.filter((row) => {
            return (
              row.id &&
              row.firstName &&
              row.lastName &&
              row.age &&
              row.gender &&
              row.civilStatus &&
              row.occupation &&
              row.address &&
              row.income
            );
          });

          if (validData.length === 0) {
            toast.error('No valid rows found in the CSV file.');
            return;
          }

          try {
            const savePromises = validData.map((record) => axios.post(API_URL, record));
            await Promise.all(savePromises);
            await fetchStudents();
            toast.success('CSV file uploaded and data saved!');
          } catch (error) {
            console.error('Error saving record:', error.response?.data || error.message);
            toast.error(`Error saving CSV data: ${error.response?.data?.message || error.message}`);
          }
        },
        error: (error) => {
          toast.error('Error parsing CSV file!');
        },
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleCharts = () => {
    setShowCharts(!showCharts);
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // If not logged in, show login screen
  if (!isLoggedIn) {
    return (
      <div>
        <Login onLoginSuccess={handleLoginSuccess} />
        <ToastContainer />
      </div>
    );
  }

  // If logged in, show the main application
  return (
    <div className="container" style={{ textAlign: 'center' }}>
      {/* Popup for Add/Edit Record */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={() => setPopupVisible(false)}>
              &times;
            </button>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="student-form">
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={formData.id}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="income"
                  placeholder="Income"
                  value={formData.income}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button type="submit" className="form-button">
                  Update Record
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddSubmit} className="student-form">
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={formData.id}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="income"
                  placeholder="Income"
                  value={formData.income}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button type="submit" className="form-button">
                  Add Record
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="students">
        {/* Top header bar */}
        <div className="top-header-bar">
          <div className="header-content">
            <div className="header-left">
            {/* <img 
              src={require("./pictures/logo.png")} 
              alt="Logo" 
              style={{ width: "4x0px", height: "auto", margin: "10px" }}
            /> */}
              <span className="system-title"><h2>BARANGAY SARAY PROFILING SYSTEM</h2></span>
            </div>
            <div className="header-right">
              <span className="welcome-text">Welcome, {user?.username || 'User'}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </div>

        <div className="header-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="input-group"> 
            <button onClick={() => { setIsEditing(false); setPopupVisible(true); }} className="add-button">
              <img src={require("./pictures/add.png")} alt="Add" />
            </button>
            <label htmlFor="file-upload" className="file-upload-button">
              <img src={require("./pictures/import.png")} alt="Import" />
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file-input"
            />
            <button 
              onClick={toggleCharts} 
              className="analytics-button"
              
              ><img src={require("./pictures/analytics.png")} alt="Add" />
            </button>
          </div>
        </div>

        {/* Wrapper for table and charts */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div className="table-container">
            {/* Main Table */}
            <table>
              <thead>
                <tr className="upperow">
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Civil Status</th>
                  <th>Occupation</th>
                  <th>Address</th>
                  <th>Income</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents
                    .sort((a, b) => a.id - b.id)
                    .map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.age}</td>
                        <td>{student.gender}</td>
                        <td>{student.civilStatus}</td>
                        <td>{student.occupation}</td>
                        <td>{student.address}</td>
                        <td>{student.income}</td>
                        <td>
                          <button onClick={() => handleEdit(student)} className="edit-btn">
                            <img src={require("./pictures/edit.png")} alt="Edit" />
                          </button>
                          <button onClick={() => handleDelete(student.id)} className="delete-btn">
                            <img src={require("./pictures/delete.png")} alt="Delete" />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  // Display 5 empty rows if no data is available
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Charts section */}
          {showCharts && students.length > 0 && (
            <div className="charts-container">
              <h3 style={{ textAlign: 'center', margin: '20px 0' }}>BARANGAY RESIDENTS ANALYTICS</h3>
              
              <div className="charts-grid">
                {/* First row */}
                <div className="chart-box">
                  <h2>GENDER DISTRIBUTION</h2>
                  <GenderDistributionChart residents={students} />
                </div>
                
                <div className="chart-box">
                <h2>AGE DISTRIBUTION</h2>
                  <AgeDistributionChart residents={students} />
                </div>
                
                {/* Second row */}
                <div className="chart-box">
                <h2>CIVIL STATUS</h2>
                  <CivilStatusChart residents={students} />
                </div>
                
                <div className="chart-box">
                <h2>INCOME DISTRIBUTION</h2>
                  <IncomeDistributionChart residents={students} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;