import React from 'react'
import Header from '../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, useMediaQuery, Chip } from '@mui/material';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IsLoading } from '../../components/loading';
import Html5QrcodePlugin from './html5QrcodeScannerPlugin';
import { useState } from 'react';
import * as singInSheetApi from "../../axios-api/siginSheetData"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { snackBarOpenAction } from '../../redux/action';
import useAuthorityRange from '../../custom-hook/useAuthorityRange';

function SignInList() {

    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const dispatch = useDispatch(null)

    const userId = useSelector(state => state.accessRangeReducer)

    const [listData, setListData] = useState(null)

    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    //獲取權限資料
    const { accessData, accessDetect } = useAuthorityRange()
    const [authorityRange, setAuthorityRange] = useState({})

    useEffect(() => {
        if (accessData) {
            const result = accessDetect(accessData, "簽到表登記")
            setAuthorityRange({
                p_delete: result.p_delete === "1" ? true : false,
                p_insert: result.p_insert === "1" ? true : false,
                p_update: result.p_update === "1" ? true : false,
            })
        }
    }, [accessData])

    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 50,
            filterable: false,
            renderCell: (params) => {
                return <div>{params.row.index + 1}</div>;
            },
            hide: isMobile
        },
        {
            field: "c_name",
            headerName: "課堂名稱",
            flex: isMobile ? 0.5 : 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "student",
            headerName: "學生",
            flex: 1,
            renderCell: (rows) => {

                const studentAll=rows.row.student.map((student)=>{
                    return (<span className='student'>{student.name}</span>)
                })
                return <div>{studentAll}</div>;
            },
        },
        {
            field: "teacher_name",
            headerName: "老師",
            flex: 1,
            hide: isMobile
        },
        {
            field: "room_name",
            headerName: "教室",
            flex: isMobile ? 0.3 : 1,
        },
        {
            field: "class-time",
            headerName: "上課時間",
            flex: isMobile ? 0.5 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        <p>{rows.row.StartTime}~{rows.row.EndTime}</p>
                    </Box>
                )
            }
        },
        {
            field: "modify",
            headerName: "登記",
            flex: isMobile ? 0.7 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        <OpenScanner listData={rows.row} />
                    </Box>
                )
            },
            hide:!authorityRange.p_insert
        },
    ];

    //獲取列表資料
    useEffect(() => {
        singInSheetApi.getAll(userId?.inform?.Tb_index).then((res) => {
            setListData(res.data)
        })
    }, [userId])

    return (
        <Box
            m="20px 0 0 0"
            width="100%"
            height="60vh"
            sx={{
                overflowX: "scroll",
                "@media all and (max-width:850px)": {
                    paddingBottom: "40px",
                    height: "70vh"
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
                }
            }}
        >
            {listData ? <DataGrid rowHeight={isMobile ? 110 : 85} rows={listData} getRowId={(row) => row.index} columns={columns} sx={{'& .student':{marginRight:'8px'}}} /> : <IsLoading />}
        </Box>
    )
}

const OpenScanner = ({ listData }) => {
    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const [open, setOpen] = useState(false)

    const dispatch = useDispatch(null)

    const handleClose = () => {
        setOpen(false)
    }

    const [statusData, setStatusData] = useState(null)

    function throttle(func, delay) {
        let inThrottle;
        let timeout = null;
        return function () {
            let context = this;
            let args = arguments;
            if (!inThrottle) {
                // 輸入之後兩秒內都不回進入這邊
                func.apply(context, args)
                inThrottle = true;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    inThrottle = false
                }, delay)
            }
        }
    }

    const throttledSignIn = throttle(function (decodedText) {
        // handle decoded results here
        singInSheetApi.signInCourse({
            course_id: listData.Tb_index,
            admin_id: decodedText
        }, (res) => {
            const status = res.data.success ? "success" : "error"
            dispatch(snackBarOpenAction(true, res.data.msg, status))
        }, (res) => {
            setStatusData(res.data.data)
        });
    }, 4000);

    const onNewScanResult = (decodedText, decodedResult) => {
        // 在需要的地方調用 throttledSignIn 函數
        throttledSignIn(decodedText);
    };

    useEffect(() => {
        console.log(statusData)
    }, [statusData])

    const columns = [
        {
            field: "name",
            headerName: "姓名",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "signin_time",
            headerName: "簽到",
            flex: 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        {rows.row.signin_time && <CheckCircleOutlineIcon sx={{ color: "green" }} />}
                    </Box>
                )
            }
        },
    ];

    return (
        <>
            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5" }} onClick={() => {
                singInSheetApi.getSignInData(listData.Tb_index, (res) => {
                    setStatusData(res.data.data)
                })
                setOpen(true)
            }
            }>
                簽到
            </Button>
            <Dialog open={open} onClose={handleClose} sx={{
                "& .MuiDialog-container > .MuiPaper-root": {
                    maxWidth: "600px",
                    width: "95%",
                    paddingTop: "35px",
                }
            }}>
                {/* {statusData?.is_signIn ?
                    <Html5QrcodePlugin
                        fps={10}
                        qrbox={250}
                        disableFlip={false}
                        qrCodeSuccessCallback={onNewScanResult}
                    /> :
                    <Box sx={{ width: "100%", height: "100px" }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <p style={{ width: "fit-content", margin: 0 }}>目前未在可簽到時間內</p>
                    </Box>
                } */}

                {statusData &&
                    <Box
                        m="20px auto 0"
                        width="85%"
                        height={`calc(40px * ${statusData.signIn_state.length + 1} + 55px)`}
                        sx={{
                            "&::-webkit-scrollbar": {
                                display: "none"
                            },
                            "& .MuiDataGrid-root": {
                                border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .MuiCheckbox-root": {
                                color: `${colors.greenAccent[200]} !important`,
                            },
                            "& .MuiDataGrid-row": {
                                borderBottom: "1px solid rgba(224, 224, 224, 1)"
                            },
                            "& .MuiDataGrid-footerContainer": {
                                display: "none"
                            }
                        }}
                    >
                        <DataGrid rowHeight={40} rows={statusData.signIn_state} getRowId={(row) => row.Tb_index} columns={columns} sx={{ width: "90%", margin: "0 auto" }} />

                    </Box>
                }
                <CloseIcon sx={{ position: "absolute", cursor: "pointer", right: "5px", top: "5px", width: "25px", height: "25px", zIndex: 99 }} onClick={(e) => {
                    e.stopPropagation()
                    setOpen(false)
                }} />
            </Dialog>
        </>
    )
}

const SignInSheet = () => {
    const today = new Date()
    return (
        <div style={{ width: '95%', margin: '20px auto 0' }}>
            <Header title={`${today.getMonth() + 1}/${today.getDate()}簽到表登記`} subtitle={`以下為當天的課堂，請在時間內進行登記\n簽到時間:課堂開始前10分鐘內\n簽退時間:課堂結束後10分鐘內`} />
            <SignInList />
        </div>
    );
}

export default SignInSheet