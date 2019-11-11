// function reducer(state={}, action) {
//     switch (action.type) {
//         case 'taskList':
//             return state.taskList = action.data;
//         case 'gateway':
//             return state.gateway = action.data;
//         default:
//             return state={
//                 taskList:[],
//                 gateway:''
//             }
//     }
// }
function userInformation(state = {}, action) {
    switch (action.type) {
        case 'userInformation':
            return action.data
        default:
            return state
    }
}
function bridalInformation(state ={}, action) {
    switch (action.type) {
        case 'bridalInformation':
            return action.data
        default:
            return state
    }
}
function apartmentInformation(state ={}, action) {
    switch (action.type) {
        case 'apartmentInformation':
            return action.data
        default:
            return state
    }
}
function estateId(state = '', action) {
    switch (action.type) {
        case 'estateId':
            return action.data
        default:
            return state
    }
}

function fileList(state = [], action) {
    switch (action.type) {
        case 'fileList':
            return state=action.data
        default:
            return state
    }
}

function housingPictures(state = [], action) {
    switch (action.type) {
        case 'housingPictures':
            return state=action.data
        default:
            return state
    }
}


export {userInformation,bridalInformation,estateId,fileList,housingPictures,apartmentInformation}