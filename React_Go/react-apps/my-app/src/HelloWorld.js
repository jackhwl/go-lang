import React, { Fragment } from 'react';
import './HelloWorld.css';

function HelloWorld(props) {
    return (
        <>
            <hr />
            <h1 className='h1-green'>{props.msg}</h1>
        </>
    );
}

export default HelloWorld;