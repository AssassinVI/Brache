
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import Header from '../../components/Header';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { getWeekInfoForDate, getWeekDates, formatDateBack, convertToChineseNumber, dataTransformTable, addMinutesToTime, calculateDifferenceIn15Minutes, getContrastColor } from './getMonday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import * as calendarApi from "../../axios-api/calendarData"
import MultiSelect from '../../lib/multiSelect';
import * as studentApi from "../../axios-api/studentData"
import * as teacherApi from "../../axios-api/teacherData"
import { IsLoading } from "../../components/loading";
import MenuItem from '@mui/material/MenuItem';
import SelectCalendar from './selectCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { calendarDateAction, calendarTableDataAction, snackBarOpenAction } from '../../redux/action';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { get_course_template_list } from '../../axios-api/calendarTemplateData';
import useAuthorityRange from '../../custom-hook/useAuthorityRange';

function FirstComponent() {
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch(null)
  const handleChange = (e) => {
    const monday_weekNumber = getWeekInfoForDate(e._d);
    const startDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day
    const endDate = formatDateBack(getWeekDates(startDate)[6])
    setData({
      monday_weekNumber: monday_weekNumber,
      startDate: startDate,
      endDate: endDate
    })
  }
  const handleCancel = () => {
    setOpen(false)
  }
  const handleSubmit = () => {

    dispatch(calendarDateAction(data.monday_weekNumber))
    calendarApi.getAll(data.startDate, data.endDate).then((data) => {
      dispatch(calendarTableDataAction(dataTransformTable(data.data)))
    })
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
      <DateRangeIcon onClick={() => {
        setOpen(true);
      }} />
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
            <LocalizationProvider dateAdapter={AdapterMoment}>
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

function ImportTemplate() {
  const [data, setData] = useState({})
  const [open, setOpen] = useState(false)
  const [templateList, setTemplateList] = useState(null)
  const [ct_title, setCtTitle] = useState(null)
  const currentDate = useSelector(state => state.calendarReducer.currentDate)
  const dispatch = useDispatch(null)
  const handleCancel = () => {
    setOpen(false)
  }
  const handleSubmit = () => {
    const startDate = currentDate.year + "-" + currentDate.month + "-" + currentDate.day
    const endDate = formatDateBack(getWeekDates(startDate)[6])

    if (window.confirm(`是否要在 '${startDate}~${endDate}' 的課表中\n匯入'${ct_title}'`)) {
      calendarApi.import_course({
        StartDate: startDate,
        EndDate: endDate,
        ct_list_id: data.Tb_index
      }, (res) => {
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
            <DialogTitle sx={{ fontSize: "20px", paddingBottom: "2px" }}>{"模板匯入"}</DialogTitle>
            <DialogTitle sx={{ fontSize: "12px", padding: "0 24px 10px 24px", color: "red" }}>{"匯入的模板無法覆蓋已登記的課表"}</DialogTitle>
            <DialogContent sx={{ width: "100%", padding: "20px 24px !important" }} >
              {templateList &&
                <FormControl fullWidth >
                  <InputLabel id="demo-simple-select-label">模板</InputLabel>
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
                    label="模板"
                    sx={{ width: "80%", maxWidth: "300px", "& .MuiButtonBase-root": { padding: "0 16px" } }}>
                    {templateList.map((item, i) => (
                      <MenuItem key={item.Tb_index} value={item.Tb_index} >
                        {item.ct_title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </DialogContent>
            <Box display={"flex"} justifyContent={"flex-end"} width={"94%"}>
              <Button onClick={handleSubmit}>OK</Button>
              <Button onClick={handleCancel}>Cancel</Button>
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
  const [studentAll, setStudentAll] = useState([]);
  const [teacherAll, setTeacherAll] = useState([]);
  const scrollRef = useRef(null)
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  let scrollNum = 0;
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
    const startDate = initDate.year + "-" + initDate.month + "-" + initDate.day
    const endDate = formatDateBack(getWeekDates(startDate)[6])
    calendarApi.getAll(startDate, endDate).then((data) => {
      console.log(data.data)
      dispatch(calendarTableDataAction(dataTransformTable(data.data)))
    })
  }, [])
  useEffect(()=>{
    console.log(teacherAll)
  },[teacherAll])

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
              <Button onClick={() => {
                const monday_weekNumber = getWeekInfoForDate(new Date());
                const startDate = monday_weekNumber.year + "-" + monday_weekNumber.month + "-" + monday_weekNumber.day
                const endDate = formatDateBack(getWeekDates(startDate)[6])
                calendarApi.getAll(startDate, endDate).then((data) => {
                  dispatch(calendarTableDataAction(dataTransformTable(data.data)))
                })
                dispatch(calendarDateAction(getWeekInfoForDate(new Date())))
              }}>TODAY</Button>
              {authorityRange.p_update&&<ImportTemplate />}
            </Box>
            <h4>{`${currentDate.year}年${currentDate.month}月第${currentDate.weekNumber}週` + "學生課表"}</h4>
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
                  console.log(scrollRef)
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
              <div className="nav">
                <span>選擇日期</span>
                <FirstComponent currentDate={currentDate} />
              </div>
              {authorityRange.p_update&& <LessonPopUp type={"insert"} studentAll={studentAll} teacherAll={teacherAll} />}
          
            </Box>

          </Box>
          {teacherAll && <TeacherColor data={teacherAll}/>}
          <Calendar ref={scrollRef} tableData={tableData} currentDate={currentDate} studentAll={studentAll} teacherAll={teacherAll} />
        </>
        : <IsLoading />
      }

    </Box >
  )
}

const Calendar = forwardRef(({ tableData, currentDate, studentAll, teacherAll }, ref) => {
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
          {getWeekDates(currentDate.year + "-" + currentDate.month + "-" + currentDate.day).map((date, i) => {
            const month = date.getMonth() + 1
            const day = date.getDate()
            return (
              <Box className='day-of-the-week' minWidth={isMobile ? "100%" : "520px"}>
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
                                    <LessonUnit teacherAll={teacherAll} studentAll={studentAll} count={count} uniqueId={uniqueId} data={tableData?.[formatDateBack(date)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]} />
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

const LessonUnit = ({ data, count, teacherAll, studentAll }) => {
  let gap;
  let classTimeStamp;
  if (data) {
    const start = data.StartTime;
    const end = data.EndTime;
    gap = calculateDifferenceIn15Minutes(start, end)
    // 将日期时间字符串解析为Date对象
    const EndTime = new Date(data.c_date +"T"+ end);

    // 获取时间戳
     classTimeStamp = EndTime.getTime();

  }

  return (
    <Box key={data && data.Tb_index} flexBasis="25%" width={"100%"}  >
      {(data && count > 0) ? <LessonPopUp teacherAll={teacherAll} studentAll={studentAll} id={data.Tb_index} name={data.c_name} gap={gap} bg={(Date.now() < classTimeStamp)||(data.signin_time && data.signout_time) ? data.t_color : "#FF0000"} type={"update"} /> : null}
    </Box>
  )
}

const LessonPopUp = ({ id, name, gap, bg, type, teacherAll, studentAll }) => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({})
  const [currentDate, setCurrentDate] = useState(null)
  const [tableData, setTableData] = useState(null)
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕

  const dispatch = useDispatch(null)
  const currentDateRedux = useSelector(state => state.calendarReducer.currentDate)
  const handleCancel = () => {
    setOpen(false)
    setData({})
  }

  const handleSubmit = () => {


    const startDate = currentDateRedux.year + "-" + currentDateRedux.month + "-" + currentDateRedux.day
    const endDate = formatDateBack(getWeekDates(startDate)[6])
    if (type === "update") {
      calendarApi.updateOne(data, (res) => {
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          calendarApi.getAll(startDate, endDate).then((data) => {
            dispatch(calendarTableDataAction(dataTransformTable(data.data)))
          })
        }
      })
    } else {
      calendarApi.insertOne(data, (res) => {
        const status = res.data.success ? "success" : "error"
        dispatch(snackBarOpenAction(true, res.data.msg, status))
        if (res.data.success) {
          calendarApi.getAll(startDate, endDate).then((data) => {
            dispatch(calendarTableDataAction(dataTransformTable(data.data)))
          })
        }
      })
    }


    setOpen(false)
  }

  const handleDelete = () => {
    if (window.confirm("確定要刪除此課程嗎?")) {
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


  useEffect(() => {
    if (currentDate) {
      calendarApi.getAll(formatDateBack(currentDate), formatDateBack(currentDate)).then((data) => {
        setTableData(dataTransformTable(data.data));
      })
    }
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

   


  if (bg || type === "insert") {
    return (
      <>
        {type === "update" ?
          <Box className='lesson-unit' height={`calc(${100 * gap}% + ${gap + (gap / 4) - 1}px)`} bgcolor={bg} boxShadow={" 0 0 0 1px #000"} sx={{ pointerEvents: "auto", zIndex: 99 }} onClick={(e) => {
            e.stopPropagation()
            calendarApi.getOne(id, (data) => {
              setData(data.data.data[0])
              setOpen(true)
            })
          }}>
            <p style={{ margin: 0, color: getContrastColor(bg), fontWeight: "500", pointerEvents: "none" }}>{name}</p>
          </Box> :
          <Button variant="contained" sx={{ backgroundColor: "#6DC4C5", width: "85px", gap: "5px" }} onClick={(e) => {
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
              <DialogTitle sx={{ fontSize: "20px" }}>{!authorityRange.p_update ?"課程瀏覽" : type === "update" ? "課程修改" : "課程新增"}</DialogTitle>
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
                  disabled={!authorityRange.p_update}
                />
              </DialogContent>
              <DialogContent>
                {((studentAll && data.student) || type === "insert") && <MultiSelect studentAll={studentAll} data={data} setData={setData} type={type} author={authorityRange.p_update}/>}
              </DialogContent>
              <DialogContent sx={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap", "& .input": { flex: "0 0 45%", "& label": { color: "#000" }, "& input": { WebkitTextFillColor: "#000" } } }}>
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
              <DialogContent sx={{ display: "flex", justifyContent: (type === "update" && authorityRange.p_delete)? "space-between" : "flex-end", alignItems: "center", "& button": { fontSize: "16px" } }}>
                {authorityRange.p_delete&& type === "update" && <Button onClick={handleDelete} sx={{ backgroundColor: "#d85847", color: "#fff", "&:hover": { backgroundColor: "#ad4638" } }}>刪除</Button>}
              
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

export const TimeSelect = ({ setCurrentDate }) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const handleCancel = () => {
    setOpen(false)
  }
  const handleChange = (e) => {
    setDate(e._d)
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
            <LocalizationProvider dateAdapter={AdapterMoment}>
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
  )

}




const ClassOverView = () => {
  return (
    <div style={{ width: '95%', margin: '20px auto 0' }}>
      <Header title="課表行事曆" subtitle="昨日之前的課表(含昨日)，不能做新增、修改、刪除的操作!" warm={true} />
      <CalendarTop />
    </div>
  );
};

export default ClassOverView;