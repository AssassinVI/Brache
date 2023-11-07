import { useSelector } from "react-redux";
import Header from "../../components/Header";
import React from 'react'
import { Box, Button, FormControl, InputLabel, Select, Typography, useMediaQuery } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import * as teacherApi from "../../axios-api/teacherData"
import { useEffect } from "react";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { IsLoading } from "../../components/loading";
import * as singInSheetApi from "../../axios-api/siginSheetData"
const SignInSheetOverView = () => {
    const accessRange = useSelector(store => store.accessRangeReducer)
    const [teacherData, setTeacherData] = useState(null)
    const [teacher, setTeacher] = useState(null)
    const [month, setMonth] = useState(null)
    const [year, setYear] = useState(null);
    const [listData, setListData] = useState({})

    useEffect(() => {
        teacherApi.getAll().then((res) => {
            setTeacherData(res.data)
        })
    }, [])

    useEffect(() => {
        if (accessRange.inform) {
            setTeacher(accessRange.inform.Tb_index)
            //這裡ajax第一次
            singInSheetApi.signIn_tch_all({
                Tb_index: accessRange.inform.Tb_index,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
            }, (res) => {
                setListData({
                    year: year,
                    month: month,
                    data: res.data.data.student,
                    teacher: res.data.data.teacher_name
                })
            })
        }
    }, [accessRange])



    const handleSubmit = () => {

        singInSheetApi.signIn_tch_all({
            Tb_index: teacher,
            year: year,
            month: month,
        }, (res) => {
            console.log(res.data)
            //後續ajax
            setListData({
                year: year,
                month: month,
                data: res.data.data.student,
                teacher: res.data.data.teacher_name
            })
        })
    }

    return (
        <div style={{ width: '95%', margin: '20px auto 0' }}>
            <Header title="簽到表總覽" subtitle="可察看每月出缺勤狀況" />
            <TopBar teacher={teacher} setTeacher={setTeacher} teacherData={teacherData} month={month} setMonth={setMonth} handleSubmit={handleSubmit} year={year} setYear={setYear} />
            <List listData={listData} />
        </div>
    );
};


function TopBar({ teacher, setTeacher, teacherData, month, setMonth, year, setYear, handleSubmit }) {
    const accessRange = useSelector(store => store.accessRangeReducer)
    const isTest = useSelector(store => store.testReducer)
    return (
        <Box display={"flex"} gap={"20px"} width={"fit-content"} alignItems={"center"} flexWrap={"wrap"}>

            {accessRange?.inform?.name !== "老師" &&
                <FormControl>
                    <InputLabel id="demo-simple-select-label">老師</InputLabel>
                    <Select onChange={(e) => {
                        setTeacher(e.target.value)
                        //console.log(e.target)
                    }}
                        value={teacher || ""}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="老師"
                        defaultValue={1} sx={{ width: "120px" }}

                    >
                        {teacherData && teacherData.map((item) => {
                            return (
                                <MenuItem key={item.Tb_index} value={item.Tb_index} style={{ paddingLeft: "8px" }}>
                                    {item.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            }
            <FormControl >
                <InputLabel id="demo-simple-select-label">年份</InputLabel>
                <Select onChange={(e) => {
                    setYear(e.target.value)
                }}
                    value={year || ""}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="年份"
                    sx={{ width: "120px" }}>
                    {Array.from({ length: new Date().getFullYear() - 2023 + 1 }, (_, index) => index + 1).map((number) => (
                        <MenuItem key={number} value={2023 + number - 1}>
                            {2023 + number - 1}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl >
                <InputLabel id="demo-simple-select-label">月份</InputLabel>
                <Select onChange={(e) => {
                    setMonth(e.target.value)
                }}
                    value={month || ""}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="月份"
                    sx={{ width: "120px" }}>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((number) => (
                        <MenuItem key={number} value={number}>
                            {number + "月"}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", width: "70px", gap: "5px", height: "35px" }} onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleSubmit()
            }}>
                查詢
            </Button >
            <Button variant="contained" sx={{backgroundColor:'#207c23'}} 
             onClick={()=>{
                const ExcelUrl= isTest.test ? `https://bratsche.web-board.tw/ajax/outputSigninExcel.php?Tb_index=${teacher}&year=${year}&month=${month}&test=test` : `https://bratsche.web-board.tw/ajax/outputSigninExcel.php?Tb_index=${teacher}&year=${year}&month=${month}`;
                window.open(ExcelUrl, '_blank')
             }}
            > 匯出Excel檔</Button>
        </Box>
    )
}

function List({ listData }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const accessRange = useSelector(store => store.accessRangeReducer)
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    const columns = [
        {
            field: "name",
            headerName: "學生姓名",
            flex: isMobile ? 0.25 : 0.1,
            cellClassName: "name-column--cell",
        },
        {
            field: "status",
            headerName: "簽到狀況",
            flex: 1,
            renderCell: (rows) => {
                                return (
                    <Box width={"100%"} overflow={isMobile ? "scroll" : "none"}>
                        <Box display={"flex"}  gap={"25px"} width="100%" minWidth={`${rows.row.classes.length * 25 + rows.row.classes.length * 100 + 50}px`}>
                            <Box alignSelf={"flex-end"} sx={{
                                "& p": {
                                    margin: 0
                                },
                                "& :nth-child(1)": {
                                    marginBottom: "7px",
                                },
                                marginBottom: "-2px",
                                marginRight: "-10px",
                            }}>
                                <p className="teacher">老師</p>
                                <p className="student">學生</p>
                            </Box>
                            {rows.row.classes.map((item) => {
                                const date = `${item.c_date.split("-")[1]}月${item.c_date.split("-")[2]}日`;
                                const StartTime_s= new Date(`${item.c_date} ${item.StartTime}`).getTime();
                                const t_time_s= new Date(item.t_signin_time).getTime();
                                const s_time_s= new Date(item.s_signin_time).getTime();
                                const delay_t_time=StartTime_s-t_time_s;
                                const delay_s_time=StartTime_s-s_time_s;
                                const show_delay_t=delay_t_time<0 ? `(晚${Math.abs(Math.round(delay_t_time/60000))}分${Math.abs((delay_t_time/1000)%60)}秒)` : '';
                                const show_delay_s=delay_t_time<0 ? `(晚${Math.abs(Math.round(delay_s_time/60000))}分${Math.abs((delay_s_time/1000)%60)}秒)` : '';
                                const t_time= item.t_signin_time==null ? '': item.t_signin_time.split(" ")[1];
                                const s_time= item.s_signin_time==null ? '': item.s_signin_time.split(" ")[1];
                                return (
                                    <Box sx={{
                                        width: "200px",
                                        "& .date": {
                                            width: "100%",
                                            "&  p": {
                                                fontSize: "15px",
                                                textAlign: "center"
                                            },
                                        },
                                        "& p": {
                                            margin: 0,
                                            fontSize: "15px"
                                        },
                                        "& .checkIn": {
                                            margin: "8px 0 6px",
                                            borderBottom: "1px solid #ccc",
                                            paddingBottom: "6px"
                                        }
                                    }}>
                                        <Box className="date">
                                            <p>{date}</p>
                                            <Box display={"flex"} justifyContent={"center"}  width={"100%"} sx={{
                                                margin: "3px 0",
                                                "& p": {
                                                    width: "50%",
                                                    textAlign: "center",
                                                }
                                            }}>
                                                <p>簽到</p>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            "& .checkIn,& .checkOut": {
                                                width: "100%",
                                                "& > div": {
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    "& > div": {
                                                        width: "15px",
                                                        height: "15px",
                                                        borderRadius: "50%",
                                                        border: "1px solid #fff"
                                                    },
                                                    "& .round": {
                                                        backgroundColor: colors.greenAccent[400],
                                                    },
                                                    "& .x": {
                                                        backgroundColor: "#c87B79",
                                                    }
                                                }
                                            }
                                        }}>
                                            <Box className="checkIn" display={"flex"} gap={"10px"} justifyContent={"center"} >
                                                <Box alignItems={"center"}>
                                                    {item.t_signin_time ? <div className="round" style={{marginRight:'8px'}}></div> : <div className="x"></div>}
                                                    {item.t_signin_time ? <p style={{lineHeight:'1'}}>{t_time}{show_delay_t}</p> : ''}
                                                </Box>
                                            </Box>
                                            <Box className="checkOut" display={"flex"} gap={"10px"} justifyContent={"center"} >
                                                <Box alignItems={"center"}>
                                                    {item.s_signin_time ? <div className="round" style={{marginRight:'8px'}}></div> : <div className="x"></div>}
                                                    {item.s_signin_time ? <p style={{lineHeight:'1'}}>{s_time}{show_delay_s}</p> : ''}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>

                    </Box>

                )
            }
        },
    ];

    return (
        <Box width={"100%"} m={"25px 0 0 0"}>
            <Box width={"100%"} position={"relative"} marginBottom={isMobile ? "45px" : 0}>
                <Typography
                    variant="h3"
                    fontWeight="normal"
                    sx={{ width: "100%", textAlign: "center", m: "0 0 10px 0", letterSpacing: "0.05em", lineHeight: "1.5" }}
                >
                    {`${listData.teacher || accessRange?.inform?.name} 老師`}
                    {isMobile ? <br /> : null}
                    {` 授課簽到表${(listData.year || new Date().getFullYear())}年${listData.month || new Date().getMonth() + 1}月`}
                </Typography>
                <Box className="tip" position={"absolute"} sx={{
                    display: "flex",
                    gap: "10px",
                    top: isMobile ? "auto" : 0,
                    bottom: isMobile ? "-50px" : 0,
                    margin: isMobile ? "0" : "auto 0",
                    left: 0,
                    "& > div": {
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    },
                    "&  .round,& .x": {
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        border: "1px solid #fff"
                    },
                    "& .round": {
                        backgroundColor: colors.greenAccent[400],
                    },
                    "& .x": {
                        backgroundColor: "#c87B79",
                    }
                }}>
                    <Box >
                        <div className="round"></div>
                        <p>已簽到</p>
                    </Box>
                    <Box >
                        <div className="x"></div>
                        <p>未簽到</p>
                    </Box>
                </Box>
            </Box>

            <Box
                m="20px 0 0 0"
                width="100%"
                height="60vh"
                sx={{
                    overflowX: "scroll",
                    "@media all and (max-width:850px)": {
                        paddingBottom: "40px",
                        // height: "70vh"
                    },
                    "&::-webkit-scrollbar": {
                        display: "none"
                    },
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[400],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[900],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-row": {
                        borderBottom: "1px solid rgba(224, 224, 224, 1)"
                    },
                    "& .MuiDataGrid-overlay": {
                        display: "none",
                    }
                }}
            >
                {listData.data ? <DataGrid rowHeight={isMobile ? 130 : 115} rows={listData.data} getRowId={(row) => row.name} columns={columns} /> : <IsLoading />}
            </Box>
        </Box>
    )
}

export default SignInSheetOverView;