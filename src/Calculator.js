import { useState, useEffect } from 'react';
import './Calculator.css';


var dpcounter = 0;    /*to ensure no entry of e.g 0.1.1*/
var opcounter = 0;    /*to compute when =2*/
var anscounter = 0;   /*to stop entry of ans on first use*/
var prevop = 0;       /*force next to not be an operator e.g stops entering +x*/
var nextop = 0;       /*force next to be an operator e.g stops entering ans3*/
var minuscounter = 0; /*stops too many minus signs*/
var result;           /*allow referencing ans*/

function Calculator() {

  const [disp, setDisp] = useState('0');

  useEffect(() => {
    if (document.getElementById('screen').offsetWidth > 
        document.getElementById('calculator-display').offsetWidth) {  /*stop display overflowing*/
      setDisp('NaN');
    }
  });

  function updateDisp(op) {
    if (op === 'AC') {
      setDisp('0');
      prevop = 0;
      nextop = 0;
      dpcounter = 0;
      opcounter = 0;
      minuscounter = 0;
      if (disp === 'NaN') {
        anscounter = 0;
      }
    }
    else if (disp === 'NaN') {
      anscounter = 0;
      /* do nothing will only allow AC */
    }
    else if (disp === '0') { 
      switch(op) {
        case '.': /*stop entries like 09 but allow 0.1*/
          setDisp(disp+op)
          dpcounter = 1;
          prevop = 1;
          break;
        case 'Ans':
          if (anscounter !== 0) {
            setDisp(op);
            nextop = 1;
          }
          break;
        case 'x':
        case '+':
        case '^':
          setDisp(disp+op);
          opcounter = 1;
          prevop = 1;
          break;
        case '/':
          setDisp(disp+'\u00F7')
          opcounter = 1;
          prevop = 1;
          break;
        case '-':
          setDisp(op);
          prevop = 1;
          minuscounter = 1;
          break;
        case '=':
          return;
        default:
          setDisp(op);
          prevop = 0;
      }
    }
    else {
      switch(op) {
        case '.':
          if (dpcounter === 0 && prevop === 0 && nextop === 0) {
            setDisp(disp+op);
            dpcounter = 1;
            prevop = 1;
            nextop = 0;
          }
          break;
        case 'Ans':
          if(anscounter === 1 && prevop === 1 && dpcounter === 0 && minuscounter === 0) {
            nextop = 1;
            prevop = 0;
            setDisp(disp+op);
          }
          break;
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
          break;
        case '=':
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
          break;
        default:
          if (nextop === 0) {
            setDisp(disp+op);
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
    var lhs = input.slice(0,i);
    var mid = input[i];
    var rhs = input.slice(i+1);
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
  }

  return (
    <div id="calculator-body">
      <div id="calculator-display">
        <div id="screen"><span>{disp}</span></div>
      </div>
      <div id="calculator-buttons">
        <div className="row">
          <div className="calc-button"><button onClick={() => updateDisp("AC")}>AC</button></div>
          <div className="calc-button"><button onClick={() => updateDisp("Ans")}>Ans</button></div>
          <div className="calc-button"><button onClick={() => updateDisp("^")}>&#119909;<sup>&#9744;</sup></button></div>
          <div className="calc-button"><button onClick={() => updateDisp("/")}>&#247;</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => updateDisp('7')}>7</button></div>
          <div className="calc-button"><button onClick={() => updateDisp('8')}>8</button></div>
          <div className="calc-button"><button onClick={() => updateDisp('9')}>9</button></div>
          <div className="calc-button"><button onClick={() => updateDisp("x")}>x</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => updateDisp('4')}>4</button></div>
          <div className="calc-button"><button onClick={() => updateDisp('5')}>5</button></div>
          <div className="calc-button"><button onClick={() => updateDisp('6')}>6</button></div>
          <div className="calc-button"><button onClick={() => updateDisp("-")}>-</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => updateDisp('1')}>1</button></div>
          <div className="calc-button"><button onClick={() => updateDisp('2')}>2</button></div>
          <div className="calc-button"><button onClick={() => updateDisp('3')}>3</button></div>
          <div className="calc-button"><button onClick={() => updateDisp("+")}>+</button></div>
        </div>
        <div className="row">
          <div id="zero-button"><button onClick={() => updateDisp('0')}>0</button></div>
          <div className="calc-button"><button onClick={() => updateDisp(".")}>.</button></div>
          <div className="calc-button"><button onClick={() => updateDisp("=")}>=</button></div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;