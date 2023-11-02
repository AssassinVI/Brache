import { Box, Typography, useTheme, Button, TextField, FormControlLabel, FormControl, FormLabel, useMediaQuery, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import * as studentApi from "../../axios-api/studentData"
import { IsLoading } from "../../components/loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { snackBarOpenAction } from "../../redux/action";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import useAuthorityRange from "../../custom-hook/useAuthorityRange";
import { Qrcode } from "../teacher"

//-- 關鍵字工具 --
import KeywordTextField from '../../tool/keywordTextField'

function UpdatedStudentData({ id, sx, handleButtonClick }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [age, setAge] = useState(1)
    const [gender, setGender] = useState("")
    const [data, setData] = useState(null)
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")

    const [school, setSchool] = useState("")
    const [schoolYear, setSchoolYear] = useState("")
    const [music, setMusic] = useState("")
    const [telephone, setTelephone] = useState("")
    const [email, setEmail] = useState("")
    const [sRemark, setSRemark] = useState("")

    const dispatch = useDispatch(null)
    const handleCancel = () => {
        setOpen(false);
        setName("")
        setGender("")
        setAge(1)
        setPhone("")
        setSchool("")
        setSchoolYear("")
        setMusic("")
        setTelephone("")
        setEmail("")
        setTimeout(() => {
            setData(null)
        }, 100)
    };

    const handleSubmit = () => {
        if (name && age && gender) {
            studentApi.updateOne({
                name: name,
                s_sex: gender,
                s_birthday: age,
                Tb_index: id,
                s_adds: address,
                s_phone: phone,
                s_school: school,
                s_school_year: schoolYear,
                s_music: music,
                s_telephone: telephone,
                s_email: email,
                s_remark: sRemark,

            }, (data) => {
                if (data.data.success) {
                    handleButtonClick()
                    dispatch(snackBarOpenAction(true, `${data.data.msg}-${name}`))
                } else {
                    dispatch(snackBarOpenAction(true, `${data.data.msg}-${name}`, "error"))
                }

            })
            handleCancel()
        } else {
            alert("請填寫完整")
        }

    }
    useEffect(() => {
        
        if (data) {
            //  console.log(data)
            setName(data.name)
            setAge(data.s_birthday)
            setGender(data.s_sex)
            setAddress(data.s_adds)
            setPhone(data.s_phone)

            setSchool(data.s_school)
            setSchoolYear(data.s_school_year)
            setMusic(data.s_music)
            setTelephone(data.s_telephone)
            setEmail(data.s_email)
            setSRemark(data.s_remark)
        }
    }, [data])

    return (
        <>
            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", ...sx }} onClick={(e) => {
                e.stopPropagation()
                studentApi.getOne(id, (data) => {
                    setData(data.data.data[0])
                })
                setOpen(true);
            }}>
                <EditIcon />
                修改
            </Button>
            <Dialog open={open} onClose={handleCancel} sx={{
                "& .MuiPaper-root": { padding: " 10px 25px" },
                "& label": {
                    fontSize: "16px"
                },
                "& .MuiDialog-container > .MuiPaper-root": {
                    padding: " 10px 25px",
                    width: "100%",
                    maxWidth: "650px",

                },
            }}>
                <DialogTitle sx={{ fontSize: "20px" }}>學生資料編輯</DialogTitle>
                {data ? 
                <>

                <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="school"
                                    label="就讀學校"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setSchool(e.target.value)
                                    }}
                                    value={school}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="school_yaer"
                                    label="年級"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setSchoolYear(e.target.value)
                                    }}
                                    value={schoolYear}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker 
                                        label="生日" 
                                        format="YYYY/MM/DD"
                                        value={dayjs(age)}
                                        onChange={(newDate)=>{
                                            let formatDate=`${newDate.$y}-${parseInt(newDate.$M)+1}-${newDate.$D}`;
                                            setAge(formatDate)
                                        }}
                                    />
                                </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">性別</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    onChange={(e) => {
                                        setGender(e.target.value)
                                    }}
                                    value={gender}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="男" />
                                    <FormControlLabel value="0" control={<Radio />} label="女" />
                                </RadioGroup>
                                </FormControl>
                                
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="phone"
                                    label="樂器"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setMusic(e.target.value)
                                    }}
                                    value={music}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="phone"
                                    label="電話(室話)"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setTelephone(e.target.value)
                                    }}
                                    value={telephone}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="phone"
                                    label="電話(行動)"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setPhone(e.target.value)
                                    }}
                                    value={phone}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="address"
                                    label="E-mail"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    value={email}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="address"
                                    label="通訊地址"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setAddress(e.target.value)
                                    }}
                                    value={address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="address"
                                    label="備註"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                       setSRemark(e.target.value)
                                    }}
                                    value={sRemark}
                                />
                            </Grid>
                    </Grid>
                    

                </> :
                    <IsLoading />}

                <DialogActions sx={{ "& button": { fontSize: "16px" } }}>
                    <Button onClick={handleSubmit}>修改</Button>
                    <Button onClick={handleCancel}>取消</Button>
                </DialogActions>

            </Dialog>
        </>



    );
}




const StudentDataList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [studentData, setStudentData] = useState(null)
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕

    const { accessData, accessDetect } = useAuthorityRange()
    const [authorityRange, setAuthorityRange] = useState({})

    //-- 關鍵字暫存所有資料用 --
    const [keywordAdminData, setKeywordAdminData] = useState(null)

    //獲取權限範圍
    useEffect(() => {
        if (accessData) {
            const result = accessDetect(accessData, "學生資料管理")
            setAuthorityRange({
                p_delete: result.p_delete === "1" ? true : false,
                p_insert: result.p_insert === "1" ? true : false,
                p_update: result.p_update === "1" ? true : false,
            })
        }
    }, [accessData])

    //獲取資料
    useEffect(() => {
        studentApi.getAll().then((res) => {
            setStudentData(res.data)
            setKeywordAdminData(res.data)
            // console.log(res);
        })
    }, [])


    const handleButtonClick = () => {
        studentApi.getAll().then((res) => {
            setStudentData(res.data)
            setKeywordAdminData(res.data)
        })
    };

    const dispatch = useDispatch(null)

    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 50,
            filterable: false,
            hide: isMobile,
            renderCell: (params) => {
                return <div>{params.row.index + 1}</div>;
            },
        },
        {
            field: "name",
            headerName: "姓名",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "s_sex",
            headerName: "性別",
            flex: 1,
            hide: isMobile
        },
        {
            field: "s_birthday",
            headerName: "生日",
            flex: 1,
        },
        {
            field: "rqcode",
            headerName: "QR CODE",
            flex: 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"5px"} width="100%">
                        <Qrcode value={rows.row.qrcodeUrl} />
                    </Box>

                )
            }
        },
        {
            field: "modify",
            headerName: "編輯",
            flex: 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"5px"} width="100%">
                        {authorityRange.p_update && <UpdatedStudentData id={rows.row.Tb_index} handleButtonClick={handleButtonClick} sx={{ width: "66px" }} />}
                    </Box>

                )
            }
        },
    ];
    return (
        <>
            {/* <Alert severity="success">This is a success alert — check it out!</Alert> */}
            <Box m="20px auto 0" width={"95%"} display={"flex"} flexDirection={"column"} >
                <Header title="學生資料管理" subtitle="本頁面條列所有學生的資料，供修改基本資料；如欲修改帳號、密碼、請到管理者管理。" />
                <Box display={'flex'} justifyContent={'flex-end'}>
                  {/* 關鍵字查詢 */}
                  <KeywordTextField keywordAdminData={keywordAdminData} setAdminData={setStudentData} searchAttr={['name']} />
                </Box>
                <Box
                    m="20px 0 0 0"
                    width="100%"
                    height="60vh"
                    sx={{
                        overflowX: "scroll",
                        "@media all and (max-width:850px)": {
                            paddingBottom: "40px",
                            height: "65vh"
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
                    {studentData ? <DataGrid rowHeight={85} rows={studentData} getRowId={(row) => row.Tb_index} columns={columns} /> : <IsLoading />}
                </Box>
            </Box>

        </>

    );
};

export default StudentDataList;