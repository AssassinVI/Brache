import React, { useState, useEffect } from "react";

import axios from "axios";
import {useParams, Link} from 'react-router-dom'
import { useSelector } from "react-redux";
import { Box, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
export default function Post() {

    const [open, setOpen] = useState(false);

    const [course, setCourse]=useState({});
    const [signInType, setSignInType]=useState(null);
    const [remark, setRemark]=useState(null);
    const param=useParams();
    const [titleName, setTitleName]=useState('');
    const [dt, setDt]=useState({});
    const isTest = useSelector(state => state.testReducer)
    const headers_obj=isTest.test ? {Test:'test'}:{};

    const msg_style={
        justifyContent:'center',
        backgroundColor: course?.success ? '#daffea':'#ffdada',
        padding: '8px 10px',
        color: course?.success ? '#158d49':'#8d1515',
        letterSpacing: '0.1em',
        borderRadius: '8px',
        marginTop: "20px",
        display: course?.success!==undefined ? 'flex':'none'
    }

    const dt_style={
        display: course?.success || dt!==undefined ? 'block':'none',
        textAlign:'left',
    }

    const btn={
        fontSize: '16px',
        letterSpacing: '0.1em',
        fontWeight: 600, 
        margin:'0 5px'
    }

    useEffect(()=>{
        //-- 獲取資料 --
        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/mailSignin.php",
            headers:headers_obj,
            data: {
                type: "getData",
                qrcodeId: param.Tb_index
            },
        }).then((res) => {
            if(res.data.data.type==='2'){
                setTitleName(`${res.data.data.name}老師`);
            }
            else{
                setTitleName(`${res.data.data.name}同學`);
            }
        })
        
    }, [])

    useEffect(()=>{
        setDt(course.data);
        //console.log(course);
    }, [course]);


    //-- 簽到/請假 --
    const signIn=({signInType, remark=null})=>{
        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/mailSignin.php",
            headers:headers_obj,
            data: {
                type: "signIn",
                qrcodeId: param.Tb_index,
                signInType:signInType,
                remark: remark
            },
        }).then((res) => {
            setCourse(res.data);
        })
        setOpen(false);
    }


    const handleClickOpen = (signInType) => {
        setSignInType(signInType);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    

    return (
        <Box>
            <h2 
            style={{
                fontSize: '30px',
                fontWeight: 600,
                letterSpacing: '0.1em',
            }}
            >
            {titleName}
            </h2>
            <Box>
                <Button variant="contained" size="large" color="success" sx={btn} onClick={()=>{handleClickOpen('signIn')}}>簽到</Button>
                <Button variant="contained" size="large" color="error" sx={btn} onClick={()=>{handleClickOpen('askForLeave', remark)}}>請假</Button>
            </Box>

            {/* 簽到/請假彈出視窗 */}
            <Dialog
                open={open}
                // fullWidth={true}
                maxWidth={'lg'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{
                        fontSize: '20px',
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        fontWeight: 600,
                }}>
                    {`${titleName}是否要${signInType==='signIn' ? '簽到':'請假'}?`}
                </DialogTitle>
                <DialogContent sx={{display: signInType==='signIn' ? 'none':'flex'}}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="備註"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e)=>{
                            setRemark(e.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{justifyContent:'center', paddingBottom:'20px'}}>
                    <Button variant="outlined" onClick={handleClose} color="error">取消</Button>
                    <Button variant="contained" onClick={()=>{signIn({signInType:signInType, remark:remark})}} color="success">確定</Button>
                </DialogActions>
            </Dialog>

            
            <h3 style={msg_style}>{course?.msg}</h3>

            <p style={dt_style}>
                課程：{dt?.c_name} <br />
                上課時間：{dt?.StartTime} <br />
                下課時間：{dt?.EndTime} <br />
            </p>

            <Button component={Link} variant="outlined" to={"/"} sx={
                {
                    // backgroundColor: '#009688',
                    fontSize: '14px',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    marginTop: '35px',
                    color:'#009688',
                    border: "1px solid"
                }
            }><HomeIcon sx={{mr:'5px'}} /> 登入系統</Button>
            
        </Box>
        
    );
}