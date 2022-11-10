import { useState, useEffect } from 'react';
import './Calculator.css';

function Calculator() {

  const [disp, setDisp] = useState('0');

  const [dpcounter, setDpc] = useState(0);        /*to ensure no entry of e.g 0.1.1*/
  const [opcounter, setOpc] = useState(0);        /*to compute when =2*/
  const [anscounter, setAnsc] = useState(0);      /*to stop entry of ans on first use*/
  const [prevop, setPrevop] = useState(0);        /*force next to not be an operator e.g stops entering +x*/
  const [nextop, setNextop] = useState(0);        /*force next to be an operator e.g stops entering ans3*/
  const [minuscounter, setMinusc] = useState(0);  /*stops too many minus signs*/
  const [zerocounter, setZeroc] = useState(0);    /*stops entering 0003 but allows 0.1*/
  const [result, setResult] = useState(0);        /*allow referencing ans*/

  useEffect(() => {
    if (document.getElementById('screen').offsetWidth > 
        document.getElementById('calculator-display').offsetWidth) {  /*stop display overflowing*/
      setDisp('NaN');
    }
  });

  function clear() {
    setDisp('0');
    setPrevop(0);
    setNextop(0);
    setDpc(0);
    setOpc(0);
    setMinusc(0);
    setZeroc(0);
    if (disp === 'NaN') {
      setAnsc(0);
    }
  }

  function isNaN() {
    if (disp === 'NaN') {
      setAnsc(0);
      return true;
    }
    return false;
  }

  function decimal() {
    if (!isNaN()) {
      if (disp === '0') {
        setDisp(disp+'.')
        setDpc(1);
        setPrevop(1);
      }
      else {
        if (dpcounter === 0 && prevop === 0 && nextop === 0) {
          setDisp(disp+'.');
          setDpc(1);
          setPrevop(1);
          setNextop(0);
          setZeroc(0);
        }
      }
    }
  }

  function onAns() {
    if (!isNaN()) {
      if (disp === '0') {
        if (anscounter !== 0) {
          setDisp('Ans');
          setNextop(1);
        }
      }
      else {
        if(anscounter === 1 && prevop === 1 && dpcounter === 0 && minuscounter === 0) {
          setNextop(1);
          setPrevop(0);
          setDisp(disp+'Ans');
        }
      }
    }
  }

  function onOperator(op) {
    if (!isNaN()) {
      switch(op) {
        case 'x':
        case '+':
        case '^':
          if (opcounter === 1) {
            if (prevop === 0) {
              compute(disp,op,2);
              setPrevop(1);
              setOpc(1);
            }
          }
          else {
            if (prevop === 0) {
              setOpc(1);
              setPrevop(1);
              setDpc(0);
              setMinusc(0);
              setNextop(0);
              setDisp(disp+op);
            }
          }
          break;
        case '/':
          if (opcounter === 1) {
            if (prevop === 0) {
              compute(disp,'\u00F7',2);
              setPrevop(1);
              setOpc(1);
            }
          }
          else {
            if (prevop === 0) {
              setOpc(1);
              setPrevop(1);
              setDpc(0);
              setMinusc(0);
              setNextop(0);
              setDisp(disp+'\u00F7');
            }
          }
          break;
        case '-':
          if (disp === '0') {
            setDisp(op);
            setPrevop(1);
            setMinusc(1);
          }
          else {
            if (opcounter === 1) {
              if (prevop === 0) {
                compute(disp,op,2);
                setPrevop(1);
                setOpc(1);
              }
              else {
                if (minuscounter === 0 && dpcounter === 0) {
                  setDisp(disp+op);
                  setPrevop(1);
                  setMinusc(1);
                  setNextop(0);
                }
              }
            }
            else {
              if (prevop === 0) {
                setOpc(1);
                setPrevop(1);
                setDpc(0);
                setMinusc(0);
                setNextop(0);
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
            setPrevop(0);
            setOpc(0);
            setNextop(1);
          }
          else if (disp === 'Ans') {
            setDisp(result);
            setAnsc(1);
            setMinusc(0);
            setNextop(0);
            setDpc(1);
          }
          else {
            setResult(disp);
            setAnsc(1);
          }
      }
    }
  }

  function onNumber(inp) {
    if (!isNaN()) {
      if (disp === '0') {
        setDisp(inp);
        setPrevop(0);
      }
      else {
        if (nextop === 0 && zerocounter === 0) {
          setDisp(disp+inp);
          setPrevop(0);
        }
      }
    }
  }

  function onZero() {
    if (!isNaN()) {
      if (disp === '0') {
        return;
      }
      else if (nextop === 0) {
        if (dpcounter === 0 && prevop === 1) {
          setDisp(disp+'0');
          setPrevop(0);
          setZeroc(1);
        }
        if (zerocounter === 0) {
        setDisp(disp+'0');
        setPrevop(0);
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
    
    let tempResult;
    switch(mid) {
      case '+':
        tempResult = Number(lhs) + Number(rhs);
        break;
      case '-':
        tempResult = Number(lhs) - Number(rhs);
        break;
      case 'x':
        tempResult = Number(lhs) * Number(rhs);
        break;
      case '\u00F7':
        if (rhs === '0') {
          setDisp('NaN');
          return;
        }
        else {
          tempResult = Number(lhs) / Number(rhs);
        }
        break;
      default:
        if (lhs === '0' && rhs[0] === '-') {
          setDisp('NaN');
          return;
        }
        else {
          tempResult = Number(lhs) ** Number(rhs);
        }
    }

    tempResult = Math.round((tempResult + Number.EPSILON) * 100000000) / 100000000; /*restrict to 8d.p.*/
    setResult(tempResult);

    if (opcount === 2) {
      setDisp(tempResult+futureop);
      setDpc(0);
    }
    else {
      setDisp(tempResult);
      setDpc(1);
    }
    setAnsc(1);
    setMinusc(0);
    setNextop(0);
    setZeroc(0);
  }

  return (
    <div id="calculator-body">
      <div id="calculator-display">
        <div id="screen"><span>{disp}</span></div>
      </div>
      <div id="calculator-buttons">
        <div className="row">
          <div className="calc-button"><button onClick={() => clear()}>AC</button></div>
          <div className="calc-button"><button onClick={() => onAns()}>Ans</button></div>
          <div className="calc-button"><button onClick={() => onOperator("^")}>&#119909;<sup>&#9744;</sup></button></div>
          <div className="calc-button"><button onClick={() => onOperator("/")}>&#247;</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => onNumber('7')}>7</button></div>
          <div className="calc-button"><button onClick={() => onNumber('8')}>8</button></div>
          <div className="calc-button"><button onClick={() => onNumber('9')}>9</button></div>
          <div className="calc-button"><button onClick={() => onOperator("x")}>x</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => onNumber('4')}>4</button></div>
          <div className="calc-button"><button onClick={() => onNumber('5')}>5</button></div>
          <div className="calc-button"><button onClick={() => onNumber('6')}>6</button></div>
          <div className="calc-button"><button onClick={() => onOperator("-")}>-</button></div>
        </div>
        <div className="row">
          <div className="calc-button"><button onClick={() => onNumber('1')}>1</button></div>
          <div className="calc-button"><button onClick={() => onNumber('2')}>2</button></div>
          <div className="calc-button"><button onClick={() => onNumber('3')}>3</button></div>
          <div className="calc-button"><button onClick={() => onOperator("+")}>+</button></div>
        </div>
        <div className="row">
          <div id="zero-button"><button onClick={() => onZero()}>0</button></div>
          <div className="calc-button"><button onClick={() => decimal()}>.</button></div>
          <div className="calc-button"><button onClick={() => onOperator("=")}>=</button></div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;