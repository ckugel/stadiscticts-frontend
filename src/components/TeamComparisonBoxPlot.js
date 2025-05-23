// src/components/TeamComparisonBoxPlot.js
import React from 'react';
import { Chart, BoxPlotController, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend } from 'chart.js';
import { BoxPlot } from 'react-chartjs-2';

Chart.register(BoxPlotController, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

const TeamComparisonBoxPlot = ({ teams }) => {
    // teams: [{ name: 'Team A', players: [{ name, rankingValue }, ...] }, ...]
    const labels = teams.map(team => team.name);
    const data = {
        labels,
        datasets: teams.map((team, idx) => ({
            label: team.name,
            backgroundColor: `rgba(${100 + idx * 50}, 99, 255, 0.5)` ,
            borderColor: `rgba(${100 + idx * 50}, 99, 255, 1)` ,
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 10,
            itemRadius: 0,
            data: [team.players.map(p => p.rankingValue)]
        }))
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
            <BoxPlot data={data} options={options} />
        </div>
    );
};

export default TeamComparisonBoxPlot;
