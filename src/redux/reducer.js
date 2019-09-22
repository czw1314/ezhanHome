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
function index(state = '', action) {
    switch (action.type) {
        case 'gateway':
            return action.data
        default:
            return state
    }
}
function userId(state = {}, action) {
    switch (action.type) {
        case 'userId':
            return action.data
        default:
            return state
    }
}

function taskList(state = [], action) {
    switch (action.type) {
        case 'taskList':
            return state=action.data
        default:
            return state
    }
}


export {userInformation,taskList,userId,index}