import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import axiosInstance from "../../axios-api/axiosInstance";
import {useParams, Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Box, Button } from "@mui/material";
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
        margin: 0
    }

    const dt_style={
        display: course.success ? 'block':'none',
        textAlign:'left',
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
            if(res.data.data.type=='2'){
                setTitleName(`${res.data.data.teacher_name}老師`);
            }
            else{
                setTitleName(`${res.data.data.student_name}同學`);
            }
        })
        
    }, [])

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
            <h3 style={msg_style}>{course.msg}</h3>
            <Button component={Link} variant="contained" to={"/"} sx={
                {
                    backgroundColor: '#009688',
                    fontSize: '16px',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    marginTop: '15px',
                    display: course.data?.type=='2' && !course?.success ? 'block':'none'
                }
            }>登入系統 </Button>
            <p style={dt_style}>
                課程：{dt?.c_name} <br />
                上課時間：{dt?.StartTime} <br />
                下課時間：{dt?.EndTime} <br />
            </p>
        </Box>
        
    );
}