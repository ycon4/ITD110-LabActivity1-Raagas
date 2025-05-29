import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AgeDistributionChart = ({ residents }) => {
  // Define age groups
  const ageGroups = {
    'Under 18': 0,
    '18-30': 0,
    '31-45': 0,
    '46-60': 0,
    'Above 60': 0
  };

  // Count residents by age group
  residents.forEach(resident => {
    const age = parseInt(resident.age);
    if (age < 18) {
      ageGroups['Under 18']++;
    } else if (age >= 18 && age <= 30) {
      ageGroups['18-30']++;
    } else if (age >= 31 && age <= 45) {
      ageGroups['31-45']++;
    } else if (age >= 46 && age <= 60) {
      ageGroups['46-60']++;
    } else {
      ageGroups['Above 60']++;
    }
  });

  const data = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        data: Object.values(ageGroups),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderColor: [
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF'
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 14,
          },
          boxWidth: 15,
          padding: 15,
        },
      },
    //   title: {
    //     display: true,
    //     text: 'AGE DISTRIBUTION',
    //     font: {
    //       size: 18,
    //       weight: 'bold',
    //     },
    //   },
    },
  };

  return (
    <div style={{ width: '90%', height: '350px', margin: '0 auto' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default AgeDistributionChart;