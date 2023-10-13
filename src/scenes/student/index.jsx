import { Box, Typography, useTheme, Button, TextField, FormControlLabel, FormControl, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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

function UpdatedStudentData({ id, sx, handleButtonClick }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [age, setAge] = useState(1)
    const [gender, setGender] = useState("")
    const [data, setData] = useState(null)
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const dispatch = useDispatch(null)
    const handleCancel = () => {
        setOpen(false);
        setName("")
        setGender("")
        setAge(1)
        setPhone("")
        setPhone("")
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
                s_phone: phone
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
            console.log(data)
            setName(data.name)
            setAge(data.s_birthday)
            setGender(data.s_sex)
            setAddress(data.s_adds)
            setPhone(data.s_phone)
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
                {data ? <>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="名稱"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            value={name}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="address"
                            label="地址"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setAddress(e.target.value)
                            }}
                            value={address}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="phone"
                            label="電話"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setPhone(e.target.value)
                            }}
                            value={phone}
                        />
                    </DialogContent>
                    <DialogContent>
                        <FormControl fullWidth>
                        <TextField
                            id="date"
                            label="生日"
                            type="date"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            value={age}
                            onChange={(e)=>{
                                setAge(e.target.value)
                            }}
                        />
                        </FormControl>
                    </DialogContent>
                    <DialogContent>
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
                    </DialogContent>


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
        })
    }, [])


    const handleButtonClick = () => {
        studentApi.getAll().then((res) => {
            setStudentData(res.data)
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
            field: "s_year",
            headerName: "年齡",
            flex: 1,
        },
        {
            field: "rqcode",
            headerName: "QR CODE",
            flex: 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"5px"} width="100%">
                        <Qrcode value={rows.row.Tb_index} />

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