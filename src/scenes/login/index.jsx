import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Paper,
    Box,
    Grid,
    Typography,
    Container,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
export default function Login() {
    const [remember, setRemember] = useState(localStorage['account'] !== null && localStorage['account'] !== undefined)
    const [recaptcha, setRecaptcha] = useState(null)
    const navigate = useNavigate();
    const isTest = useSelector(state => state.testReducer)
    const headers_obj=isTest.test ? {Test:'test'}:{};

    //-- 獲取記住帳號資訊 --
    const [rememberAdmin, setRememberAdmin]=useState(null);
    const [is_rememberAdmin, setIsRememberAdmin]=useState(false);



    useEffect(()=>{

        console.log(remember);

        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/login_ajax.php",
            headers:headers_obj,
            data:{
                type:'rememberAdmin',
                admin_id:localStorage['account']
            }
        }).then((res)=>{
            //console.log(res.data);
            setRememberAdmin(res.data);
            if(res.data.success){
                setIsRememberAdmin(true);
            }
        });

    }, [])
    


    //送出登入
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const axiosData={
            type: "login",
            "g-recaptcha-response": recaptcha
        }

        //-- 記住帳號 --
        if(is_rememberAdmin){
            axiosData.Tb_index=rememberAdmin.data.Tb_index
        }
        else{
            axiosData.admin_id=data.get("account");
            axiosData.admin_pwd=data.get("password");
        }

        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/login_ajax.php",
            headers:headers_obj,
            data: axiosData,
        }).then((res) => {
            if (res.data.success) {
                window.sessionStorage.setItem("jwt", res.data.jwt)
                window.localStorage.setItem("refresh_jwt", res.data.refresh_jwt)
                if (remember && !is_rememberAdmin) {
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
    }
    useEffect(() => {
        // Add reCaptcha
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?render=6LdlsdkZAAAAALcVJSFlSZhJOZg7weQepUzfY-_F"
        script.addEventListener("load", handleLoaded)
        document.body.appendChild(script)
    }, [])

    const adminName={
        margin: 0,

        padding: '10px 20px',
        border: '1px solid #bbb',
        borderRadius: '5px',
        textAlign: 'center'
    }

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
                       
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square >
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
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 ,width:'100%'}}>

                                    {
                                        is_rememberAdmin ?
                                        <div className="rememberAdmin">
                                            <h2 style={adminName}>{rememberAdmin?.data?.Group_name}：{rememberAdmin?.data?.name}</h2>
                                            <Button onClick={()=>{setIsRememberAdmin(false)}} fullWidth sx={{
                                                letterSpacing: '0.1em',
                                                backgroundColor: '#f3f3f3'
                                            }}>更換帳號</Button>
                                        </div>
                                        : 
                                        <Box>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="account"
                                                label="帳號"
                                                name="account"
                                                autoComplete="account"
                                                autoFocus
                                                defaultValue={window.localStorage.getItem("account")}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password"
                                                label="密碼"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox defaultChecked={remember} onChange={(e) => { setRemember(e.target.checked); }} color="primary" />}
                                                label="記住帳號"
                                            />
                                            <Button onClick={()=>{setIsRememberAdmin(true)}}  sx={{
                                                display: rememberAdmin?.success ? 'inline-flex':'none',
                                                letterSpacing: '0.1em',
                                                backgroundColor: '#f3f3f3'
                                            }}>目前帳號</Button>
                                        </Box>
                                    }
                                    
                                    


                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        sx={{ mt: 3, mb: 2, fontSize: '18px', letterSpacing: '0.1em' }}
                                    >
                                        登入
                                    </Button>
                                    <div
                                        className="g-recaptcha"
                                        data-sitekey="_reCAPTCHA_site_key_"
                                        data-size="invisible"
                                    ></div>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}