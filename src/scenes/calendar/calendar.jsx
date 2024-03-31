
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import Header from '../../components/Header';
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, Select, Switch, TextField, Typography, useMediaQuery, Tooltip, IconButton, MenuItem, Autocomplete } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { getWeekInfoForDate, 
         getWeekDates, 
         formatDateBack, 
         convertToChineseNumber, 
         dataTransformTable, 
         addMinutesToTime, 
         calculateDifferenceIn15Minutes, 
         getContrastColor, 
         countMondaysInMonth, 
         getDateOfMondayInWeek } from './getMonday';
import * as calendarApi from "../../axios-api/calendarData"
import * as changeApi from "../../axios-api/changeSystem"
import MultiSelect from '../../lib/multiSelect';
import * as studentApi from "../../axios-api/studentData"
import * as teacherApi from "../../axios-api/teacherData"
import { IsLoading } from "../../components/loading";
import SelectCalendar from './selectCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { calendarDateAction, calendarTableDataAction, snackBarOpenAction, notificationListAction, askForLeaveCourseAction } from '../../redux/action';
import { get_course_template_list } from '../../axios-api/calendarTemplateData';
import useAuthorityRange from '../../custom-hook/useAuthorityRange';
import ChangeSheet from "../change-system/changeSheet";

//-- 日期選擇btn --
function SelectDate({setScrollNum}) {
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch(null)
  

  //-- 選擇日期 --
  const handleChange = (e) => {
    // const selectDate=new Date(getDateOfMondayInWeek(`${e.$y}-${e.$M+1}-${e.$D}`));
    const selectDate=new Date(`${e.$y}-${e.$M+1}-${e.$D}`);
    const monday_weekNumber = getWeekInfoForDate(selectDate);
    const startDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day;
    const endDate = formatDateBack(getWeekDates(startDate)[6]);
    setData({
      monday_weekNumber: monday_weekNumber,
      selectDate: `${e.$y}-${e.$M+1}-${e.$D}`,
      startDate: startDate,
      endDate: endDate,
    })
    // console.log({
    //   monday_weekNumber: monday_weekNumber,
    //   selectDate: `${e.$y}-${e.$M+1}-${e.$D}`,
    //   startDate: startDate,
    //   endDate: endDate,
    // });
  }

  const handleCancel = () => {
    setOpen(false)
  }

  //-- 確認日期 --
  const handleSubmit = () => {

    //-- 送到redux calendarDateAction --
    dispatch(calendarDateAction(data.monday_weekNumber))

    //-- 獲取期間課表資料送到redux calendarTableDataAction --
    calendarApi.getAll(data.startDate, data.endDate).then((data) => {
      dispatch(calendarTableDataAction(dataTransformTable(data.data)))
    })

    
    //-- 捲到指定位置 --
    let getday=new Date(data.selectDate);
        getday=getday.getDay()==0 || getday.getDay()>6 ? 6 : getday.getDay()-1;
    setScrollNum(getday)

    handleCancel()
  }



  useEffect(() => {
    if (open) {
      const monday_weekNumber = getWeekInfoForDate(new Date())
      const startDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day
      const endDate = formatDateBack(getWeekDates(startDate)[6])
      setData({
        monday_weekNumber: monday_weekNumber,
        startDate: startDate,
        endDate: endDate
      })
    }
  }, [open])

  return (
    <>
      <Button sx={{backgroundColor:'#1d7dc9'}} variant="contained" startIcon={<DateRangeIcon />} onClick={() => {
        setOpen(true);
      }}>
        選擇日期
      </Button>

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
              <DateCalendar onChange={handleChange}  />
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


//-- 匯入課表按鈕 --
function ImportTemplate() {
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)
  const [templateList, setTemplateList] = useState(null)
  const [copyNum, setCopyNum] = useState(1)
  const [ct_title, setCtTitle] = useState(null)
  const currentDate = useSelector(state => state.calendarReducer.currentDate)
  const dispatch = useDispatch(null)
  const handleCancel = () => {
    setCtTitle(null);
    setOpen(false)
    setCopyNum(1);
  }
  const handleSubmit = () => {
    const startDate = currentDate.year + "-" + currentDate.month + "-" + currentDate.day;
    const endDate = formatDateBack(getWeekDates(startDate)[6]);

    if(ct_title===null){
      dispatch(snackBarOpenAction(true, '請選擇公版課表', 'error'));
    }
    else if (window.confirm(`是否要在 "${currentDate.year}年${currentDate.month}月第${currentDate.weekNumber}週" 的課表中\n匯入'${ct_title}'公版課表\n並複製${copyNum-1}週`)) {
      //-- 指定月的第一週星期一日期 --
      //const firstMonday=getDateOfMondayInWeek(currentDate.year, currentDate.month, 1);
      calendarApi.import_course({
       // StartDate: `${firstMonday.getFullYear()}-${firstMonday.getMonth()+1}-${firstMonday.getDate()}`,
        StartDate: startDate,
        EndDate: endDate,
        ct_list_id: data.Tb_index,
        copyNum:copyNum
      }, (res) => {
        // console.log(res);
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          calendarApi.getAll(startDate, endDate).then((data) => {
            dispatch(calendarTableDataAction(dataTransformTable(data.data)))
          })
        }
      })
      handleCancel()
    }

  }

  //-- 刪除匯入課表 --
  const deletTemplateClass=()=>{
    const startDate = currentDate.year + "-" + currentDate.month + "-" + currentDate.day;
    const endDate = formatDateBack(getWeekDates(startDate)[6]);

    if(ct_title===null){
      dispatch(snackBarOpenAction(true, '請選擇公版課表', 'error'));
    }
    else if(window.confirm(`是否要在 "${currentDate.year}年${currentDate.month}月第${currentDate.weekNumber}週" 刪除匯入的'${ct_title}'公版課表\n共刪除${copyNum}週`)){
      calendarApi.delete_template_course({
        StartDate: startDate,
        EndDate: endDate,
        ct_list_id: data.Tb_index,
        copyNum:copyNum
      }, (res)=>{
          const status = res.data.success ? "success" : "error"
          dispatch(snackBarOpenAction(true, res.data.msg, status))
          if (res.data.success) {
            calendarApi.getAll(startDate, endDate).then((data) => {
              dispatch(calendarTableDataAction(dataTransformTable(data.data)))
            })
          }
      });
      handleCancel()
    }
    
    
  };


  useEffect(() => {
    get_course_template_list().then((data) => {
      setTemplateList(data.data)
    })
  }, [])



  return (
    <>
      <Button onClick={() => {
        setOpen(true)
      }}>
        匯入課表
      </Button>
      <Dialog open={open} onClose={handleCancel}>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} position={"relative"} zIndex={10} width={"100%"} height={"100%"} left={0} top={0}
          onClick={handleCancel}
        >
          <Box width={"fit-content"} p={"25px"}
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0 0 10px 1px rgba(0,0,0,0.3)",
              width:'350px'
            }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <DialogTitle sx={{ fontSize: "20px", paddingBottom: "2px" }}>{"公版課表匯入"}</DialogTitle>
            <DialogTitle sx={{ fontSize: "12px", padding: "0 24px 10px 24px", color: "red" }}>{"匯入的公版課表無法覆蓋已登記的課表"}</DialogTitle>
            <DialogContent sx={{ width: "100%", padding: "20px 24px !important" }} >
              {templateList &&
                <Box>
                  <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">公版課表</InputLabel>
                    <Select onChange={(e) => {
                      const selectedTbIndex = e.target.value;
                      const selectedTemplate = templateList.find(item => item.Tb_index === selectedTbIndex);
                      setCtTitle(selectedTemplate.ct_title)
                      setData({
                        ...data,
                        Tb_index: e.target.value,
                      })
                    }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="公版課表"
                      sx={{ width: "80%", maxWidth: "300px", "& .MuiButtonBase-root": { padding: "0 16px" } }}>
                      {templateList.map((item, i) => (
                        <MenuItem key={item.Tb_index} value={item.Tb_index} >
                          {item.ct_title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{marginTop:'20px'}}>
                     <InputLabel id="demo-simple-select-label2">匯入或刪除幾週</InputLabel>
                     <Select
                      labelId="demo-simple-select-label2"
                      label="匯入或刪除幾週"
                      value={copyNum}
                      onChange={(e)=>{
                        setCopyNum(e.target.value);
                      }}
                     >
                      <MenuItem value={1} >一週</MenuItem>
                      <MenuItem value={2} >二週</MenuItem>
                      <MenuItem value={3} >三週</MenuItem>
                      <MenuItem value={4} >四週</MenuItem>
                      <MenuItem value={5} >五週</MenuItem>
                     </Select>
                  </FormControl>
                </Box>
                
              }
            </DialogContent>
            <Box display={"flex"} justifyContent={"flex-end"} width={"94%"}>
              <Button color="error" sx={{margin:'0 5px'}} onClick={deletTemplateClass}>刪除公版課表</Button>
              <Button variant="contained" color="success" sx={{margin:'0 5px'}} onClick={handleSubmit}>匯入</Button>
              <Button sx={{margin:'0 5px'}} onClick={handleCancel}>取消</Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function TeacherColor ({data}){
  return(
    <Box display={"flex"} gap={"20px"} flexWrap={"wrap"}  m={"19px 0 0"}>
      {
          data.map((item)=>{
            return(
                <Box display={"flex"} gap={"5px"} alignItems={"center"} >
                  <span style={{lineHeight:0}}>{item.name}</span>
                  <div style={{backgroundColor:`${item.t_color}`,width:"13px",height:"13px",borderRadius:"50%",marginBottom:"2px"}}></div>
                </Box>
            )
        })
      }
    </Box>
  )
}

const CalendarTop = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch(null)
  const currentDate = useSelector(state => state.calendarReducer.currentDate)
  const tableData = useSelector(state => state.calendarReducer.tableData)
  const adminData = useSelector(state => state.accessRangeReducer)
  const isTest = useSelector(store => store.testReducer)
  const [studentAll, setStudentAll] = useState([]);
  const [teacherAll, setTeacherAll] = useState([]);
  const [autocompleteStudentAll, setAutocompleteStudentAll] = useState([]);
  const [searchStudent,setSearchStudent] =useState(null)
  const [prevMaxWeeks, setPrevMaxWeeks]=useState(0);
  const [maxWeeks, setMaxWeeks]=useState(0);
  const scrollRef = useRef(null)
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  let [scrollNum, setScrollNum] = useState(0);
  //儲存異動單list資料
  const [listData, setListData] = useState(null)
  //-- 顯示請假課程 --
  const [isAskForLeave_course, setIsAskForLeave_course] = useState(false)
  // const [askForLeave_course, setAskForLeave_course] = useState(null)
  const askForLeaveCourse = useSelector(state => state.calendarReducer.askForLeaveCourse)

  //-- 捲動到指定日期 --
  useEffect(()=>{
    if(scrollRef.current!=null){
      scrollRef.current.scrollTo(
        {
          left: isMobile ? `${400 * scrollNum}` : `${520 * scrollNum}`,
          behavior: 'smooth',
        }
      )
    }
  }, [scrollNum])

  //-- 查詢學生 --
  useEffect(()=>{
    if(currentDate!==null){
      const prevWeekMonday=getDateOfMondayInWeek(currentDate.year , currentDate.month , currentDate.weekNumber);
      const monday_weekNumber={
          year: prevWeekMonday.getFullYear(),
          month: prevWeekMonday.getMonth()+1,
          day: prevWeekMonday.getDate(),
          weekNumber: currentDate.weekNumber
      }

      const prevStartDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day;
      const prevEndDate = formatDateBack(getWeekDates(prevStartDate)[6]);

      //-- 送到redux calendarDateAction --
      dispatch(calendarDateAction(monday_weekNumber));

      //-- 獲取期間課表資料送到redux calendarTableDataAction --
      calendarApi.getAll(prevStartDate, prevEndDate).then((data) => {
        dispatch(calendarTableDataAction(dataTransformTable(data.data)))
      })
    }
    
  }, [searchStudent])


  //-- 顯示請假課程 --
  useEffect(()=>{

    if(isAskForLeave_course && currentDate!==null){
      const WeekMonday=getDateOfMondayInWeek(currentDate.year , currentDate.month , currentDate.weekNumber);
      const monday_weekNumber={
          year: WeekMonday.getFullYear(),
          month: WeekMonday.getMonth()+1,
          day: WeekMonday.getDate(),
          weekNumber: currentDate.weekNumber
      }

      const startDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day;
      const endDate = formatDateBack(getWeekDates(startDate)[6]);
      calendarApi.get_cover_askForLeave({
         s_date: startDate,
         e_date: endDate
        }, 
        (data) => {
          //  console.log(askForLeaveCourse)
           dispatch(askForLeaveCourseAction(dataTransformTable(data.data.data)))
          // setAskForLeave_course(dataTransformTable(data.data.data));
        })
    }
    else{
      dispatch(askForLeaveCourseAction(null))
    }
  }, [isAskForLeave_course])


  //-- 撈學生老師資料 --
  useEffect(() => {
    studentApi.getAll().then((data) => {
      setStudentAll(data.data);
      setAutocompleteStudentAll({
          options: data.data,
          getOptionLabel: (option) => option.name,
      });
    });
    teacherApi.getAll().then((data) => {
      setTeacherAll(data.data);
    });
  }, [])

  //-- 初始課程資料 --
  useEffect(() => {
    const initDate = getWeekInfoForDate(new Date())
    dispatch(calendarDateAction(initDate))
    const startDate = initDate.year + "-" + initDate.month + "-" + initDate.day
    const endDate = formatDateBack(getWeekDates(startDate)[6])
    calendarApi.getAll(startDate, endDate).then((data) => {
      //console.log(data.data)
      dispatch(calendarTableDataAction(dataTransformTable(data.data)))
    })
  }, [])


    //權限
    const { accessData, accessDetect } = useAuthorityRange()
    const [authorityRange, setAuthorityRange] = useState({})
  
    //獲取權限範圍
    useEffect(() => {
    
        if (accessData) {
            const result = accessDetect(accessData, "課表總覽")
            setAuthorityRange({
                p_delete: result?.p_delete === "1" ? true : false,
                p_insert: result?.p_insert === "1" ? true : false,
                p_update: result?.p_update === "1" ? true : false,
            })
        }
    }, [accessData])

    //-- 獲取最大周 --
    useEffect(()=>{
    
      if(currentDate){
        setPrevMaxWeeks(countMondaysInMonth(currentDate.month===1 ? currentDate.year-1 : currentDate.year, currentDate.month===1 ? 12 : currentDate.month-1));
        setMaxWeeks(countMondaysInMonth(currentDate.year, currentDate.month));
      }
    }, [currentDate])


    //-- 上一週 --
    function prevWeek() {

      // console.log('Max',maxWeeks, 'Num',currentDate.weekNumber+1, 'prevNum', prevMaxWeeks);
      // if(currentDate.weekNumber!==1){}
        
        const prevWeekMonday=getDateOfMondayInWeek(currentDate.year , currentDate.month , currentDate.weekNumber-1);

        //-- 新的年 --
        let newYear=currentDate.weekNumber === 1 && prevWeekMonday.getMonth()+1 === 1 ? prevWeekMonday.getFullYear()-1 : prevWeekMonday.getFullYear();
        //-- 新的月 --
        let newMonth
        if(prevWeekMonday.getMonth()+1 === 1){
          newMonth=currentDate.weekNumber === 1 ? 12 : prevWeekMonday.getMonth()+1
        }
        else{
          newMonth=currentDate.weekNumber === 1 ? prevWeekMonday.getMonth() : prevWeekMonday.getMonth()+1
        }
        //-- 新的日 --
        let newWeekNumber=currentDate.weekNumber === 1 ? prevMaxWeeks : currentDate.weekNumber-1

        const monday_weekNumber={
            year: newYear,
            month: newMonth,
            day: prevWeekMonday.getDate(),
            weekNumber: newWeekNumber
        }

        const prevStartDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day;
        const prevEndDate = formatDateBack(getWeekDates(prevStartDate)[6]);


        //-- 送到redux calendarDateAction --
        dispatch(calendarDateAction(monday_weekNumber));

        //-- 獲取期間課表資料送到redux calendarTableDataAction --
        calendarApi.getAll(prevStartDate, prevEndDate).then((data) => {
          dispatch(calendarTableDataAction(dataTransformTable(data.data)))
        })
      
    }

    //-- 下一週 --
    function nextWeek() {

      //setMaxWeeks(countMondaysInMonth(currentDate.year, currentDate.month));
      // if(currentDate.weekNumber < maxWeeks){}

        const nextWeekMonday=getDateOfMondayInWeek(currentDate.year , currentDate.month , currentDate.weekNumber+1);
        //-- 新的年 --
        let newYear=currentDate.weekNumber === maxWeeks && nextWeekMonday.getMonth()+1 === 12 ? nextWeekMonday.getFullYear()+1 : nextWeekMonday.getFullYear();
        //-- 新的月 --
        let newMonth
        if(nextWeekMonday.getMonth()+1 === 12){
          newMonth=currentDate.weekNumber === maxWeeks ? 1 : nextWeekMonday.getMonth()+1
        }
        else{
          newMonth=currentDate.weekNumber === maxWeeks ? nextWeekMonday.getMonth()+2 : nextWeekMonday.getMonth()+1
        }
        //-- 新的日 --
        let newWeekNumber=currentDate.weekNumber === maxWeeks ? 1 : currentDate.weekNumber+1

        const monday_weekNumber={
            year: newYear,
            month: newMonth,
            day: nextWeekMonday.getDate(),
            weekNumber: newWeekNumber
        }

        const nextStartDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day;
        const nextEndDate = formatDateBack(getWeekDates(nextStartDate)[6]);

         //-- 送到redux calendarDateAction --
        dispatch(calendarDateAction(monday_weekNumber));

        //-- 獲取期間課表資料送到redux calendarTableDataAction --
        calendarApi.getAll(nextStartDate, nextEndDate).then((data) => {
          dispatch(calendarTableDataAction(dataTransformTable(data.data)))
        })
    }
  
    //-- Today --
    const go_today=()=>{
      const monday_weekNumber = getWeekInfoForDate(new Date());
      const startDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day
      const endDate = formatDateBack(getWeekDates(startDate)[6])
      calendarApi.getAll(startDate, endDate).then((data) => {
        dispatch(calendarTableDataAction(dataTransformTable(data.data)))
      })
      dispatch(calendarDateAction(getWeekInfoForDate(new Date())))

      //-- 捲到指定位置 --
      let getday=new Date();
          getday=getday.getDay()==0 || getday.getDay()>6 ? 6 : getday.getDay()-1;
      setScrollNum(getday)
    }

  

  return (
    <Box m={"25px 0"} sx={
      {
        position: "relative",
        width: "100%",
        "& .title": {
          position: "relative",
          "& > .buttonBox button": {
            padding: "5px 16px",
            backgroundColor: colors.blueAccent[300],
            color: "#fff",
            fontSize: "14px"
          },
          "& h4": {
            fontSize: "22px",
            fontWeight: "400",
            margin: "0 auto"
          },
          "& .nav": {
            display: "flex",
            alignItems: "center",
            "& svg": {
              width: "46px",
              height: "auto",
              cursor: "pointer",
              padding: "8px",
            }
          }
        },
      }
    }>
      {currentDate && tableData ?
        <>
       
          <Box className='title' display={"flex"} width={"100%"} justifyContent={"space-between"} gap={"15px"} alignItems={"center"} flexWrap={"wrap"}>
            <Box display={"flex"} gap={"15px"} className='buttonBox' >
              <Button onClick={() => {go_today()}}>TODAY</Button>
              {authorityRange.p_update&&<ImportTemplate />}
              <Button sx={{backgroundColor:'#207c23 !important'}} onClick={()=>{
                const adminPer=adminData.inform.admin_per;
                const Tb_index=adminData.inform.Tb_index;
                const adminURL= adminPer=='group2023071815335388' || adminPer=='group2023071815332755' ? `&Tb_index=${Tb_index}&admin_per=${adminPer}` :'';
                const testUrl=isTest.test ? '&test=test' : '';
                window.open(`https://bratsche.web-board.tw/ajax/outputCourseExcel.php?year=${currentDate.year}&month=${currentDate.month}${adminURL}${testUrl}`, '_blank');
              }}>
                匯出Excel課表
              </Button>


            </Box>
            <Box display={"flex"} alignItems={"center"}>

              <IconButton onClick={(e)=>{prevWeek();}} aria-label="上一週" sx={{ 
                // opacity: currentDate.weekNumber===1 ? 0: 1 ,
                // visibility: currentDate.weekNumber===1 ? 'hidden': 'visible' ,
                backgroundColor:'#1d7dc9', 
                color:'#fff', 
                transform:'rotate(180deg)', 
                "&:hover":{backgroundColor:'#15629e',}}}><ArrowForwardIcon /></IconButton>

              <h4 style={{margin:'0 8px'}}>{`${currentDate.year}年${currentDate.month}月第${currentDate.weekNumber}週學生課表`}</h4>

              <IconButton onClick={(e)=>{nextWeek();}} aria-label="下一週" sx={{
                // opacity: currentDate.weekNumber===maxWeeks ? 0: 1 ,
                // visibility: currentDate.weekNumber===maxWeeks ? 'hidden': 'visible' ,
                backgroundColor:'#1d7dc9', 
                color:'#fff', 
                "&:hover":{backgroundColor:'#15629e',}}}><ArrowForwardIcon /></IconButton>

            </Box>
            <Box display={"flex"} justifyContent={"space-between"} gap={"15px"} m={isMobile ? "0 0 0 auto" : "0"}>
              <Box className="scroll-button" display={isMobile ? "none" : "flex"} justifyContent={"space-between"} alignItems={"center"} sx={
                {
                  gap: "10px",
                  pointerEvents: "none",
                  "& > div": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "10px",
                    borderRadius: "50%",
                    pointerEvents: "auto",
                    "& svg": {
                      width: "30px",
                      height: "30px",
                    },
                    "&:hover": {
                      backgroundColor: colors.blueAccent[200],
                      "& svg": {
                        fill: "#fff"
                      }
                    }
                  }
                }
              }>
                <div className="left" onClick={(e) => {
                  if (scrollNum > 0) {
                    // scrollNum = scrollNum - 1
                    setScrollNum(scrollNum - 1)
                  }
                  // scrollRef.current.scrollTo(
                  //   {
                  //     left: `${520 * scrollNum}`,
                  //     behavior: 'smooth',
                  //   }
                  // )
                }}>
                  <ArrowForwardIcon sx={{ transform: "rotateY(180deg)" }} />
                </div>
                <div className="right" onClick={(e) => {
                  //console.log(scrollRef)
                  if (scrollNum < (3640 - scrollRef.current.clientWidth) / 520) {
                    // scrollNum = scrollNum + 1
                    setScrollNum(scrollNum + 1)
                  }
                  // scrollRef.current.scrollTo(
                  //   {
                  //     left: `${520 * scrollNum}`,
                  //     behavior: 'smooth',
                  //   }
                  // )
                }}>
                  <ArrowForwardIcon />
                </div>
              </Box>
              <Box sx={{display:'flex', alignItems:'center', gap: "10px",}}>
                {/* 選擇日期 */}
                <SelectDate currentDate={currentDate} setScrollNum={setScrollNum} />

                {/* 新增異動單 */}
                {adminData?.inform?.position_type!=='3' ? <ChangeSheet crud={"insert"} setListData={setListData}/> : ''}

                {authorityRange.p_update&& <LessonPopUp type={"insert"} studentAll={studentAll} teacherAll={teacherAll}  />}
              </Box>
              
              
            </Box>
          </Box>
          <Box sx={{display:'flex', justifyContent:'space-between', flexDirection:{lg:'row', xs:'column'}, gap:{xs:'20px'}, paddingTop:'15px'}}>
            {teacherAll && <TeacherColor data={teacherAll}/>}
            <Box display={'flex'} gap={'20px'} alignItems={'flex-end'}>
              <Box>
                <FormControlLabel control={
                  <Switch
                   checked={isAskForLeave_course}
                   onChange={(e)=>{setIsAskForLeave_course(e.target.checked)}}
                   sx={{
                    '& .MuiSwitch-switchBase':{
                      color: '#eeeeee',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#c69e0e',
                      '&:hover': {
                        backgroundColor: '#c69e0e45',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#c69e0e',
                    },
                  }} />
                } label="顯示被取代的請假課程" />
              </Box>
               <Autocomplete
                {...autocompleteStudentAll}
                id="controlled-demo"
                // disableClearable
                onChange={(event, newValue) => {

                  setSearchStudent(newValue===null ? null: newValue.Tb_index);
                }}
                renderInput={(params) => (
                    <TextField {...params} label="查詢學生" variant="standard" />
                )}
                sx={{width:'200px'}}
                />
            </Box>
          </Box>
          
          <Calendar 
            ref={scrollRef} 
            tableData={tableData} 
            currentDate={currentDate} 
            studentAll={studentAll} 
            teacherAll={teacherAll} 
            searchStudent={searchStudent} 
            askForLeaveCourse={askForLeaveCourse} 
          />
        </>
        : <IsLoading />
      }

    </Box >
  )
}


/**
 * 日曆表格
 * @param tableData 有課程的日曆資料
 * @param currentDate 外部所選的日期資料
 * @param studentAll 所有學生
 * @param teacherAll 所有老師
 */
const Calendar = forwardRef(({ tableData, currentDate, studentAll, teacherAll, searchStudent=null, askForLeaveCourse=null }, ref) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  const classes = [
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "1F",
    "備"
  ]
  const lessonTime = [
    { start: "06:00", end: "07:00" },
    { start: "07:00", end: "08:00" },
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
    { start: "17:00", end: "18:00" },
    { start: "18:00", end: "19:00" },
    { start: "19:00", end: "20:00" },
    { start: "20:00", end: "21:00" },
    { start: "21:00", end: "22:00" },
    { start: "22:00", end: "23:00" },
  ]
  return (
    <>
      <Box className='calendar' display={"flex"} m={"20px 0 0"} sx={{
        width: "100%",
        height: "100vh",
        minHeight: "1020px",
        border: "1px solid #000",
        pointerEvents: "none",
        "& .calendar-time": {
          display: "flex",
          flexDirection: "column",
          width: "4%",
          minWidth: isMobile ? "40px" : "80px",
          borderRight: "1px solid #000",
          "& > :nth-of-type(1)": {
            display: "flex",
            alignItems: "center",
            padding: "0 5%",
            flexWrap: "wrap",
            "& p": {
              margin: 0,
              flex: "0 0 100%",
              "&:nth-of-type(1)": {
                textAlign: "end"
              },
            },
          },
          "& .hour-box": {
            "& > :not(:last-child)": {
              borderBottom: "1px solid #000"
            }
          }
        },
        "& .calendar-content": {
          pointerEvents: "auto",
          flexGrow: 1,
          "& .day-of-the-week": {
            display: "flex",
            flexDirection: "column",
            width: "calc(100%/7)",
            "&:not(:last-child)": {
              borderRight: "3px solid #000"
            },
            "& .calendar-date": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
              borderBottom: "1px solid #000",
              "& h6": {
                fontSize: "16px",
                margin: 0,
                fontWeight: "400"
              }
            },
            "& .calendar-square": {
              flexGrow: 1,
              pointerEvents: "auto",
              "& .calendar-y-axis": {
                "& .selected": {
                  backgroundColor: "#ffcdcd",

                },
                "& .selecting": {
                  backgroundColor: "#f5d9b2",

                },
                "&:not(:last-child)": {
                  borderRight: "1px solid #000"
                },
                "& .class-name": {
                  height: "40px",
                  borderBottom: "1px solid #000",

                  "& p": {
                    margin: 0,

                  }
                },
                "& .lesson-box": {
                  "&:not(:last-child)": {
                    borderBottom: "1px solid #000"
                  },
                  "&> div": {
                    position: "relative",
                    borderBottom: "1px solid #ccc",

                    "& .lesson-unit": {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",

                      zIndex: "99",
                      cursor: "pointer",

                    }
                  }
                }
              },

            }
          }

        }

      }}>
        <Box className='calendar-time'>
          <Box width={"100%"} height={"80px"} borderBottom={"1px solid #000"}>
            <p>日期</p>
            <p>時間</p>
          </Box>
          <Box flexGrow={1} className='hour-box'>
            {lessonTime.map((item, i) => {
              return (
                <Box key={item.start + item.end} className='hour' display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={`calc((100% - ${window.innerWidth <= 850 ? "0px" : "17px"}) / ${lessonTime.length})`}
                  sx={{
                    backgroundColor: i % 2 === 0 ? colors.primary[400] : "#fff"
                  }}
                >
                  <p style={{ margin: 0 }}>{`${item.start}-${item.end}`}</p>
                </Box>
              )
            })}

          </Box>

        </Box>

        <Box className='calendar-content' display={"flex"} overflow={"scroll"} ref={ref}>
          {getWeekDates(currentDate.year + "-" + currentDate.month + "-" + currentDate.day).map((date, i) => {
            const month = date.getMonth() + 1
            const day = date.getDate()
            return (
              <Box className='day-of-the-week' minWidth={isMobile ? "400px" : "520px"}>
                <Box className='calendar-date'>
                  {date && <h6>{`${month}月${day}日(星期${convertToChineseNumber(i + 1)})`}</h6>}
                </Box>
                <Box display={"flex"} className='calendar-square' >
                  {classes.map((class_type) => {
                    let count = 0
                    return (
                      <Box
                        key={class_type} // 設置唯一的key
                        style={{ width: `calc(100% / 8)` }}
                        className={`calendar-y-axis selectable-group-container`}
                      >
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} className='class-name' sx={{ pointerEvents: "none" }}>
                          <p>{class_type}</p>
                        </Box>
                        {lessonTime.map((time, i) => {
                          return (
                            <Box key={time.end + time.start} className='lesson-box' display={"flex"} flexDirection={"column"} width={"100%"} height={`calc((100% - 40px) / ${lessonTime.length})`}
                              sx={{
                                backgroundColor: i % 2 === 0 ? colors.primary[400] : "#fff"
                              }}
                            >
                              {tableData.length !== 0 &&
                                [...Array(4)].map((_, i) => {
                                  const uniqueId = `${date.getFullYear()}-${month}-${day} ${addMinutesToTime(time.start, (i) * 15)}/${class_type}`

                                  if (tableData?.[formatDateBack(date)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]) {
                                    const start = tableData?.[formatDateBack(date)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].StartTime;
                                    const end = tableData?.[formatDateBack(date)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].EndTime;
                                    count = calculateDifferenceIn15Minutes(start, end)
                                  } else {
                                    if (count > 0) {
                                      --count
                                    } else {
                                      count = 0
                                    }
                                  }
                                  
                                  return (
                                    <LessonUnit 
                                      data={tableData?.[formatDateBack(date)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]} 
                                      count={count} 
                                      teacherAll={teacherAll} 
                                      studentAll={studentAll} 
                                      searchStudent={searchStudent} 
                                      askForLeaveCourse_one={askForLeaveCourse?.[formatDateBack(date)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]}
                                      uniqueId={uniqueId} 
                                    />
                                  )
                                })
                              }
                            </Box>
                          )
                        })}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>

    </>

  )
})


/**
 * 課程單元
 * @param data 課程資料
 * @param count 計算相差的 15 分鐘數量
 * @param teacherAll 所有學生
 * @param studentAll 所有老師
 * @returns 顯示課程在日曆上
 */
const LessonUnit = ({ data, count, teacherAll, studentAll, searchStudent=null, askForLeaveCourse_one=null }) => {
  let gap, bg_color, askForLeave_gap, askForLeave_bg_color;

  if (data) {
    const start = data.StartTime;
    const end = data.EndTime;
    gap = calculateDifferenceIn15Minutes(start, end)
    bg_color=data.t_color;
  }

  if (askForLeaveCourse_one) {
    const start = askForLeaveCourse_one.StartTime;
    const end = askForLeaveCourse_one.EndTime;
    askForLeave_gap = calculateDifferenceIn15Minutes(start, end)
    askForLeave_bg_color=askForLeaveCourse_one.t_color;
    
  }


  return (
    <Box key={data && data.Tb_index} flexBasis="25%" width={"100%"}  >
      {(data && count > 0) ? 
      <LessonPopUp 
        unitData={data} 
        teacherAll={teacherAll} 
        studentAll={studentAll} 
        id={data.Tb_index} 
        name={data.c_name} 
        gap={gap} 
        bg={bg_color} 
        type={"update"} 
        searchStudent={searchStudent} 
      /> : null}

      {(askForLeaveCourse_one && count > 0) ? 
      <LessonPopUp 
        unitData={askForLeaveCourse_one} 
        teacherAll={teacherAll} 
        studentAll={studentAll} 
        id={askForLeaveCourse_one.Tb_index} 
        name={askForLeaveCourse_one.c_name} 
        gap={askForLeave_gap} 
        bg={askForLeave_bg_color} 
        type={"update"} 
        searchStudent={searchStudent} 
        isAskForLeaveCourse={true}
      /> : null}

    </Box>
  )
}




/**
 * 課程單元+開啟編輯視窗
 * @param unitData 該筆課程資料
 * @param id 課程ID
 * @param name 課程名稱
 * @param gap 課程所佔日曆格子數
 * @param bg 課程被景色
 * @param type 新增修改刪除分類
 * @param teacherAll 所有學生
 * @param studentAll 所有老師
 * @param isAskForLeaveCourse 判斷是否顯示請假課程(被覆蓋的)
 * @returns 
 */
const LessonPopUp = ({unitData, id, name, gap, bg, type, teacherAll, studentAll, searchStudent=null, isAskForLeaveCourse=false }) => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({})
  const [currentDate, setCurrentDate] = useState(null)
  const [tableData, setTableData] = useState(null)
  const adminData = useSelector(state => state.accessRangeReducer)
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  //獲取使用者資訊
  const userData = useSelector(state => state.accessRangeReducer)
  // console.log(unitData);

  const dispatch = useDispatch(null)
  const currentDateRedux = useSelector(state => state.calendarReducer.currentDate)

  //儲存異動單list資料
  const [listData, setListData] = useState(null)


  
  //-- 關閉視窗 --
  const handleCancel = () => {
    setOpen(false)
    setData({})
  }

  //-- 視窗送出資料 --
  const handleSubmit = () => {
    const startDate = currentDateRedux.year + "-" + currentDateRedux.month + "-" + currentDateRedux.day
    const endDate = formatDateBack(getWeekDates(startDate)[6])
    //-- 修改 --
    if (type === "update") {
      calendarApi.updateOne(data, (res) => {
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          calendarApi.getAll(startDate, endDate).then((data) => {
            dispatch(calendarTableDataAction(dataTransformTable(data.data)))
          })
          setOpen(false)
        }
      })
    } 

    //-- 新增 --
    else {
      calendarApi.insertOne(data, (res) => {
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          calendarApi.getAll(startDate, endDate).then((data) => {
            dispatch(calendarTableDataAction(dataTransformTable(data.data)))
          })
          setOpen(false)
        }
      })
    }
  }

  //-- 視窗刪除課程 --
  const handleDelete = () => {

    // console.log(adminData);

    if (window.confirm("確定要刪除此課程嗎?")) {
      //-- 老師 --
      if(adminData.inform.admin_per==="group2023071815332755"){
        changeApi.insert_course_transfer({
            type: 'insert_course_transfer',
            course_id: data.Tb_index,
            admin_id: userData.inform.Tb_index,
            c_remark: ' ',
            change_type:5,
            change_status:1
        },(res)=>{
            if(res.data.success){
                dispatch(snackBarOpenAction(true, `${res.data.msg}`))
                handleCancel()
            }
            else{
                dispatch(snackBarOpenAction(true, `${res.data.msg}`, 'error'))
            }
        })
      }
      //-- 管理者 --
      else{
        const startDate = currentDateRedux.year + "-" + currentDateRedux.month + "-" + currentDateRedux.day
        const endDate = formatDateBack(getWeekDates(startDate)[6])
        calendarApi.deleteOne(id, (res) => {
          const status = res.data.success ? "success" : "error"
          dispatch(snackBarOpenAction(true, res.data.msg, status))
          if (res.data.success) {
            calendarApi.getAll(startDate, endDate).then((data) => {
              dispatch(calendarTableDataAction(dataTransformTable(data.data)))
            })
          }
        })
      }
      
    }
  }


  //-- 補簽 --
  const ReSigning = ()=>{
    if (window.confirm("確定要補簽此課程嗎?")){

      const startDate = currentDateRedux.year + "-" + currentDateRedux.month + "-" + currentDateRedux.day
      const endDate = formatDateBack(getWeekDates(startDate)[6])

      changeApi.insert_course_transfer({
          type: 'insert_course_transfer',
          course_id: data.Tb_index,
          admin_id: userData.inform.Tb_index,
          c_remark: ' ',
          change_type:3,
          change_status:1
      },(res)=>{
          if(res.data.success){
              dispatch(snackBarOpenAction(true, `${res.data.msg}`))
              dispatch(notificationListAction({reflash: true}))
              calendarApi.getAll(startDate, endDate).then((data) => {
                dispatch(calendarTableDataAction(dataTransformTable(data.data)))
              })
              handleCancel()
          }
          else{
              dispatch(snackBarOpenAction(true, `${res.data.msg}`, 'error'))
          }
      })
    }
  }


  //-- 請假 --
  const askForLeave=()=>{
    let result = prompt("確定要為此課程請假嗎?\n下欄填寫備註：", '');
    if(result!==null){
      const startDate = currentDateRedux.year + "-" + currentDateRedux.month + "-" + currentDateRedux.day
      const endDate = formatDateBack(getWeekDates(startDate)[6])
      calendarApi.askForLeave({
        course_id: data.Tb_index,
        remark: result
      }, (res)=>{
        if(res.data.success){
          dispatch(snackBarOpenAction(true, `${res.data.msg}`))
          calendarApi.getAll(startDate, endDate).then((data) => {
            dispatch(calendarTableDataAction(dataTransformTable(data.data)))
          })
          handleCancel()
        }
        else{
            dispatch(snackBarOpenAction(true, `${res.data.msg}`, 'error'))
        }
      })
    }
  }

  //-- 超時請假 --
  const askForLeaveTransfer= ()=>{
    if(window.confirm("確定要為此課程請假嗎?\n##此為超時請假會產生異動單，需請管理者審核##")){
      const startDate = currentDateRedux.year + "-" + currentDateRedux.month + "-" + currentDateRedux.day
      const endDate = formatDateBack(getWeekDates(startDate)[6])

      changeApi.insert_course_transfer({
          type: 'insert_course_transfer',
          course_id: data.Tb_index,
          admin_id: userData.inform.Tb_index,
          c_remark: '超時請假',
          change_type:6,
          change_status:1
      },(res)=>{
          if(res.data.success){
              dispatch(snackBarOpenAction(true, `${res.data.msg}`))
              dispatch(notificationListAction({reflash: true}))
              calendarApi.getAll(startDate, endDate).then((data) => {
                dispatch(calendarTableDataAction(dataTransformTable(data.data)))
              })
              handleCancel()
          }
          else{
              dispatch(snackBarOpenAction(true, `${res.data.msg}`, 'error'))
          }
      })
    }
  }


  //-- 簽到 --
  const signNow=()=>{
    if(window.confirm("確定要為此課程簽到嗎?")){
      const startDate = currentDateRedux.year + "-" + currentDateRedux.month + "-" + currentDateRedux.day
      const endDate = formatDateBack(getWeekDates(startDate)[6])
      calendarApi.signIn({
        course_id: data.Tb_index,
      }, (res)=>{
        if(res.data.success){
          dispatch(snackBarOpenAction(true, `${res.data.msg}`))
          calendarApi.getAll(startDate, endDate).then((data) => {
            dispatch(calendarTableDataAction(dataTransformTable(data.data)))
          })
          handleCancel()
        }
        else{
            dispatch(snackBarOpenAction(true, `${res.data.msg}`, 'error'))
        }
      })
    }
  }


  useEffect(() => {
    if (currentDate) {
      calendarApi.getAll(formatDateBack(currentDate), formatDateBack(currentDate)).then((data) => {
        setTableData(dataTransformTable(data.data));
      })
    }
     //console.log(unitData);
  }, [currentDate])

   //權限
   const { accessData, accessDetect } = useAuthorityRange()
   const [authorityRange, setAuthorityRange] = useState({})
   //獲取權限範圍
   useEffect(() => {
       if (accessData) {
           const result = accessDetect(accessData, "課表總覽")
           setAuthorityRange({
               p_delete: result?.p_delete === "1" ? true : false,
               p_insert: result?.p_insert === "1" ? true : false,
               p_update: result?.p_update === "1" ? true : false,
           })
       }
   }, [accessData])


  //  useEffect(()=>{
  //   console.log(type);
  //  }, [open])

   

  if (bg || type === "insert") {

    let isSign=false;
    let isAskForLeave=false;
    let isReSignin_time=false;
    let TimeOut=false;
    let isTransfer=false;
    let signTime=false; // -- 簽到時間 --
    
    
    if(unitData){
      // console.log(unitData);
      // 将日期时间字符串解析为Date对象
      const StartTime = new Date(unitData.c_date +"T"+ unitData.StartTime);
      const EndTime = new Date(unitData.c_date +"T"+ unitData.EndTime);
      

      // 获取时间戳
      const classTimeStampStart = StartTime.getTime();
      const classTimeStamp = EndTime.getTime();
      const minuteTimeStamp=1000*60; //-- 1分鐘毫秒 --

      signTime=classTimeStampStart-(minuteTimeStamp*15) <= Date.now() && classTimeStamp >= Date.now();

      TimeOut=Date.now() > classTimeStamp;

      //-- 超過上課時間視為遲到變紅色 --
      if((Date.now() > classTimeStamp)&& unitData.signin_time===null && unitData.askForLeave_time===null && unitData.reSignin_time===null){
        isSign=true;
      } 
      //-- 請假 --
      else if((unitData.askForLeave_time)){
        isAskForLeave=true;
      }
      //-- 補簽 --
      else if((unitData.reSignin_time)){
        isReSignin_time=true;
      }

      //-- 判斷異動單 --
      if(unitData.course_transfer && unitData.course_transfer.Tb_index!==null){
        isTransfer=true;
      }

      
    }

    return (
      <>
        {type === "update" ?
          <Tooltip title={
            <React.Fragment>
              <h2 style={{margin:0, fontSize:'18px'}}>{name}</h2>
              <p style={{margin:0, fontSize:'15px'}}>上課教室：{unitData.room_name}</p>
              <p style={{margin:0, fontSize:'15px'}}>上課日期：{unitData.c_date}</p>
              <p style={{margin:0, fontSize:'15px'}}>上課時間：{unitData.StartTime}</p>
              <p style={{margin:0, fontSize:'15px'}}>下課時間：{unitData.EndTime}</p>
              <p style={{margin:0, fontSize:'15px', display: unitData.course_transfer_end.c_remark===null || unitData.course_transfer_end.c_remark===' ' ? 'none':'inline-block'}}>備註：{unitData.course_transfer_end.c_remark}</p>
            </React.Fragment>
          } arrow placement="top" >

                {/* 課程底色方塊 */}
                <Box className='lesson-unit' height={`calc(${100 * gap}% + ${gap + (gap / 4) - 1}px)`} bgcolor={bg} boxShadow={" 0 0 0 1px #000"} sx={{ pointerEvents: "auto", zIndex: 99 }} 
                border={isAskForLeaveCourse ? '4px solid #ffc800':''}
                onClick={(e) => {
                  e.stopPropagation()
                    // console.log(unitData);
                    calendarApi.getOne(id, (data) => {
                      if((userData.inform.admin_per!=="group2023071815332755" || (userData.inform.admin_per==="group2023071815332755" && data.data.data[0].teacher_id===userData.inform.Tb_index)) && !isAskForLeaveCourse){
                        setData(data.data.data[0])
                        setOpen(true)
                      }
                    })
                }}>
                  
                     {
                      userData.inform.admin_per!=="group2023071815332755" || (userData.inform.admin_per==="group2023071815332755" && unitData.teacher_id===userData.inform.Tb_index) ?
                        <Chip label={isSign ? '未' : isAskForLeave ? '假': isReSignin_time ? '補' : ''} 
                            size="small" 
                            sx={{
                              position:'absolute', 
                              top:'-5px', 
                              right:'-3px', 
                              height: '16px',
                              fontSize:'11px',
                              padding:'6px 0',
                              backgroundColor: isSign ? '#cb271b' : isAskForLeave ? '#c69e0e' : '#19851d',
                              color: '#fff',
                              display: isSign || isAskForLeave || isReSignin_time ? 'inline-flex':'none'
                              }}/>
                      : ''
                     }

                     {
                       isTransfer ?
                        <Chip label={unitData.course_transfer?.change_type} 
                        size="small" 
                        sx={{
                          position:'absolute', 
                          top:'-5px', 
                          left:'-3px', 
                          height: '16px',
                          fontSize:'11px',
                          padding:'6px 0',
                          backgroundColor: 'rgb(255 255 255 / 80%)',
                          color: '#1f5295',
                          display: 'inline-flex'
                          }}/>
                        : ''
                     }
                        

                     <div style={{  color: getContrastColor(bg), fontWeight: "500", pointerEvents: "none" }}>
                          { 
                            // 課程顯示學生名
                            unitData.student.map((item)=>{
                               
                               if(searchStudent===null){
                                //-- 老師自己的課顯示學生名 --
                                if(userData.inform.admin_per!=="group2023071815332755" || (userData.inform.admin_per==="group2023071815332755" && unitData.teacher_id===userData.inform.Tb_index)){
                                    return (
                                      <p style={{margin: 0,}}>{item.name}</p>
                                    )
                                }
                                //-- 顯示課程名 --
                                else{
                                  return (
                                    <p style={{margin: 0, opacity:0.4}}>{name}</p>
                                  )
                                }
                               }
                               else{
                                 //-- 查詢學生 --
                                 if(searchStudent===item.Tb_index){
                                    return (
                                      <p style={{margin: 0,}}>{item.name}</p>
                                    )
                                 }
                               }
                               
                            })
                          }
                    </div>

                </Box> 
          </Tooltip>
          :
           <Box>
              <Button startIcon={<EditIcon />} variant="contained" sx={{ backgroundColor: "#6DC4C5" }} onClick={(e) => {
                e.stopPropagation()
                setOpen(true)
              }}>
                新增課程
              </Button >
              
           </Box>
        }
        <Dialog open={open} onClose={handleCancel} sx={{
          "& .MuiPaper-root": { padding: " 10px 25px" },
          "& label": {
            fontSize: "16px"
          },
          "& .MuiDialog-container > .MuiPaper-root": {
            padding: " 10px 15px",
            margin: "10px",
            width: "100%",
            maxWidth: "650px",
          },
        }}>
          {(data || type === "insert") && studentAll.length > 0 && teacherAll.length > 0 ?
            <>
              <DialogTitle sx={{ fontSize: "20px", padding: '5px' }}>{!authorityRange.p_update ?"課程瀏覽" : type === "update" ? "課程修改" : "課程新增"}</DialogTitle>
              <DialogContent sx={{ width: "100%", padding: "10px !important" }} >
                {teacherAll &&
                  <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">老師</InputLabel>
                    <Select onChange={(e) => {
                      setData({
                        ...data,
                        teacher_id: e.target.value,
                      })
                    }}
                    disabled={!authorityRange.p_update}
                      value={data.teacher_id}
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
                  </FormControl>
                }
              </DialogContent>
              <DialogContent sx={{padding: "10px !important"}}>
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
                      c_name: e.target.value
                    })
                  }}
                  value={data.c_name}
                  disabled={!authorityRange.p_update}
                />
              </DialogContent>
              <DialogContent sx={{padding: "10px !important"}}>
                {((studentAll && data.student) || type === "insert") && <MultiSelect studentAll={studentAll} data={data} setData={setData} type={type} author={authorityRange.p_update}/>}
              </DialogContent>
              <DialogContent sx={{padding: "10px !important", display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap", "& .input": { flex: "0 0 45%", "& label": { color: "#000" }, "& input": { WebkitTextFillColor: "#000" } } }}>
                <Box flex={"0 0 100%"}>
                  <Typography variant="h5" component="h6">課堂時間及教室</Typography>
                  {authorityRange.p_update &&
                    <Box display={"flex"} alignItems={"center"}>
                    <p style={{ color: "red", fontSize: "13px", letterSpacing: "0.1em", margin: "0px 5px 6px 0" }}>(上課時間及教室請透過右邊行事曆修改)--{'>'}</p>
                    <TimeSelect setCurrentDate={setCurrentDate} />
                  </Box>
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
                  onChange={(e) => {
                    setData({
                      ...data,
                      c_date: e.target.value
                    })
                  }}
                  value={data.c_date || " "}
                  disabled
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
                  onChange={(e) => {
                    setData({
                      ...data,
                      room_name: e.target.value
                    })
                  }}
                  value={data.room_name || " "}
                  disabled
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
                  onChange={(e) => {
                    setData({
                      ...data,
                      StartTime: e.target.value
                    })
                  }}
                  value={data.StartTime || " "}
                  disabled
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
                  onChange={(e) => {
                    setData({
                      ...data,
                      EndTime: e.target.value
                    })
                  }}
                  value={data.EndTime || " "}
                  disabled
                  className='input'
                />

              </DialogContent>

              <DialogContent sx={{ 
                display: "flex", 
                flexDirection:{xs:"column", lg:"row"}, 
                justifyContent: (type === "update" && authorityRange.p_delete)? "space-between" : "flex-end", 
                alignItems: "center", 
                "& button": { fontSize: "16px" }, 
                height: '145px',
                gap: '5px',
                padding: '0',
                paddingTop: '12px'}}>
                
                <Box sx={{display:'flex', gap:'10px', }}>

                  {authorityRange.p_delete&& type === "update" && 
                    <Button onClick={handleDelete} sx={{ backgroundColor: "#d85847", color: "#fff", "&:hover": { backgroundColor: "#ad4638" } }}>刪除</Button>
                  }
                  <Button onClick={()=>{ReSigning()}} variant="contained" sx={{backgroundColor:'#1f5295', display: isSign ? 'inline-flex':'none'}}>{'補簽'}</Button>
                  <Button onClick={()=>{askForLeaveTransfer()}} variant="contained" sx={{backgroundColor:'#d9a710', display: isSign ? 'inline-flex':'none'}}>{'超時請假'}</Button>
                  {type ==='insert' || TimeOut || isAskForLeave || isReSignin_time ? '':<ChangeSheet crud={"adjustCourse"} course_id={data.Tb_index} setListData={setListData}/>}
                  {type ==='insert' || TimeOut || isAskForLeave || isReSignin_time ? '':<ChangeSheet crud={"changeCourse"} course_id={data.Tb_index} setListData={setListData}/>}
                  <Button onClick={()=>{askForLeave()}} variant="contained" sx={{backgroundColor:'#d9a710', display: type ==='insert' || TimeOut || isAskForLeave || isReSignin_time ? 'none':'inline-flex'}}>{'請假'}</Button>
                  <Button onClick={()=>{signNow()}} variant="contained" sx={{backgroundColor:'#1e9151', display: signTime ? 'inline-flex':'none'}}>{'簽到'}</Button>

                </Box>
                <Box>
                  {authorityRange.p_update && <Button onClick={handleSubmit}>{type === "update" ? "修改" : "新增"}</Button>}
                  <Button onClick={handleCancel}>{authorityRange.p_update ? "取消" : "退出"}</Button>
                </Box>
              </DialogContent>

              {currentDate &&
                <Dialog open={currentDate} onClose={() => setCurrentDate(null)} sx={{
                  "& .MuiPaper-root": isMobile ? {
                    maxWidth: "100%",
                    width: "100%",
                    margin: 0
                  } : {
                    maxWidth: "700px",
                    padding: "25px"
                  }
                }}>
                  {tableData ? <SelectCalendar tableData={tableData} currentDate={currentDate} data={data} setData={setData} setCurrentDate={setCurrentDate}></SelectCalendar> : <IsLoading />}
                </Dialog>
              }
            </>
            : <IsLoading />
          }
        </Dialog>
      </>
    )
  }
}


export const TimeSelect = ({ setCurrentDate, maxDate=null, minDate=null }) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const handleCancel = () => {
    setOpen(false)
  }
  const handleChange = (e) => {
    setDate(e.$d)
  }
  const handleSubmit = () => {
    setCurrentDate(date)

    setDate(new Date())
    handleCancel()
  }
  return (
    <>
      <Box onClick={() => setOpen(true)} sx={{ cursor: "pointer" }}>
        <DateRangeIcon />
      </Box>
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
              <DateCalendar onChange={handleChange} maxDate={dayjs(maxDate)} minDate={dayjs(minDate)} />
              <Box display={"flex"} justifyContent={"flex-end"} width={"94%"}>
                <Button onClick={handleSubmit}>OK</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </Box>
            </LocalizationProvider>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}



export default function ClassOverView() {
  return (
    <div style={{ width: '95%', margin: '20px auto 0' }}>
      <Header title="課表行事曆" subtitle="昨日之前的課表(含昨日)，不能做新增、修改、刪除的操作!" warm={true} sx={{marginBottom:'0px'}} />
      <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} sx={{
        '& div':{display:'flex', alignItems:'center', margin:'0 5px'},
        '& span':{ fontSize:'13px', display: 'inline-flex'}
      }}> 
        標籤說明：
        <Box>未簽 <Chip label={'未'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#cb271b', color: '#fff'}} /></Box>
        <Box>請假 <Chip label={'假'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#c69e0e', color: '#fff'}} /></Box>
        <Box>補簽 <Chip label={'補'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#19851d', color: '#fff'}} /></Box>
        <Box>調課 <Chip label={'調'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#dddc', color: '#1f5295'}} /></Box>
        <Box>換課 <Chip label={'換'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#dddc', color: '#1f5295'}} /></Box>
        {/* <Box>補課 <Chip label={'補'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#dddc', color: '#1f5295'}} /></Box> */}
        <Box>加課 <Chip label={'加'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#dddc', color: '#1f5295'}} /></Box>
        <Box>刪課 <Chip label={'刪'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#dddc', color: '#1f5295'}} /></Box>
        <Box>超時請假 <Chip label={'假'} size='small' sx={{ height: '16px', padding:'6px 0', backgroundColor: '#dddc', color: '#1f5295'}} /></Box>
      </Box>
      <CalendarTop />
    </div>
  );
};