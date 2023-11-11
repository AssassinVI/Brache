import { Box, Typography, useMediaQuery, Button,  } from "@mui/material";
import React from "react";
import { IsLoading } from "../../components/loading";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import ChangeSheet from "./changeSheet";
import { delete_course_transfer, get_course_transfer } from "../../axios-api/changeSystem";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpenAction } from "../../redux/action";
import ArrowRightAltSharpIcon from '@mui/icons-material/ArrowRightAltSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Inprogress({listData=[],setListData}){
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕

    //獲取使用者資訊
    const userData = useSelector(state => state.accessRangeReducer)
    const dispatch = useDispatch(null)

    const columns = [
        {
            field: "c_name",
            headerName: "課堂名稱",
            flex: 0.7 ,
            cellClassName: "name-column--cell",
        },
        {
            field: "keyindate",
            headerName: "申請日期",
            flex: isMobile?1:0.4,
        },
        {
            field: "change_type",
            headerName: "事由",
            flex:  0.3 ,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        {rows.row.change_type === "1" && <p>調課</p>}
                        {rows.row.change_type === "2" && <p>換課</p>}
                        {rows.row.change_type === "3" && <p>補簽</p>}
                    </Box>
                )
            }
        },
        {
            field: "process",
            headerName: "簽核狀態",
            flex:1.5,
            hide:isMobile,
            renderCell: (rows) => {
             
                return (
                    <Box display={"flex"} gap={"16px"} width="100%" >
                        {rows.row.process.map((item,i)=>{
                               
                            return(
                                <Box display={"flex"} alignItems={"center"} gap={"4px"} sx={{
                                    width:"fit-content",
                                    padding:"5px 10px",
                                    backgroundColor:item.record_type === "100" ? "#ccc" : rows.row.process[i-1]?.record_type === "100" ? "#6060d1":i==0?"#6060d1":"transparent",
                                    borderRadius:"10px",
                                    boxShadow:rows.row.process[i-1]?.record_type === "100" ? "0 0 5px 1px #9a9a9a":i==0?"0 0 5px 1px #9a9a9a":"none",
                                    border:rows.row.process[i-1]?.record_type === "100" ? "none":i==0?"none":"1px solid #9a9a9a",
                                    "& p":{
                                        margin:0,
                                        color:item.record_type === "100" ? "#000":rows.row.process[i-1]?.record_type === "100" ? "#fff":i==0?"#fff":"#8a8a8a",
                                    }
                                }}>
                                    <p >{item.name}</p>
                                    {item.record_type === "100" ? 
                                        <>
                                          <p>: {item?.record_type === "100".split(" ")[0]}</p>
                                            <ArrowRightAltSharpIcon/>
                                        </>
                                        :
                                        rows.row.process[i-1]?.record_type === "100" ?  <EditIcon sx={{width:"15px",height:"15px",fill:"#fff"}}/>:i==0  ?  <EditIcon sx={{width:"15px",height:"15px",fill:"#fff"}}/>:""
                                     
                                    }
                                </Box>
                            )
                        })}
                    </Box>
                )
            }
        },
        {
            field: "modify",
            headerName: "檢視",
            flex: isMobile ? 0.7 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        <ChangeSheet data={rows.row} crud={"view"} sheetId={rows.row.Tb_index} setListData={setListData}/>

                        <Button variant="contained" sx={{ backgroundColor: "#F8AC59", width: "85px", gap: "5px" }} onClick={(e) => {
                               const userId = userData.inform.Tb_index;
                               if(window.confirm("確定要刪除此異動單?")){
                                delete_course_transfer(rows.row.Tb_index,(res)=>{
                                    if(res.data.success){
                                        dispatch(snackBarOpenAction(true, `${res.data.msg}`))
                                        get_course_transfer(userId,(res)=>{
                                            setListData(res.data.data)
                                    })}
                                })
                               }
                        }}>
                            <DeleteIcon sx={{ color: "#fff" }} />
                            刪除
                        </Button>
                    </Box>
                    
                )
            }
        },
    ];
    return(
        <Box m={"25px 0"}>
             <Typography variant="h5" sx={{fontWeight:"600"}}>申請中的異動單</Typography>
             <Box
            m="20px 0 0 0"
            width="100%"
            height="35vh"
            sx={{
                overflowX: "scroll",
                "@media all and (max-width:850px)": {
                    paddingBottom: "40px",
                    height: "40vh"
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
            {listData ? <DataGrid rowHeight={isMobile ? 95 : 85} rows={listData} getRowId={(row) => row.Tb_index} columns={columns} /> : <IsLoading />}
        </Box>
        </Box>
    )
}