import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, DateRangeIcon, LocalizationProvider } from '@mui/x-date-pickers'
import { Box, Button, Dialog, useMediaQuery, Badge } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { convertToChineseNumber, getWeekInfoForDate } from '../calendar/getMonday'
import * as recordListApi from "../../axios-api/recordList"
import { useTheme } from '@emotion/react'
import { tokens } from '../../theme'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { IsLoading } from '../../components/loading';
import CloseIcon from '@mui/icons-material/Close';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RemarkUpdated from './remark_updated'
import AddPractice from './addPractice'
import useAuthorityRange from '../../custom-hook/useAuthorityRange'
import {notificationListAction} from '../../redux/action'
import TextWithNewlines from '../../components/nl2br'

function DateSelector({setDate}) {
    const [data, setData] = useState({})
    const [open, setOpen] = useState(false)
    const navigate=useNavigate(null)
    const handleChange = (e) => {
        const date = new Date(e)
        let monday = getWeekInfoForDate(date);
        setData({
          monday:`${monday.year}-${monday.month}-${monday.day}`,
          weekNumber:monday.weekNumber
        })
    }
    const handleCancel = () => {
      setOpen(false)
    }
    const handleSubmit = () => {
      navigate('/class-record/all')
      setDate(data)
      handleCancel()
    }
    return (
      <>
        <DateRangeIcon onClick={() => {
          setOpen(true);
        }} sx={{cursor:"pointer",padding:"5px",width:"33px",height:"33px"}}/>
        <Dialog open={open} onClose={handleCancel} >
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} position={"relative"} zIndex={10} width={"100%"} height={"100%"} left={0} top={0}
            onClick={handleCancel}
          >
            <Box width={"fit-content"} p={"25px"}
              sx={{
                backgroundColor: "#fff",
                boxShadow: "0 0 10px 1px rgba(0,0,0,0.3)",
  
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
                <DateCalendar onChange={handleChange} />
                <Box display={"flex"} justifyContent={"flex-end"} width={"94%"}>
                  <Button onClick={handleSubmit}>OK</Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </Box>
              </LocalizationProvider>
            </Box>
  
          </Box>
        </Dialog>
  
  
      </>
  
    );
  }

function RecordSheet({studentData, record=null}){
  const [open,setOpen] = useState(false);
  const [recordData,setRecordData] = useState(null)
  const userData = useSelector(state => state.accessRangeReducer)
  const dispatch = useDispatch(null)
  const handleClose = ()=>{
    setOpen(false)
  }
  //權限
  const { accessData, accessDetect } = useAuthorityRange()
  const [authorityRange, setAuthorityRange] = useState({})

  //獲取權限範圍
  useEffect(() => {
      if (accessData) {
          const result = accessDetect(accessData, "上課紀錄表")
          setAuthorityRange({
              p_delete: result.p_delete === "1" ? true : false,
              p_insert: result.p_insert === "1" ? true : false,
              p_update: result.p_update === "1" ? true : false,
          })
      }
  }, [accessData])


  return(
    <>
    <Box sx={{textAlign:'center'}}>
      <Badge variant="dot" color="error" invisible={studentData.student_id!==record?.student_id}>
      {/* <Badge variant="dot" color="error" invisible={record===null}> */}
        <Button className='studentBtn' sx={{backgroundColor:"transparent",color:"#000",boxShadow:"none",borderRadius:"0",width:"150px",padding:"10px",margin:"0 auto"}} onClick={() => {
                recordListApi.get_course_record_one(studentData.student_record_id,(res)=>{
                   //console.log(res.data.data)
                  // console.log(userData)
                  setRecordData(res.data.data[0])
                  })
              setOpen(true)
          }
          }>
          {studentData.name}
        </Button>
      </Badge>
    </Box>
    
       
  <Dialog open={open} onClose={handleClose} sx={{
      "& .MuiDialog-container > .MuiPaper-root": {
          maxWidth: "750px",
          width: "95%",
          padding: "35px 0",
      }
  }}>
      <CloseIcon sx={{ position: "absolute", cursor: "pointer", right: "5px", top: "5px", width: "25px", height: "25px", zIndex: 99 }} onClick={(e) => {
          e.stopPropagation()
          setOpen(false)
      }} />
      {recordData&&userData ? 
      <Box width={"92.5%"} m={"0 auto"} sx={{
        "& .record-title":{
          width:"100%",
          // textAlign:"center"
        },
        "& .remark-area":{
          textAlign:"justify",
          letterSpacing:"0.1em",
          lineHeight:"1.65em"
        },
        "& .practice-total":{
          marginTop:0,
          width:"100%",
          // textAlign:"center",
          "& span":{
            padding:"0 6px 1px",
          }
        },
        "& .practice":{
          width:"100%",
          listStyle:"none",
          padding:0,
          border:"1px solid #000",
          "& li":{
            display:"flex",
            alignItems:"center",
            width:"100%",
            flexWrap: 'wrap',
            "&:not(:last-child)":{
              borderBottom:"1px solid #000"
            }
          },
          "& li > div":{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            width:"calc(100% / 3)",
            height:"25px",
            "&:not(:last-child)":{
              borderRight:"1px solid #000"
            }
          },
          "& li .remark":{
            position:'relative',
            flex: '1 1 100%',
            height: 'auto',
            borderTop: '1px solid #000',
            justifyContent: 'flex-start',
            padding: '3px 10px',
            background: '#effeff',
            "& span":{
              position: 'absolute',
              bottom: '5%',
              right: '1%',
              color: '#7bc4c9',
              fontWeight: 500,
              fontSize: '15px',
            }
          }
        },
        "& .sign":{
          border:"1px solid #000",
          "h4":{
            width:"100%",
            textAlign:"center",
            borderBottom:"1px solid #000",
            margin:"0",
            padding:"10px 0"
          },
          "& .sign-area":{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            width:"100%",
            height:"100px",
            "& img":{
              width:"50px",
              height:"auto"
            }
          }
        }
      }}>
        <Header title={ "巴雀藝術中心\n上課紀錄表" } subtitle={`課堂時間:${recordData.c_date} (星期${convertToChineseNumber(new Date(recordData.c_date).getDay())})\n學生姓名:${studentData.name}`} />
        <Box width={"100%"} position={"relative"} sx={{
          "& .remarkBtn":{
            position:"absolute",
            top:0,
            bottom:0,
            right:0,
            margin:"auto 0",
            cursor:"pointer",
          }
        }}>
        <h2 className='record-title'>本周功課及注意事項</h2>
        {!(recordData.admin_id || recordData.teacher_id) && (userData.inform.name === "老師" || userData.inform.name === "系統管理員")&& authorityRange.p_update && <RemarkUpdated data={recordData} setRecordData={setRecordData}/>}
        </Box>
        <p className='remark-area'>{recordData.remark? recordData.remark : "老師尚未填寫注意事項"}</p>
        <Box width={"100%"} position={"relative"} sx={{
          "& .practiceBtn":{
            position:"absolute",
            top:0,
            bottom:0,
            right:0,
            margin:"auto 0",
            cursor:"pointer",
          }
        }}>
     <h2 className='record-title' style={{marginBottom:0}}>本周練習時間</h2>
        {!(recordData.admin_id || recordData.teacher_id) && userData.inform.name === "學生" && authorityRange.p_update && <AddPractice data={recordData} setRecordData={setRecordData}/>}
     
        </Box>
   
        <p className='practice-total'>共<span>{`${recordData.record_time.length}`}</span>天</p>
        <ul className="practice">
          <li>
             <div className="date">日期</div>
             <div className="startTime">開始時間</div>
             <div className="endTime">結束時間</div>
          </li>
          {recordData.record_time.length > 0 ? recordData.record_time.map((item,i)=>{
            return(
              <li key={`date${i}`}>
                  <div className="date">{item.record_date}</div>
                  <div className="startTime">{item.StartTime}</div>
                  <div className="endTime">{item.EndTime}</div>
                  <div className='remark' style={{display: item.remark===null ? 'none':'flex'}}>
                    <TextWithNewlines text={item.remark} />
                    <span>{`${item.record_date}學生反饋`}</span>
                  </div>
              </li>
            )
          }):
          <li >
            <div className="date">尚未填寫</div>
            <div className="startTime">尚未填寫</div>
            <div className="endTime">尚未填寫</div>
          </li>
          }
        </ul>
          <Box className='sign' width={"100%"} display={"flex"} m={"15px 0 0 0"} border={"1px solid #000"}>
              <Box width={"50%"} borderRight={"1px solid #000"}>
                  <h4>巴雀藝術檢閱</h4>
                  {authorityRange.p_update &&
                  <div className="sign-area">
                  {recordData.admin_id ? <TaskAltIcon /> : userData.inform.name !== "學生" ?
                    <Button variant="contained" sx={{ backgroundColor: "#6DC4C5" }} onClick={() => {
                      if(userData.inform.name !== "學生" && userData.inform.name !== "老師"){
                        if(window.confirm("簽閱後不可再修改此紀錄表，是否要完成簽閱?")){
                          recordListApi.set_teacher_record_signIn({teacher_id:userData.inform.Tb_index,record_id:recordData.record_id},()=>{
                            recordListApi.get_course_record_one(studentData.student_record_id,(res)=>{
                              setRecordData(res.data.data[0])
                            })

                            //-- 更新通知 --
                            dispatch(notificationListAction({reflash:true}))
                          })
                          
                        }
                      }else{
                        window.alert("此欄位由巴雀藝術簽閱")
                      }
                     
                  }
                  }>簽閱</Button> : "巴雀藝術尚未簽閱"
                  }
              </div>
                  }
                 
              </Box>
              <Box width={"50%"}>
                  <h4>老師檢閱</h4>
                  {authorityRange.p_update &&
                     <div className="sign-area">
                     {recordData.teacher_id ? <TaskAltIcon /> : userData.inform.name !== "學生" ?
                       <Button variant="contained" sx={{ backgroundColor: "#6DC4C5" }} onClick={() => {
                         if(userData.inform.name === "老師"){
                           if(window.confirm("簽閱後不可再修改此紀錄表，是否要完成簽閱?")){
                             recordListApi.set_teacher_record_signIn({teacher_id:userData.inform.Tb_index,record_id:recordData.record_id},()=>{
                               recordListApi.get_course_record_one(studentData.student_record_id,(res)=>{
                                 setRecordData(res.data.data[0])
                               })

                               //-- 更新通知 --
                               dispatch(notificationListAction({reflash:true}))
                             })
                           }
                         }else{
                           window.alert("此欄位由課堂老師簽閱")
                         }
                     }
                     }>簽閱</Button>: "老師尚未簽閱"
                     }
                 </div>
                  }
               
              </Box>
          </Box>
      </Box> :<IsLoading/>
    }
       
  </Dialog>
    </>
 
  )
}


//-- 紀錄表按鈕 --
function RecordButton({studentData, record=null}){
  const [open,setOpen] = useState(false);
  const handleClose = ()=>{
    setOpen(false)
  }
  return(
    <>
      <Badge variant="dot" color="error" invisible={record===null}>
        <Button variant="contained" sx={{ backgroundColor: "#6DC4C5" }} onClick={() => {
              setOpen(true)
          }
        }>
            紀錄表
        </Button>
      </Badge>
       
      <Dialog open={open} onClose={handleClose} sx={{
          "& .MuiDialog-container > .MuiPaper-root": {
              maxWidth: "400px",
              width: "95%",
              padding: "80px 0",
          },
          "& .studentBtn:not(:last-child)":{
            marginBottom:"5px",
            borderBottom:"1px solid #ccc"
        
          }
      }}>
          <CloseIcon sx={{ position: "absolute", cursor: "pointer", right: "5px", top: "5px", width: "25px", height: "25px", zIndex: 99 }} onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
          }} />
          {studentData.map((item,i)=>{
            return(
              <RecordSheet studentData={item} record={record}/>
            )
          })}
      </Dialog>
    </>
 
  )
}

//-- 紀錄表按鈕(學生用) --
function  RecordButtonStudentVer({studentData, record=null}){
  const [open,setOpen] = useState(false);
  const userData = useSelector(state => state.accessRangeReducer)
  const handleClose = ()=>{
    setOpen(false)
  }

  return(
    <>
    <Badge variant="dot" color="error" invisible={record===null}>
      <Button variant="contained" sx={{ backgroundColor: "#6DC4C5" }} onClick={() => {
              setOpen(true)
            }
        }>
          紀錄表
      </Button>
    </Badge>
       
  <Dialog open={open} onClose={handleClose} sx={{
      "& .MuiDialog-container > .MuiPaper-root": {
          maxWidth: "400px",
          width: "95%",
          padding: "80px 0",
      },
      "& .studentBtn:not(:last-child)":{
        marginBottom:"5px",
        borderBottom:"1px solid #ccc"
     
      }
  }}>
      <CloseIcon sx={{ position: "absolute", cursor: "pointer", right: "5px", top: "5px", width: "25px", height: "25px", zIndex: 99 }} onClick={(e) => {
          e.stopPropagation()
          setOpen(false)
      }} />
      {userData&& studentData.map((item,i)=>{
        if(item.name === userData.inform.access){
          return(
            <RecordSheet studentData={item} record={record}/>
          )
        }
      })}
  </Dialog>
    </>
 
  )
}

function RecordList({date, listDataReview=undefined}) {


    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const userId = useSelector(state => state.accessRangeReducer)
 
    const [listData, setListData] = useState(null)
    
    //-- 提醒資料 --
    const notificationList = useSelector(state => state.notificationListReducer)

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
            field: "student",
            headerName: "學生",
            flex: isMobile ? 0.6 : 1,
            cellClassName: "name-column--cell",
            renderCell: (params) => {
              return (
                params.row.student.map((s_one)=>{
                  return (
                    <span style={{margin:"0px 5px"}}>{s_one.name}</span>
                  );
                })
              );
            },
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
            flex: isMobile ? 0.5 : 1,
   
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
            field: "modify",
            headerName: "紀錄",
            flex: isMobile ? 0.5 : 1,
            renderCell: (rows) => {
               
                const student_record=notificationList?.data?.student_record;
                const record_one= student_record!==null && student_record!==undefined ? 
                student_record.find((item)=>{
                  return rows.row.Tb_index===item.course_id
                })
                :
                null;

                //console.log(record_one);
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                      {(userId && userId.inform.name !== "學生") ?<RecordButton studentData={rows.row.student} record={record_one}/>:<RecordButtonStudentVer studentData={rows.row.student} record={record_one}/>}
                      
                    </Box>
                )
            }
        },
    ];
    

    //獲取列表資料
    // useEffect(() => {
    //   if(date!=undefined){
    //     recordListApi.get_teacher_course({userId:userId?.inform?.Tb_index, date:date.monday}).then((res) => {
    //         setListData(res.data)
    //     })
    //   }
    // }, [date])

  
    useEffect(()=>{
      if(listDataReview){
        console.log(listDataReview)
        setListData(listDataReview)
      }
    },[listDataReview])

    

    
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
            {listData ? <DataGrid rowHeight={isMobile ? 110 : 85} rows={listData} getRowId={(row) => row.index} columns={columns} /> : <IsLoading />}
        </Box>
    )
}

export default function ClassRecord() {
  const [date,setDate] = useState(null)
  const navigate=useNavigate(null)
  let monday = getWeekInfoForDate(new Date());
  const userId = useSelector(state => state.accessRangeReducer)
  const [listDataReview, setListDataReview]=useState(null);
  const params = useParams();

  
  function need_listData() {
    //-- 獲取需審閱的紀錄表 (老師) --
    if(userId.inform.admin_per==='group2023071815335388'){
      navigate('/class-record/log')
    }
    //-- 獲取需填寫的紀錄表 (學生) --
    else{
      navigate('/class-record/review')
    }
    
  }

  //-- 判斷網址參數、日期 --
  useEffect(()=>{
    //console.log(params);
    //-- 獲取需審閱的紀錄表 (老師) --
    if(params.type==='review'){
      recordListApi.get_teacher_course_review({userId:userId?.inform?.Tb_index}).then((res) => {
          setListDataReview(res.data)
      })
    }
    //-- 獲取需填寫的紀錄表 (學生) --
    else if(params.type==='log'){
      recordListApi.get_teacher_course_log({userId:userId?.inform?.Tb_index}).then((res) => {
          setListDataReview(res.data)
      })
    }
    else{
      if(date===null || date===undefined){
        const dates = new Date()
        const today = `${dates.getFullYear()}-${dates.getMonth()+1}-${dates.getDate()}`;
        recordListApi.get_teacher_course({userId:userId?.inform?.Tb_index,date:today}).then((res) => {
          setListDataReview(res.data)
        })
      }
      else{
        recordListApi.get_teacher_course({userId:userId?.inform?.Tb_index, date:date?.monday}).then((res) => {
          setListDataReview(res.data)
        })
      }
     
    }
  }, [params,date])

    return (
        <div style={{ width: '95%', margin: '20px auto 0' }}>
            <Header title="上課紀錄表" subtitle="請確實記錄" />
            <Box display={"flex"} alignItems={"center"} sx={{
                width:"fit-content",
                "& span":{
                    marginTop:"5px"
                }
            }}>
            <span >選擇日期:</span>
            <DateSelector setDate={setDate}/>
             <Button variant="contained" size="small" sx={{backgroundColor:'#2676b1', marginLeft:'5px'}} onClick={()=>{need_listData()}}>{ userId?.inform?.admin_per==='group2023071815335388' ? '需填寫的紀錄表' : '需審閱的紀錄表'}</Button>
            </Box>
            <h2 style={{fontWeight:"500",textAlign:"center"}}>
              { params.type==='log' ? `需填寫的紀錄表` : 
                params.type==='review' ? `需審閱的紀錄表` : 
                date === null ? `${monday.year}年${monday.month}月第${monday.weekNumber}週紀錄表` : `${date.monday.split("-")[0]}年${date.monday.split("-")[1]}月第${date.weekNumber}週紀錄表`
              }
            </h2>
            <RecordList date={date} listDataReview={listDataReview}/>
    
        </div>
    )
}
