import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
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
  );
}
var x = "outside";
var f1 = function () {
  var x = "inside f1";
};
f1();
console.log(x);
// → outside

var f2 = function () {
  x = "inside f2";
};
f2();
console.log(x);
// → inside f2

export default App;
