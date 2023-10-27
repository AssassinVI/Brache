import { isTestType } from "../type";

const initialState = {
    test: false,
}

// 這部分和useReducer hook是一樣的
export const testReducer = (state = initialState, action) => {
    switch (action.type) {
        case isTestType:
            return {
                test: action.payload,
            }
        default:
            return state;
    }
}