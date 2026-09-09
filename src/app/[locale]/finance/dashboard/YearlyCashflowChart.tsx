'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { BarChart3, LineChart, TrendingUp } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface YearlyStat {
    month: string;
    total_income: number;
    total_expense: number;
    income_target: number;
    balance: number;
}

interface YearlyCashflowChartProps {
    yearlyStats: YearlyStat[];
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function YearlyCashflowChart({
    yearlyStats,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: YearlyCashflowChartProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    const monthLabels = useMemo(() => {
        return yearlyStats.map(s => {
            const [y, m] = s.month.split('-');
            const d = new Date(Number(y), Number(m) - 1, 1);
            return d.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'short' });
        });
    }, [yearlyStats, locale]);

    const incomeData = useMemo(() => yearlyStats.map(s => s.total_income), [yearlyStats]);
    const expenseData = useMemo(() => yearlyStats.map(s => s.total_expense), [yearlyStats]);
    const balanceData = useMemo(() => yearlyStats.map(s => s.balance), [yearlyStats]);

    const data = {
        labels: monthLabels,
        datasets: chartType === 'bar' ? [
            {
                label: isIndo ? 'Pemasukan' : 'Income',
                data: incomeData,
                backgroundColor: 'rgba(16, 185, 129, 0.85)',
                hoverBackgroundColor: '#10b981',
                borderRadius: 8,
                borderSkipped: false
            },
            {
                label: isIndo ? 'Pengeluaran' : 'Expense',
                data: expenseData,
                backgroundColor: 'rgba(244, 63, 94, 0.85)',
                hoverBackgroundColor: '#f43f5e',
                borderRadius: 8,
                borderSkipped: false
            },
            {
                label: isIndo ? 'Surplus / Net' : 'Net Surplus',
                data: balanceData,
                backgroundColor: 'rgba(99, 102, 241, 0.85)',
                hoverBackgroundColor: '#6366f1',
                borderRadius: 8,
                borderSkipped: false
            }
        ] : [
            {
                label: isIndo ? 'Pemasukan' : 'Income',
                data: incomeData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 7
            },
            {
                label: isIndo ? 'Pengeluaran' : 'Expense',
                data: expenseData,
                borderColor: '#f43f5e',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 7
            },
            {
                label: isIndo ? 'Surplus / Net' : 'Net Surplus',
                data: balanceData,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 7
            }
        ]
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                    font: {
                        family: 'inherit',
                        size: 11,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 11, weight: '500' },
                padding: 12,
                cornerRadius: 12,
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatMoney(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.12)'
                },
                ticks: {
                    font: {
                        size: 10
                    },
                    callback: function (val: any) {
                        if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}M`;
                        if (val >= 1000000) return `${(val / 1000000).toFixed(0)}jt`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                        return val;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800 relative overflow-hidden transition-all">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                        <TrendingUp size={13} /> {isIndo ? 'Tren Arus Kas Tahunan' : 'Yearly Cashflow Dynamics'}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Perbandingan Pemasukan vs Pengeluaran' : 'Income vs Expense Comparison'}
                    </h3>
                </div>

                {/* Chart Type Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
                    <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                            chartType === 'bar'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <BarChart3 size={14} />
                        <span>Bar</span>
                    </button>
                    <button
                        onClick={() => setChartType('line')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                            chartType === 'line'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <LineChart size={14} />
                        <span>Line</span>
                    </button>
                </div>
            </div>

            {/* Chart Canvas Container */}
            <div className="h-[280px] md:h-[340px] w-full">
                {chartType === 'bar' ? (
                    <Bar data={data} options={options} />
                ) : (
                    <Line data={data} options={options} />
                )}
            </div>
        </div>
    );
}
