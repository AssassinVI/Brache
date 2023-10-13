import React, { useState } from 'react'
import Header from '../../components/Header'
import { Box, Button, Dialog, DialogContent } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { set_teacher_record_remark,get_course_record_one } from '../../axios-api/recordList';


export default function RemarkUpdated({data,setRecordData}){

    const [open , setOpen] = useState(false)
    const [remark , setRemark] = useState(null)
    const handleCancel=()=>{
        setOpen(false)
    }
    const handleSubmit = ()=>{
        set_teacher_record_remark({
            record_id:data.record_id,
            remark:remark
        },()=>{
            get_course_record_one(data.record_id,(res)=>{
                setRecordData(res.data.data[0])
            })
            setOpen(false)
        })
    }
    return(
        <>
        <EditIcon className='remarkBtn' onClick={()=>{
            setOpen(true)
        }}/>
          <Dialog open={open} onClose={handleCancel} >
         
            
            <Box sx={{
                padding:"16px",
                "& textarea":{
                    padding:"5px",
                    fontSize:"14px",
                    lineHeight:"1.5em"
                }
            }}>
                <h2 style={{
                    margin:"0 0 10px 0"
                }}>本周作業及注意事項</h2>
            <textarea onChange={(e)=>{
                setRemark(e.target.value)
            }} defaultValue={data.remark && data.remark} style={{width:"100%"}} cols="30" rows="20"></textarea>
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