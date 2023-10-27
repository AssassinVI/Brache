// 我的範例上是簡單採types.js來命名，但當檔案多時通常還會再次拆分
const snackbarOpen = 'snackbarOpen';
const menuIn = 'menuIn';
const systemTree = "systemTreeData"
const adminType = "adminData"
const informType = "informData"
const clearType = "clearAllRedux"
const calendarDateType = "switchCalendarDate"
const calednarTableDataType = "switchCalednarTableData"
const isTestType = 'isTestType';
// 這裡採node的方式做export/import
module.exports = {
    snackbarOpen,
    menuIn,
    systemTree,
    adminType,
    clearType,
    calendarDateType,
    calednarTableDataType,
    informType,
    isTestType
};