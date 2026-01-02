import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ name, link, league }) => {
    return (
        <div className="card">
            <Link to={link}>
                <h3>{name}</h3>
	     {league && <p className="league-info">League: {league}</p>}
            </Link>
        </div>
    );
};

export default Card;
