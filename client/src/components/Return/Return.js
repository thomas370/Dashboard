import React from 'react';
import style from './Return.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
const Return = () => {
    return (
        <div>
            <div className={style.Return}>
                <Link to={'/'}><FontAwesomeIcon icon={faArrowLeft} /></Link>
            </div>
        </div>
    );
};

export default Return;