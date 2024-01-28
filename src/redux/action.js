import { 
    snackbarOpen, 
    menuIn, 
    systemTree, 
    adminType, 
    clearType, 
    calendarDateType, 
    calednarTableDataType, 
    askForLeaveCourseType, 
    informType, 
    isTestType, 
    notificationListType 
} from "./type"

export const snackBarOpenAction = (bolean, str, severity) => {
    return {
        type: snackbarOpen,
        payload: bolean,
        message: str,
        severity: severity
    }
}

export const menuInAction = (flag) => {
    return {
        type: menuIn,
        payload: flag,
    }
}

export const systemTreeAction = (treeArr, bolean = false) => {
    return {
        type: systemTree,
        payload: treeArr,
        needConfirm: bolean
    }
}


export const adminAction = (data, inform) => {
    return {
        type: adminType,
        data: data,
        inform: inform
    }
}
export const infromAction = (inform) => {
    return {
        type: informType,
        inform: inform
    }
}

export const clearReduxStateAction = () => ({
    type: clearType,
});



export const calendarDateAction = (data) => {
    return {
        type: calendarDateType,
        currentDate: data,
    }
}

export const calendarTableDataAction = (data) => {
    return {
        type: calednarTableDataType,
        tableData: data,
    }
}

export const askForLeaveCourseAction = (data) => {
    return {
        type: askForLeaveCourseType,
        askForLeaveCourse: data,
    }
}


export const isTestTypeAction = (test) => {
    return {
        type: isTestType,
        payload: test,
    }
}

/**
 * 
 * @param {Array} data 通知資料
 * @param {Boolean} reflash 是否刷新
 * @returns 
 */
export const notificationListAction = ({data, reflash}) => {
    return {
        type: notificationListType,
        list: data,
        reflash: reflash
    }
}