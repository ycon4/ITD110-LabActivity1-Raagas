import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';
import Papa from 'papaparse';
import TeamBarChart from './TeamBarChart'; // Import the bar graph component

const API_URL = 'http://localhost:5000/students';

function App() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    course: '',
    age: '',
    position: '',
    team: '',
    gender: '',
    penName: '',
  });
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new student
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success('Student added successfully!');
      fetchStudents();
      setFormData({
        id: '',
        name: '',
        course: '',
        age: '',
        position: '',
        team: '',
        gender: '',
        penName: '',
      });
    } catch (error) {
      toast.error('Error adding student!');
    }
  };

  // Update existing student
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData);
      toast.success('Student updated successfully!');
      fetchStudents();
      setFormData({
        id: '',
        name: '',
        course: '',
        age: '',
        position: '',
        team: '',
        gender: '',
        penName: '',
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Error updating student!');
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Student deleted!');
      fetchStudents();
    } catch (error) {
      toast.error('Error deleting student!');
    }
  };

  // Populate form for updating student
  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
  };

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: async (results) => {
          const parsedData = results.data;

          // Filter out invalid rows
          const validData = parsedData.filter((row) => {
            return (
              row.id &&
              row.name &&
              row.course &&
              row.age &&
              row.position &&
              row.team &&
              row.gender &&
              row.penName
            );
          });

          if (validData.length === 0) {
            toast.error('No valid rows found in the CSV file.');
            return;
          }

          try {
            const savePromises = validData.map((student) => axios.post(API_URL, student));
            await Promise.all(savePromises);
            await fetchStudents();
            toast.success('CSV file uploaded and data saved to Redis!');
          } catch (error) {
            console.error('Error saving student:', error.response?.data || error.message);
            toast.error(`Error saving CSV data: ${error.response?.data?.message || error.message}`);
          }
        },
        error: (error) => {
          toast.error('Error parsing CSV file!');
        },
      });
    }
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div className="addStudent">
        <h1>Silahis Repository</h1>
        {!isEditing ? (
          <form onSubmit={handleAddSubmit}>
            <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <select name="position" value={formData.position} onChange={handleChange} required>
              <option value="">Select Position</option>
              <option value="Head Editor">Head Editor</option>
              <option value="Senior Head">Senior Head</option>
              <option value="Junior Head">Junior Head</option>
              <option value="Staff">Staff</option>
              <option value="Trainee">Trainee</option>
            </select>
            <select name="team" value={formData.team} onChange={handleChange} required>
              <option value="">Select Team</option>
              <option value="Art">Art</option>
              <option value="Layout">Layout</option>
              <option value="Videojournalism">Videojournalism</option>
              <option value="Photojournalism">Photojournalism</option>
              <option value="News">News</option>
              <option value="Editorial">Editorial</option>
              <option value="Feature">Feature</option>
              <option value="Sci-tech">Sci-tech</option>
            </select>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="text" name="penName" placeholder="Pen Name" value={formData.penName} onChange={handleChange} required />
            <button type="submit">Add Student</button>
          </form>
        ) : (
          <form onSubmit={handleEditSubmit}>
            <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required disabled />
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <select name="position" value={formData.position} onChange={handleChange} required>
              <option value="">Select Position</option>
              <option value="Head Editor">Head Editor</option>
              <option value="Senior Head">Senior Head</option>
              <option value="Junior Head">Junior Head</option>
              <option value="Staff">Staff</option>
              <option value="Trainee">Trainee</option>
            </select>
            <select name="team" value={formData.team} onChange={handleChange} required>
              <option value="">Select Team</option>
              <option value="Art">Art</option>
              <option value="Layout">Layout</option>
              <option value="Videojournalism">Videojournalism</option>
              <option value="Photojournalism">Photojournalism</option>
              <option value="News">News</option>
              <option value="Editorial">Editorial</option>
              <option value="Feature">Feature</option>
              <option value="Sci-tech">Sci-tech</option>
            </select>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="text" name="penName" placeholder="Pen Name" value={formData.penName} onChange={handleChange} required />
            <button type="submit">Update Student</button>
          </form>
        )}
      </div>

      <div className="students">
        <h2>MEMBER LIST</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px', padding: '5px', width: '300px' }}
        />
        <input type="file" accept=".csv" onChange={handleFileUpload} style={{ marginBottom: '20px' }} />

        {/* Wrapper for table and chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
        
        <div className="table-container">

        {/* Main Table */}
        <table>
  <thead>
    <tr className="upperow">
      <th>ID</th>
      <th>Name</th>
      <th>Course</th>
      <th>Age</th>
      <th>Position</th>
      <th>Team</th>
      <th>Gender</th>
      <th>Pen Name</th>
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
            <td>{student.name}</td>
            <td>{student.course}</td>
            <td>{student.age}</td>
            <td>{student.position}</td>
            <td>{student.team}</td>
            <td>{student.gender}</td>
            <td>{student.penName}</td>
            <td>
              <button onClick={() => handleEdit(student)} className="edit-btn">
                <img src={require("./pictures/edit.png")} alt="Edit"></img>
              </button>
              <button onClick={() => handleDelete(student.id)} className="delete-btn">
                <img src={require("./pictures/delete.png")} alt="Delete"></img>
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
        </tr>
      ))
    )}
  </tbody>
</table>
      </div>

          {/* Move the bar chart here */}
          <div style={{ marginTop: '20px', width: '100%' }}>
            <h2>STUDENT DISTRIBUTION BY TEAM</h2>
            <TeamBarChart students={students} />
          </div>
        </div>
</div>


      <ToastContainer />
    </div>
  );
}

export default App;