import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { IsLoading } from "../../components/loading";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState } from "react";
import { getAll } from "../../axios-api/teacherData";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { course_transfer_history } from "../../axios-api/changeSystem";
import ChangeSheet from "./changeSheet";


function FunctionBar({date,setDate,teacher,setTeacher}){
    const accessRange = useSelector(store => store.accessRangeReducer)
    const [teacherAll,setTeacherAll] = useState(null)
    const dates = new Date()
    const today = `${dates.getFullYear()}-${dates.getMonth()+1}-${dates.getDate()}`;
    const todayArr = today.split("-")
    todayArr.forEach((item,i)=>{
        if(i>0 && item.length <2){
            todayArr[i] = "0"+todayArr[i]
        }
    })
    useEffect(()=>{
       getAll().then((data) => {
        setTeacherAll(data.data);
          });
    },[])
    return(
       <Box display={"flex"} gap={"25px"} flexWrap={"wrap"}>
          {accessRange?.inform?.name !== "老師" && teacherAll &&
                <FormControl>
                    <InputLabel id="demo-simple-select-label">老師</InputLabel>
                    <Select onChange={(e) => {
                        setTeacher(e.target.value)
                    }}
                        value={teacher || ""}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="老師"
                        defaultValue={1} sx={{ width: "120px" }}

                    >
                        <MenuItem key={'all'} value={'all'} style={{ paddingLeft: "8px" }}>
                           全部
                        </MenuItem>
                        {teacherAll && teacherAll.map((item) => {
                            return (
                                <MenuItem key={item.Tb_index} value={item.Tb_index} style={{ paddingLeft: "8px" }}>
                                    {item.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            }

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker 
                    label="開始日期" 
                    format="YYYY/MM/DD"
                    value={dayjs(date?.StartDate ? date.StartDate : todayArr.join("-"))}
                    onChange={(newDate)=>{
                        setDate({
                            ...date,
                            StartDate:newDate
                        })
                    }}
                />
            </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker 
                    label="結束日期" 
                    format="YYYY/MM/DD"
                    value={dayjs(date?.EndDate ? date.EndDate : todayArr.join("-"))}
                    onChange={(newDate)=>{
                        setDate({
                            ...date,
                            EndDate:newDate
                        })
                    }}
                />
            </DemoContainer>
            </LocalizationProvider>

        {/* <TextField
        id="date"
        label="開始日期"
        type="date"
        InputLabelProps={{
        shrink: true,
        }}
        value={date?.StartDate ? date.StartDate : todayArr.join("-")}
        onChange={(e)=>{
            setDate({
                ...date,
                StartDate:e.target.value
            })
        }}
        />
         <TextField
            id="date"
            label="結束日期"
            type="date"
            InputLabelProps={{
            shrink: true,
            }}
            value={date?.EndDate ? date.EndDate : todayArr.join("-")}
            onChange={(e)=>{
                setDate({
                    ...date,
                    EndDate:e.target.value
                })
            }}
        /> */}
       </Box>
    )
}



export default function ChangeHistory(){
    const userData = useSelector(store => store.accessRangeReducer)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    const [date,setDate] = useState(null)
    const [teacher,setTeacher] =useState(null)
    const [listData,setListData] = useState(null)

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
            field: "change_type",
            headerName: "事由",
            flex: isMobile ? 0.3 : 1 ,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        {rows.row.change_type === "1" && <p>調課</p>}
                        {rows.row.change_type === "2" && <p>換課</p>}
                        {rows.row.change_type === "3" && <p>補簽</p>}
                        {rows.row.change_type === "4" && <p>加課</p>}
                    </Box>
                )
            }
        },
        {
            field: "keyindate",
            headerName: "申請時間",
            flex: isMobile ? 0.65 : 1,
        },
        {
            field: "modify",
            headerName: "檢視",
            flex: isMobile ? 0.5 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        <ChangeSheet data={rows.row} crud={"history"} sheetId={rows.row.Tb_index} setListData={setListData}/>
                    </Box>
                )
            }
        },
    ];


    useEffect(() => {
        const dates = new Date()
        const today = `${dates.getFullYear()}-${dates.getMonth()+1}-${dates.getDate()}`;
         if(userData.inform){
          if(userData.inform.name !=="老師" && teacher){
                course_transfer_history({
                    admin_id:teacher,
                    StartDate:date?.StartDate ? date.StartDate :today,
                    EndDate:date?.EndDate ? date.EndDate : today,
                },(res)=>{
                    console.log(res)
                    setListData(res.data.data)
                })
          }else{
                course_transfer_history({
                    admin_id:userData.inform.Tb_index,
                    StartDate:date?.StartDate ? date.StartDate :today,
                    EndDate:date?.EndDate ? date.EndDate : today,
                },(res)=>{
                    console.log(res)
                    setListData(res.data.data)
                })
          }
         }
      }, [userData,date,teacher])


    return(
        <Box m={"25px 0"} sx={{ width: '95%', margin: '20px auto 0' }}>
            <Header title={`歷史異動單`} subtitle={`可瀏覽已通過申請的異動單`} />
            <FunctionBar date={date} setDate={setDate} teacher={teacher} setTeacher={setTeacher} />
             <Box
            m="20px 0 0 0"
            width="100%"
            height="60vh"
            sx={{
                overflowX: "scroll",
                "@media all and (max-width:850px)": {
                    paddingBottom: "40px",
                    height: "70vh"
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
            {listData ? <DataGrid rowHeight={isMobile ? 110 : 85} rows={listData} getRowId={(row) => row.Tb_index} columns={columns} /> : <IsLoading />}
        </Box>
        </Box>
    )
}