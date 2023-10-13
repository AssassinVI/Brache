// useAdminData.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';



const useAuthorityRange = () => {
    // 使用 useSelector 來從 Redux store 中獲取 adminData 資料
    const accessData = useSelector(state => state.accessRangeReducer.data)
    // 處理資料的邏輯，例如使用 accessDetect 函式
    const accessDetect = (adminData, target) => {
        let foundItem = null;
        adminData.forEach((item) => {
            if (item.children.length > 0) {
                if (item.MT_Name === target) {
                    foundItem = item;
                } else if (!foundItem) {
                    foundItem = accessDetect(item.children, target);
                }
            } else {
                if (item.MT_Name === target) {
                    foundItem = item;
                }
            }
        });
        return foundItem;
    }


    // 回傳整合後的資料和處理函式
    return { accessData, accessDetect };
};

export default useAuthorityRange;