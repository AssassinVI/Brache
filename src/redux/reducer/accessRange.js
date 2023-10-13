import { adminType,informType } from "../type";

const initialState = {
    data: null,
    inform: null
}
// 這部分和useReducer hook是一樣的
export const accessRangeReducer = (state = initialState, action) => {
    switch (action.type) {
        case adminType:
            return {
                data: action.data,
                inform: action.inform
            }
            case informType:
                return {
                    inform: action.inform
                }
        default:
            return state;
    }
}
