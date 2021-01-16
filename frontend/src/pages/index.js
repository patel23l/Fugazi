import React from 'react';

const home=()=>{
    return(
    <div className="App">
      <header className="App-header">
        <navbar>TEST</navbar>
        <div>
        <section id="login" class="login">
          <div>
            <div>
              <header>LOGIN</header>
            <form></form>
            </div>
          </div>
        </section>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    )
}
export default home;