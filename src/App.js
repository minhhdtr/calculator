import './style.css'
import { useReducer } from 'react'
import DigitButton from './components/DigitButton'
import OperationButton from './components/OperationButton'

export const ACTIONS = {
  ALL_CLEAR: 'all-clear',
  DELETE_DIGIT: 'delete-digit',
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0')
        return state
      if (payload.digit === '.' && state.currentOperand.includes('.'))
        return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    case ACTIONS.ALL_CLEAR:
      return {}
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null)
        return state
      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
        overwrite: true
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(curr))
    return ''
  let res = ''
  switch (operation) {
    case '+':
      res = prev + curr
      break
    case '-':
      res = prev - curr
      break
    case '*':
      res = prev * curr
      break
    case '÷':
      res = prev / curr
      break
    default:
      break
  }
  return res.toString()
}

const INTEGER_FORMATER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null)
    return INTEGER_FORMATER.format(integer)
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } })

  return (
    <div div className='container'>
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>
        <button className='span-two orange' onClick={() => dispatch({ type: ACTIONS.ALL_CLEAR })}>AC</button>
        <button className='orange' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation='÷' dispatch={dispatch} />
        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2' dispatch={dispatch} />
        <DigitButton digit='3' dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />
        <DigitButton digit='4' dispatch={dispatch} />
        <DigitButton digit='5' dispatch={dispatch} />
        <DigitButton digit='6' dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />

        <DigitButton digit='7' dispatch={dispatch} />
        <DigitButton digit='8' dispatch={dispatch} />
        <DigitButton digit='9' dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />

        <DigitButton digit='.' dispatch={dispatch} />
        <DigitButton digit='0' dispatch={dispatch} />
        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>

      <div className='footer'>
        made with ❤️ by duc minhh
      </div>
    </div>
  )
}

export default App