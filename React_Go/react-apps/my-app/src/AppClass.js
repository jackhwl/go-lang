import React, { Fragment, Component } from 'react';
import './AppClass.css';
import Input from './Input';

export default class AppClass extends Component {
    constructor(props) {
        super(props);

        this.firstNameRef = React.createRef(null);
        this.lastNameRef = React.createRef();
        this.dobRef = React.createRef(null);

        this.state = {
            isTrue: false,
            crowd: [],
        };
    }

    setFirstName = (firstName) => {
        this.setState({ firstName: firstName });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.firstName !== '') {
            this.addPerson(this.state.firstName, this.state.lastName, this.state.dob);
        }
        console.log('First Name: ', this.state.firstName);
        console.log('Last Name: ', this.state.lastName);
        console.log('Date of Birth: ', this.state.dob);
    }
    addPerson = (newFirst, newLast, newDOB) => {
        let newPerson = {
            id: this.state.crowd.length + 1,
            firstName: newFirst,
            lastName: newLast,
            dob: newDOB
        }

        const newList = this.state.crowd.concat(newPerson);
        const sorted = newList.sort((a, b) => {
            if (a.lastName < b.lastName) {
                return -1;
            } else if (a.lastName > b.lastName) {
                return 1;
            }
            return 0;
        })

        this.setState({crowd: sorted});
        this.setState({ firstName: '', lastName: '', dob: '' });
        
        this.firstNameRef.current.value = '';
        this.lastNameRef.current.value = '';
        this.dobRef.current.value = '';
    }
    componentDidMount() {
        console.log('componentDidMount fired! ');

        let people = [
            { id: 1, firstName: 'John', lastName: 'Doe', dob: '1990-01-01' },
            { id: 2, firstName: 'Jane', lastName: 'Doe', dob: '1992-02-02' },
            { id: 3, firstName: 'Jim', lastName: 'Beam', dob: '1994-03-03' },
            { id: 4, firstName: 'Jack', lastName: 'Daniels', dob: '1996-04-04' }
        ]
        this.setState({ 
            firstName: '', 
            lastName: '',
            dob: '',
            crowd: people 
        });
    }


    toggleTrue = () => {
        if  (this.state.isTrue) {
            this.setState({ isTrue: false });
            return
        }
        this.setState({ isTrue: true });
    }

    render() {
        return (
            <div>
                <h1 className='h1-red'>{this.props.msg}</h1>
                <hr />
                { this.state.isTrue && 
                    <Fragment>
                        <p>THe current value of isTrue is true</p>
                        <hr />
                    </Fragment>
                }
                <hr />
                { this.state.isTrue ? <p> is true </p> : <p> is false </p> }
                <a href="#!" className="btn btn-outline-secondary" onClick={this.toggleTrue}>Toggle isTrue</a>
                            <hr />
                <form autoComplete='off' onSubmit={this.handleSubmit}>
                    <input title="First Name" type="text" className="form-control" ref={this.firstNameRef} name='firstName' autoComplete='firstName-new' id="firstName" onChange={event => this.setFirstName(event.target.value)}/>
                    <Input title="Last Name" type="text" className="form-control" ref={this.lastNameRef} name='lastName' autoComplete='lastName-new' id="lastName" onChange={event => this.setState({lastName: event.target.value})}/>
                    <Input title="Date of Birth" type="date" className="form-control" ref={this.dobRef} name='dob' autoComplete='dob-new' id="dob" onChange={event => this.setState({dob: event.target.value})}/>
                    <input type="submit" className="btn btn-primary" value="Submit" ></input>
                </form>
                <div>
                    First Name: {this.state.firstName} <br />
                    Last Name: {this.state.lastName} <br />
                    Date of Birth: {this.state.dob} <br />
                </div>
                <h2>People</h2>
                <ul className="list-group">
                    {this.state.crowd.map((person) => (
                        <li key={person.id} className="list-group-item">
                            {person.firstName} {person.lastName} - {person.dob}
                        </li>
                    ))}
                </ul>
            </div>
            
        );
    }
}