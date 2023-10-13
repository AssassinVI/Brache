import React, { useState } from 'react'
import Header from '../../components/Header'
import { DateCalendar, DateRangeIcon, LocalizationProvider } from '@mui/x-date-pickers'
import { Box, Button, Dialog, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DataGrid } from '@mui/x-data-grid'
import { convertToChineseNumber, getWeekInfoForDate } from '../calendar/getMonday'
import { get_student_course_history_one } from '../../axios-api/studentData'
import { useTheme } from '@emotion/react'
import { tokens } from '../../theme'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { IsLoading } from '../../components/loading';
import { getAll } from '../../axios-api/studentData'
import CloseIcon from '@mui/icons-material/Close';

function FunctionBar({date,setDate,student,setStudent}){
    const accessRange = useSelector(store => store.accessRangeReducer)
    const [studentAll,setStudentAll] = useState(null)
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
            setStudentAll(data.data);
          });
    },[])
    return(
       <Box display={"flex"} gap={"25px"} flexWrap={"wrap"}>
          {accessRange?.inform?.name !== "學生" && studentAll &&
                <FormControl>
                    <InputLabel id="demo-simple-select-label">學生</InputLabel>
                    <Select onChange={(e) => {
                        setStudent(e.target.value)
                    }}
                        value={student || ""}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="學生"
                        defaultValue={1} sx={{ width: "120px" }}

                    >
                        {studentAll && studentAll.map((item) => {
                            return (
                                <MenuItem key={item.Tb_index} value={item.Tb_index} style={{ paddingLeft: "8px" }}>
                                    {item.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            }
        <TextField
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
        />
       </Box>
    )
}



function RecordList({date,student}) {


    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const userId = useSelector(state => state.accessRangeReducer)

    const [listData, setListData] = useState(null)

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
            hide: isMobile
        },
        {
            field: "c_name",
            headerName: "課堂名稱",
            flex: isMobile ? 0.5 : 1,
            cellClassName: "name-column--cell",
            
        },
        {
          field: "room_name",
          headerName: "教室",
          flex: isMobile ? 0.3 : 1,
          hide: isMobile
      },
        {
            field: "c_date",
            headerName: "日期",
            flex: isMobile ? 0.4 : 1,
   
        },
       
        {
            field: "class-time",
            headerName: "上課時間",
            flex: isMobile ? 0.6 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        <p>{rows.row.StartTime}~{rows.row.EndTime}</p>
                    </Box>
                )
            }
        },
        {
            field: "teacher_sign",
            headerName: "老師出席狀況",
            flex: isMobile ? 0.6 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"}  gap={"12px"} width="100%" sx={{
                        "& .box":{
                            display:"flex",
                            gap:"10px",
                            flexWrap:"wrap",
                            "& div":{
                                display:"flex",
                                gap:"5px",
                                alignItems:"center",
                                "& .time":{
                                    fontSize:"14px",
                                    fontWeight:"500"
                                }
                            }
                        }
                    }}>
                        <Box className='box' >
                        <Box>
                                <p>簽到:</p>
                                {rows.row.teacher.signin_time ? <p className='time'>{rows.row.teacher.signin_time.split(" ")[1]}</p>  :<CloseIcon/>}
                            </Box>
                            <Box>
                                <p>簽退:</p>
                                {rows.row.teacher.signout_time ? <p className='time'>{rows.row.teacher.signout_time.split(" ")[1]}</p>  :<CloseIcon/>}
                            </Box>
                        </Box>
                    </Box>
                )
            }
        },
        {
            field: "student_sign",
            headerName: "學生出席狀況",
            flex: isMobile ? 0.6 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"}  gap={"12px"} width="100%" sx={{
                        "& .box":{
                            display:"flex",
                            gap:"10px",
                            flexWrap:"wrap",
                            "& div":{
                                display:"flex",
                                gap:"5px",
                                alignItems:"center",
                                "& .time":{
                                    fontSize:"14px",
                                    fontWeight:"500"
                                }
                            }
                        }
                    }}>
                        <Box  className='box' >
                            <Box>
                                <p>簽到:</p>
                                {rows.row.student.signin_time ? <p className='time'>{rows.row.student.signin_time.split(" ")[1]}</p>  :<CloseIcon/>}
                            </Box>
                            <Box>
                                <p>簽退:</p>
                                {rows.row.student.signout_time ? <p className='time'>{rows.row.student.signout.split(" ")[1]}</p>  :<CloseIcon/>}
                            </Box>
                        </Box>
                    </Box>
                )
            }
        },
    ];

    //獲取列表資料
    useEffect(() => {
      const dates = new Date()
      const today = `${dates.getFullYear()}-${dates.getMonth()+1}-${dates.getDate()}`;
       if(userId.inform){
        if(userId.inform.name !=="學生" && student){
            get_student_course_history_one({student_id:student,StartDate:date?.StartDate ? date.StartDate :today,EndDate:date?.EndDate ? date.EndDate : today}).then((res) => {
                setListData(res.data)
            })
        }else{
            get_student_course_history_one({student_id:userId.inform.Tb_index,StartDate:date?.StartDate ? date.StartDate :today,EndDate:date?.EndDate ? date.EndDate : today}).then((res) => {
                setListData(res.data)
            })
        }
       }
    }, [userId,date,student])

    useEffect(()=>{
      if(listData){
        console.log(listData)
      }
    },[listData])
    return (
      
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
            {listData ? <DataGrid rowHeight={isMobile ? 135 : 100} rows={listData} getRowId={(row) => row.index} columns={columns} sx={{minWidth:"550px"}}/> : <IsLoading />}
        </Box>
    )
}

export default function ClassHistory() {
  const [date,setDate] = useState(null)
  const [student,setStudent] =useState(null)
    return (
        <div style={{ width: '95%', margin: '20px auto 0' }}>
            <Header title="課堂軌跡" subtitle="紀錄歷史上課狀況" />
            <Box display={"flex"} alignItems={"center"} sx={{
                width:"fit-content",
                "& span":{
                    marginTop:"5px"
                }
            }}>
               <FunctionBar student={student} setStudent={setStudent} date={date} setDate={setDate}/>
            </Box>

            <RecordList date={date} student={student}/>
        </div>
    )
}
