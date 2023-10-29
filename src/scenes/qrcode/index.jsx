import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    CssBaseline,
    Paper,
    Box,
    Grid,
    Typography,
    Container,
} from "@mui/material";
import axios from "axios";
import { infromAction } from "../../redux/action";
import { useDispatch } from "react-redux";
import axiosInstance from "../../axios-api/axiosInstance";
import UrlPost from './post'
export default function Login() {
    const [remember, setRemember] = useState(window.localStorage.getItem("account") !== null)
    const [recaptcha, setRecaptcha] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch(null)


    //送出登入
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/login_ajax.php",
            headers:{
                Test:'test'
            },
            data: {
                type: "login",
                admin_id: data.get("account"),
                admin_pwd: data.get("password"),
                "g-recaptcha-response": recaptcha
            },
        }).then((res) => {
            if (res.data.success) {
                window.sessionStorage.setItem("jwt", res.data.jwt)
                window.localStorage.setItem("refresh_jwt", res.data.refresh_jwt)
                if (remember) {
                    window.localStorage.setItem("account", data.get("account"))
                }
                window.alert(`${res.data.msg}`)
           
                navigate("/calendar/overview");
            } else {
                window.alert(`${res.data.msg}`)
                window.location.reload()
            }

        })

    };

    const handleLoaded = _ => {
        window.grecaptcha.ready(_ => {
            window.grecaptcha
                .execute("6LdlsdkZAAAAALcVJSFlSZhJOZg7weQepUzfY-_F", { action: "submit" })
                .then(token => {
                    setRecaptcha(token)
                })
        })
    };

    useEffect(() => {
        // Add reCaptcha
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?render=6LdlsdkZAAAAALcVJSFlSZhJOZg7weQepUzfY-_F"
        script.addEventListener("load", handleLoaded)
        document.body.appendChild(script)
    }, [])


    return (
        
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Container component="main" sx={{ width: "100%", height: "50vh", maxHeight: "480px" }}>
                <Box
                    sx={{
                        margin: "0",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "& .css-11lq3yg-MuiGrid-root": {
                            width: "100%",
                            height: "100%"
                        }
                    }}>
                    <Grid container sx={{
                        justifyContent: "center"
                    }}>
                        <CssBaseline />
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{borderRadius: '8px',}} >
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography component="h1" variant="h4">
                                    巴雀系統
                                </Typography>
                                <Box sx={{ mt: 1, textAlign:'center' }}>
                                   
                                    <UrlPost/>
                                    
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}