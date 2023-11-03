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
import { infromAction } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axios-api/axiosInstance";
export default function Login() {
    const [remember, setRemember] = useState(window.localStorage.getItem("account") !== null)
    const [recaptcha, setRecaptcha] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch(null)
    const isTest = useSelector(state => state.testReducer)
    const headers_obj=isTest.test ? {Test:'test'}:{};

    //送出登入
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios({
            method: 'post',
            url: "https://bratsche.web-board.tw/ajax/login_ajax.php",
            headers:headers_obj,
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
    }
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
                        {/* <Grid
                            item
                            xs={false}
                            sm={4}
                            md={7}
                            sx={{
                                backgroundImage: "url(https://source.unsplash.com/random)",
                                backgroundRepeat: "no-repeat",
                                backgroundColor: (t) =>
                                    t.palette.mode === "light"
                                        ? t.palette.grey[50]
                                        : t.palette.grey[900],
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        /> */}
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
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                                        control={<Checkbox defaultChecked={remember} onChange={(e) => { setRemember(e.target.checked) }} color="primary" />}
                                        label="記住帳號"
                                    />


                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
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