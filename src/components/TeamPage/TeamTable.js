import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, ENDPOINTS } from '../../constants/api';
import AgGridTable from '../AgGrid/AgGridTable.js';
import CompareBox from './CompareBox.js';

const TeamTable = () => {
    const [teamData, setTeamData] = useState({ players: [] });
    const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'ascending'});
    const [compareInput, setCompareInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { teamName, year, league } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef();

    useEffect(() => {
        if (teamName) {
            let endpoint = `${API_BASE_URL}${ENDPOINTS.TEAM}/${teamName}`;
            if (year && year !== 'all') {
                endpoint += `/${year}`;
            }
            if (league) {
                endpoint += `?league=${league}`;
            }
            console.log(endpoint);
            fetch(endpoint)
                .then(response => response.json())
                .then(data => setTeamData(data))
                .catch(error => console.error('Error fetching team data:', error));
        }
    }, [teamName, league, year]);

    return (
	<div>
            <h2>Team: {teamName}</h2>
	    <CompareBox/>
           <AgGridTable
                rowData={Array.isArray(teamData.players) ? teamData.players : []}
                columnDefs={[
                    {
                        headerName: 'Player Name',
                        field: 'name',
                        cellRenderer: params => (
                            <Link to={`/players/${params.data.name}`}>{params.data.name}</Link>
                        ),
                        flex: 1
                    },
                    {
                        headerName: 'Year',
                        field: 'year',
                        sortable: true,
                        flex: 1
                    },
                    {
                        headerName: 'Ranking Value',
                        field: 'rankingValue',
                        sortable: true,
                        flex: 1
                    }
                ]}
                style={{ height: 400, width: '100%' }}
                className="custom-aggrid"
            />
        </div>
    );
};

export default TeamTable;
