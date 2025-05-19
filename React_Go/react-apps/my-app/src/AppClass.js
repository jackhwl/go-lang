import React, { Component } from 'react';
import './AppClass.css';
export default class AppClass extends Component {

    render() {
        return (
            <div>
                <h1 className='h1-red'>{this.props.msg}</h1>
            </div>
        );
    }
}