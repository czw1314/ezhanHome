
import { createStore, combineReducers, applyMiddleware } from 'redux'
import {userInformation,taskList,userId,index} from './reducer'
const rootReducer = combineReducers({
    'userInformation':userInformation,
    'taskList':taskList,
    'userId':userId,
    'index':index
})
const store=new createStore(rootReducer)
export default store