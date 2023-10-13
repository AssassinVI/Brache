import { calendarDateType, calednarTableDataType } from "../type";

const initialState = {
    currentDate: null,
    tableData: null
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
        default:
            return state;
    }
}