import React, { useState } from 'react'
import { Box, Button, Dialog, DialogContent, TextField, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { set_student_course_record,get_course_record_one } from '../../axios-api/recordList';
import { useDispatch } from 'react-redux'
import { notificationListAction } from "../../redux/action";
import AddIcon from '@mui/icons-material/Add';
export default function AddPractice({data,setRecordData,time=null}){
    //console.log(data)
    const [open , setOpen] = useState(false)
    const [practiceData,setPracticeData] = useState({})
    const dispatch=useDispatch(null);
    const handleCancel=()=>{
        setOpen(false)
    }
    const handleSubmit = ()=>{
        //console.log(practiceData)
       
        set_student_course_record({
            record_id:data.record_id,
           ...practiceData
        },()=>{
            get_course_record_one(data.record_id,(res)=>{
                setRecordData(res.data.data[0])
            })
            //-- 更新通知 --
            dispatch(notificationListAction({reflash: true}))
            setOpen(false)
        })
    }
   
    return(
        <>
        <Button variant="contained" color="success" onClick={()=>{setOpen(true)}} sx={{position: 'absolute', right:0, top:0}}>
            <AddIcon /> 練習時間
        </Button>
          <Dialog open={open} onClose={handleCancel} >
            <Box sx={{
                padding:"30px",
                maxWidth:"1200px",
                "& textarea":{
                    padding:"5px",
                    fontSize:"14px",
                    lineHeight:"1.5em"
                },
                "& ul":{
                    padding:0
                },
                "& li":{
                    listStyle:"none",
                    marginBottom:"25px",
                    "& h4":{
                        textAlign:"center",
                        margin:"10px 0 5px 0"
                    },
                }
            }}>
                <h2 style={{
                    margin:"0 0 10px 0"
                }}>本周練習時間</h2>
            <ul>
                <li>
                    <TextField
                        id="date"
                        label="日期"
                        type="date"
                        defaultValue={time?time.date :""}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={(e)=>{
                           setPracticeData({
                            ...practiceData,
                            record_date:e.target.value
                           })
                        }}
                        />
                </li>
                <li>
                    <TextField
                        id="time"
                        label="開始時間"
                        type="time"
                        defaultValue={time?time.StartTime :""}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 分鐘一個tick
                        }}
                        onChange={(e)=>{
                            setPracticeData({
                             ...practiceData,
                             StartTime:e.target.value
                            })
                         }}
                        />
                </li>
                <li>
                    <TextField
                        id="time"
                        label="結束時間"
                        type="time"
                        defaultValue={time?time.EndTime :""}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 分鐘一個tick
                        }}
                        onChange={(e)=>{
                            //console.log(e)
                            setPracticeData({
                             ...practiceData,
                             EndTime:e.target.value
                            })
                         }}
                        />
                </li>
            </ul>
            <DialogContent sx={{ display: "flex", padding:0,justifyContent: "flex-end", alignItems: "center", "& button": { fontSize: "15px" } }}>
            
                <Box>
                  <Button onClick={handleSubmit}>送出</Button>
                  <Button onClick={handleCancel}>取消</Button>
                </Box>
              </DialogContent>
            </Box>
          </Dialog>
        </>
    )
}