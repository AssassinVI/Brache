import { notificationListType } from "../type";

const initialState = {
    data: null,
    reflash: false
}

// 這部分和useReducer hook是一樣的
export const notificationListReducer = (state = initialState, action) => {
    switch (action.type) {
        case notificationListType:
            return {
                data: action.list==undefined ? state.list : action.list,
                reflash: action.reflash==undefined ? state.reflash : action.reflash
            }
        default:
            return state;
    }
}