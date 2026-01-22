'use client';
import { Line } from 'react-chartjs-2';

export default function AIPersonalisationPage() {
  return (
    <Line
      data={{
        labels: ['Week 1', 'Week 2', 'Week 3'],
        datasets: [
          {
            label: 'Skill Progress',
            data: [45, 60, 78],
          },
        ],
      }}
    />
  );
}
