import React from "react";
import SelectCalendar from "../calendar/selectCalendar";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, TextField, useMediaQuery, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { TimeSelect } from "../calendar/calendar";
import { getCourseAll } from "../../axios-api/calendarData";
import { dataTransformTable, formatDateBack } from "../calendar/getMonday";
import { IsLoading } from "../../components/loading";
import Select from '@mui/material/Select';
import * as changeApi from "../../axios-api/changeSystem"
import { useDispatch, useSelector } from "react-redux";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { getOne } from "../../axios-api/calendarData";
import * as teacherApi from "../../axios-api/teacherData";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MultiSelect from '../../lib/multiSelect';
import * as studentApi from "../../axios-api/studentData"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousSharpIcon from '@mui/icons-material/DangerousSharp';
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp';
import { snackBarOpenAction, notificationListAction } from "../../redux/action";
import useAuthorityRange from '../../custom-hook/useAuthorityRange';

//-- 顯示指定日期的課堂 --
function OpenSelectClass({teacher=null, date=null, isSelect=false, setClassDate, data, setData, type =null}){
    const [listData,setListData] = useState(null)
    const userData = useSelector(state => state.accessRangeReducer)
    const newDate = new Date(date)
    const handleCancel=()=>{
        setClassDate(null)
    }
    useEffect(()=>{
        if(date && userData){
            
            changeApi.select_course({
                c_date:`${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`,
                teacher_id: teacher ? teacher : userData.inform.Tb_index,
                isSelect:isSelect
            },(data)=>{
                // console.log(userData)
                setListData(data.data.data)
            })
        }
    },[date])
    
    return(
        <>
        <Dialog open={date !== null ? date : false} onClose={()=>setClassDate(null)}
        sx={{
            "& .MuiPaper-root": { padding: " 10px 25px" },
            "& label": {
                fontSize: "16px"
            },
            "& .MuiDialog-container > .MuiPaper-root": {
                padding: " 10px 25px",
                width: "100%",
                maxWidth: "650px",
            },
            "& ul":{
                width:"100%",
                padding:0,
                border:"1px solid #000",
                borderBottom:"none",
                "& li":{
                    display:"flex",
                    listStyle:"none",
                    width:"100%",
                    "& .box":{
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        width:"28%",
                        height:"45px",
                        borderBottom:"1px solid #000",
                        "& label":{
                            margin:0
                        },
                        "& p":{
                            textAlign:"center",
                            margin:0,
                            lineHeight:1
                        },
                        "&.radio":{
                            width:"16%"
                        }
                    }
                }
            }
        }}>
        {listData ?
        <RadioGroup
             row
             aria-labelledby="demo-row-radio-buttons-group-label"
             name="row-radio-buttons-group"
             onChange={(e) => {
                if(type !== "換課"){
                    setData({
                        ...data,
                        course_id:e.target.value
                    })
                }else{
                    setData({
                        ...data,
                        change_course_id:e.target.value
                    })
                }
                
             }}
             value={data.radio}
         >
            <h4>{`${newDate.getFullYear()}年${newDate.getMonth()+1}月${newDate.getDate()}日課堂`}</h4>
            <ul>
                <li>
                    <div className="box">學生</div>
                    <div className="box">教室</div>
                    <div className="box">上課</div>
                    <div className="box radio">選擇</div>
                </li>
         {listData.map((item)=>{
            return(
            <li key={item.Tb_index}>
                <div className="box"><p>{
                    item.student.map((student)=>{
                        return ( <span style={{margin:'0 5px'}}>{student.name}</span> )
                    })    
                }</p></div>
                <div className="box"><p>{item.room_name}</p></div>
                <div className="box"><p>{item.StartTime}</p></div>
                <div className="box radio">
                    {
                        item.change_id==null || item.change_status==100 ? 
                        <FormControlLabel value={item.Tb_index} control={<Radio  />}  />
                        :
                        "已有異動單"
                    }
                    
                </div>
            </li>
            )
         })}
     </ul>
     <DialogActions sx={{display:"flex",width:"100%",padding:0,ustifyContent:"flex-end", "& button": { fontSize: "15px",padding:0 } }}>
                        <Button onClick={handleCancel}>確認</Button>
    </DialogActions>
     </RadioGroup>:<IsLoading/>    
            }
               
        </Dialog>
      
        </>
     
    )
}

//-- 顯示選定的課堂 --
function TargetClass({course_id,teacher=null,setTeacher=()=>{},type=null,beforeData=null}){
    const [courseData,setCourseData]=useState(null)
    useEffect(()=>{
        //calendarApi
            getOne(course_id,(data)=>{
            
                if(teacher !==null){
                    setTeacher(data.data.data[0].teacher_id)
                }
                setCourseData(data.data.data[0])
            })
        
    },[course_id])
    return(
    <>
        {(((courseData && beforeData)) || (courseData && type !== "history"))
        &&
            <>
            <Box sx={{
                 "& ul":{
                    width:"100%",
                    padding:0,
                    border:"1px solid #000",
                    borderBottom:"none",
                    "& li":{
                        display:"flex",
                        listStyle:"none",
                        width:"100%",
                        "& .box":{
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            width:"25%",
                            height:"45px",
                            borderBottom:"1px solid #000",
                            textAlign:"center",
                            "& label":{
                                margin:0
                            },
                            "& p":{
                                textAlign:"center",
                                margin:0,
                                lineHeight:1
                            }
                        }
                    }
                }
            }}>
               <ul>
                    <li>
                        <div className="box">學生</div>
                        <div className="box">日期</div>
                        <div className="box">教室</div>
                        <div className="box">上課</div>
                    </li>
                    <li>
                       {type !== "history" ? 
                       <>
                        <div className="box">{
                            courseData.student.map((student)=>{
                                return ( <span>{student.name}</span> )
                            })
                        }</div>
                        <div className="box">{courseData.c_date}</div>
                        <div className="box">{courseData.room_name}</div>
                        <div className="box">{courseData.StartTime}</div>
                       </>
                       :
                       <>
                        <div className="box">{
                            courseData.student.map((student)=>{
                                return ( <span>{student.name}</span> )
                            })
                        }</div>
                        <div className="box">{beforeData?.before_date}</div>
                        <div className="box">{beforeData?.before_room_name}</div>
                        <div className="box">{beforeData?.before_StartTime}</div>
                       </>
                       
                    }
                    </li>
                </ul>
            </Box>
            </>
        }
    
    </>
    
    )
}

function TargetTeacher({teacher,setTeacher}){
    const [teacherAll,setTeacherAll] = useState(null)
    
    useEffect(()=>{
        teacherApi.getAll().then((data) => {
            setTeacherAll(data.data);
          });
    },[])
    return(
       <>
         {teacherAll &&
                  <FormControl fullWidth  sx={{width:"fit-content"}}>
                    <InputLabel id="demo-simple-select-label">老師</InputLabel>
                    <Select onChange={(e) => {
                      setTeacher(e.target.value)
                    }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={teacher}
                      label="老師"
                      sx={{ width: "120px", maxWidth: "300px", "& .MuiButtonBase-root": { padding: "0 16px" } }}>
                      {teacherAll.map((item, i) => (
                        <MenuItem key={item.Tb_index} value={item.Tb_index} >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
       </>
    )
}


function OpenSelectCalendar({setData}){
    const [currentDate, setCurrentDate] = useState(null)
    const [tableData,setTableData] = useState(null)
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    useEffect(() => {
        if (currentDate) {
            //獲取calendar的資料
            getCourseAll(formatDateBack(currentDate), formatDateBack(currentDate)).then((data) => {
            setTableData(dataTransformTable(data.data));
          })
        }
      }, [currentDate])
    return(
        <>
       
          <Box display={"flex"} alignItems={"center"}>
                <p style={{ color: "red", fontSize: "13px", letterSpacing: "0.1em", margin: "0px 5px 6px 0" }}>(時間與教室透過右邊行事曆選擇)--{'>'}</p>
                <TimeSelect setCurrentDate={setCurrentDate} />
            </Box>
            {currentDate &&
                <Dialog open={currentDate !==null ? currentDate :false} onClose={() => setCurrentDate(null)} sx={{
                  "& .MuiPaper-root": isMobile ? {
                    maxWidth: "100%",
                    width: "100%",
                    margin: 0
                  } : {
                    maxWidth: "700px",
                    padding: "25px"
                  }
                }}>
                  {tableData ? <SelectCalendar tableData={tableData} setData={setData} currentDate={currentDate} setCurrentDate={setCurrentDate}></SelectCalendar> : <IsLoading />}
                </Dialog>
              }
        </>
    )
}

function Process({data,isMobile,crud}){
    const [open,setOpen] = useState(false)
    const style = isMobile ? {
        position:"absolute",
        backgroundColor:"#fff",
        left:open ? "auto": "100%" ,
        right:open ? "0": "auto" ,
        top:0,
        padding:"40px",
        boxShadow:"0 0 10px 1px #000",
    }:{}
    return(
        <>
        {/* main content */}
            <Box sx={{
            flexGrow:1,
            padding:"25px 0 0 20px",
            ...style,
            "& .box":{
                display:"flex",
                alignItems:"center",
                gap:"20px",
                "& .left":{
                    display:"flex",
                    position:"relative",
                    alignItems:"center",
                    width:"fit-content",
                    "& .line":{
                        position:"absolute",
                        display:"none",
                        width:"1px",
                        height:"80px",
                        top:"80%",
                        left:0,
                        right:0,
                        margin:"0 auto",
                        backgroundColor:"#000"
                    }
                },
                "& .right":{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    "& p":{
                        margin:0
                    }
                },
                "&:not(:last-child)":{
                    marginBottom:"30px",
                    "& .line":{
                        display:"block",
                    }
                },
                "&:nth-child(1)":{
                    "& .left":{
                        "& .line":{
                            height:"57px"
                        }
                    }
                }
            }
        }}>
            <Box  className="box">
                <div className="left">
                    <MailOutlineIcon/>
                    <div className="line"></div>
                </div>
                <div className="right">
                    <p>{data.admin_name} - {crud === "storage"? "暫存" : "送件"}</p>
                </div>
            </Box>
            {data.record.map((item)=>{
                    return(
                        <Box  className="box">
                            <div className="left">
                                {item.record_type !== "駁回" ? <CheckCircleIcon sx={{fill:"#6DC4C5"}}/>:<DangerousSharpIcon sx={{fill:"#c87B79"}}/>}
                                <div className="line"></div>
                            </div>
                            <div className="right">
                                <p>{item.record_type}日期 - {item.keyindate}</p>
                                <p>{item.name} - {item.record_type}</p>
                                <p>備註 : {item.c_remark}</p>
                            </div>
                        </Box>
                    )
                })}
            </Box>
        {/* toggle btn */}
           {isMobile&&
            <Box display={"flex"} alignItems={"center"}  sx={{position:"absolute",right:"15px",top:"5px"}} onClick={(e)=>{
                if(open){
                    setOpen(false)
                }else{
                    setOpen(true)
                }
            }}>
                <ArrowLeftSharpIcon sx={{transform:open?"rotateY(180deg)":"none",width:"40px",height:"40px",marginRight:"-10px"}}/>
                <p style={{margin:0,fontSize:"15px"}}>{open ? "收合" : "展開"}</p>
            </Box>
           }
        </>
    )
}


export default function ChangeSheet({sheetId,crud,setListData}){
    const [open,setOpen] = useState(false)
    //獲取使用者資訊
    const userData = useSelector(state => state.accessRangeReducer)
      //主要後續傳後端的data
      const [data,setData] = useState({})
    //異動課堂
    const [classDate,setClassDate] = useState(null)
    //互換課堂
    const [teacher,setTeacher] = useState(null)
    const [classDate2,setClassDate2] = useState(null)
  
    //欲調課的位置
    const [newClass,setNewClass] = useState({})

    //簽核留言位置
    const [message,setMessage] = useState(null)

    const [studentAll, setStudentAll] = useState([]);
    const [teacherAll, setTeacherAll] = useState([]);

    const [currentDate, setCurrentDate] = useState(null)

     //權限
     const { accessData, accessDetect } = useAuthorityRange()
     const [authorityRange, setAuthorityRange] = useState({})
  
        //獲取權限範圍
        useEffect(() => {
            if (accessData) {
                const result = accessDetect(accessData, "課表異動管理")
                setAuthorityRange({
                    p_delete: result?.p_delete === "1" ? true : false,
                    p_insert: result?.p_insert === "1" ? true : false,
                    p_update: result?.p_update === "1" ? true : false,
                })
            }
        }, [accessData])

    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕

    const dispatch = useDispatch(null)

    const handleCancel = ()=>{
        setData({})
        setOpen(false)
    }

    useEffect(()=>{
        studentApi.getAll().then((data) => {
            setStudentAll(data.data);
          });
        teacherApi.getAll().then((data) => {
            setTeacherAll(data.data);
        });
        
    }, [])
  


      useEffect(()=>{
        setData({
            ...data,
            change_date:newClass.c_date,
           change_StartTime:newClass.StartTime,
           change_EndTime:newClass.EndTime,
           change_room_name:newClass.room_name
        })
      },[newClass])

      useEffect(()=>{
        if(data?.change_type !== "1" && data?.change_type !== "4"){
            setNewClass({})
        }
        if (data?.change_type !== "2"){
            setTeacher(null)
            setData({
                ...data,
                change_course_id:undefined
            })
        }
      },[data.change_type])
  
     //-- 送出表單 --
     const handleSubmit = (status)=>{
        //status === 0 = > 暫存
          //status === 1 = > 送出
          const userId = userData.inform.Tb_index;
          const handleAjax = (status)=>{
            if(crud ==="insert"){
                
                changeApi.insert_course_transfer({
                    ...data,
                    admin_id:userId,
                    c_remark:data?.c_remark || " ",
                    change_status:status
                },(res)=>{
                    if(res.data.success){
                        dispatch(snackBarOpenAction(true, `${res.data.msg}`))
                        changeApi.get_course_transfer(userId,(res)=>{
                                setListData(res.data.data)
                        })
                        //-- 更新通知 --
                        dispatch(notificationListAction({reflash: true}))
                        handleCancel()
                    }
                    else{
                        dispatch(snackBarOpenAction(true, `${res.data.msg}`, 'error'))
                    }
                })
            }else{
                // console.log(data);
                changeApi.update_course_transfer({
                    ...data,
                    admin_id:userId,
                    c_remark:data?.c_remark || " ",
                    change_status:status,
                    Tb_index:sheetId,
                },(res)=>{
                    if(res.data.success){
                        dispatch(snackBarOpenAction(true, `${res.data.msg}`))
                        changeApi.get_course_transfer(userId,(res)=>{
                                setListData(res.data.data)
                        })
                        //-- 更新通知 --
                        dispatch(notificationListAction({reflash: true}))
                        handleCancel()
                    }
                    else{
                        dispatch(snackBarOpenAction(true, `${res.data.msg}`, 'error'))
                    }
                })
            }
          }

          
        if(window.confirm(status === "0" ? "是否要暫存此異動單" : "送出後不可再修改，確認是否送出此異動單")){
           
            if(data.change_type === "1"){
                if(data.course_id && data.change_date){
                    handleAjax(status)
                }else{
                    dispatch(snackBarOpenAction(true, "資料未完整，無法送出", 'error'))
                }
            }
            else if(data.change_type === "2"){
                if(data.course_id && data.change_course_id){
                    handleAjax(status)
                }else{
                    dispatch(snackBarOpenAction(true, "資料未完整，無法送出", 'error'))
                }
            }
            else if(data.change_type === "3"){
                if(data.course_id ){
                    handleAjax(status)
                }else{
                    dispatch(snackBarOpenAction(true, "資料未完整，無法送出", 'error'))
                }
            }
            else if(data.change_type === "4"){
                if(data.change_teacher_id && data.change_date && data.student){
                    handleAjax(status)
                }else{
                    dispatch(snackBarOpenAction(true, "資料未完整，無法送出", 'error'))
                }
            }
        }
     }
     
     //-- 簽到 --
     const handleSign = (status)=>{
            const userId =userData.inform.Tb_index
            changeApi.signIn_course_transfer({
                record_type:status,
                admin_id:userId,
                c_remark:message || " ",
                course_ch_id:data.Tb_index
            },(res)=>{
                if(res.data.success){
                    dispatch(snackBarOpenAction(true, `${res.data.msg}`))
                    changeApi.get_course_transfer(userId,(res)=>{
                        setListData(res.data.data)
                    })
                    //-- 更新通知 --
                    dispatch(notificationListAction({reflash: true}))
                    handleCancel()
            }
            })
     }

     
    return(
        <>
             <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", width: "85px", gap: "5px" }} onClick={(e) => {
                    e.stopPropagation()
                    if(sheetId){
                        changeApi.course_transfer_one(sheetId,(res)=>{
                            //console.log(res);
                            setData(res.data.data)
                        })
                    }
                    setOpen(true)
                }}>
                {crud !== "view" || crud !== "history" &&  "檢視"}
                {crud === "insert" && "新增"}
                {crud === "view" || crud === "history" && "檢視"}
                {(crud === "turndown" || crud ==="storage") && "修改"}
                {crud === "needApproval" && "簽核"}
          </Button >
          <Dialog open={open} onClose={handleCancel} sx={{
                "& .MuiPaper-root": { padding: " 10px 25px" },
                "& label": {
                    fontSize: "16px"
                },
                "& .MuiDialog-container > .MuiPaper-root": {
                    padding: " 10px 25px",
                    width: "100%",
                    maxWidth: "700px",

                },
            }}>
                {data ?
                    <Box display={"flex"}>
                        <Box sx={{width:(crud !== "turndown" && crud !== "insert")&&(!isMobile) ? "400px" : "100%"}}>
                        <DialogTitle sx={{ fontSize: "20px",padding:0 }}>
                            {crud === "insert" && "異動單新增"}
                            {crud === "view" || crud === "history" && "異動單檢視"}
                            {crud === "turndown" && "異動單修改"}
                            {crud === "needApproval" && "異動單簽核"}
                        </DialogTitle>
                        <DialogContent sx={{padding:0,margin:"10px 0"}}>
                          <FormControl fullWidth sx={{marginTop:'10px'}}>
                            <InputLabel id="demo-simple-select-label">事由</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="事由"
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            change_type:e.target.value
                                        })
                                    }}
                                    fullWidth
                                    value={data.change_type || ''} // 确保值不为 undefined
                                    inputProps={{ readOnly: crud  === "view" ||  crud === "history" || crud === "needApproval"}}
                                >
                                    <MenuItem value={"4"} >{"加課"}</MenuItem>
                                    <MenuItem value={"1"} >{"調課"}</MenuItem>
                                    <MenuItem value={"2"} >{"換課"}</MenuItem>
                                    <MenuItem value={"3"} >{"補簽"}</MenuItem>
                                </Select>
                          </FormControl>
                        </DialogContent>
                        
                        {data.change_type !== "4" &&
                            <DialogContent sx={{padding:0,margin:"10px 0"}}>
                            <InputLabel id="demo-simple-select-label"sx={{marginBottom:"5px"}}>異動課堂</InputLabel>
                            {crud !== "view" &&  crud !== "history" && crud !== "needApproval" &&
                                <Box display={"flex"} gap={"5px"} alignItems={"center"}>
                                    <p style={{ color: "red", fontSize: "13px", letterSpacing: "0.1em", margin: "0px 5px 6px 0" }}>(課堂日期透過右邊查詢)--{'>'}</p>
                                    <TimeSelect setCurrentDate={setClassDate}/>
                                </Box>
                            }

                            {
                            (data.course_id && crud === "history") ? <TargetClass course_id={data.course_id} type={crud} beforeData={data}/>  : <TargetClass course_id={data.course_id}/>
                            }
                            {
                            classDate &&<OpenSelectClass  date={classDate} setClassDate={setClassDate} setData={setData} data={data}/>
                            }
                            </DialogContent>
                        }
                        
                        {data.change_type === "1" &&
                            <DialogContent sx={{padding:0,margin:"10px 0"}}>
                                <InputLabel id="demo-simple-select-label" sx={{margin:"10px 0 5px"}}>欲調課至的課堂日期</InputLabel>
                            {crud !== "view" &&  crud !== "history" && crud!=="needApproval" &&
                                <OpenSelectCalendar setData={setNewClass}/>
                            }
                            <TextField
                            autoFocus
                            margin="dense"
                            id="c_date"
                            label="日期"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={data.change_date || " "}
                        
                            className='input'
                            />
                            <TextField
                            autoFocus
                            margin="dense"
                            id="room_name"
                            label="教室"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={data.change_room_name || " "}
                        
                            className='input'
                            />
            
                            <TextField
                            autoFocus
                            margin="dense"
                            id="StartTime"
                            label="課堂開始時間"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={data.change_StartTime || " "}
                        
                            className='input'
                            />
                            <TextField
                            autoFocus
                            margin="dense"
                            id="EndTime"
                            label="課堂結束時間"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={data.change_EndTime || " "}
                        
                            className='input'
                            />
                            </DialogContent>
                        }
                        {data.change_type === "2" &&
                            <DialogContent sx={{padding:0,margin:"10px 0"}}>
                                <InputLabel id="demo-simple-select-label"sx={{marginBottom:"20px"}}>互換的課堂</InputLabel>
                                <Box display={"flex"} gap={"5px"} alignItems={"center"} flexWrap={"wrap"} m={"5px 0 0 0"}>
                                    {crud !== "view" &&  crud !== "history" && crud !== "needApproval" &&
                                    <>
                                        {/* <TargetTeacher teacher={teacher} setTeacher={setTeacher} /> */}
                                        <p style={{ color: "red",display:"inline", fontSize: "13px", letterSpacing: "0.1em", margin: "0px 5px 6px 0" }}>(課堂資訊透過右邊查詢)--{'>'}</p>
                                        <TimeSelect setCurrentDate={setClassDate2}/>
                                    </>
                                    }
                                    
                                    {classDate2 &&
                                    <OpenSelectClass 
                                        //teacher={teacher} 
                                        isSelect={true} date={classDate2} setClassDate={setClassDate2} setData={setData} data={data} type={"換課"}/>}
                                </Box>
                                {data.change_course_id &&<TargetClass course_id={data.change_course_id} teacher={teacher} setTeacher={setTeacher}/>}
                            </DialogContent>
                        }
                        {data.change_type === "4" &&
                            
                            <DialogContent sx={{padding:0,margin:"10px 0"}}>

                                {teacherAll && <FormControl fullWidth sx={{marginTop:'10px'}}> 
                                    <InputLabel id="demo-simple-select-label">老師</InputLabel>
                                    <Select onChange={(e) => {
                                        setData({
                                            ...data,
                                            change_teacher_id: e.target.value,
                                        })
                                        }}
                                        inputProps={{ readOnly: !authorityRange.p_update || crud  === "view" ||  crud === "history" || crud === "needApproval"}}
                                        value={data.change_teacher_id}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="老師"
                                        sx={{ width: "80%", maxWidth: "300px", "& .MuiButtonBase-root": { padding: "0 16px" } }}>
                                        {teacherAll.map((item, i) => (
                                            <MenuItem key={item.Tb_index} value={item.Tb_index} >
                                            {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>}

                                
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="c_name"
                                    label="課程名稱"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            change_c_name: e.target.value,
                                        })
                                    }}
                                    value={data.change_c_name}
                                    InputProps={{
                                        readOnly: crud === "view" || crud === "history" || crud === "needApproval",
                                    }}
                                    />
                                <Box sx={{marginTop:'10px'}}>
                                    {studentAll &&  <MultiSelect studentAll={studentAll} data={data} setData={setData} type={crud} author={authorityRange.p_update} />}
                                </Box>
                                <Box flex={"0 0 100%"} sx={{marginTop:'10px'}}>
                                    <Typography variant="h5" component="h6">課堂時間及教室</Typography>
                                    {crud !== "view" &&  crud !== "history" && crud!=="needApproval" &&
                                        <OpenSelectCalendar setData={setNewClass}/>
                                    }
                                </Box>
                                <TextField
                                autoFocus
                                margin="dense"
                                id="c_date"
                                label="日期"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={data.change_date || " "}
                            
                                className='input'
                                />
                                <TextField
                                autoFocus
                                margin="dense"
                                id="room_name"
                                label="教室"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={data.change_room_name || " "}
                            
                                className='input'
                                />
                
                                <TextField
                                autoFocus
                                margin="dense"
                                id="StartTime"
                                label="課堂開始時間"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={data.change_StartTime || " "}
                            
                                className='input'
                                />
                                <TextField
                                autoFocus
                                margin="dense"
                                id="EndTime"
                                label="課堂結束時間"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={data.change_EndTime || " "}
                            
                                className='input'
                                />
                            </DialogContent>
                        }
        
                        <DialogContent sx={{padding:0,margin:(isMobile && crud === "needApproval")?"10px 0 60px":"10px 0"}}>
                        <InputLabel id="demo-simple-select-label">備註</InputLabel>
                                <TextField
                                    margin="dense"
                                    id="remark"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            c_remark: e.target.value,
                                        })
                                    }}
                                    value={data.c_remark}
                                    InputProps={{
                                        readOnly: crud === "view" || crud === "history" || crud === "needApproval",
                                    }}
                                />
                        </DialogContent>   
                        {(crud !== "view" &&  crud !== "history" && crud !== "needApproval") ?
                            <DialogActions  sx={{display:"flex",width:"100%",justifyContent:"space-between" }}>
                            <Button onClick={()=>handleSubmit("0")} sx={{padding:0,width:"fit-content",marginLeft:"-5px",border:"1px solid #1a1a1a",fontSize:"14px"}}>暫存</Button>
                            <Box display={"flex"} sx={{"& button": { fontSize: "16px" }}}>
                                <Button onClick={()=>handleSubmit("1")}>送出</Button>
                                <Button onClick={handleCancel}>取消</Button>
                            </Box>
                        </DialogActions> 
                        :
                        <DialogActions  sx={{display:"flex",width:"100%",justifyContent:"flex-end" ,position:"relative",zIndex:"15",pointerEvents:"none"}}>
                            <Box display={"flex"} sx={{"& button": { fontSize: "16px" ,pointerEvents:"auto"}}}>
                                <Button onClick={handleCancel}>返回</Button>
                            </Box>
                        </DialogActions> 
                        }
        
                        {crud === "needApproval" && 
                                <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} gap={"10px"} sx={{position:"absolute",left:"25px",bottom:"20px","& button":{fontSize:"15px"}}}>
                                    <Box display={"flex"} gap={"5px"}>
                                        <Button variant="contained"  sx={{ backgroundColor: "#6DC4C5"}} onClick={()=>{
                                            if(window.confirm("簽核後無法再取消，是否要簽核此異動單?")){
                                                handleSign("100")
                                            }
                                        }}>
                                                簽核
                                        </Button>
                                        <Button variant="contained"  sx={{ backgroundColor: "#c87B79"}} onClick={()=>{
                                            if(window.confirm("駁回後無法再取消，是否要駁回此異動單?")){
                                                handleSign("9")
                                            }
                                        }}>
                                                駁回
                                        </Button>
                                    </Box>
                                <DialogContent sx={{padding:0,width:"250px"}}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        type="text"
                                        variant="standard"
                                        onChange={(e) => {
                                            setMessage(
                                                e.target.value
                                            )
                                        }}
                                        value={message}
                                        placeholder="留言"
                                    />
                                </DialogContent>  
                                </Box>
                        }
                        </Box>
                        {data.record && <Process data={data} isMobile={isMobile} crud={crud}/>}
                    </Box>
              :<IsLoading/>
            }
          
          </Dialog>
        </>
    )
}

