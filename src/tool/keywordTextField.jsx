import {TextField, FormControl, InputAdornment  } from "@mui/material";
import { useEffect, useState } from "react";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

/**
 * 關鍵字查詢
 * @param {array} keywordAdminData 暫存資料
 * @param {function} setAdminData 查詢結果回傳fun
 * @param {array} searchAttr 關鍵字查詢的屬性
 * @returns 
 */
export default function keyword({keywordAdminData, setAdminData, searchAttr}) {
    //-- 關鍵字查詢 --
    const changeAdminName= (e)=>{
        
        const newData= keywordAdminData.filter((item)=>{
            let index=0;
            searchAttr.forEach(attr => {
                let newIndex=item[attr].indexOf(e.target.value);
                index+=newIndex;
            });
            return index!=-1;
        })
        setAdminData(newData);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120, marginBottom:0}} size="small">
        {/* <TextField id="outlined-basic" label="名稱查詢" variant="outlined" size="small"/> */}
        <TextField
            id="input-with-icon-textfield"
            label="名稱查詢"
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <PersonSearchIcon />
                </InputAdornment>
            ),
            }}
            variant="outlined"
            size="small"
            onChange={changeAdminName}
        />
        </FormControl>
    )
}