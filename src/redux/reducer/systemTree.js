import { systemTree } from "../type";
const initialState = {
    tree: null,
    needConfirm: false
}
// 這部分和useReducer hook是一樣的
export const systemTreeReducer = (state = initialState, action) => {
    switch (action.type) {
        case systemTree:
            return {
                ...state,
                tree: action.payload,
                needConfirm: action.needConfirm
            }

        default:
            return state;
    }
}
