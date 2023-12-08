import React, { useState, useEffect } from "react";

import axios from "axios";
import {useParams, Link} from 'react-router-dom'
import { useSelector } from "react-redux";
import { Box, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
export default function Post() {

    const [course, setCourse]=useState({});
    const param=useParams();
    const [titleName, setTitleName]=useState('');
    const [dt, setDt]=useState({});
    const isTest = useSelector(state => state.testReducer)
    const headers_obj=isTest.test ? {Test:'test'}:{};

    const msg_style={
        backgroundColor: course.success ? '#daffea':'#ffdada',
        padding: '8px 10px',
        color: course.success ? '#158d49':'#8d1515',
        letterSpacing: '0.1em',
        borderRadius: '8px',
        marginTop: "20px"
    }

    const dt_style={
        display: course.success ? 'block':'none',
        textAlign:'left',
    }

    const btn={
        fontSize: '16px',
        letterSpacing: '0.1em',
        fontWeight: 600, 
        margin:'0 5px'
    }

    useEffect(()=>{

        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/qrcode.php",
            headers:headers_obj,
            data: {
                type: "qrcode",
                qrcodeId: param.Tb_index
            },
        }).then((res) => {
            setCourse(res.data);
            if(res.data.data.type==='2'){
                setTitleName(`${res.data.data.name}老師`);
            }
            else{
                setTitleName(`${res.data.data.name}同學`);
            }
        })
        
    }, [])

    const signIn=()=>{
        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/qrcode.php",
            headers:headers_obj,
            data: {
                type: "signIn",
                qrcodeId: param.Tb_index
            },
        }).then((res) => {
            setCourse(res.data);
        })
    }

    useEffect(()=>{
        setDt(course.data);
        console.log(course);
    }, [course]);

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
                <Button variant="contained" size="large" color="success" sx={btn} onClick={()=>{signIn()}}>簽到</Button>
                <Button variant="contained" size="large" color="error" sx={btn}>請假</Button>
            </Box>
            
            <h3 style={msg_style}>{course.msg}</h3>
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
            <p style={dt_style}>
                課程：{dt?.c_name} <br />
                上課時間：{dt?.StartTime} <br />
                下課時間：{dt?.EndTime} <br />
            </p>
        </Box>
        
    );
}