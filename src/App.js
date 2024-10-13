import logo from "./logo.svg";
import "./App.css";
import Javascript from "./tempJS/javascript.tsx";
import { data } from "./tempJS/data.tsx";

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
        <Javascript data={data} />
      </header>
    </div>
  );
}
// var x = "outside";
// var f1 = function () {
//   var x = "inside f1";
// };
// f1();
// console.log(x);
// // → outside

// var f2 = function () {
//   x = "inside f2";
// };
// f2();
// console.log(x);
// // → inside f2
// var landscape = function () {
//   var result = "";
//   var flat = function (size) {
//     for (var count = 0; count < size; count++) result += "_";
//   };
//   var mountain = function (size) {
//     result += "/";
//     for (var count = 0; count < size; count++) result += "'";
//     result += "\\";
//   };
//   flat(3);
//   mountain(4);
//   flat(6);
//   mountain(1);
//   flat(1);
//   return result;
// };
// console.log(landscape());

// function greet(who) {
//   console.log("Привет, " + who);
// }
// greet("Семён");
// console.log("Покеда");
// function power(base, exponent) {
//   if (exponent == undefined) exponent = 2;
//   var result = 1;
//   for (var count = 0; count < exponent; count++) result *= base;
//   return result;
// }
// console.log(power(4));
// // → 16
// console.log(power(4, 3));
// // → 64

// function wrapValue(n) {
//   var localVariable = n;
//   return function () {
//     return localVariable;
//   };
// }
// var wrap1 = wrapValue(1);
// var wrap2 = wrapValue(2);
// console.log(wrap1());
// // → 1
// console.log(wrap2());

// function multiplier(factor) {
//   return function (number) {
//     return number * factor;
//   };
// }
// var twice = multiplier(2);
// console.log(multiplier(2));
// console.log(twice(8));
// // → 10

// function power(base, exponent) {
//   if (exponent == 0) return 1;
//   else return base * power(base, exponent - 1);
// }
// console.log(power(2, 3));

// function findSolution(target) {
//   function find(start, history) {
//     if (start == target) return history;
//     else if (start > target) return null;
//     else
//       return (
//         find(start + 5, "(" + history + " + 5)") ||
//         find(start * 3, "(" + history + " * 3)")
//       );
//   }
//   return find(1, "1");
// }
// console.log(findSolution(24));

// function outerFunction(outerVariable) {
//   return function innerFunction(innerVariable) {
//     console.log("Outer Variable: " + outerVariable);
//     console.log("Inner Variable: " + innerVariable);
//   };
// }

// const newFunction = outerFunction(5);
// newFunction(10);

// вывестиИнвентаризациюФермы
// function printFarmInventory(cows, chickens) {
//   var cowString = String(cows);
//   while (cowString.length < 3) cowString = "0" + cowString;
//   console.log(cowString + " Коров");
//   var chickenString = String(chickens);
//   while (chickenString.length < 3) chickenString = "0" + chickenString;
//   console.log(chickenString + " Куриц");
// }
// printFarmInventory(7, 11);

// вывестиИнвентаризациюФермы
// function printFarmInventory(cows, chickens, pigs) {
//   printZeroPaddedWithLabel(cows, "Коров");
//   printZeroPaddedWithLabel(chickens, "Куриц");
//   printZeroPaddedWithLabel(pigs, "Свиней");
// }
// printFarmInventory(7, 11, 3);

// добавитьНулей
// function zeroPad(number, width) {
//   var string = String(number);
//   while (string.length < width) string = "0" + string;
//   return string;
// }
// // вывестиИнвентаризациюФермы
// function printFarmInventory(cows, chickens, pigs) {
//   console.log(zeroPad(cows, 3) + " Коров");
//   console.log(zeroPad(chickens, 3) + " Куриц");
//   console.log(zeroPad(pigs, 3) + " Свиней");
// }
// printFarmInventory(7, 16, 3);

// Создаём f со ссылкой на функцию
// var f = function (a) {
//   console.log(a + 2);
// };
// // Объявляем функцию g
// function g(a, b) {
//   return a * b * 3.5;
// }
// function min(a, b) {
//   return Math.min(a, b);
// }
// console.log(min(0, 10));
// console.log(min(10, 30));

// function max(a, b) {
//   if (a > b) {
//     return a;
//   } else {
//     return b;
//   }
// }
// console.log(max(10, 1));
// function max(a, b, minmax) {
//   if (minmax === false) {
//     return a < b ? a : b;
//   } else if (minmax === true || minmax === undefined) {
//     return a > b ? a : b;
//   }
// }

// console.log(max(13, 12, false)); // 13
// console.log(max(12, 13, false)); // 13
// console.log(max(10, 10)); // 10
// function countBS(stringinit) {
//   function count(findLetter, findNumberOfLetter, countallletters) {
//     let i = 0
// for(i;)
//   }
// }
// var closed = countBS("hmmm");
// console.log(closed("m", "m"));
// function stringCalc(stringinit, numberLettr) {
//   let summary = stringinit.length;
//   let numberOfLetter = 0;

//   for (let i = 0; i < stringinit.length; i++) {
//     if (stringinit[i] === numberLettr) {
//       numberOfLetter++;
//     }
//     return numberOfLetter;
//   }
//   return numberOfLetter + summary;
// }

// console.log(stringCalc("Svitlanka", "v"));
// function closed(stringinit, findLetter) {
//   let count = [];
//   let summary = stringinit.length;
//   for (let i = 0; i < stringinit.length; i++) {
//     if (stringinit[i] === findLetter) {
//       count.push(i);
//     }
//   }
//   return (
//     `'your letter is under number:'` +
//     count +
//     `"and"` +
//     `'summary of all words is:${summary}'`
//   );
// }

// console.log(closed("svitlanka", "n")); // 3

// function closed(stringinit, findLetter) {
//   let indices = [];
//   let summary = stringinit.length;
//   for (let i = 0; i < stringinit.length; i++) {
//     if (stringinit[i] === findLetter) {
//       indices.push(i);
//     }
//   }
//   return `Your letter is found at positions: ${indices.join(
//     ", "
//   )} and the total number of characters is: ${summary}`;
// }

// console.log(closed("svitlanka", "i")); // Output: Your letter is found at positions: 2 and the total number of characters is: 9
// const name = "svitlnka";
// console.log(name[0]);

// var total = 0,
//   count = 1;
// while (count <= 10) {
//   total += count;
//   count += 1;
// }
// console.log(total);

// console.log(sum(Range(1, 10)));

// var array = [1, 2, 3];
// for (var i = 0; i < array.length; i++) {
//   var current = array[i];
//   console.log(current);
// }
// function gatherCorrelations(journal) {
//   var phis = {};
//   for (var entry = 0; entry < journal.length; entry++) {
//     var events = journal[entry].events;
//     for (var i = 0; i < events.length; i++) {
//       var event = events[i];
//       if (!(event in phis)) phis[event] = phi(tableFor(event, journal));
//     }
//   }
//   return phis;
// }

// var string = JSON.stringify({ name: "X", born: 1980 });
// console.log(string);
// // → {"name":"X","born":1980}
// console.log(JSON.parse(string).born);
// // → 1980
// var ancestry = JSON.parse(ANCESTRY_FILE);
// console.log(ancestry.length);
// function filter(array, test) {
//   var passed = [];
//   for (var i = 0; i < array.length; i++) {
//   if (test(array[i]))
//   passed.push(array[i]);
//   }
//   return passed;
//   }
//   console.log(filter(ancestry, function(person) {
//   return person.born > 1900 && person.born < 1925;

export default App;
