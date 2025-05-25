import React, { Fragment, useEffect, useRef, useState } from 'react';
import './App.css';
import Input from './Input';

function HelloWorld(props) {
    const [isTrue, setIsTrue] = useState(true);
    const [crowd, setCrowd] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const dobRef = useRef(null);

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

    const handleSubmit = (event) => {
        event.preventDefault();

        if (lastName !== '') {
            addPerson(firstName, lastName, dob);
        }
        console.log('First Name: ', firstName);
        console.log('Last Name: ', lastName);
        console.log('Date of Birth: ', dob);

        // let newPerson = {
        //     id: crowd.length + 1,
        //     firstName: firstName,
        //     lastName: lastName,
        //     dob: dob
        // }
        // setCrowd([...crowd, newPerson]);
    }

    const addPerson = (newFirst, newLast, newDOB) => {
        let newPerson = {
            id: crowd.length + 1,
            firstName: newFirst,
            lastName: newLast,
            dob: newDOB
        }
        const newList = crowd.concat(newPerson);
        const sorted = newList.sort((a, b) => {
            if (a.lastName < b.lastName) {
                return -1;
            } else if (a.lastName > b.lastName) {
                return 1;
            }
            return 0;
        })
        setCrowd(sorted);
        setFirstName('');
        setLastName('');
        setDob('');

        firstNameRef.current.value = '';
        lastNameRef.current.value = '';
        dobRef.current.value = '';
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
            <hr />
            <form autoComplete='off' onSubmit={handleSubmit}>
                <input title="First Name" type="text" className="form-control" ref={firstNameRef} name='firstName' autoComplete='firstName-new' id="firstName" onChange={event => setFirstName(event.target.value)}/>
                <Input title="Last Name" type="text" className="form-control" ref={lastNameRef} name='lastName' autoComplete='lastName-new' id="lastName" onChange={event => setLastName(event.target.value)}/>
                <Input title="Date of Birth" type="date" className="form-control" ref={dobRef} name='dob' autoComplete='dob-new' id="dob" onChange={event => setDob(event.target.value)}/>
                <input type="submit" className="btn btn-primary" value="Submit" ></input>
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