// src/components/TeamComparisonBoxPlot.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
} from 'chart.js';
import { BoxPlot, BoxAndWhiskers } from 'chartjs-chart-box-and-violin-plot';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
  BoxPlot,
  BoxAndWhiskers
);


const TeamComparisonBoxPlot = ({ teams }) => {
    // teams: [{ name: 'Team A', players: [{ name, rankingValue }, ...] }, ...]
    const labels = teams.map(team => team.name);
    const data = {
        labels,
        datasets: [
            {
                label: 'Player Ranking Value',
                backgroundColor: 'rgba(24, 233, 239, 0.5)',
                borderColor: 'rgba(7, 68, 69, 1)',
                borderWidth: 1,
                outlierColor: '#999999',
                padding: 10,
                itemRadius: 0,
                data: teams.map(team => team.players.map(p => p.rankingValue)),
                type: 'boxplot',
            }
        ]
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Team Player Ranking Value Comparison (Box Plot)' }
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Ranking Value' } }
        }
    };
    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <Chart type="boxplot" data={data} options={options} />
        </div>
    );
};

export default TeamComparisonBoxPlot;
