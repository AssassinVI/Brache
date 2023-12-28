import { Box, Typography, useMediaQuery, Button } from "@mui/material";
import {useState} from "react";
import { IsLoading } from "../../components/loading";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useDispatch, useSelector } from 'react-redux';
import { snackBarOpenAction, notificationListAction } from '../../redux/action';
import ChangeSheet from "./changeSheet";
import * as changeApi from "../../axios-api/changeSystem"

export default function YourApproval({listData=[],setListData}){
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    const [selectCt, setSelectCt] = useState([]); // 批次勾選異動單 --
    const dispatch = useDispatch(null)
    //獲取使用者資訊
    const userData = useSelector(state => state.accessRangeReducer)

    

    const columns = [
        {
            field: "student",
            headerName: "學生",
            flex: isMobile ? 0.7 : 1,
            cellClassName: "name-column--cell",
            renderCell: (rows)=>{

                return(
                    rows.row.student.map((student)=>{
                        return (
                            <span style={{marginRight:'5px'}}>{student.name}</span>
                        )
                    })
                )
            }
        },
        {
            field: "change_date",
            headerName: "上課日期",
            flex: 1,
        },
        {
            field: "change_StartTime",
            headerName: "上課時間",
            flex: 1,
        },
        {
            field: "change_room",
            headerName: "上課教室",
            flex: 1,
        },
        {
            field: "keyindate",
            headerName: "申請日期",
            flex: 1,
        },
        {
            field: "change_type",
            headerName: "事由",
            flex: isMobile ? 0.3 : 0.5,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        {rows.row.change_type === "1" && '調課'}
                        {rows.row.change_type === "2" && '換課'}
                        {rows.row.change_type === "3" && '補簽'}
                        {rows.row.change_type === "4" && '加課'}
                        {rows.row.change_type === "5" && '刪課'}
                    </Box>
                )
            }
        },
        {
            field: "modify",
            headerName: "簽核",
            flex: isMobile ? 0.7 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        <ChangeSheet data={rows.row} crud={"needApproval"} sheetId={rows.row.Tb_index} setListData={setListData}/>
                    </Box>
                )
            }
        },
    ];

    //-- 批次簽核 --
    const batchApproval= ()=>{
        let result = prompt("是否要簽核所勾選的異動單嗎?\n下欄填寫備註：", '');
        if(result!==null){
            if(selectCt.length>0){
                const userId =userData.inform.Tb_index

                    // 存储所有请求的Promise数组
                    var promises = [];
                    selectCt.forEach(ch_id => {
                        let pm= changeApi.signIn_course_transfer({
                            record_type:'100',
                            admin_id:userId,
                            c_remark:result,
                            course_ch_id:ch_id
                        },(res)=>{
                            
                        })
                        promises.push(pm);
                    });

                    try{
                         // 等待所有请求完成
                         Promise.all(promises).then(()=>{
                            setTimeout(() => {
                                dispatch(snackBarOpenAction(true, `已完成所有批次審核`))
                                changeApi.get_course_transfer(userId,(res)=>{
                                    setListData(res.data.data)
                                })
                                //-- 更新通知 --
                                dispatch(notificationListAction({reflash: true}))
                            }, 500);
                            
                         });
                    }
                    catch (error){
                        // 至少有一个请求失败
                        console.error("至少有一个请求失败: " + error);
                    }
                

            }
            else{
                dispatch(snackBarOpenAction(true, `請勾選需要簽核的異動單!`, 'error'))
            }
        }
    }

    const responsiveColumns = isMobile
    ? columns.filter((column) => column.field !== 'change_StartTime' && column.field !== 'change_room' && column.field !== 'keyindate')
    : columns;

    return(
        <Box m={"25px 0"}>
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
             <Typography variant="h5" sx={{fontWeight:"600"}}>須簽核的異動單</Typography>
             <Button variant="contained" color="success" onClick={()=>{batchApproval()}}>批次簽核</Button>
            </Box>
             
             <Box
            m="20px 0 0 0"
            width="100%"
            height="35vh"
            sx={{
                overflowX: "scroll",
                "@media all and (max-width:850px)": {
                    paddingBottom: "40px",
                    // height: "40vh"
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
            {listData ? <DataGrid 
                            rowHeight={isMobile ? 45 : 45} 
                            rows={listData} 
                            getRowId={(row) => row.Tb_index} 
                            columns={responsiveColumns}
                            checkboxSelection
                            onSelectionModelChange={(item)=>{
                                setSelectCt(item);
                            }}
                             /> 
                        : <IsLoading />}
        </Box>
        </Box>
    )
}