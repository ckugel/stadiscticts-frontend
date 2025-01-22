// src/components/Card.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ name, link }) => {
    return (
        <div className="card">
            <Link to={link}>
                <h3>{name}</h3>
            </Link>
        </div>
    );
};

export default Card;