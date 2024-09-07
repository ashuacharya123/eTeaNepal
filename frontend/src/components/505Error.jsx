import React from 'react';
import './Error505.css';

const Error505 = () => {
  return (
    <div className="container">
      <header className="header">
        <img src="/img/error.png" alt="Error" className="image" />
        <h1 className="error-code">500 INTERNAL SERVER ERROR</h1>
      </header>
      <p className="message">
        It seems there is some issue with this site. <span>Please try after sometime, or,</span>
      </p>
      <div className="button-container">
        <button className="button" onClick={goHome}>Return HOME</button>
        <button className="button" onClick={goBack}>Try Again</button>
      </div>
    </div>
  );
};

export default Error505;