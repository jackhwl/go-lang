import React, { Fragment, Component } from 'react';
import './AppClass.css';
export default class AppClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTrue: false
        };
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
            </div>
        );
    }
}