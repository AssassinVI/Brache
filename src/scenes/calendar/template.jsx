import React from 'react'
import Header from '../../components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import * as templateApi from "../../axios-api/calendarTemplateData"
import { useEffect } from 'react';
import { IsLoading } from '../../components/loading';
import { useDispatch } from 'react-redux';
import { snackBarOpenAction } from '../../redux/action';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ClassTemplate from './classTemplate';
import useAuthorityRange from '../../custom-hook/useAuthorityRange';
function CrudTemplateData({ id, type, sx, handleButtonClick }) {
    const [open, setOpen] = useState(false);
    const [templateListData, setTemplateListData] = useState({
        ct_title: "",
        ct_remark: "",
        OnLineOrNot: true
    })

    const [data, setData] = useState(null)


    const dispatch = useDispatch(null)


    const handleCancel = () => {
        setOpen(false);

        setTemplateListData({
            ct_title: "",
            ct_remark: "",
            OnLineOrNot: true
        })
        setTimeout(() => {
            setData(null)
        }, 100)
    };
    const updateData = () => {
        templateApi.update_course_list({
            ct_title: templateListData.ct_title,
            ct_remark: templateListData.ct_remark,
            OnLineOrNot: templateListData.OnLineOrNot ? "1" : "0",
            Tb_index: id,
        }, (data) => {
            if (data.data.success) {

                handleButtonClick()
                dispatch(snackBarOpenAction(true, `${data.data.msg}-${templateListData.ct_title}`))
            } else {
                dispatch(snackBarOpenAction(true, `${data.data.msg}-${templateListData.ct_title}`, "error"))
            }

        })
        handleCancel()
    }
    const insertData = () => {

        templateApi.insert_course_list({
            ct_title: templateListData.ct_title,
            ct_remark: templateListData.ct_remark,
            OnLineOrNot: templateListData.OnLineOrNot ? "1" : "0",
        }, (data) => {
            if (data.data.success) {
                handleButtonClick()
                dispatch(snackBarOpenAction(true, `${data.data.msg}-${templateListData.ct_title}`))
                handleCancel()
            } else {
                dispatch(snackBarOpenAction(true, `${data.data.msg}`, "error"))
            }

        })
    }
    const handleSubmit = () => {
        if (templateListData.ct_title) {
            if (type === "update") {
                updateData()
            } else {
                insertData()
            }
        } else {
            alert("請填寫模板名稱")
        }
    }
    useEffect(() => {
        if (data && type === "update") {
            setTemplateListData({
                OnLineOrNot: data.OnLineOrNot === "1" ? true : false,
                ct_title: data.ct_title,
                ct_remark: data.ct_remark,
            })
        }
    }, [data])

    return (
        <>
            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", ...sx }} onClick={(e) => {
                e.stopPropagation()
                if (type === "update") {
                    templateApi.get_course_template_list_one(id, (data) => {
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
                <DialogTitle sx={{ fontSize: "20px" }}>{type === "update" ? "模板編輯" : "新增模板"}</DialogTitle>
                <Box>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="模板名稱"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setTemplateListData({
                                    ...templateListData,
                                    ct_title: e.target.value,
                                })
                            }}
                            value={templateListData.ct_title}
                        />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="備註"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setTemplateListData({
                                    ...templateListData,
                                    ct_remark: e.target.value,
                                })
                            }}
                            value={templateListData.ct_remark}
                        />
                    </DialogContent>
                </Box>
                <DialogActions sx={{ "& button": { fontSize: "16px" } }}>
                    <Button onClick={handleSubmit}>{type === "update" ? "修改" : "新增"}</Button>
                    <Button onClick={handleCancel}>取消</Button>
                </DialogActions>
                <Box sx={{ position: "absolute", right: "30px", top: "30px" }}>
                    <FormControlLabel
                        control={
                            <Checkbox checked={templateListData.OnLineOrNot} onChange={((e) => {
                                setTemplateListData({
                                    ...templateListData,
                                    OnLineOrNot: e.target.checked
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

function TemplateReNew({ id}) {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Button style={{ display: "flex", gap: "6px" }} variant="contained" sx={{ backgroundColor: "#a87b79", width: "90px" }} onClick={(e) => {
                e.stopPropagation()

                setOpen(true);

            }}>    <DateRangeIcon />
                模板更改
            </Button>
            <Dialog open={open}  sx={{
                "& .MuiPaper-root": { padding: " 10px 0" },
                "& label": {
                    fontSize: "16px"
                },
                "& .MuiDialog-container > .MuiPaper-root": {
                    padding: " 10px 0",
                    width: "100%",
                    maxWidth: "100%",
                    margin: isMobile ? "0" : "32px"
                },
            }}>
                <IconButton
                    aria-label="close"
                    size="large"
                    onClick={handleCancel}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#000',
                    }}
                    >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
                <ClassTemplate id={id} />
            </Dialog>
        </>



    );
}


function TemplateList({ templateData, setTemplateData, handleButtonClick,authorityRange }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch(null)
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
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
            field: "ct_title",
            headerName: "模板名稱",
            flex: isMobile ? 0.5 : 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "ct_remark",
            headerName: "備註",
            flex: 1,
            hide: isMobile, // 在手机屏幕上隐藏列
        },
        {
            field: "OnLineOrNot",
            headerName: "狀態",
            flex: isMobile ? 0.5 : 1,
            renderCell: (rows) => {
                return (
                    <Box
                        width="100%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        borderRadius="4px"
                    >
                        {Math.floor(rows.row.OnLineOrNot) ? <CheckIcon /> : <CloseIcon />}
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
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" flexDirection={isMobile ? "column" : "row"}>
                        {/* {authorityRange.p_update && <UpdatedTeacherData id={rows.row.Tb_index}  sx={{ width: "66px" }} />} */}
                        <TemplateReNew id={rows.row.Tb_index}/>
                        {authorityRange.p_update &&
                           <CrudTemplateData id={rows.row.Tb_index} sx={{ width: "80px" }} type={"update"} handleButtonClick={handleButtonClick} />
                        }
                        {authorityRange.p_delete &&
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
                              if (window.confirm(`確定要刪除使用者:"${rows.row.ct_title}"嗎?`)) {
                                  templateApi.delete_course_list(rows.row.Tb_index, (data) => {
                                      if (data.data.success) {
                                          handleButtonClick()
                                          dispatch(snackBarOpenAction(true, `${data.data.msg}-${rows.row.ct_title}`))
                                      } else {
                                          dispatch(snackBarOpenAction(true, `${data.data.msg}-${rows.row.ct_title}`, "error"))
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
    //獲取列表資料
    useEffect(() => {
        templateApi.get_course_template_list().then((res) => {
            setTemplateData(res.data)
        })
    }, [])
    return (
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
            {templateData ? <DataGrid rowHeight={isMobile ? 140 : 85} rows={templateData} getRowId={(row) => row.index} columns={columns} sx={{ minWidth: "430px", }} /> : <IsLoading />}
        </Box>
    )
}


export default function Template() {
    const [templateData, setTemplateData] = useState(null)

    const handleButtonClick = () => {
        templateApi.get_course_template_list().then((res) => {
            setTemplateData(res.data)
        })
    };

   //權限
   const { accessData, accessDetect } = useAuthorityRange()
   const [authorityRange, setAuthorityRange] = useState({})
 
   //獲取權限範圍
   useEffect(() => {
       if (accessData) {
           const result = accessDetect(accessData, "公版課表")
           setAuthorityRange({
               p_delete: result.p_delete === "1" ? true : false,
               p_insert: result.p_insert === "1" ? true : false,
               p_update: result.p_update === "1" ? true : false,
           })
       }
       
   }, [accessData]);
   

    return (
        <div style={{ width: '95%', margin: '20px auto 0', display: "flex", flexDirection: "column" }}>
            <Header title="公版課表" subtitle="以週為單位新增公版課表，模板可以用來匯入至正式課表做初步排課。" />
            {authorityRange.p_insert && <CrudTemplateData type={"insert"} sx={{ alignSelf: "flex-end" }} handleButtonClick={handleButtonClick} />}
          
            <TemplateList templateData={templateData} setTemplateData={setTemplateData} handleButtonClick={handleButtonClick} authorityRange={authorityRange}/>
        </div>
    );
}
