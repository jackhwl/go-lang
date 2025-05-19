import React from 'react';
import ReactDOM from 'react-dom/client';
import AppClass from './AppClass';
import HelloWorld from './HelloWorld';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container">
      <div className="row">
        <div className="col">
          <AppClass msg="Hello world class" />
          <HelloWorld  msg="Hello world func"/>
        </div>
      </div> 
    </div>
  </React.StrictMode>
);
