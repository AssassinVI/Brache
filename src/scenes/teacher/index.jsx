import { Box, useTheme, Button, TextField, FormControlLabel, FormControl, useMediaQuery, Grid, FormLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import * as teacherApi from "../../axios-api/teacherData"
import { IsLoading } from "../../components/loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { snackBarOpenAction } from "../../redux/action";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import useAuthorityRange from "../../custom-hook/useAuthorityRange";
import QrCodeIcon from '@mui/icons-material/QrCode';
import { QRCode } from 'react-qr-code';
import { useRef } from "react";


function UpdatedTeacherData({ id, sx, handleButtonClick }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [skill, setSkill] = useState("")
    const [color, setColor] = useState("")
    const [data, setData] = useState(null)
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")

    const [telephone, setTelephone] = useState("")
    const [email, setEmail] = useState("")
    const [education, setEducation] = useState("")
    const [remark, setRemark] = useState("")

    const dispatch = useDispatch(null)
    const handleCancel = () => {
        setOpen(false);
        setName("")
        setGender("")
        setSkill("")
        setColor("")
        setAddress("")
        setPhone("")

        setTelephone("")
        setEmail("")
        setEducation("")
        setRemark("")

        setTimeout(() => {
            setData(null)
        }, 100)
    };

    const handleSubmit = () => {
        if (name && skill && gender) {
            teacherApi.updateOne({
                name: name,
                s_sex: gender,
                t_skill: skill,
                Tb_index: id,
                t_color: color,
                s_adds: address,
                s_phone: phone,

                s_telephone: telephone,
                s_email: email,
                s_education: education,
                s_remark: remark,

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
            setName(data.name)
            setSkill(data.t_skill)
            setGender(data.s_sex)
            setColor(data.t_color)
            setAddress(data.s_adds)
            setPhone(data.s_phone)

            setTelephone(data.s_telephone)
            setEmail(data.s_email)
            setEducation(data.s_education)
            setRemark(data.s_remark)
        }
    }, [data])

    return (
        <>
            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", ...sx }} onClick={(e) => {
                e.stopPropagation()
                teacherApi.getOne(id, (data) => {
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
                <DialogTitle sx={{ fontSize: "20px" }}>老師資料編輯</DialogTitle>
                {data ? <>

                    
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="skill"
                                label="專長"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={(e) => {
                                    setSkill(e.target.value)
                                }}
                                value={skill}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                
                                margin="dense"
                                id="skill"
                                label="學歷"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={(e) => {
                                    setEducation(e.target.value)
                                }}
                                value={education}
                            />
                        </Grid>
                        
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
                            <TextField
                                
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
                                
                                margin="dense"
                                id="telephone"
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
                        <Grid item xs={6}>
                            <TextField
                                
                                margin="dense"
                                id="color"
                                label="代表色"
                                type="color"
                                fullWidth
                                variant="standard"
                                onChange={(e) => {
                                    setColor(e.target.value)
                                }}
                                value={color}
                                sx={{ width: "60px" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                
                                margin="dense"
                                id="address"
                                label="備註"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={(e) => {
                                    setRemark(e.target.value)
                                }}
                                value={remark}
                            />
                        </Grid>
                </Grid>

                    {/* <DialogContent>
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
                        <TextField
                            autoFocus
                            margin="dense"
                            id="skill"
                            label="專長"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setSkill(e.target.value)
                            }}
                            value={skill}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="color"
                            label="代表色"
                            type="color"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setColor(e.target.value)
                            }}
                            value={color}
                            sx={{ width: "60px" }}
                        />
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
                    </DialogContent> */}


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


export const Qrcode = ({ value }) => {
    const [open, setOpen] = useState(false);

    const handleCancel = () => {
        setOpen(false);
    };

    const qrRef = useRef(null);

    const downloadQRCode = () => {
        const svgElement = qrRef.current;
        if (!svgElement) {
            console.error('SVG 元素未找到');
            return;
        }
        if (window.confirm("是否要下載此QR碼")) {
            const svgXml = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgXml], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'qrcode.svg';
            downloadLink.click();
        }

    };

    return (
        <>
            <QrCodeIcon onClick={() => setOpen(true)} sx={{ cursor: "pointer" }} />
            <Dialog open={open} onClose={handleCancel}>
                <QRCode ref={qrRef} value={value} />
                <button onClick={downloadQRCode} style={{ padding: "15px 0", margin: "5px", cursor: "pointer" }}>下載 QR 碼</button>
            </Dialog>
        </>
    );
}


const TeacherDataList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [teacherData, setTeacherData] = useState(null)
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    const { accessData, accessDetect } = useAuthorityRange()
    const [authorityRange, setAuthorityRange] = useState({})

    //獲取權限範圍
    useEffect(() => {
        if (accessData) {
            const result = accessDetect(accessData, "老師資料管理")
            setAuthorityRange({
                p_delete: result.p_delete === "1" ? true : false,
                p_insert: result.p_insert === "1" ? true : false,
                p_update: result.p_update === "1" ? true : false,
            })
        }
    }, [accessData])

    //獲取資料
    useEffect(() => {
        teacherApi.getAll().then((res) => {
            setTeacherData(res.data)
            // console.log(res.data);
        })
    }, [])


    const handleButtonClick = () => {
        teacherApi.getAll().then((res) => {
            setTeacherData(res.data)
        })
    };
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
        },
        {
            field: "t_skill",
            headerName: "專長",
            flex: 1,
            hide: isMobile
        },
        {
            field: "qrcode",
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
                        {authorityRange.p_update && <UpdatedTeacherData id={rows.row.Tb_index} handleButtonClick={handleButtonClick} sx={{ width: "66px" }} />}
                    </Box>
                )
            }
        },
    ];
    return (
        <>
            {/* <Alert severity="success">This is a success alert — check it out!</Alert> */}
            <Box m="20px auto 0" width={"95%"} display={"flex"} flexDirection={"column"} >
                <Header title="教師資料管理" subtitle="本頁面條列所有教師的資料，供修改基本資料；如欲修改帳號、密碼、請到管理者管理。" />
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
                    {teacherData ? <DataGrid rowHeight={85} rows={teacherData} getRowId={(row) => row.Tb_index} columns={columns} /> : <IsLoading />}
                </Box>
            </Box>

        </>

    );
};

export default TeacherDataList;