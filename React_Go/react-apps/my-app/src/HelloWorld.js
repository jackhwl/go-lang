import React, { Fragment, useState } from 'react';
import './HelloWorld.css';

function HelloWorld(props) {
    const [isTrue, setIsTrue] = useState(true);
    const toggleTrue = () => {
        if (isTrue) {
            setIsTrue(false);
            return
        }
        setIsTrue(true);
    }
    return (
        <>
            <hr />
            <h1 className='h1-green'>{props.msg}</h1>
            <hr />
            { isTrue && 
                <Fragment>
                    <p>THe current value of isTrue is true</p>
                    <hr />
                </Fragment>
            }
            <hr />
            { isTrue ? <p> is true </p> : <p> is false </p> }
            <a href="#!" className="btn btn-outline-secondary" onClick={toggleTrue}>Toggle isTrue</a>
        </>
    );
}

export default HelloWorld;