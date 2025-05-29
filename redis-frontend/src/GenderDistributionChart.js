import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GenderDistributionChart = ({ residents }) => {
  // Count residents by gender
  const genderCounts = residents.reduce((acc, resident) => {
    const gender = resident.gender || 'Unknown';
    if (!acc[gender]) {
      acc[gender] = 0;
    }
    acc[gender]++;
    return acc;
  }, {});

  const genders = Object.keys(genderCounts);
  const counts = Object.values(genderCounts);

  // Define colors for each gender
  const backgroundColors = genders.map(gender => {
    if (gender === 'Male') return '#1d5161';
    if (gender === 'Female') return '#9b3642';
    return '#3E7CB1'; // Other genders
  });

  const data = {
    labels: genders,
    datasets: [
      {
        label: 'Number of Residents',
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend as colors indicate gender
      },
      // title: {
      //   display: true,
      //   text: 'GENDER DISTRIBUTION',
      //   font: {
      //     size: 18,
      //     weight: 'bold',
      //   },
      // },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Residents',
        },
      },
    },
  };

  return (
    <div style={{ width: '90%', height: '250px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GenderDistributionChart;