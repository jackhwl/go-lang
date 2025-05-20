import React, { Fragment, useEffect, useState } from 'react';
import './App.css';

function HelloWorld(props) {
    const [isTrue, setIsTrue] = useState(true);
    const [crowd, setCrowd] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');


    const toggleTrue = () => {
        if (isTrue) {
            setIsTrue(false);
            return
        }
        setIsTrue(true);
    }

    useEffect(() => {
        console.log('useEffect fired! ');

        let people = [
            { id: 1, firstName: 'John', lastName: 'Doe', dob: '1990-01-01' },
            { id: 2, firstName: 'Jane', lastName: 'Doe', dob: '1992-02-02' },
            { id: 3, firstName: 'Jim', lastName: 'Beam', dob: '1994-03-03' },
            { id: 4, firstName: 'Jack', lastName: 'Daniels', dob: '1996-04-04' }
        ]
        setCrowd(people);
    }, []);

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
            <hr />
            <form autoComplete='off'>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" name='firstName' id="firstName" onChange={event => setFirstName(event.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="lastName" id="lastName"  onChange={event => setLastName(event.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="dob" className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" name="dob" id="dob" onChange={event => setDob(event.target.value)} />
                </div>
            </form>
            <div>
                First Name: {firstName} <br />
                Last Name: {lastName} <br />
                Date of Birth: {dob} <br />
            </div>
            <h2>People</h2>
            <ul className="list-group">
                {crowd.map((person) => (
                    <li key={person.id} className="list-group-item">
                        {person.firstName} {person.lastName} - {person.dob}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default HelloWorld;