import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeamCourseBarChart = ({ students }) => {
  // Process data: Group students by team and course
  const teamCourseData = students.reduce((acc, student) => {
    const { team, course } = student;
    if (!acc[team]) {
      acc[team] = {};
    }
    if (!acc[team][course]) {
      acc[team][course] = 0;
    }
    acc[team][course] += 1;
    return acc;
  }, {});

  // Extract unique teams and courses
  const teams = Object.keys(teamCourseData);
  const courses = [...new Set(students.map((student) => student.course))];

  // Prepare dataset for Chart.js
  const datasets = courses.map((course) => ({
    label: course,
    data: teams.map((team) => teamCourseData[team][course] || 0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
  }));

  const data = {
    labels: teams,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Students by Team and Course',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
      <div style={{ width: '90%', height: '300px', margin: '0 auto' }}>
        <Bar data={data} options={options} />
      </div>
    );
};

export default TeamCourseBarChart;