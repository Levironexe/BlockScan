"use client";
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const data = {
    labels: ['Unlocked', 'Brunt', 'Locked', 'Owner'], //set properties for the chart and nodes
    datasets: [
      {
        label: 'Token Liquidity',
        data: [35, 35, 15, 15],
        backgroundColor: [
          '#9333ea',
          '#ec4899',
          '#f9a8d4',
          '#fbcfe8',
        ],
        borderColor: '#f7f8f7',
        borderWidth: 8,
        borderRadius: 14,
        hoverBackgroundColor: [
          '#6b13bb',
          '#b4226a',
          '#a96a8c',
          '#bf87a7',
        ],
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
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              return {
                text: `${label}: ${value}%`, // Use backticks for template literals
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: undefined,
                lineWidth: 0,
                borderRadius: 3,
              };
            });
          },
          boxWidth: 15,
          padding: 20,
          font: {
            family: 'Outfit',
            size: 14,
            weight: '400',
          },
          color: '#000',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataValue = tooltipItem.raw;
            return `${tooltipItem.label}: ${dataValue}%`; // Use backticks for template literals
          },
        },
      },
    },
  };

  return (
    <div
      className="w-full p-6 mb-7"
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        backgroundColor: '#fff',
      }}
    >
      <h2 className="bg-gradient-to-r from-primary-red via-pink-500 to-purple-600 text-transparent bg-clip-text text-2xl font-bold mb-4" style={{ fontFamily: "Outfit" }}>
        Token Liquidity Analysis
      </h2>

      <div
        className="rounded-xl p-6 w-full"
        style={{
          backgroundColor: 'rgba(240, 240, 240, 0.5)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="text-center mb-4" style={{ fontFamily: 'Outfit', fontSize: '24px' }}>
          <span className="font-bold" style={{ fontWeight: 'bold' }}>Total Liquidity:</span>{' '}
          <span style={{ fontWeight: 'normal' }}>$1.5M</span>
        </div>

        <div
          style={{
            width: '100%',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            marginTop: '10px',
            marginBottom: '20px',
          }}
        ></div>

        <div style={{ width: '100%', height: '300px' }}> {/* Set height to ensure chart fits */}
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
