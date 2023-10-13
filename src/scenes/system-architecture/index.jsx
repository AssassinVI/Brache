import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Accordion, AccordionSummary, AccordionDetails, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import * as systemApi from "../../axios-api/systemData"
import * as moduleApi from "../../axios-api/moduleData"
import { IsLoading } from '../../components/loading';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TopicIcon from '@mui/icons-material/Topic';
import ArticleIcon from '@mui/icons-material/Article';
import { systemTreeAction, snackBarOpenAction } from '../../redux/action';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Header from '../../components/Header';
//下拉
export const Item = ({ mainText, children }) => {
    const [expanded, setExpanded] = useState(null);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };
    return (
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ width: "100%", paddingRight: "18px", "& .MuiAccordionSummary-content": { margin: 0 }, position: "relative", "& .css-18h7urw": { paddingRight: "0", paddingLeft: "0" } }} >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ width: "100%", "& .MuiAccordionSummary-expandIconWrapper": { position: "absolute", left: "10px" } }}>
                {mainText}
            </AccordionSummary>
            <AccordionDetails sx={{ width: "100%" }}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

//react dnd
const DraggableDroppableBox = ({ id, handleDrop, children }) => {
    const systemTreeData = useSelector(state => state.systemTreeReducer.tree)
    const theme = useTheme();
    const dispatch = useDispatch(null)
    const [{ isDragging }, drag] = useDrag({
        item: { id },
        type: 'box',
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'box',
        drop: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (!dropResult) {
                // 執行拖放操作
                const test = handleDrop(item.id, id, systemTreeData)
                if (test) {
                    dispatch(systemTreeAction(test, true))

                }

            }
        },
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;
    const backgroundColor = isOver ? '#ccc' : canDrop ? '#eee' : (theme.palette.mode === "dark" ? "#1e1e1e" : "white");
    return (
        <div
            ref={node => {
                drag(drop(node));
            }}
            style={{ opacity, backgroundColor, cursor: 'move' }}
        >
            {children}
        </div>
    );
};

const handleDrop = (dragItemId, dropItemId, systemTreeData) => {
    const cloneData = JSON.parse(JSON.stringify(systemTreeData))
    const findItemAndRemove = (items) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === dragItemId.id) {

                const spliceItem = items.splice(i, 1);
                return spliceItem;
            }
            if (items[i].children.length > 0) {
                const found = findItemAndRemove(items[i].children);
                if (found) return found;
            }
        }
        return false;
    };

    const findItemAndInsert = (items, spliceItem) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === dropItemId.id) {
                items.splice(i + 1, 0, spliceItem)
            } else if (items[i].id + "init" === dropItemId.id) {
                items[i].children.push(spliceItem)
            }
            if (items[i].children.length > 0) {
                findItemAndInsert(items[i].children, spliceItem);
            }
        }
    };

    if (dragItemId !== dropItemId && dragItemId && dropItemId) {
        const spliceItem = findItemAndRemove(cloneData);
        findItemAndInsert(cloneData, spliceItem[0]);
        return cloneData
    }

};




const TableRow = ({ data, style, icon, refetchData }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box display={"flex"} alignItems={"center"} sx={{ width: "100%", height: "60px", padding: "10px 0", "@media all and (max-width:850px)": { height: "100px" }, ...style }} >
            <Typography flex={1} display={"flex"} alignItems={"center"} sx={{ "& svg": { marginRight: "5px" } }} color={colors.greenAccent[300]}>
                {icon}
                {data.name}
            </Typography>
            <Typography flex={1} sx={{ "@media all and (max-width:850px)": { flex: "0.5" } }}>
                {data.orderBy}
            </Typography>
            <Typography flex={1} sx={{ "@media all and (max-width:850px)": { display: "none" } }}>
                {data.id}
            </Typography>
            <Typography flex={1}>
                {data.module}
            </Typography>
            <Box onClick={(e) => e.stopPropagation()} display={"flex"} width={"175px"} justifyContent={"space-between"} sx={{ paddingRight: "15px", "@media all and (max-width:850px)": { display: "flex", flexDirection: "column", width: "95px", gap: "8px" } }}>
                <UpdataSystemArchitecture id={data.id} refetchData={refetchData} />
                <Button variant="contained" dataset-id={data.id} sx={{ backgroundColor: "#F8AC59" }} onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm(`是否要刪除系統-"${data.name}"`)) {
                        systemApi.deleteOne(data.id, refetchData)
                    }
                }}>
                    <DeleteIcon />
                    刪除
                </Button>
            </Box>
        </Box>
    )
}

const renderTableRow = (item, refetchData) => {
    if (Math.floor(item.is_data)) {
        return (
            <DraggableDroppableBox key={item.id} id={{ id: item.id, isData: item.is_data }} handleDrop={handleDrop}>
                <TableRow
                    data={item}
                    style={{ padding: "10px 36px 10px 16px" }}
                    icon={<ArticleIcon />}
                    refetchData={refetchData}
                />
            </DraggableDroppableBox>

        );
    } else {
        return (
            <DraggableDroppableBox key={item.id} id={{ id: item.id, isData: item.is_data }} handleDrop={handleDrop}>
                <Item mainText={<TableRow data={item} icon={<TopicIcon />} refetchData={refetchData} style={{ "& > p:nth-of-type(1) svg": { marginLeft: '20px' } }} />}>
                    {item.children.length < 1 ?
                        <DraggableDroppableBox key={item.id + "init"} id={{ id: item.id + "init", isData: 1 }} handleDrop={handleDrop}>
                            <Box sx={{ padding: "25px" }}> 新增文件到此資料夾...</Box>
                        </DraggableDroppableBox> :
                        item.children.map((itemInner) => {
                            return renderTableRow(itemInner, refetchData);
                        })}
                </Item>
            </DraggableDroppableBox>
        );
    }
};

function NewSystemArchitecture({ refetchData }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [module, setModule] = useState("")
    const [radio, setRadio] = useState("資料夾")
    const [router, setRouter] = useState("")
    const [icon, setIcon] = useState("")
    const { moduleData } = moduleApi.useGetAll()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if (name) {
            systemApi.newOne({
                MT_Name: name,
                UseModuleID: module,
                is_data: radio === "資料夾" ? "0" : "1",
                parent_id: "",
                router_url: router,
                router_icon: icon
            }, refetchData)
            setOpen(false);
        } else {
            alert("請填寫系統名稱")
        }

    }
    useEffect(() => {
        setModule("")
        setName("")
        setRadio("資料夾")
        setIcon("")
        setRouter("")
    }, [open])
    return (
        <div >
            <Button variant="outlined" onClick={handleClickOpen}>
                新增系統
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} sx={{ "& .MuiPaper-root": { padding: " 10px 25px" } }}>
                <DialogTitle>新增系統</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="系統名稱"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />

                </DialogContent>
                {radio === "文件" &&
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="router"
                            label="路由"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setRouter(e.target.value)
                            }}
                            value={router}
                        />
                    </DialogContent>
                }
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="icon"
                        label="圖示"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setIcon(e.target.value)
                        }}
                        value={icon}
                    />
                </DialogContent>
                <DialogContent>
                    <InputLabel id="demo-simple-select-label">使用模組</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="使用模組"
                        onChange={(e) => {
                            setModule(e.target.value)
                        }}
                        fullWidth
                        sx={{ "& #demo-simple-select": { padding: "10px" }, marginTop: "10px" }}
                        value={module || ''} // 确保值不为 undefined
                    >
                        <MenuItem value={""} >{"無"}</MenuItem>
                        {moduleData && moduleData.data.map((item) => {
                            return (
                                <MenuItem key={item.Tb_index} value={item.Tb_index}>{item.Mod_name}</MenuItem>
                            )
                        })}
                    </Select>
                </DialogContent>
                <DialogContent>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={(e) => {
                            setRadio(e.target.value)
                        }}
                        value={radio}

                    >
                        <FormControlLabel value="資料夾" control={<Radio />} label="資料夾" />
                        <FormControlLabel value="文件" control={<Radio />} label="文件" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit}>建立</Button>
                    <Button onClick={handleCancel}>取消</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function UpdataSystemArchitecture({ refetchData, id }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [module, setModule] = useState("")
    const [radio, setRadio] = useState("")
    const [data, setData] = useState(null)
    const [router, setRouter] = useState("")
    const [icon, setIcon] = useState("")
    const { moduleData } = moduleApi.useGetAll()


    const handleCancel = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if (name) {
            systemApi.updateOne({
                MT_Name: name,
                UseModuleID: module,
                is_data: radio === "資料夾" ? "0" : "1",
                Tb_index: id,
                router_url: router,
                router_icon: icon
            }, refetchData)
            setOpen(false);
        } else {
            alert("請填寫系統名稱")
        }

    }
    useEffect(() => {
        if (data) {
            setName(data.MT_Name)
            setModule(data.UseModuleID)
            setRadio(Math.floor(data.is_data) ? "文件" : "資料夾")
            setIcon(data.router_icon)
            setRouter(data.router_url)
        }
    }, [data])
    return (
        <>
            <Button variant="contained" sx={{ backgroundColor: "#6DC4C5" }} onClick={(e) => {
                e.stopPropagation()
                systemApi.getOne(id, (data) => {
                    setData(data.data.data[0])

                })
                setOpen(true);
            }}>
                <EditIcon />
                修改
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} sx={{ "& .MuiPaper-root": { padding: " 10px 25px" } }}>
                <DialogTitle>修改系統</DialogTitle>
                {data ? <>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="系統名稱"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            value={name}
                        />

                    </DialogContent>
                    {radio === "文件" &&
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="router"
                                label="路由"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={(e) => {
                                    setRouter(e.target.value)
                                }}
                                value={router}
                            />
                        </DialogContent>
                    }
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="icon"
                            label="圖示"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setIcon(e.target.value)
                            }}
                            value={icon}
                        />
                    </DialogContent>
                    <DialogContent>
                        <InputLabel id="demo-simple-select-label">使用模組</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="使用模組"
                            onChange={(e) => {
                                setModule(e.target.value)
                            }}
                            fullWidth
                            sx={{ "& #demo-simple-select": { padding: "10px" }, marginTop: "10px" }}
                            value={module || ''} // 确保值不为 undefined
                        >
                            <MenuItem value={""} >{"無"}</MenuItem>
                            {moduleData && moduleData.data.map((item) => {
                                return (
                                    <MenuItem key={item.Tb_index} value={item.Tb_index}>{item.Mod_name}</MenuItem>
                                )
                            })}
                        </Select>
                    </DialogContent>
                    <DialogContent>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) => {
                                setRadio(e.target.value)
                            }}
                            value={radio}

                        >
                            <FormControlLabel value="資料夾" control={<Radio />} label="資料夾" />
                            <FormControlLabel value="文件" control={<Radio />} label="文件" />
                        </RadioGroup>
                    </DialogContent>
                </> :
                    <IsLoading />}

                <DialogActions>
                    <Button onClick={handleSubmit}>修改</Button>
                    <Button onClick={handleCancel}>取消</Button>
                </DialogActions>
            </Dialog>
        </>



    );
}




export const SystemArchitecture = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const systemTreeData = useSelector(state => state.systemTreeReducer.tree)
    const needConfirmOrder = useSelector(state => state.systemTreeReducer.needConfirm)

    const { refetchData } = systemApi.useGetAll()
    const dispatch = useDispatch(null)

    const updateOrder = (e) => {
        systemApi.updateOrderBy(systemTreeData, refetchData)
        dispatch(systemTreeAction(systemTreeData, false))
        dispatch(snackBarOpenAction(true, `成功更新排序`))
    }


    return (
        <Box sx={
            {
                width: "95%",
                margin: "60px auto 0",
                position: "relative",
                "@media all and (max-width:850px)": {
                    marginTop: "15px",
                    "& .css-1xn3edc": {
                        marginBottom: "70px"
                    },
                    "& .css-1rovily": {
                        top: "90px"
                    },
                    "& .css-18h7urw": {
                        padding: "10px",
                        paddingRight: "0"
                    },
                    "& .MuiPaper-root": {
                        paddingRight: 0
                    },
                    "& .css-1kcuymg-MuiButtonBase-root-MuiAccordionSummary-root": {
                        paddingRight: 0
                    },
                    "& .css-1bt7x26-MuiAccordionDetails-root": {
                        paddingRight: 0,
                        paddingLeft: "48px"
                    }
                },

            }
        }>
            <Header title="系統架構" subtitle="本頁面條列此系統之基本架構" />
            <Box display={"flex"} sx={{ position: "absolute", right: "0%", top: "48px", gap: "10px" }}>
                <NewSystemArchitecture refetchData={refetchData} action={"新增"} />
                <Button variant="contained" color={"primary"} sx={{ color: !needConfirmOrder ? "#000" : "#fff", backgroundColor: !needConfirmOrder ? "#ccc" : colors.blueAccent[300], pointerEvents: !needConfirmOrder ? "none" : "auto" }} onClick={updateOrder}>更新排序</Button>
            </Box>
            <TableRow data={{ name: "名稱", orderBy: "排序", id: "id", module: "使用模組" }} style={{ padding: "10px 37px 10px 16px", backgroundColor: colors.blueAccent[400], "& button": { display: "none" }, "@media all and (max-width:850px)": { height: "60px" }, }} />
            <Box width="100%" minHeight="50vh">
                {systemTreeData ? <DraggableDroppableBox id={"root"} handleDrop={handleDrop}>
                    {systemTreeData.map((item) => {
                        return renderTableRow(item, refetchData);
                    })}
                </DraggableDroppableBox> : <IsLoading />}
            </Box>


        </Box>

    );
};

