'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface RealTimeChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: ChartData<'line' | 'bar' | 'doughnut'>;
  options?: ChartOptions<'line' | 'bar' | 'doughnut'>;
  height?: number | string;
  className?: string;
}

export const RealTimeChart: React.FC<RealTimeChartProps> = React.memo(({
  type,
  data,
  options,
  height,
  className,
}) => {
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        displayColors: false,
      },
    },
    scales:
      type !== 'doughnut'
        ? {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: { size: 11 },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                font: { size: 11 },
              },
            },
          }
        : {},
  };

  const finalOptions = { ...defaultOptions, ...options };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data as ChartData<'line'>} options={finalOptions} />;
      case 'bar':
        return <Bar data={data as ChartData<'bar'>} options={finalOptions} />;
      case 'doughnut':
        return (
          <Doughnut
            data={data as ChartData<'doughnut'>}
            options={finalOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={className}
      style={{ height: height || '100%', width: '100%' }}
    >
      {renderChart()}
    </div>
  );
});
