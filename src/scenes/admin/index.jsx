import { Box, Typography, useTheme, Button, TextField, FormControlLabel, FormControl, useMediaQuery, Grid, FormLabel  } from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import * as adminApi from "../../axios-api/adminData"
import * as authorityApi from "../../axios-api/authorityData"
import { IsLoading } from "../../components/loading";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpenAction } from "../../redux/action";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import useAuthorityRange from "../../custom-hook/useAuthorityRange";

//-- 關鍵字工具 --
import KeywordTextField from '../../tool/keywordTextField'

function UpdatedAdminData({ id, type, sx, authorityData, handleButtonClick }) {
    const [open, setOpen] = useState(false);

    //-- 帳號流水號 --
    const date=new Date();
    const accountAutoId= `user${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

    const [userData, setUserData] = useState({
        name: "",
        online: true,
        account: accountAutoId,
        radio: "",
        password: "",
        authority: "",
        gender: "",
        s_birthday: "",
        t_skill: "",
        t_color: "",
        s_adds: "",
        s_phone: "",

        s_school: "",
        s_school_year: "",
        s_music: "",
        s_telephone: "",
        s_email: "",
        s_education: "",
        s_remark:""
    })


    const [formPage, setFormPage] = useState(1)
    const [data, setData] = useState(null)
    //const { authorityData } = authorityApi.useGetAll()
    const dispatch = useDispatch(null)


    const handleCancel = () => {
        setOpen(false);

        setUserData({
            name: "",
            online: true,
            account: accountAutoId,
            radio: "",
            password: "",
            authority: "",
            gender: "",
            s_birthday: "",
            t_skill: "",
            t_color: "",
            s_adds: "",
            s_phone: "",

            s_school: "",
            s_school_year: "",
            s_music: "",
            s_telephone: "",
            s_email: "",
            s_education: "",
            s_remark:""
        })
        setTimeout(() => {
            setFormPage(1)
            setData(null)
        }, 100)
    };

    //-- 更新 --
    const updateData = () => {
        adminApi.updateOne({
            name: userData.name,
            admin_per: userData.authority,
            is_use: userData.online ? "1" : "0",
            Tb_index: id,
            admin_id: userData.account,
            admin_pwd: userData.password,
            position_type: userData.radio
        }, (data) => {
            if (data.data.success) {
                handleButtonClick()
                dispatch(snackBarOpenAction(true, `${data.data.msg}-${userData.name}`))
            } else {
                dispatch(snackBarOpenAction(true, `${data.data.msg}-${userData.name}`, "error"))
            }
        })
        handleCancel()
    }

    //-- 新增 --
    const insertData = () => {

        adminApi.insertOne({
            name: userData.name,
            admin_per: userData.authority,
            is_use: userData.online ? "1" : "0",
            admin_id: userData.account,
            admin_pwd: userData.password,
            position_type: userData.radio,
            s_sex: userData.gender,
            s_birthday: userData.s_birthday,
            t_skill: userData.t_skill,
            t_color: userData.t_color,
            s_adds: userData.s_adds,
            s_phone: userData.s_phone,

            s_school: userData.s_school,
            s_school_year: userData.s_school_year,
            s_music: userData.s_music,
            s_telephone: userData.s_telephone,
            s_email: userData.s_email,
            s_education: userData.s_education,
            s_remark:userData.s_remark
        }, (data) => {
            if (data.data.success) {
                handleButtonClick()
                dispatch(snackBarOpenAction(true, `${data.data.msg}-${userData.name}`))
                handleCancel()
            } else {
                dispatch(snackBarOpenAction(true, `${data.data.msg}`, "error"))
            }
        })
    }

    
    const handleSubmit = () => {
        if (userData.name && userData.account && userData.authority && userData.radio) {

            if (type === "update") {
                updateData()
            } else {
                if (userData.radio === "1") {
                    if (userData.password) {
                        insertData()
                    } else {
                        window.alert("密碼尚未填寫")
                    }
                } else {
                    if (userData.password) {
                        if (formPage !== 1) {
                            //-- 老師 --
                            if(userData.radio === "2" && userData.gender && userData.t_skill){
                                insertData();
                            }
                            //-- 學生 --
                            else if (userData.radio === "3" ) {
                                insertData();
                            } 
                            else {
                                window.alert("尚有欄位未填寫")
                            }

                        } else {
                            setFormPage(2)
                        }
                    } else {
                        window.alert("密碼尚未填寫")
                    }
                }
            }


        } else {
            alert("請填寫完整")
        }

    }
    useEffect(() => {
        if (data && type === "update") {
            setUserData({
                online: data.is_use === "1" ? true : false,
                name: data.name,
                authority: data.admin_per,
                account: data.admin_id,
                password:data.admin_pwd,
                pwd:data.admin_pwd,
                radio: data.position_type,
            })
            console.log(data);
        }
    }, [data])

    return (
        <>
           
            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", ...sx }} onClick={(e) => {
                e.stopPropagation()
                if (type === "update") {
                    adminApi.getOne(id, (data) => {
                        setData(data.data.data[0])

                    })
                    setOpen(true);
                } else {
                    setData(true)
                    setOpen(true);
                }


            }}>
                <EditIcon />
                {type === "update" ? "修改" : "新增"}
            </Button>
            
            <Dialog  open={open}  sx={{
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
                <DialogTitle sx={{ fontSize: "20px" }}>{type === "update" ? "管理者編輯" : "新增使用者"}</DialogTitle>
                {data ? <FormPage userData={userData} setUserData={setUserData} authorityData={authorityData} type={type} formPage={formPage} /> :
                    <IsLoading />}
                <DialogActions sx={{ "& button": { fontSize: "16px" } }}>
                    {formPage === 2 && <Button onClick={() => setFormPage(1)}>上一步</Button>}
                    <Button onClick={handleSubmit}>{type === "update" ? "修改" : formPage === 2 ? "新增" : userData.radio !== "1" ? "下一步" : "新增"}</Button>
                    <Button onClick={handleCancel}>取消</Button>
                </DialogActions>
                <Box sx={{ position: "absolute", right: "30px", top: "30px" }}>
                    <FormControlLabel
                        control={
                            <Checkbox checked={userData.online} onChange={((e) => {
                                setUserData({
                                    ...userData,
                                    online: e.target.checked
                                })
                            })} />
                        }
                        label="啟用"
                    />
                </Box>
            </Dialog>
        </>



    );
}

/**
 * 學生欄位
 * @param userData 資料 
 * @returns 
 */
const StudentForm= ({ userData, setUserData})=>{
  return (
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
                        setUserData({
                            ...userData,
                            s_school: e.target.value,
                        })
                    }}
                    value={userData.s_school}
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
                        setUserData({
                            ...userData,
                            s_school_year: e.target.value,
                        })
                    }}
                    value={userData.s_school_year}
                />
            </Grid>
            <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker 
                        label="生日" 
                        format="YYYY/MM/DD"
                        value={dayjs(userData.s_birthday)}
                        sx={{'& .Mui-error':{
                                color: "#757575 !important"
                            },
                            '& .Mui-error fieldset':{
                                borderColor: "#b9b9b9 !important",
                            }}}
                        onChange={(newDate)=>{
                            let formatDate=`${newDate.$y}-${parseInt(newDate.$M)+1}-${newDate.$D}`;
                            setUserData({
                                ...userData,
                                s_birthday: formatDate,
                            })
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
                        setUserData({
                            ...userData,
                            gender: e.target.value,
                        })
                    }}
                    value={userData.gender}

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
                        setUserData({
                            ...userData,
                            s_music: e.target.value,
                        })
                    }}
                    value={userData.s_music}
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
                        setUserData({
                            ...userData,
                            s_telephone: e.target.value,
                        })
                    }}
                    value={userData.s_telephone}
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
                        setUserData({
                            ...userData,
                            s_phone: e.target.value,
                        })
                    }}
                    value={userData.s_phone}
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
                        setUserData({
                            ...userData,
                            s_email: e.target.value,
                        })
                    }}
                    value={userData.s_email}
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
                        setUserData({
                            ...userData,
                            s_adds: e.target.value,
                        })
                    }}
                    value={userData.s_adds}
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
                          setUserData({
                              ...userData,
                              s_remark: e.target.value,
                          })
                      }}
                      value={userData.s_remark}
                  />
            </Grid>
        </Grid>
  );
}


/**
 * 老師欄位
 * @param userData 資料 
 * @returns 
 */
const TeacherForm= ({ userData, setUserData })=>{
    return (
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
                        setUserData({
                            ...userData,
                            t_skill: e.target.value,
                        })
                    }}
                    value={userData.t_skill}
                />
             </Grid>
             <Grid item xs={6}>
                 <TextField
                    autoFocus
                    margin="dense"
                    id="skill"
                    label="學歷"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setUserData({
                            ...userData,
                            s_education: e.target.value,
                        })
                    }}
                    value={userData.s_education}
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
                          setUserData({
                              ...userData,
                              s_email: e.target.value,
                          })
                      }}
                      value={userData.s_email}
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
                          setUserData({
                              ...userData,
                              gender: e.target.value,
                          })
                      }}
                      value={userData.gender}
  
                  >
                      <FormControlLabel value="1" control={<Radio />} label="男" />
                      <FormControlLabel value="0" control={<Radio />} label="女" />
                  </RadioGroup>
                </FormControl>
                  
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
                          setUserData({
                              ...userData,
                              s_telephone: e.target.value,
                          })
                      }}
                      value={userData.s_telephone}
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
                          setUserData({
                              ...userData,
                              s_phone: e.target.value,
                          })
                      }}
                      value={userData.s_phone}
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
                          setUserData({
                              ...userData,
                              s_adds: e.target.value,
                          })
                      }}
                      value={userData.s_adds}
                  />
              </Grid>
              <Grid item xs={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="color"
                    label="代表色"
                    type="color"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setUserData({
                            ...userData,
                            t_color: e.target.value,
                        })
                    }}
                    value={userData.t_color}
                    sx={{ width: "60px" }}
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
                          setUserData({
                              ...userData,
                              s_remark: e.target.value,
                          })
                      }}
                      value={userData.s_remark}
                  />
            </Grid>
    </Grid>
    );
}

const FormPage = ({ userData, setUserData, authorityData, type, formPage }) => {

    return (
        <>
            <Box sx={{ opacity: formPage === 1 ? 1 : 0, pointerEvents: formPage === 1 ? "auto" : "none" }}>
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
                            setUserData({
                                ...userData,
                                name: e.target.value,
                            })
                        }}
                        value={userData.name}
                    />
                    
                </DialogContent>
                <DialogContent>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={(e) => {
                            // setUserData({
                            //     ...userData,
                            //     radio: e.target.value,
                            // });

                            switch (e.target.value) {
                                case "2":
                                    setUserData({
                                        ...userData,
                                        radio: e.target.value,
                                        authority: 'group2023071815332755',
                                    })
                                    break;
                                case "3":
                                    setUserData({
                                        ...userData,
                                        radio: e.target.value,
                                        authority: 'group2023071815335388',
                                    })
                                    break;
                                default:
                                    setUserData({
                                        ...userData,
                                        radio: e.target.value,
                                        authority: '',
                                    })
                                    break;
                            }
                        }}
                        value={userData.radio}

                    >
                        <FormControlLabel value="1" control={<Radio disabled={type === "insert" ? false : userData.radio === "1" ? false : true} />} label="管理員" />
                        <FormControlLabel value="2" control={<Radio disabled={type === "insert" ? false : userData.radio === "2" ? false : true} />} label="老師" />
                        <FormControlLabel value="3" control={<Radio disabled={type === "insert" ? false : userData.radio === "3" ? false : true} />} label="學生" />
                    </RadioGroup>

                    <p style={{ margin: 0, color: "#f35151" }}>(新增後無法再修改)</p>
                </DialogContent>
                <DialogContent>
                    <InputLabel id="demo-simple-select-label">權限</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="權限"
                        onChange={(e) => {
                            setUserData({
                                ...userData,
                                authority: e.target.value,
                            })
                        }}
                        fullWidth
                        sx={{ "& #demo-simple-select": { padding: "10px" }, marginTop: "10px" }}
                        value={userData.authority || ''} // 确保值不为 undefined
                    >
                        <MenuItem value={""} >{"無"}</MenuItem>
                        {authorityData && authorityData.data.map((item) => {
                            return (
                                <MenuItem key={item.Tb_index} value={item.Tb_index}>{item.Group_name}</MenuItem>
                            )
                        })}
                    </Select>
                </DialogContent>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="帳號"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setUserData({
                                ...userData,
                                account: e.target.value,
                            })
                        }}
                        value={userData.account}
                    />
                </DialogContent>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={type === "update" ? "修改密碼(非必填)" : "密碼"}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setUserData({
                                ...userData,
                                password: e.target.value,
                            })
                        }}
                        value={userData.password}
                    />
                </DialogContent>
            </Box>

            <Box sx={{ opacity: formPage !== 1 ? 1 : 0, position: "absolute", top: "74px", left: "25px", width:'91%', pointerEvents: formPage !== 1 ? "auto" : "none" }}>
                
                

                {
                //-- 學生欄位 --
                userData.radio === "3" ?
                    <DialogContent>
                        <StudentForm userData={userData} setUserData={setUserData} />
                    </DialogContent> 
                    :
                    //-- 老師欄位 --
                    <DialogContent>
                        <TeacherForm userData={userData} setUserData={setUserData} />
                    </DialogContent>
                }
                
            </Box>
        </>

    )
}

const AdminManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [adminData, setAdminData] = useState(null)
    const { accessData, accessDetect } = useAuthorityRange()
    const [authorityRange, setAuthorityRange] = useState({})
    const userId = useSelector(state => state.accessRangeReducer)
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    const { authorityData } = authorityApi.useGetAll()
    const [adminType, setAdminType]=useState('all')
    //-- 關鍵字暫存所有資料用 --
    const [keywordAdminData, setKeywordAdminData] = useState(null)


    useEffect(() => {
        if (accessData) {
            const result = accessDetect(accessData, "管理者管理")
            setAuthorityRange({
                p_delete: result.p_delete === "1" ? true : false,
                p_insert: result.p_insert === "1" ? true : false,
                p_update: result.p_update === "1" ? true : false,
            })
        }
    }, [accessData])
    useEffect(() => {
        adminApi.getAll().then((res) => {
            setAdminData(res.data)
            setKeywordAdminData(res.data);
        })
    }, [])

    useEffect(()=>{
        console.log(authorityData);
    }, [authorityData])

    const handleButtonClick = () => {
        adminApi.getAll().then((res) => {
            setAdminData(res.data)
        })
    };

    //-- 權限查詢 --
    const changeAdminType= (e)=>{
        setAdminType(e.target.value);
        adminApi.getTypeAll(e.target.value).then((res)=>{
            setAdminData(res.data);
            setKeywordAdminData(res.data);
        });
    };

    const dispatch = useDispatch(null)
    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 50,
            filterable: false,

            renderCell: (params) => {
                return <div>{params.row.index + 1}</div>;
            },
        },
        {
            field: "name",
            headerName: "名稱",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "Group_name",
            headerName: "權限",
            flex: 1,
        },
        {
            field: "admin_id",
            headerName: "帳號",
            flex: 1,
            hide: isMobile
        },
        {
            field: "is_use",
            headerName: "狀態",
            flex: 0.2,
            renderCell: (rows) => {
                return (
                    <Box
                        width="100%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        borderRadius="4px"
                    >
                        {Math.floor(rows.row.is_use) ? <CheckIcon /> : <CloseIcon />}
                    </Box>
                );
            },
        },
        {
            field: "modify",
            headerName: "編輯",
            flex: 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"5px"} width="100%">
                        {authorityRange.p_update && <UpdatedAdminData id={rows.row.Tb_index} type={"update"} authorityData={authorityData} handleButtonClick={handleButtonClick} sx={{ width: "85px" }} />}

                        {(authorityRange.p_delete && rows.row.Tb_index !== userId.inform.Tb_index) &&
                            <Box
                                width="fit-content"
                                p="6px"
                                display="flex"
                                borderRadius="4px"
                                backgroundColor="#F8AC59"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    if (window.confirm(`確定要刪除使用者:"${rows.row.name}"嗎?`)) {
                                        adminApi.deleteOne(rows.row.Tb_index, (data) => {
                                            if (data.data.success) {
                                                handleButtonClick()
                                                dispatch(snackBarOpenAction(true, `${data.data.msg}-${rows.row.name}`))
                                            } else {
                                                dispatch(snackBarOpenAction(true, `${data.data.msg}-${rows.row.name}`, "error"))
                                            }

                                        })
                                    }

                                }}
                            >
                                <DeleteIcon sx={{ color: "#fff" }} />
                                <Typography color={"#fff"} sx={{ ml: "5px" }}>
                                    刪除
                                </Typography>

                            </Box>
                        }
                    </Box>

                )
            }
        },
    ];
    return (
        <>
            {/* <Alert severity="success">This is a success alert — check it out!</Alert> */}
            <Box m="20px auto 0" width={"95%"} display={"flex"} flexDirection={"column"} >
                <Header title="管理者管理" subtitle="本頁面條列所有使用者的權限以及基本資料" />

                <Box display={'flex'} justifyContent={'flex-end'}>

                    {/* 關鍵字查詢 */}
                    <KeywordTextField keywordAdminData={keywordAdminData} setAdminData={setAdminData} searchAttr={['name']} />
                     
                    <FormControl sx={{ m: 1, minWidth: 120, marginBottom:0}} size="small">
                        <InputLabel id="demo-select-small-label">權限分類</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={adminType}
                            label="權限分類"
                            onChange={changeAdminType}
                        >
                            <MenuItem value={'all'}>ALL</MenuItem>
                            {authorityData && authorityData.data.map((item) => {
                                return (
                                    <MenuItem key={item.Tb_index} value={item.Tb_index}>{item.Group_name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    {authorityRange.p_insert && <UpdatedAdminData type={"insert"} handleButtonClick={handleButtonClick} authorityData={authorityData} sx={{ width: "85px", alignSelf: "flex-end" }} />}

                    
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
                    {adminData ? <DataGrid rowHeight={85} rows={adminData} getRowId={(row) => row.Tb_index} columns={columns} /> : <IsLoading />}
                </Box>
            </Box>

        </>

    );
};

export default AdminManagement;