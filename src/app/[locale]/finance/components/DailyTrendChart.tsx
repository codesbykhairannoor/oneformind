'use client';

import { useMemo, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Transaction {
    id: number;
    date: string;
    type: 'income' | 'expense';
    amount: number;
    title: string;
    category: string;
}

interface DailyTrendChartProps {
    transactions: Transaction[];
    currentDate: string; // YYYY-MM-DD
    onDayClick?: (payload: { date: string; transactions: Transaction[]; total_income: number; total_expense: number }) => void;
}

export default function DailyTrendChart({ transactions, currentDate, onDayClick }: DailyTrendChartProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const formatMoney = (val: number) => {
        const isIDR = locale === 'id';
        if (isIDR) {
            return `Rp ${val.toLocaleString('id-ID')}`;
        }
        return `$${val.toLocaleString('en-US')}`;
    };

    const daysInMonth = useMemo(() => {
        const [y, m] = currentDate.split('-').map(Number);
        return new Date(y, m, 0).getDate();
    }, [currentDate]);

    const chartData = useMemo(() => {
        const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const incomeData = new Array(daysInMonth).fill(0);
        const expenseData = new Array(daysInMonth).fill(0);

        const [currY, currM] = currentDate.split('-').map(Number);

        transactions.forEach(trx => {
            if (!trx.date) return;
            const [y, m, d] = trx.date.split('-').map(Number);
            if (y === currY && m === currM && d >= 1 && d <= daysInMonth) {
                const idx = d - 1;
                const amt = Number(trx.amount) || 0;
                if (trx.type === 'income') {
                    incomeData[idx] += amt;
                } else {
                    expenseData[idx] += amt;
                }
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: t('in') || 'Income',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#10b981',
                    data: incomeData,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },
                {
                    label: t('out') || 'Expense',
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    borderColor: '#f43f5e',
                    data: expenseData,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }
            ]
        };
    }, [transactions, currentDate, daysInMonth, t]);

    const monthInsights = useMemo(() => {
        if (!transactions || transactions.length === 0) return null;
        const [currY, currM] = currentDate.split('-').map(Number);

        let totalOut = 0;
        const countByDate: Record<string, number> = {};
        const expByDate: Record<string, number> = {};

        transactions.forEach(trx => {
            if (!trx.date) return;
            const [y, m] = trx.date.split('-').map(Number);
            if (y === currY && m === currM) {
                countByDate[trx.date] = (countByDate[trx.date] || 0) + 1;
                if (trx.type === 'expense') {
                    const amt = Number(trx.amount) || 0;
                    totalOut += amt;
                    expByDate[trx.date] = (expByDate[trx.date] || 0) + amt;
                }
            }
        });

        let busiestDate = { date: '-', count: 0 };
        for (const [date, count] of Object.entries(countByDate)) {
            if (count > busiestDate.count) busiestDate = { date, count };
        }

        let highestExpDate = { date: '-', amount: 0 };
        for (const [date, amount] of Object.entries(expByDate)) {
            if (amount > highestExpDate.amount) highestExpDate = { date, amount };
        }

        const avgSpend = totalOut / (daysInMonth || 1);

        return {
            busiestDate: busiestDate.date !== '-' ? busiestDate.date : '-',
            busiestCount: busiestDate.count,
            highestExpenseDate: highestExpDate.date !== '-' ? highestExpDate.date : '-',
            highestExpenseAmount: highestExpDate.amount,
            avgSpend
        };
    }, [transactions, currentDate, daysInMonth]);

    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any[]) => {
            if (!elements || elements.length === 0 || !onDayClick) return;
            const dataIndex = elements[0].index;
            const dayNum = chartData.labels[dataIndex];
            const [y, m] = currentDate.split('-').map(Number);
            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            
            const dayTrx = transactions.filter(t => t.date === dateStr);
            if (dayTrx.length === 0) return;

            const totalInc = dayTrx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
            const totalExp = dayTrx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);

            onDayClick({
                date: dateStr,
                transactions: dayTrx,
                total_income: totalInc,
                total_expense: totalExp
            });
        },
        onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            }
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    color: '#94a3b8',
                    font: { weight: 'bold', size: 10 }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: (context: any) => ` ${context.dataset.label}: ${formatMoney(context.raw)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(51, 65, 85, 0.1)',
                    borderDash: [5, 5]
                },
                ticks: {
                    callback: (val: any) => (val >= 1000 ? (val / 1000) + 'k' : val),
                    color: '#94a3b8',
                    font: { size: 10, weight: 'bold' }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10, weight: 'bold' }
                }
            }
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800 w-full mt-8 transition-colors duration-500">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-sm md:text-base tracking-tight">{t('finance_trend') || 'Trend Keuangan'}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-tight mt-1">{t('daily_chart') || 'Grafik Bulanan'}</p>
                </div>
                
                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 tracking-wider">{t('status_active') || 'Aktif'}</span>
                </div>
            </div>

            <div className="relative w-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-2 mb-6">
                <div className="h-[280px] min-w-[600px] md:min-w-full relative">
                    {isMounted ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center animate-pulse">
                            <span className="text-xs font-bold text-slate-400">Loading Chart...</span>
                        </div>
                    )}
                </div>
            </div>

            {monthInsights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                            {t('avg_expense_daily') || 'Rata-rata Pengeluaran'}
                        </span>
                        <span className="text-base font-black text-slate-800 dark:text-white">{formatMoney(Math.round(monthInsights.avgSpend))}/hari</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20">
                        <span className="text-[10px] font-black text-rose-500/80 tracking-wider block mb-1">
                            {t('highest_expense') || 'Pengeluaran Tertinggi'}
                        </span>
                        <span className="text-base font-black text-rose-600 dark:text-rose-400">{formatMoney(monthInsights.highestExpenseAmount)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20">
                        <span className="text-[10px] font-black text-indigo-500/80 tracking-wider block mb-1">
                            {t('busiest_day') || 'Hari Terramai'}
                        </span>
                        <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{monthInsights.busiestDate} ({monthInsights.busiestCount} trx)</span>
                    </div>
                </div>
            )}
        </div>
    );
}
