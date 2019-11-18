import React from 'react';
import {Button} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import './Introduction.css';

const Introduction = () => {
    return <div className="intro"><div className="intro__overlay"></div><div className="intro__button-container"><div className="intro__href"><Link to="/views"><Button className="intro__button">Get started</Button></Link></div></div></div>
}

export default Introduction;