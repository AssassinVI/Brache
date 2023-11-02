import { Box, Typography, useTheme, Button, ButtonGroup, TextField, FormControlLabel, Radio, RadioGroup,  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import CheckIcon from '@mui/icons-material/Check';
import Header from "../../components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import * as authorityApi from "../../axios-api/authorityData";
import { IsLoading } from "../../components/loading";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpenAction } from "../../redux/action";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import { Item } from "../system-architecture";
import TopicIcon from '@mui/icons-material/Topic';
import ArticleIcon from '@mui/icons-material/Article';
import useAuthorityRange from "../../custom-hook/useAuthorityRange";
import { getAll } from "../../axios-api/adminData";


function UpdataAuthorityData({ id, type, sx, handleButtonClick }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [online, setOnline] = useState(true)
    const [data, setData] = useState(null)
    const [collectionData, setCollectionData] = useState([])
    const systemTreeData = useSelector(state => state.systemTreeReducer.tree)
    const dispatch = useDispatch(null)
    const handleCancel = () => {
        setOpen(false);
        setName("")
    };
    const handleSubmit = () => {
        if (name) {
            if (type === "update") {
                authorityApi.updateOne({
                    Tb_index: id,
                    permissions: collectionData,
                    Group_name: name,
                    is_use: online ? "1" : "0"
                }, (data) => {
                    handleButtonClick()
                    setOpen(false);
                    if (data.data.success) {
                        dispatch(snackBarOpenAction(true, `${data.data.msg}-${name}`))
                        window.alert(`${data.data.msg}-${name}`)
                        window.location.reload()
                    } else {
                        dispatch(snackBarOpenAction(true, `${data.data.msg}-${name}`, "error"))
                    }

                })
            } else if (type === "insert") {
                authorityApi.insertOne({
                    permissions: collectionData,
                    Group_name: name,
                    is_use: online ? "1" : "0"
                }, (data) => {
                    handleButtonClick()
                    setOpen(false);
                    if (data.data.success) {
                        dispatch(snackBarOpenAction(true, `${data.data.msg}-${name}`))
                        window.alert(`${data.data.msg}-${name}`)
                        window.location.reload()
                    } else {
                        dispatch(snackBarOpenAction(true, `${data.data.msg}-${name}`, "error"))
                    }

                })
            }


        } else {
            alert("請填寫權限名稱")
        }

    }
    const handleDataCollection = (data) => {

        setCollectionData((prevData) => {
            // 如果四个属性都为 false，则从 collectionData 中删除数据
            if (!data.p_insert && !data.p_delete && !data.p_update && !data.p_read) {
                const updatedData = prevData.filter(
                    (item) => item.permissions_id !== data.permissions_id
                );
                return updatedData;
            }

            const existingItem = prevData.find(
                (item) => item.permissions_id === data.permissions_id
            );
            if (existingItem) {
                // 更新已有的选项
                const updatedData = prevData.map((item) => {
                    if (item.permissions_id === data.permissions_id) {
                        return data;
                    }
                    return item;
                });
                return updatedData;
            }
            // 添加新的选项\
            return [...prevData, data];
        });
    };
    useEffect(() => {
        if (data) {
            setName(data.Group_name)

            setCollectionData([...data.permissions])

            if (type === "update") {
                setOnline(Math.floor(data.is_use) === 1 ? true : false)
            }
        }
    }, [data])


    return (
        <>

            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", ...sx }} onClick={(e) => {
                    e.stopPropagation()
                    authorityApi.getOne(id, (data) => {
                        setData(data.data.data)
                        setOpen(true);
                    })
                }}>
                    <EditIcon />
                    {type === "update" ? "修改" : "新增"}
             </Button >
            
            <Dialog open={open} onClose={handleCancel} sx={
                {
                    "& .MuiDialog-container > .MuiPaper-root": {
                        padding: " 10px 25px",
                        width: "100%",
                        maxWidth: "1560px",

                    },
                    "& label": { fontSize: "18px" },
                    "& .MuiInputBase-input": {
                        padding: "15px 0",
                    },
                    "& .css-1kcuymg-MuiButtonBase-root-MuiAccordionSummary-root": {
                        "@media all and (max-width:850px)": {
                            padding: 0
                        }
                    },
                    "& .css-1ou9u3a-MuiPaper-root-MuiAccordion-root": {
                        "@media all and (max-width:850px)": {
                            padding: 0
                        }
                    },
                    "& .css-yw020d-MuiAccordionSummary-expandIconWrapper": {
                        "@media all and (max-width:850px)": {
                            left: "1px !important"
                        }
                    },
                    "& .css-1bt7x26-MuiAccordionDetails-root": {
                        "@media all and (max-width:850px)": {
                            padding: "8px 4px 16px"
                        }
                    }
                }
            }>

                <Box width={"100%"} height={"100%"} sx={{ position: "relative", minWidth: "680px" }}>
                    <DialogTitle sx={{ fontSize: "28px", "@media all and (max-width:850px)": { padding: "10px 0" } }}>{type === "update" ? "權限編輯" : "權限新增"}</DialogTitle>
                    {data ? <>
                        <DialogContent sx={{ "@media all and (max-width:850px)": { padding: "15px 0" }, }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="權限名稱"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                value={name}
                                sx={{ width: "fit-content" }}
                            />
                        </DialogContent>
                        <TableRow style={{ padding: "10px 36px 10px 16px", "& > .MuiBox-root label": { display: "none" } }} data={{ name: "系統名稱", orderBy: "排序" }} />
                        {systemTreeData.map((item) => {
                            return renderTableRow(item, data, handleDataCollection);
                        })}
                    </> : <IsLoading />}
                    <DialogActions sx={{ marginTop: "20px", "& button": { fontSize: "18px" } }}>
                        <Button onClick={handleSubmit}>{type === "update" ? "修改" : "新增"}</Button>
                        <Button onClick={handleCancel}>取消</Button>
                    </DialogActions>
                    <Box sx={{ position: "absolute", right: "30px", top: "36px" }}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={online} onChange={((e) => {
                                    setOnline(e.target.checked)
                                })} />
                            }
                            label="啟用"
                        />
                    </Box>
                </Box>
            </Dialog>
        </>



    );
}

const TableRow = ({ data, accessData, style, icon, className, handleDataCollection }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [access, setAccess] = useState({
        p_insert: false,
        p_update: false,
        p_delete: false,
        p_read: false,
    })
    const handleChange = (target, bool) => {
        if (access.p_delete || access.p_insert || access.p_update) {

            setAccess({
                ...access,
                [target]: bool,
                p_read: true,
            })

        } else {
            setAccess({
                ...access,
                p_read: true,
                [target]: bool,
            })
        }
    }
    useEffect(() => {
        if (accessData) {
            accessData.permissions.forEach((item) => {
                if (data.id === item.permissions_id) {

                    const insert = item.p_insert === "1" ? true : false;
                    const update = item.p_update === "1" ? true : false;
                    const del = item.p_delete === "1" ? true : false;
                    setAccess({
                        p_insert: insert,
                        p_update: update,
                        p_delete: del,
                        p_read: true
                    })
                }
            })
        }
    }, [accessData])

    useEffect(() => {
        if (typeof handleDataCollection === "function") {
            handleDataCollection({ ...access, permissions_id: data.id })
        }
    }, [access])
    return (
        <Box className={className} display={"flex"} alignItems={"center"} sx={{ width: "100%", height: "60px", padding: "10px 12px", "@media all and (max-width:850px)": { padding: "10px 0" }, ...style }} >
            <Typography flex={'1 1 20%'} display={"flex"} alignItems={"center"} sx={{ "& svg": { marginRight: "5px" }, "@media all and (max-width:1110px)": { flex: "0.5" } }} color={colors.greenAccent[300]}>
                {icon && icon}
                {data.name}
            </Typography>
            <Typography flex={'1 1 10%'} sx={{ "@media all and (max-width:1110px)": { flex: "0.3" } }}>
                {data.orderBy}
            </Typography>
            <Box display={"flex"} flex={'1 1 50%'} justifyContent={'flex-end'}>
                <FormControlLabel
                    control={
                        <Checkbox checked={access.p_insert} onChange={() => {
                            handleChange("p_insert", !access.p_insert)
                        }} />
                    }
                    label="新增"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={access.p_update} onChange={(() => {
                            handleChange("p_update", !access.p_update)
                        })} />
                    }
                    label="修改"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={access.p_delete} onChange={(() => {
                            handleChange("p_delete", !access.p_delete)
                        })} />
                    }
                    label="刪除"
                />
                <FormControlLabel
                    control={
                        <Checkbox checked={(access.p_insert || access.p_update || access.p_delete) ? true : access.p_read ? true : false} onChange={(() => {
                            if (!(access.p_insert || access.p_update || access.p_delete)) {
                                handleChange("p_read", !access.p_read)
                            }
                        })} />
                    }
                    label="檢視"
                />
            </Box>
            <Box display={"flex"} flex={'1 1 20%'} justifyContent={'flex-end'}>
                {/* <FormControlLabel
                    control={
                        <Checkbox checked={(access.p_insert && access.p_update && access.p_delete) && true} onChange={((e) => {
                            if (e.target.checked) {
                                setAccess({
                                    p_insert: true,
                                    p_update: true,
                                    p_delete: true,
                                    p_read: true,
                                })
                            } else {
                                setAccess({
                                    p_insert: false,
                                    p_update: false,
                                    p_delete: false,
                                    p_read: false,
                                })
                            }
                        })} />
                    }
                    label="全選"
                /> */}
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="全選" control={<Radio />} label="全選" checked={(access.p_insert && access.p_update && access.p_delete) && true} onChange={(e)=>{
                         setAccess({
                            p_insert: true,
                            p_update: true,
                            p_delete: true,
                            p_read: true,
                        })
                    }} />
                    <FormControlLabel value="不全選" control={<Radio />} label="不全選" checked={(!access.p_insert && !access.p_update && !access.p_delete && !access.p_read)} onChange={(e)=>{
                         setAccess({
                            p_insert: false,
                            p_update: false,
                            p_delete: false,
                            p_read: false,
                        })
                    }} />
                </RadioGroup>
            </Box>
        </Box>
    )
}

const renderTableRow = (item, accessData, handleDataCollection, isInner = false) => {
    if (Math.floor(item.is_data)) {
        if (isInner) {

        }
        return (
            <TableRow
                data={item}
                style={{ padding: "10px 36px 10px 16px", "&.inner-table": { padding: "0 1px 0 20px" } }}
                icon={<ArticleIcon />}
                className={isInner ? "inner-table" : ""}
                key={item.id}
                handleDataCollection={handleDataCollection}
                accessData={accessData}
            />
        );
    } else {
        return (
            <Item key={item.id} mainText={<TableRow data={item} icon={<TopicIcon />} style={{ padding: "0", "& > p:nth-of-type(1) svg": { marginLeft: '20px' }, "& > div": { opacity: "0", pointerEvents: "none" } }} />}>
                {
                    item.children.map((itemInner) => {
                        return renderTableRow(itemInner, accessData, handleDataCollection, true);
                    })
                }
            </Item>
        );
    }
};



const Authority = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { authorityData, refetchData } = authorityApi.useGetAll();
    const { accessData, accessDetect } = useAuthorityRange()
    const [authorityRange, setAuthorityRange] = useState({})
    useEffect(() => {
        if (accessData) {
            const result = accessDetect(accessData, "權限管理")
            setAuthorityRange({
                p_delete: result.p_delete === "1" ? true : false,
                p_insert: result.p_insert === "1" ? true : false,
                p_update: result.p_update === "1" ? true : false,
            })
        }
    }, [accessData])


    //數據刷新點
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
            field: "Group_name",
            headerName: "權限名稱",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "is_use",
            headerName: "狀態",
            flex: 1,
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
                    
                    <Box width="100%">


                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                           {authorityRange.p_update && <UpdataAuthorityData id={rows.row.Tb_index} type={"update"} handleButtonClick={handleButtonClick} />}
                           {authorityRange.p_delete &&
                                <Button variant="contained" startIcon={<DeleteIcon />}
                                    sx={{backgroundColor: '#F8AC59', display: rows.row.Tb_index==='group2023071815332755' || rows.row.Tb_index==='group2023071815335388' || rows.row.Tb_index==='group2022092314594853' ? 'none':'inline-flex' }}
                                    onClick={() => {
                                        getAll().then((res) => {
                                            let result = [];
                                            res.data.forEach((item) => {
                                                if (item.Group_name === rows.row.Group_name) {
                                                    result.push(item.name)
                                                }
                                            })
                                            if (result.length === 0) {
                                                if (window.confirm(`確定要刪除權限:"${rows.row.Group_name}"嗎?`)) {
                                                    authorityApi.deleteOne(rows.row.Tb_index, (data) => {
                                                        if (data.data.success) {
                                                            dispatch(snackBarOpenAction(true, `${data.data.msg}-${rows.row.Group_name}`))
                                                        } else {
                                                            dispatch(snackBarOpenAction(true, `${data.data.msg}-${rows.row.Group_name}`, "error"))
                                                        }
                                                        handleButtonClick()
                                                    })
                                                }
                                            } else {
                                                const str = result.join("\r");
                                                window.alert(`無法刪除此權限，以下使用者正在套用中:\r${str}`)
                                            }
    
                                        })
    
                                    }}
                                >
                                        刪除
                                </Button>
                        }
                        </ButtonGroup>
                        
                        
                    </Box>

                )
            }
        },
    ];

    return (
        <>
            {/* <Alert severity="success">This is a success alert — check it out!</Alert> */}
            <Box m="20px auto 0" width={"95%"} display={"flex"} flexDirection={"column"}>
                <Header title="權限管理" subtitle="本頁面設定權限之範圍" />
                {authorityRange.p_insert && <UpdataAuthorityData type={"insert"} sx={{ width: "85px", alignSelf: "flex-end" }} handleButtonClick={handleButtonClick} />}

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
                    }}
                >
                    {authorityData ? <DataGrid rowHeight={85} rows={authorityData.data} getRowId={(row) => row.Tb_index} columns={columns} sx={{ minWidth: "100%", }} /> : <IsLoading />}
                </Box>
            </Box>

        </>

    );
};

export default Authority;




