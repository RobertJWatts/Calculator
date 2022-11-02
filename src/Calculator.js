import { useState, useEffect } from 'react';
import './Calculator.css';

let dpcounter = 0;    /*to ensure no entry of e.g 0.1.1*/
let opcounter = 0;    /*to compute when =2*/
let anscounter = 0;   /*to stop entry of ans on first use*/
let prevop = 0;       /*force next to not be an operator e.g stops entering +x*/
let nextop = 0;       /*force next to be an operator e.g stops entering ans3*/
let minuscounter = 0; /*stops too many minus signs*/
let result;           /*allow referencing ans*/
let zerocounter = 0;  /*stops entering 0003 but allows 0.1*/

function Calculator() {

  const [disp, setDisp] = useState('0');

  useEffect(() => {
    if (document.getElementById('screen').offsetWidth > 
        document.getElementById('calculator-display').offsetWidth) {  /*stop display overflowing*/
      setDisp('NaN');
    }
  });

  function clear() {
    setDisp('0');
    prevop = 0;
    nextop = 0;
    dpcounter = 0;
    opcounter = 0;
    minuscounter = 0;
    zerocounter = 0;
    if (disp === 'NaN') {
      anscounter = 0;
    }
  }

  function isNaN() {
    if (disp === 'NaN') {
      anscounter = 0;
      return true;
    }
    return false;
  }

  function decimal() {
    if (!isNaN()) {
      if (disp === '0') {
        setDisp(disp+'.')
        dpcounter = 1;
        prevop = 1;
      }
      else {
        if (dpcounter === 0 && prevop === 0 && nextop === 0) {
          setDisp(disp+'.');
          dpcounter = 1;
          prevop = 1;
          nextop = 0;
          zerocounter = 0;
        }
      }
    }
  }

  function ans() {
    if (!isNaN()) {
      if (disp === '0') {
        if (anscounter !== 0) {
          setDisp('Ans');
          nextop = 1;
        }
      }
      else {
        if(anscounter === 1 && prevop === 1 && dpcounter === 0 && minuscounter === 0) {
          nextop = 1;
          prevop = 0;
          setDisp(disp+'Ans');
        }
      }
    }
  }

  function operator(op) {
    if (!isNaN()) {
      switch(op) {
        case 'x':
        case '+':
        case '^':
          if (opcounter === 1) {
            if (prevop === 0) {
              compute(disp,op,2);
              prevop = 1;
              opcounter = 1;
            }
          }
          else {
            if (prevop === 0) {
              opcounter = 1;
              prevop = 1;
              dpcounter = 0;
              minuscounter = 0;
              nextop = 0;
              setDisp(disp+op);
            }
          }
          break;
        case '/':
          if (opcounter === 1) {
            if (prevop === 0) {
              compute(disp,op,2);
              prevop = 1;
              opcounter = 1;
            }
          }
          else {
            if (prevop === 0) {
              opcounter = 1;
              prevop = 1;
              dpcounter = 0;
              minuscounter = 0;
              nextop = 0;
              setDisp(disp+'\u00F7');
            }
          }
          break;
        case '-':
          if (disp === '0') {
            setDisp(op);
            prevop = 1;
            minuscounter = 1;
          }
          else {
            if (opcounter === 1) {
              if (prevop === 0) {
                compute(disp,op,2);
                prevop = 1;
                opcounter = 1;
              }
              else {
                if (minuscounter === 0 && dpcounter === 0) {
                  setDisp(disp+op);
                  prevop = 1;
                  minuscounter = 1;
                  nextop = 0;
                }
              }
            }
            else {
              if (prevop === 0) {
                opcounter = 1;
                prevop = 1;
                dpcounter = 0;
                minuscounter = 0;
                nextop = 0;
                setDisp(disp+op);
              }
            }
          }
          break;
        case '=':
          if (disp === '0') {
            return;
          }
          if (opcounter !== 0 && prevop === 0) {
            compute(disp,op,1);
            prevop = 0;
            opcounter = 0;
            nextop = 1;
          }
          else if (disp === 'Ans') {
            setDisp(result);
            anscounter = 1;
            minuscounter = 0;
            nextop = 0;
            dpcounter = 1;
          }
          else {
            result = disp;
            anscounter = 1;
          }
      }
    }
  }

  function num(inp) {
    if (!isNaN()) {
      if (disp === '0') {
        setDisp(inp);
        prevop = 0;
      }
      else {
        if (nextop === 0 && zerocounter === 0) {
          setDisp(disp+inp);
          prevop = 0;
        }
      }
    }
  }

  function zero() {
    if (!isNaN()) {
      if (disp === '0') {
        return;
      }
      else if (nextop === 0) {
        if (dpcounter === 0 && prevop === 1) {
          setDisp(disp+'0');
          prevop = 0;
          zerocounter = 1;
        }
        if (zerocounter === 0) {
        setDisp(disp+'0');
        prevop = 0;
        }
      }
    }
  }

  function compute(input,futureop,opcount) {

    for (var i = 1; i<input.length; i++) {
      if (input[i] === '+' || input[i] === '-' || input[i] === 'x' ||
          input[i] === '\u00F7' || input[i] === '^') {
            break;
          }
    }
    let lhs = input.slice(0,i);
    let mid = input[i];
    let rhs = input.slice(i+1);
    if (lhs === 'Ans') {
      lhs = result;
    }
    if (rhs === 'Ans') {
      rhs = result;
    }
    
    switch(mid) {
      case '+':
        result = Number(lhs) + Number(rhs);
        break;
      case '-':
        result = Number(lhs) - Number(rhs);
        break;
      case 'x':
        result = Number(lhs) * Number(rhs);
        break;
      case '\u00F7':
        if (rhs === '0') {
          setDisp('NaN');
          return;
        }
        else {
          result = Number(lhs) / Number(rhs);
        }
        break;
      default:
        if (lhs === '0' && rhs[0] === '-') {
          setDisp('NaN');
          return;
        }
        else {
          result = Number(lhs) ** Number(rhs);
        }
    }

    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000; /*restrict to 8d.p.*/

    if (opcount === 2) {
      setDisp(result+futureop);
      dpcounter = 0;
    }
    else {
      setDisp(result);
      dpcounter = 1;
    }
    anscounter = 1;
    minuscounter = 0;
    nextop = 0;
    zerocounter = 0;
  }

  return (
    <div id="calculator-body">
      <div id="calculator-display">
        <div id="screen"><span>{disp}</span></div>
      </div>
      <div id="calculator-buttons">
        <div className="row">
          <div className="calc-button"><button onClick={() => clear()}>AC</button></div>
          <div className="calc-button"><button onClick={() => ans()}>Ans</button></div>
          <div className="calc-button"><button onClick={() => operator("^")}>&#119909;<sup>&#9744;</sup></button></div>
          <div className="calc-button"><button onClick={() => operator("/")}>&#247;</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => num('7')}>7</button></div>
          <div className="calc-button"><button onClick={() => num('8')}>8</button></div>
          <div className="calc-button"><button onClick={() => num('9')}>9</button></div>
          <div className="calc-button"><button onClick={() => operator("x")}>x</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => num('4')}>4</button></div>
          <div className="calc-button"><button onClick={() => num('5')}>5</button></div>
          <div className="calc-button"><button onClick={() => num('6')}>6</button></div>
          <div className="calc-button"><button onClick={() => operator("-")}>-</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => num('1')}>1</button></div>
          <div className="calc-button"><button onClick={() => num('2')}>2</button></div>
          <div className="calc-button"><button onClick={() => num('3')}>3</button></div>
          <div className="calc-button"><button onClick={() => operator("+")}>+</button></div>
        </div>
        <div className="row">
          <div id="zero-button"><button onClick={() => zero()}>0</button></div>
          <div className="calc-button"><button onClick={() => decimal()}>.</button></div>
          <div className="calc-button"><button onClick={() => operator("=")}>=</button></div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;