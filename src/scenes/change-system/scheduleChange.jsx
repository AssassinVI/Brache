import React from "react";
import Header from "../../components/Header";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, TextField, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import * as changeApi from "../../axios-api/changeSystem"
import { useSelector } from "react-redux";
import ChangeSheet from "./changeSheet";
import YourApproval from "./yourApproval";
import Inprogress from "./inProgress";
import TurnDown from "./turnDown";
import Storage from "./storage";
import useAuthorityRange from "../../custom-hook/useAuthorityRange";

export default function ScheduleChange(){
    //儲存list資料
    const [listData,setListData] = useState(null)

    const userData = useSelector(state => state.accessRangeReducer)

    //獲取權限資料
    const { accessData, accessDetect } = useAuthorityRange()
    const [authorityRange, setAuthorityRange] = useState({})

    useEffect(() => {
        if (accessData) {
            const result = accessDetect(accessData, "課表異動管理")
            setAuthorityRange({
                p_delete: result.p_delete === "1" ? true : false,
                p_insert: result.p_insert === "1" ? true : false,
                p_update: result.p_update === "1" ? true : false,
            })
        }
    }, [accessData])


    useEffect(()=>{
        if(userData.inform !== null){
         
            const userId = userData.inform.Tb_index;
            changeApi.get_course_transfer(userId,(res)=>{
                setListData(res.data.data)
            })
        }
    },[userData])

    useEffect(()=>{
        console.log(listData)
    },[listData])

 


    return(
        <div style={{ width: '95%', margin: '20px auto 0' }}>
            <Header title={`異動單管理`} subtitle={`已提交的異動單無法再做修改與刪除。`} />
            {authorityRange.p_insert&&<ChangeSheet crud={"insert"} setListData={setListData}/>}
            {listData&& listData.you_approval.length>0 && <YourApproval listData={listData.you_approval} setListData={setListData}/>}
            {listData&& listData.in_progress.length>0 && <Inprogress listData={listData.in_progress} setListData={setListData}/>}
            {listData&& listData.turn_down.length>0 && <TurnDown listData={listData.turn_down} setListData={setListData}/>}
            {listData&& listData.storage.length>0 && <Storage listData={listData.storage} setListData={setListData}/>}
            {listData && listData.storage.length ==0 && listData.you_approval.length == 0 && listData.in_progress.length == 0 && listData.turn_down.length == 0 && <p>尚未有您的異動單</p>}
        </div>
    )
}