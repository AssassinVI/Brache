import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import CheckIcon from '@mui/icons-material/Check';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import * as moduleApi from "../../axios-api/moduleData";
import { IsLoading } from "../../components/loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { snackBarOpenAction } from "../../redux/action";
import axiosInstance from "../../axios-api/axiosInstance";
// import Alert from '@mui/material/Alert';
const moduleUrl = "https://bratsche.web-board.tw/ajax/module.php";
const ModuleManage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [editModule, showEditModule] = useState(null);
    const { moduleData, refetchData } = moduleApi.useGetAll();
    const handleButtonClick = () => {
        refetchData();
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
            field: "Mod_name",
            headerName: "模組名稱",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "Mod_code",
            headerName: "模組代碼",
            flex: 1,
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
            field: "version",
            headerName: "版本",
            flex: 0.3,
        },
        {
            field: "modify",
            headerName: "編輯",
            flex: 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"5px"} width="100%">
                        <Box
                            width="fit-content"
                            m="0 10px 0 0"
                            p="6px"
                            display="flex"
                            borderRadius="4px"
                            backgroundColor="#6DC4C5"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                showEditModule(null)
                                setTimeout(() => {
                                    showEditModule(rows.row.Tb_index)
                                }, 100)
                            }}
                        >
                            <EditIcon sx={{ color: "#fff" }} />
                            <Typography color={"#fff"} sx={{ ml: "5px" }}>
                                修改
                            </Typography>
                        </Box>
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
                                if (window.confirm(`確定要刪除模組:"${rows.row.Mod_name}"嗎?`)) {
                                    axiosInstance({
                                        method: "POST",
                                        url: moduleUrl,
                                        data: {
                                            type: "delete_Module",
                                            Tb_index: rows.row.Tb_index,
                                        }
                                    }).then(() => {
                                        dispatch(snackBarOpenAction(true, `成功刪除模組-${rows.row.Mod_name}`))
                                        handleButtonClick()
                                    })


                                }

                            }}
                        >
                            <DeleteIcon sx={{ color: "#fff" }} />
                            <Typography color={"#fff"} sx={{ ml: "5px" }}>
                                刪除
                            </Typography>

                        </Box>
                    </Box>

                )
            }
        },
    ];

    return (
        <>
            {/* <Alert severity="success">This is a success alert — check it out!</Alert> */}
            <Box m="20px">
                <Header title="模組管理" subtitle="本頁面條列目前後台所使用的模組，請勿任意刪除，感恩" />
                <NewModule reFetch={handleButtonClick} />
                <Box
                    m="40px 0 0 0"
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
                    }}
                >
                    {moduleData ? <DataGrid rowHeight={85} rows={moduleData.data} getRowId={(row) => row.Tb_index} columns={columns} sx={{ minWidth: "430px", }} /> : <IsLoading />}
                </Box>
            </Box>
            {editModule && <EditModule id={editModule} close={showEditModule} reFetch={handleButtonClick} />}
        </>

    );
};

export default ModuleManage;




const EditModule = ({ id, close, reFetch }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const prevData = moduleApi.useGetOne(id);
    const [name, setName] = useState(null)
    const [code, setCode] = useState(null)
    const [version, setVersion] = useState(null)
    const [is_use, setIs_use] = useState(null)
    const dispatch = useDispatch(null)
    useEffect(() => {
        if (prevData) {
            setName(prevData.data[0].Mod_name)
            setCode(prevData.data[0].Mod_code)
            setVersion(prevData.data[0].version)
            setIs_use(prevData.data[0].is_use)
        }
    }, [prevData])



    return (
        <Box width={"clamp(300px,10%,500px)"} height={"clamp(360px,28vh,600px)"} p={"45px 0 30px"} sx={{ zIndex: 1500, position: "fixed", left: 0, right: 0, top: 0, bottom: 0, margin: "auto", backgroundColor: `${colors.primary[400]}`, boxShadow: "0 0 6px 1px rgba(0,0,0,0.4)" }}>

            {prevData ? <>
                <Box width={"60%"} m={"0 auto 15px"}>
                    <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                        模組名稱:
                        <input type="text" style={{ width: "100%", border: "1px solid #ccc", padding: "5px", outline: "none" }} defaultValue={prevData.data[0].Mod_name} onChange={(e) => setName(e.target.value)}></input>
                    </Typography>
                </Box>
                <Box width={"60%"} m={"0 auto 15px"}>
                    <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                        模組代碼:
                        <input type="text" style={{ width: "100%", border: "1px solid #ccc", padding: "5px", outline: "none" }} defaultValue={prevData.data[0].Mod_code} onChange={(e) => setCode(e.target.value)}></input>
                    </Typography>
                </Box>
                <Box width={"60%"} m={"0 auto 15px"}>
                    <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                        版本:
                        <input type="text" style={{ width: "100%", border: "1px solid #ccc", padding: "5px", outline: "none" }} defaultValue={prevData.data[0].version} onChange={(e) => setVersion(e.target.value)}></input>
                    </Typography>
                </Box>
                <Box width={"60%"} m={"0 auto 15px"}>
                    <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                        <label style={{ display: "flex", alignItems: "center" }}>
                            上線
                            <input type="checkbox" defaultChecked={Math.floor(prevData.data[0].is_use) ? true : false} onChange={(e) => {
                                if (e.target.value) {
                                    setIs_use("1")
                                } else {
                                    setIs_use("0")
                                }
                            }} />
                        </label>
                    </Typography>
                </Box>
                <Box width={"60%"} m={"0 auto 15px"}>
                    <Button color="secondary" variant="contained" onClick={(e) => {

                        axiosInstance({
                            method: "POST",
                            url: moduleUrl,
                            data: {
                                type: "update_Module",
                                Tb_index: id,
                                Mod_name: name,
                                Mod_code: code,
                                version: version,
                                is_use: is_use
                            }
                        }).then(() => {
                            close(null)
                            dispatch(snackBarOpenAction(true, `成功修改模組-${name}`))
                            reFetch()
                        })
                    }}>
                        修改模組
                    </Button>
                </Box>
            </> : <IsLoading />}
            <CloseIcon onClick={() => close(null)} style={{ position: "absolute", right: "5px", top: "5px", cursor: "pointer" }} />
        </Box>
    )
}


const NewModule = ({ reFetch }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [name, setName] = useState(null)
    const [code, setCode] = useState(null)
    const [version, setVersion] = useState(null)
    const [onSubmit, setOnSubmit] = useState(false)
    const dispatch = useDispatch(null)
    return (
        <Box m="40px 0 0 0" p="30px 20px" display="flex" gap={"20px"} alignItems={"center"} flexWrap={"wrap"} justifyContent={"space-between"} width={"100%"} maxWidth={"500px"} sx={{ backgroundColor: `${colors.primary[400]}` }}>
            <Box width={"100%"}>
                <Typography color={colors.grey[100]} sx={{ ml: "5px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    模組名稱:
                    <input type="text" style={{ width: "60%", border: "1px solid #ccc", padding: "5px", outline: "none" }} onChange={(e) => setName(e.target.value)}></input>
                </Typography>
            </Box>
            <Box width={"100%"}>
                <Typography color={colors.grey[100]} sx={{ ml: "5px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    模組代碼:
                    <input type="text" style={{ width: "60%", border: "1px solid #ccc", padding: "5px", outline: "none" }} onChange={(e) => setCode(e.target.value)}></input>
                </Typography>
            </Box>
            <Box width={"100%"}>
                <Typography color={colors.grey[100]} sx={{ ml: "5px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    版本:
                    <input type="text" style={{ width: "60%", border: "1px solid #ccc", padding: "5px", outline: "none" }} onChange={(e) => setVersion(e.target.value)}></input>
                </Typography>
            </Box>
            <Box width={"100%"} sx={{ display: "flex", justifyContent: "flex-end", pointerEvents: onSubmit ? "none" : "auto", }} >
                <Button type="submit" color={onSubmit ? "primary" : "secondary"} variant="contained" onClick={(e) => {
                    e.preventDefault();
                    if (name && code && version) {
                        setOnSubmit(true)
                        axiosInstance({
                            method: "POST",
                            url: moduleUrl,
                            data: {
                                type: "insert_Module",
                                Mod_name: name,
                                Mod_code: code,
                                version: version,
                            }
                        }).then(() => {
                            setOnSubmit(false)
                            dispatch(snackBarOpenAction(true, `成功新增模組-${name}`))
                            reFetch()
                        })
                    } else {
                        dispatch(snackBarOpenAction(true, `資料尚未填寫完成`, "error"))
                    }

                }}>
                    {onSubmit ? "上傳中..." : "新增模組"}
                </Button>
            </Box>
        </Box>
    )
}