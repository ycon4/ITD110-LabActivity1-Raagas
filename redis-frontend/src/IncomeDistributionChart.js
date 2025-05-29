import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeDistributionChart = ({ residents }) => {
  // Define income brackets
  const incomeBrackets = {
    'Below ₱10,000': 0,
    '₱10,000-₱20,000': 0,
    '₱20,001-₱30,000': 0,
    '₱30,001-₱50,000': 0,
    'Above ₱50,000': 0
  };

  // Count residents by income bracket
  residents.forEach(resident => {
    const income = parseInt(resident.income);
    if (income < 10000) {
      incomeBrackets['Below ₱10,000']++;
    } else if (income >= 10000 && income <= 20000) {
      incomeBrackets['₱10,000-₱20,000']++;
    } else if (income > 20000 && income <= 30000) {
      incomeBrackets['₱20,001-₱30,000']++;
    } else if (income > 30000 && income <= 50000) {
      incomeBrackets['₱30,001-₱50,000']++;
    } else {
      incomeBrackets['Above ₱50,000']++;
    }
  });

  const data = {
    labels: Object.keys(incomeBrackets),
    datasets: [
      {
        label: 'Number of Residents',
        data: Object.values(incomeBrackets),
        backgroundColor: '#9b3642',
        borderColor: '#9b3642',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    //   title: {
    //     display: true,
    //     text: 'INCOME DISTRIBUTION',
    //     font: {
    //       size: 18,
    //       weight: 'bold',
    //     },
    //   },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
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
    <div style={{ width: '90%', height: '300px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IncomeDistributionChart;