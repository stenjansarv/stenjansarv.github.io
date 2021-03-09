import { combineReducers } from 'redux'

const details = (state = {}, action) => {
  switch (action.type) {
    case 'USER':
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  details
})