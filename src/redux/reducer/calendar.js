import { calendarDateType, calednarTableDataType, askForLeaveCourseType } from "../type";

const initialState = {
    currentDate: null,
    tableData: null,
    askForLeaveCourse: null
}

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case calendarDateType:
            return {
                ...state,
                currentDate: action.currentDate, // 注意這裡使用小寫的 data
            };
        case calednarTableDataType:
            return {
                ...state,
                tableData: action.tableData, // 注意這裡使用 inform
            };
        case askForLeaveCourseType:
            return {
                ...state,
                askForLeaveCourse: action.askForLeaveCourse,
            };
        default:
            return state;
    }
}