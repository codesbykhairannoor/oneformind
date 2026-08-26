'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
);

interface HabitTrendChartProps {
    overallPercentage: number;
}

export default function HabitTrendChart({ overallPercentage }: HabitTrendChartProps) {
    const chartData = {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
            {
                label: 'Progress',
                data: [40, 60, 45, 70, 55, 80, overallPercentage],
                borderColor: '#818cf8',
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    g.addColorStop(0, 'rgba(129,140,248,0.4)');
                    g.addColorStop(1, 'rgba(129,140,248,0)');
                    return g;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 3
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        scales: {
            x: { display: false },
            y: { display: false, min: 0, max: 100 }
        }
    };

    return <Line data={chartData as any} options={chartOptions as any} />;
}
