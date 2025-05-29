import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CivilStatusChart = ({ residents }) => {
  // Count residents by civil status
  const statusCounts = residents.reduce((acc, resident) => {
    const status = resident.civilStatus;
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  }, {});

  // Prepare data for chart
  const statuses = Object.keys(statusCounts);
  const counts = Object.values(statusCounts);

  const data = {
    labels: statuses,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          '#9b3642',  // Single - Red
          '#1d5161',  // Married - Yellow
          '#3E7CB1',  // Divorced - Blue
          '#4BC0C0',  // Widowed - Teal
          '#9966FF',  // Other statuses if any
        ],
        borderColor: [
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
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
        },
      },
    //   title: {
    //     display: true,
    //     text: 'CIVIL STATUS DISTRIBUTION',
    //     font: {
    //       size: 18,
    //       weight: 'bold',
    //     },
    //   },
    },
  };

  return (
    <div style={{ width: '90%', height: '350px', margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CivilStatusChart;