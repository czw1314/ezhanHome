
import { createStore, combineReducers, applyMiddleware } from 'redux'
import {userInformation,bridalInformation,estateId,fileList} from './reducer'
const rootReducer = combineReducers({
    'userInformation':userInformation,
    'bridalInformation':bridalInformation,
    'estateId':estateId,
    'fileList':fileList

})
const store=new createStore(rootReducer)
export default store