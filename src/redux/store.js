
import { createStore, combineReducers, applyMiddleware } from 'redux'
import {userInformation,bridalInformation,estateId,fileList,housingPictures} from './reducer'
const rootReducer = combineReducers({
    'userInformation':userInformation,
    'bridalInformation':bridalInformation,
    'estateId':estateId,
    'fileList':fileList,
    'housingPictures':housingPictures

})
const store=new createStore(rootReducer)
export default store