
import { createStore, combineReducers, applyMiddleware } from 'redux'
import {userInformation,bridalInformation,userId} from './reducer'
const rootReducer = combineReducers({
    'userInformation':userInformation,
    'bridalInformation':bridalInformation,
    'userId':userId,
})
const store=new createStore(rootReducer)
export default store