import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TeamBarChart = ({ students }) => {
  // Count the number of male and female students in each team
  const teamGenderCounts = students.reduce((acc, student) => {
    if (!acc[student.team]) {
      acc[student.team] = { male: 0, female: 0 };
    }
    if (student.gender === 'Male') {
      acc[student.team].male += 1;
    } else if (student.gender === 'Female') {
      acc[student.team].female += 1;
    }
    return acc;
  }, {});

  const teams = Object.keys(teamGenderCounts);
  const maleCounts = teams.map((team) => teamGenderCounts[team].male);
  const femaleCounts = teams.map((team) => teamGenderCounts[team].female);

  const data = {
    labels: teams,
    datasets: [
      {
        label: 'Male',
        data: maleCounts,
        backgroundColor: '#940706', // Blue for male
        borderColor: '#940706',
        borderWidth: 1,
      },
      {
        label: 'Female',
        data: femaleCounts,
        backgroundColor: '#FFB20F', // Pink for female
        borderColor: '#FFB20F',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize
    plugins: {
      legend: {
        display: true, // Show legend to differentiate between male and female
        position: 'top', // Move legend to the top
        labels: {
          font: {
            size: 14, // Increase legend font size
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Stack the bars for each team
        barPercentage: 0.5, // Make bars thinner (default is 0.9)
        categoryPercentage: 0.6, // Adjust space between bars
        ticks: {
          font: {
            size: 14, // Increase x-axis label font size
          },
        },
        title: {
          display: true,
          text: 'Teams', // Add x-axis title
          font: {
            size: 16, // Increase x-axis title font size
          },
        },
      },
      y: {
        stacked: true, // Stack the bars for each team
        beginAtZero: true,
        ticks: {
          font: {
            size: 14, // Increase y-axis label font size
          },
        },
        title: {
          display: true,
          text: 'Number of Students', // Add y-axis title
          font: {
            size: 16, // Increase y-axis title font size
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '90%', height: '300px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TeamBarChart;