// src/components/TeamComparisonBoxPlot.js
import React from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
} from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from 'chartjs-chart-box-and-violin-plot';
import { Chart as ChartJS } from 'react-chartjs-2';

Chart.register(BoxPlotController, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend, BoxAndWiskers);

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
            <ChartJS type="boxplot" data={data} options={options} />
        </div>
    );
};

export default TeamComparisonBoxPlot;
