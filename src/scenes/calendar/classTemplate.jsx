
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import Header from '../../components/Header';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, Select, TextField, Typography, useMediaQuery, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { getWeekInfoForDate, dataTransformTable, dataTransformTableTemplate, addMinutesToTime, calculateDifferenceIn15Minutes, getContrastColor } from './getMonday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import * as templateApi from "../../axios-api/calendarTemplateData"
import MultiSelect from '../../lib/multiSelect';
import * as studentApi from "../../axios-api/studentData"
import * as teacherApi from "../../axios-api/teacherData"
import { IsLoading } from "../../components/loading";
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { calendarDateAction, snackBarOpenAction } from '../../redux/action';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SelectTemplate from './selectTemplate';
import useAuthorityRange from '../../custom-hook/useAuthorityRange';

function TeacherColor ({data}){
  return(
    <Box display={"flex"} gap={"20px"} flexWrap={"wrap"}  >
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

const CalendarTop = ({ id }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch(null)
  const [tableData, setTableData] = useState({})
  const [studentAll, setStudentAll] = useState([]);
  const [teacherAll, setTeacherAll] = useState([]);
  //-- 第幾周 --
  const [weekNum, setWeekNum] = useState(1);
  //-- 所有週課程資料 --
  const [allWeekTableData, setAllWeekTableData] = useState([]);
  const scrollRef = useRef(null)
  let scrollNum = 0;
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  useEffect(() => {
    studentApi.getAll().then((data) => {
      setStudentAll(data.data);
    });
    teacherApi.getAll().then((data) => {
      setTeacherAll(data.data);
    });
  }, [])


  useEffect(() => {
    const initDate = getWeekInfoForDate(new Date())
    dispatch(calendarDateAction(initDate))
    templateApi.get_course_template(id, (data) => {
      

      setAllWeekTableData(dataTransformTableTemplate(data.data.data));
      
    })
  }, [])

  useEffect(()=>{
     if(allWeekTableData!==null){
      
      console.log(allWeekTableData);
      if(allWeekTableData[weekNum]===undefined){
        setTableData({});
      }
      else{
        setTableData(allWeekTableData[weekNum]);
      }
      
     }
  }, [allWeekTableData])

  // useEffect(()=>{
  //   if(allWeekTableData!==null){
      
  //     setTableData(allWeekTableData[weekNum]);

  //     console.log(tableData);
  //    }
  // }, [tableData])


   //權限
   const { accessData, accessDetect } = useAuthorityRange()
   const [authorityRange, setAuthorityRange] = useState({})
 
   //獲取權限範圍
   useEffect(() => {
       if (accessData) {
           const result = accessDetect(accessData, "公版課表")
           setAuthorityRange({
               p_delete: result.p_delete === "1" ? true : false,
               p_insert: result.p_insert === "1" ? true : false,
               p_update: result.p_update === "1" ? true : false,
           })
       }
   }, [accessData])


   //-- 上一週 --
   function prevWeek() {
    if(weekNum!==1){
        let newWeek=weekNum-1;
        setWeekNum(newWeek);
        if(allWeekTableData[newWeek]===undefined){
          let newAllWeekTableData={};
          newAllWeekTableData[newWeek]={};
          setAllWeekTableData({...allWeekTableData, ...newAllWeekTableData});
        }
        setTableData(allWeekTableData[newWeek]);
      }
    }

   //-- 下一週 --
   function nextWeek() {
    if(weekNum!==5){
        let newWeek=weekNum+1;
        setWeekNum(newWeek);
        if(allWeekTableData[newWeek]===undefined){
          let newAllWeekTableData={};
          newAllWeekTableData[newWeek]={};
          setAllWeekTableData({...allWeekTableData, ...newAllWeekTableData});
        }
        setTableData(allWeekTableData[newWeek]);
      }
    }



  return (
    <Box m={"25px 0"} sx={
      {
        position: "relative",
        width: "100%",
        "& .title": {
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          "& > button": {
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
      {tableData ?
        <>
          <Box className='title' display={"flex"} width={"100%"} justifyContent={"space-between"} gap={"15px"} alignItems={"center"} flexWrap={"wrap"}>

            {
                // 老師顏色列表
                teacherAll && <TeacherColor data={teacherAll}/>
            }
            <Box className='selectWeek' sx={{display:"flex", alignItems: "center", gap: "10px"}}>
              <IconButton onClick={(e)=>{prevWeek();}} aria-label="上一週" title='上一週' sx={{ 
                opacity: weekNum===1 ? 0: 1 ,
                visibility: weekNum===1 ? 'hidden': 'visible' ,
                backgroundColor:'#1d7dc9', 
                color:'#fff', 
                transform:'rotate(180deg)', 
                "&:hover":{backgroundColor:'#15629e',}}}><ArrowForwardIcon /></IconButton>
               <h2>第{weekNum}週</h2>
               <IconButton onClick={(e)=>{nextWeek();}} aria-label="下一週" title='下一週' sx={{
                opacity: weekNum===5 ? 0: 1 ,
                visibility: weekNum===5 ? 'hidden': 'visible' ,
                backgroundColor:'#1d7dc9', 
                color:'#fff', 
                "&:hover":{backgroundColor:'#15629e',}}}><ArrowForwardIcon /></IconButton>
            </Box>
            <Box className='tool_box' display={"flex"} justifyContent={"space-between"} gap={"15px"}>
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
                    scrollNum = scrollNum - 1
                  }
                  scrollRef.current.scrollTo(
                    {
                      left: `${520 * scrollNum}`,
                      behavior: 'smooth',
                    }
                  )
                }}>
                  <ArrowForwardIcon sx={{ transform: "rotateY(180deg)" }} />
                </div>
                <div className="right" onClick={(e) => {
                  if (scrollNum < (3640 - scrollRef.current.clientWidth) / 520) {
                    scrollNum = scrollNum + 1
                  }
                  scrollRef.current.scrollTo(
                    {
                      left: `${520 * scrollNum}`,
                      behavior: 'smooth',
                    }
                  )
                }}>
                  <ArrowForwardIcon />
                </div>
              </Box>
              { 
                // 新增按鈕
                authorityRange.p_insert &&  <LessonPopUp type={"insert"} weekNum={weekNum} ct_list_id={id} studentAll={studentAll} teacherAll={teacherAll} tableData={tableData} setTableData={setTableData} setAllWeekTableData={setAllWeekTableData} authorityRange={authorityRange} />
              }
            </Box>

          </Box>
          
          <Calendar ref={scrollRef} weekNum={weekNum} tableData={tableData} studentAll={studentAll} teacherAll={teacherAll} setTableData={setTableData} setAllWeekTableData={setAllWeekTableData} ct_list_id={id} authorityRange={authorityRange}/>
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
 * @param ct_list_id 模板ID
 * @param authorityRange 權限
 */
const Calendar = forwardRef(({ tableData, studentAll, teacherAll, setTableData, setAllWeekTableData, weekNum, ct_list_id ,authorityRange}, ref) => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const weeks = [
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日",
  ]

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
            width: isMobile ? "100%" : "calc(100%/7)",
            "&:not(:last-child)": {
              borderRight: "1px solid #000"
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
          {weeks.map((week, i) => {
            return (
              <Box className='day-of-the-week' minWidth={isMobile ? "100%" : "520px"}>
                <Box className='calendar-date'>
                  {<h6>{`星期${week}`}</h6>}
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
                                  const uniqueId = `星期${week} ${addMinutesToTime(time.start, (i) * 15)}/${class_type}`

                                  if (tableData?.[week]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]) {
                                    const start = tableData?.[week]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].StartTime;
                                    const end = tableData?.[week]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].EndTime;
                                    count = calculateDifferenceIn15Minutes(start, end)
                                  } else {
                                    if (count > 0) {
                                      --count
                                    } else {
                                      count = 0
                                    }
                                  }
                                  return (
                                    <LessonUnit  authorityRange={authorityRange} ct_list_id={ct_list_id} tableData={tableData} setTableData={setTableData} setAllWeekTableData={setAllWeekTableData} teacherAll={teacherAll} studentAll={studentAll} count={count} uniqueId={uniqueId} weekNum={weekNum} data={tableData?.[week]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]} />
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
 * @param tableData 課程資料
 * @param setTableData 課程資料
 * @param ct_list_id 模板ID
 * @param authorityRange 權限
 * @returns 顯示課程在日曆上
 */
const LessonUnit = ({ data, weekNum, count, teacherAll, studentAll, tableData, setTableData, setAllWeekTableData, ct_list_id, authorityRange }) => {
  let gap;
  if (data) {
    const start = data.StartTime;
    const end = data.EndTime;
    gap = calculateDifferenceIn15Minutes(start, end)
  }

  return (
    <Box key={data && data.Tb_index} flexBasis="25%" width={"100%"}  >
      {count > 0 ? <LessonPopUp unitData={data} weekNum={weekNum} authorityRange={authorityRange} ct_list_id={ct_list_id} teacherAll={teacherAll} studentAll={studentAll} id={data?.Tb_index} name={data?.c_name} gap={gap} bg={data?.t_color} type={"update"} tableData={tableData} setTableData={setTableData} setAllWeekTableData={setAllWeekTableData} /> : null}
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
 * @param tableData 課程資料
 * @param setTableData 課程資料
 * @param ct_list_id 模板ID
 * @param authorityRange 權限
 * @returns 
 */
const LessonPopUp = ({unitData, weekNum, id, name, gap, bg, type, teacherAll, studentAll, tableData, setTableData, setAllWeekTableData, ct_list_id, authorityRange }) => {

  const [open, setOpen] = useState(false)
  const [data, setData] = useState({})
  const dispatch = useDispatch(null)
  const handleCancel = () => {
    setOpen(false)
    setData({})
  }
  
  //console.log(unitData);

  //-- 送出資料(新增、修改) --
  const handleSubmit = () => {
    if (type === "update") {
      templateApi.update_course({ ...data, ct_list_id: ct_list_id }, (res) => {
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          templateApi.get_course_template(ct_list_id, (data) => {
            //setTableData(dataTransformTable(data.data.data, "template"))
            setAllWeekTableData(dataTransformTableTemplate(data.data.data));
          })
        }

      })
    } else {
      templateApi.insert_course({ ...data, ct_list_id: ct_list_id, c_week_num: weekNum }, (res) => {
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          templateApi.get_course_template(ct_list_id, (data) => {
            //setTableData(dataTransformTable(data.data.data, "template"))
            setAllWeekTableData(dataTransformTableTemplate(data.data.data));
          })
        }
      })
    }

    setOpen(false)
  }

  const handleDelete = () => {
    if (window.confirm("確定要刪除此課程嗎?")) {
      templateApi.delete_course(id, (res) => {
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          templateApi.get_course_template(ct_list_id, (data) => {
            setTableData(dataTransformTable(data.data.data, "template"))
          })
        }
      })
    }
  }

  if (bg || type === "insert") {
    return (
      <>
        {type === "update" ?
          <Tooltip title={
            <React.Fragment>
              <h2 style={{margin:0, fontSize:'18px'}}>{name}</h2>
              <p style={{margin:0, fontSize:'15px'}}>上課教室：{unitData.room_name}</p>
              <p style={{margin:0, fontSize:'15px'}}>上課日期：星期{unitData.c_week}</p>
              <p style={{margin:0, fontSize:'15px'}}>上課時間：{unitData.StartTime}</p>
              <p style={{margin:0, fontSize:'15px'}}>下課時間：{unitData.EndTime}</p>
            </React.Fragment>
          } arrow placement="top">
            <Box className='lesson-unit' height={`calc(${100 * gap}% + ${gap + (gap / 4) - 1}px)`} bgcolor={bg} boxShadow={" 0 0 0 1px #000"} sx={{ pointerEvents: "auto", zIndex: 99 }} onClick={(e) => {
              e.stopPropagation()
              templateApi.get_course_template_one(id, (data) => {
                setData(data.data.data[0])
                setOpen(true)
              })
            }}>
              <p style={{ margin: 0, color: getContrastColor(bg), fontWeight: "500", pointerEvents: "none" }}>
                { 
                  // 課程顯示學生名
                  unitData.student.map((item)=>{
                      return (
                        <p style={{margin: 0,}}>{item.name}</p>
                      )
                  })
                }
              </p>
            </Box> 
          </Tooltip>
          :
          <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", width: "100px", gap: "5px" }} onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}>
            <EditIcon />
            新增
          </Button >
        }
        <Dialog open={open} onClose={handleCancel} sx={{
          "& .MuiPaper-root": { padding: " 10px 25px" },
          "& label": {
            fontSize: "16px"
          },
          "& .MuiDialog-container > .MuiPaper-root": {
            padding: " 10px 25px",
            width: "100%",
            maxWidth: "650px",
          },
        }}>
          {(data || type === "insert") && studentAll.length > 0 && teacherAll.length > 0 ?
            <>
             <DialogTitle sx={{ fontSize: "20px" }}>{!authorityRange?.p_update ?"課程瀏覽" : type === "update" ? "課程修改" : "課程新增"}</DialogTitle>
              <DialogContent sx={{ width: "100%", padding: "20px 24px !important" }} >
                {teacherAll &&
                  <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">老師</InputLabel>
                    <Select onChange={(e) => {
                      setData({
                        ...data,
                        teacher_id: e.target.value,
                      })
                    }}
                      value={data.teacher_id}
                      disabled={!authorityRange?.p_update}
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
              <DialogContent>
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
                  disabled={!authorityRange?.p_update}
                />
              </DialogContent>
              <DialogContent>
                {((studentAll && data.student) || type === "insert") && <MultiSelect studentAll={studentAll} data={data} setData={setData} type={type} author={authorityRange?.p_update}/>}
              </DialogContent>
              <DialogContent sx={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap", "& .input": { flex: "0 0 45%", "& label": { color: "#000" }, "& input": { WebkitTextFillColor: "#000" } } }}>
                <Box flex={"0 0 100%"}>
                  <Typography variant="h5" component="h6">課堂時間及教室</Typography>
                  {authorityRange?.p_update &&
                    <Box display={"flex"} alignItems={"center"}>
                    <p style={{ color: "red", fontSize: "13px", letterSpacing: "0.1em", margin: "0px 5px 6px 0" }}>(上課時間及教室請透過右邊行事曆修改)--{'>'}</p>
                    <SelectTemplateContainer tableData={tableData} initDay={data.c_week} setData={setData} data={data} />
                  </Box>
                  }
                
                </Box>
                <TextField
                  autoFocus
                  margin="dense"
                  id="c_date"
                  label="星期"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={(e) => {
                    setData({
                      ...data,
                      c_week: e.target.value
                    })
                  }}
                  value={data.c_week || " "}
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
              <DialogContent sx={{ display: "flex", justifyContent: (type === "update" && authorityRange?.p_delete)? "space-between" : "flex-end", alignItems: "center", "& button": { fontSize: "16px" } }}>
                {authorityRange?.p_delete&& type === "update" && <Button onClick={handleDelete} sx={{ backgroundColor: "#d85847", color: "#fff", "&:hover": { backgroundColor: "#ad4638" } }}>刪除</Button>}
              
                <Box>
                  {authorityRange?.p_update && <Button onClick={handleSubmit}>{type === "update" ? "修改" : "新增"}</Button>}
                  <Button onClick={handleCancel}>{authorityRange?.p_update ? "取消" : "退出"}</Button>
                </Box>
              </DialogContent>

            </>
            : <IsLoading />
          }
        </Dialog>
      </>
    )
  }
}

const SelectTemplateContainer = ({ tableData, data, setData, initDay = "一" }) => {
  const [open, setOpen] = useState(false)
  const handleCancel = () => {
    setOpen(false)
  }
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  function convertDayToNumber(day) {
    const dayMap = {
      "一": 0,
      "二": 1,
      "三": 2,
      "四": 3,
      "五": 4,
      "六": 5,
      "日": 6
    };

    if (day in dayMap) {
      return dayMap[day];
    } else {
      throw new Error("無效的星期幾");
    }
  }
  initDay = convertDayToNumber(initDay);
  return (
    <>
      <Box onClick={() => setOpen(true)} sx={{ cursor: "pointer" }}>
        <DateRangeIcon />
      </Box>
      <Dialog open={open} onClose={handleCancel} sx={{
        "& .MuiDialog-container > .MuiPaper-root": {
          padding: isMobile ? "5px" : "40px 40px 5px 40px",
          maxWidth: isMobile ? "100%" : "700px",
          margin: isMobile ? "0" : "32px",
          width: isMobile ? "100%" : "auto"
        }
      }}>
        <SelectTemplate handleCancel={handleCancel} data={data} setData={setData} tableData={tableData} initWeekDay={initDay} />
      </Dialog>
    </>
  )

}



export default function ClassTemplate({ id }) {

  return (
    <div style={{ width: '95%', margin: '2vw auto' }}>
      <Header title="公版課表" subtitle="儲存後可以匯入每周課表" />
      <CalendarTop id={id} />
    </div>
  );
};
