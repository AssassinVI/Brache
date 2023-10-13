import { snackbarOpen } from "../type";

const initialState = {
    flag: false,
    message: null,
    severity: "success"
}
// 這部分和useReducer hook是一樣的
export const snackbarOpenReducer = (state = initialState, action) => {
    switch (action.type) {
        case snackbarOpen:
            return {
                flag: action.payload,
                message: action.message,
                severity: action.severity
            }

        default:
            return state;
    }
}
