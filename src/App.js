import React from "react";
import Web3 from "web3";
import logo from "./logo.svg";
import "./App.css";
import Swap from "./components/swap/swap";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      address:"",
    };
  }
  
  connectWallect = async() => {
    const metamaskInstalled = typeof window.web3 !== "undefined";
    if (metamaskInstalled) {
       if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        // DO NOTHING...
      }
      const web3 = window.web3;
      // Load account
      const accounts = await web3.eth.getAccounts();
      this.setState({address:accounts[0]})
    }
  };
  render() {
    return (
      <div className="App">
        <div className="navbar">
          <div className="address">{this.state.address}</div> 
          <button onClick={this.connectWallect} className="btn">
            Connect wallet
          </button>
        </div>
        <header className="App-header">
          <Swap address={this.state.address} />
          {/* <img src={logo} className="App-logo" alt="logo" />
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
          </a> */}
        </header>
      </div>
    );
  }
}
export default App;
