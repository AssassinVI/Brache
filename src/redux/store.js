import { combineReducers } from "redux";
import { snackbarOpenReducer } from "./reducer/snackOpen";
import { menuInReducer } from "./reducer/menuIn";
import { systemTreeReducer } from "./reducer/systemTree";
import { accessRangeReducer } from "./reducer/accessRange";
import { calendarReducer } from "./reducer/calendar";
import { testReducer } from "./reducer/isTest";
import { clearType } from "./type";
const createStore = require('redux').createStore;
const reducers = combineReducers({
    snackbarOpenReducer,
    menuInReducer,
    systemTreeReducer,
    accessRangeReducer,
    calendarReducer,
    testReducer
})

const rootReducer = (state, action) => {
    if (action.type === clearType) {
        // 重置所有 reducer 的狀態為它們的初始狀態
        state = undefined;
    }

    return reducers(state, action);
};


export const store = createStore(rootReducer)