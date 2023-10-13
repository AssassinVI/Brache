import { menuIn } from "../type";

const initialState = {
    flag: true
}
// 這部分和useReducer hook是一樣的
export const menuInReducer = (state = initialState, action) => {
    switch (action.type) {
        case menuIn:
            return {
                flag: action.payload,
            }
        default:
            return state;
    }
}
