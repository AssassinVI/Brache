import React, { useEffect, useRef, useState } from 'react'
import { addMinutesToTime, calculateDifferenceIn15Minutes, convertToChineseNumber, formatDateBack, getContrastColor, dataTransformTable } from './getMonday';
import { Box, Button, DialogActions, useMediaQuery, Chip } from '@mui/material';
import { SelectableGroup } from 'react-selectable-fast';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import { createSelectable } from "react-selectable-fast";
import * as courseApi from "../../axios-api/calendarData";

//-- 顯示課程 --
const SelectArea = ({ selectableRef, isSelected, isSelecting, uniqueId, data = false, gap }) => {
  //獲取使用者資訊
  const userData = useSelector(state => state.accessRangeReducer)

  return (
    <Box width={"100%"} height={"100%"} className={`${isSelected ? 'selected' : ''} ${isSelecting ? 'selecting' : ''}`} data-uniqueid={uniqueId} ref={selectableRef} position={"relative"}>

      {data && <Box className='lesson-unit' position={"absolute"} left={0} top={0} height={`calc(${100 * gap}% + ${gap + (gap / 4) - 1}px)`} bgcolor={`${data.t_color}99`} boxShadow={" 0 0 0 1px #000"} sx={{ pointerEvents: "none", color: getContrastColor(data.t_color) }}>
        
        <Chip label={'假'} 
            size="small" 
            sx={{
              position:'absolute', 
              top:'-5px', 
              right:'-3px', 
              height: '16px',
              fontSize:'11px',
              padding:'6px 0',
              backgroundColor: '#c69e0e',
              color: '#fff',
              display: data.askForLeave_time!==null ? 'inline-flex' : 'none'
              }}/>
        
        {
        data.student.map((student)=>{
          // console.log(data);
          //-- 老師自己的課顯示學生名 --
          if(userData.inform.admin_per!=="group2023071815332755" || (userData.inform.admin_per==="group2023071815332755" && data.teacher_id===userData.inform.Tb_index)){
              return (
                <p style={{margin: 0,}}>{student.name}</p>
              )
          }
          //-- 顯示課程名 --
          else{
            return (
              <p style={{margin: 0, opacity:0.4}}>{data.c_name}</p>
            )
          }
        })
      }</Box>}
    </Box>
  )
}

//-- 異動單課程 --
const TransferArea = ({ uniqueId, data = false, gap }) => {

  return (
    <Box width={"100%"} height={"100%"} data-uniqueid={uniqueId}  position={"absolute"}>

      {data && <Box className='lesson-unit' position={"absolute"} left={0} top={0} height={`calc(${100 * gap}% + ${gap + (gap / 4) - 1}px)`} bgcolor={`${data.t_color}99`} boxShadow={" 0 0 0 1px #000"} sx={{zIndex: "110 !important", pointerEvents: "none", color: getContrastColor(data.t_color) }}>
        
        <Chip label={'異動'} 
            size="small" 
            sx={{
              position:'absolute', 
              top:'-5px', 
              right:'-3px', 
              height: '16px',
              fontSize:'11px',
              padding:'6px 0',
              backgroundColor: '#a31313',
              color: '#fff',
              display: 'inline-flex'
              }}/>
        
        {
        data.student.map((student)=>{
          // console.log(data);
          return (
            <p style={{margin: 0,}}>{student.name}</p>
          )
        })
      }</Box>}
    </Box>
  )
}

const CreateSelectable = createSelectable(SelectArea);

//-- 課程單元 --
const LessonUnit = ({transferData=null, changeCourse=null, data, uniqueId, tType }) => {
  let gap, tData, tGap, tStart, tEnd, tRoom, uniqueId_arr;
  if (data) {
    const start = data.StartTime;
    const end = data.EndTime;
    gap = calculateDifferenceIn15Minutes(start, end)
    // console.log(data, uniqueId);
  }

  if(transferData){
        uniqueId_arr=uniqueId.split(' ')
        uniqueId_arr=uniqueId_arr[1].split('/')
        
    if(tType==="before"){
      tRoom=transferData.change_type==="4" ? transferData.change_room_name : transferData.before_room_name;
      tStart = transferData.change_type==="4" ? transferData.change_StartTime : transferData.before_StartTime;
      tEnd = transferData.change_type==="4" ? transferData.change_EndTime :  transferData.before_EndTime;
    }
    else{
      tRoom= changeCourse!==null ? changeCourse.room_name : transferData.change_room_name;
      tStart = changeCourse!==null ? changeCourse.StartTime : transferData.change_StartTime;
      tEnd = changeCourse!==null ? changeCourse.EndTime : transferData.change_EndTime;
    }
    
    tGap = calculateDifferenceIn15Minutes(tStart, tEnd)

    tData={
      t_color: '#cccccc',
      student: transferData.student,
    }
  }
    
  

  return (
    <Box key={data && data.Tb_index} flexBasis="25%" width={"100%"}  >
      {transferData && tStart===uniqueId_arr[0] && tRoom===uniqueId_arr[1] ? <TransferArea uniqueId={uniqueId} data={tData} gap={tGap} /> : ''}
      {<CreateSelectable uniqueId={uniqueId} data={data} gap={gap} />}
    </Box>
  )
}

const SelectCalendar = ({ currentDate = new Date(), setCurrentDate, data }) => {

  const [tableDataNEW, setTableDataNEW] = useState(null)
  const [tableDataChNEW, setTableDataChNEW] = useState(null)
  const [transferDate, setTransferDate] = useState(null)
  const [transferChDate, setTransferChDate] = useState(null)
  const [changeCourse, setChangeCourse] = useState(null)

  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕

  // const month = currentDate.getMonth() + 1;
  // const date = currentDate.getDate()
  // const day = currentDate.getDay()
  const [month, setMonth] = useState(null)
  const [date, setDate] = useState(null)
  const [day, setDay] = useState(null)

  const [chMonth, setChMonth] = useState(null)
  const [chDate, setChDate] = useState(null)
  const [chDay, setChDay] = useState(null)

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

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

  const classesId = [
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "1",
    "99"
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
  //滑鼠選取
  const [selectedElements, setSelectedElements] = useState([]);
  const selectedGroupsRef = useRef([]);

  const addGroupRef = (groupRef) => {
    if (selectedGroupsRef.current.length >= 8) {
      selectedGroupsRef.current = []
      selectedGroupsRef.current.push(groupRef);
    } else {
      selectedGroupsRef.current.push(groupRef);
    }

  };
  // useEffect(() => {
  //   if (selectedElements[0]) {
  //     selectedElements.forEach((item) => {
  //       console.log(item.props.uniqueId)
  //     })
  //   }
  // }, [selectedElements])

  useEffect(()=>{
    //-- 將日期帶入 --
    //-- 加課只有change_date --
     let tDate=data.change_type==="4" ? data.change_date.split('-') : data.before_date.split('-');
     setTransferDate(new Date(tDate[0], parseInt(tDate[1])-1, tDate[2]))

     console.log(data)

     if(data.change_type==="1"){
       let tDate=data.change_date.split('-');
       setTransferChDate(new Date(tDate[0], parseInt(tDate[1])-1, tDate[2]))
     }
     //-- 換課要撈換課資料 --
     else if(data.change_type==="2"){
      courseApi.getOne(data.change_course_id, (data)=>{
        let tDate=data.data.data[0].c_date.split('-');
        setTransferChDate(new Date(tDate[0], parseInt(tDate[1])-1, tDate[2]))
        setChangeCourse(data.data.data[0]);
      })
     }
  
  }, [])

  //-- 異動前日期 --
  useEffect(()=>{
    if(transferDate!==null){
      setMonth(transferDate.getMonth() + 1)
      setDate(transferDate.getDate())
      setDay(transferDate.getDay())
      //獲取calendar的資料
      courseApi.getCourseAll(formatDateBack(transferDate), formatDateBack(transferDate)).then((data) => {
        setTableDataNEW(dataTransformTable(data.data));
      })
    }
  }, [ transferDate])

  //-- 異動後日期 --
  useEffect(()=>{
    if(transferChDate!==null){
      setChMonth(transferChDate.getMonth() + 1)
      setChDate(transferChDate.getDate())
      setChDay(transferChDate.getDay())
      //獲取calendar的資料
      courseApi.getCourseAll(formatDateBack(transferChDate), formatDateBack(transferChDate)).then((data) => {
        setTableDataChNEW(dataTransformTable(data.data));
      })
    }
  }, [transferChDate])

  // useEffect(()=>{
  //   console.log(tableDataNEW)
  // }, [ tableDataNEW])

  useEffect(() => {
    selectedGroupsRef.current.forEach((groupRef) => {
      if (groupRef) {
        groupRef.clearSelection();
      }
    });
  }, [currentDate])

  const [selectionStart, setSelectionStart] = useState(false);

  const handleSelectionStart = () => {
    if (selectionStart) {
      selectedGroupsRef.current.forEach((groupRef) => {
        groupRef.clearSelection();
      });
      setSelectionStart(false)
    }


  };
  const handleSelectionFinish = (selectedItems) => {
    setSelectedElements(selectedItems);
    setSelectionStart(true)
  };

  // const handleSubmit = () => {
  //   const sortedSelectableItems = selectedElements.slice().sort((item1, item2) => {
  //     const [date1, time1] = item1.props.uniqueId.split('/');
  //     const [date2, time2] = item2.props.uniqueId.split('/');

  //     if (date1 !== date2) {
  //       // 先按日期排序
  //       return new Date(date1) - new Date(date2);
  //     } else {
  //       // 如果日期相同，再按開始時間排序
  //       const [start1] = time1.split('-');
  //       const [start2] = time2.split('-');
  //       return start1.localeCompare(start2);
  //     }
  //   });
  //   const endTime = addMinutesToTime(sortedSelectableItems[sortedSelectableItems.length - 1].props.uniqueId.split("/")[0].split(" ")[1], 15);
  //   const startTime = sortedSelectableItems[0].props.uniqueId.split("/")[0].split(" ")[1];
  //   const class_type = sortedSelectableItems[0].props.uniqueId.split("/")[1];
  //   const year_date_day = sortedSelectableItems[0].props.uniqueId.split("/")[0].split(" ")[0];
  //   setData({
  //     ...data,
  //     StartTime: startTime,
  //     EndTime: endTime,
  //     room_name: class_type,
  //     c_date: year_date_day
  //   })
  //   handleCancel()
  // }

  const handleCancel = () => {
     setCurrentDate(null)
  }

  return (
    <>
     <Box>
        <h3>
         {data.change_type==="1" || data.change_type==="2" ? "異動前課表":"異動的課表"}
        </h3>
        <Box className='calendar' display={"flex"} m={"20px 0 0"} sx={{
          width: "100%",
          height: "100vh",
          minHeight: "1020px",
          border: "1px solid #000",
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
                "& .calendar-y-axis": {
                  "& .selected": {
                    backgroundColor: "#2970bc",

                  },
                  "& .selecting": {
                    backgroundColor: "#7bb6f5",

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
                  <Box key={item.start + item.end} className='hour' display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={`calc((100%) /  ${lessonTime.length})`}
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

          <Box className='calendar-content' display={"flex"} overflow={"hidden"} >
            <Box className='day-of-the-week' minWidth={isMobile ? "100%" : "520px"} >
              <Box className='calendar-date'>
                {transferDate && <h6>{`${month}月${date}日(星期${convertToChineseNumber(day)})`}</h6>}
              </Box>
              <Box display={"flex"} className='calendar-square' >
                {classes.map((class_type, index) => {
                  let count = 0
                  return (
                    <>
                      {
                        transferDate && 
                        <SelectableGroup
                          disabled={true}
                          allowClickWithoutSelected={false}
                          key={class_type} // 設置唯一的key
                          resetOnStart={true}
                          onSelectionFinish={(selectedItems) => {
                            handleSelectionFinish(selectedItems)
                          }}
                          duringSelection={handleSelectionStart}
                          ref={(ref) => addGroupRef(ref)}
                          style={{ width: `calc(100% / 8)` }}
                          className={`calendar-y-axis`}>
    
                          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} className='class-name' >
                            <p>{class_type}</p>
                          </Box>
                          {lessonTime.map((time, i) => {
                            return (
                              <Box key={time.end + time.start} className='lesson-box' display={"flex"} flexDirection={"column"} width={"100%"} height={`calc((100% - 40px) / ${lessonTime.length})`}
                                sx={{
                                  backgroundColor: i % 2 === 0 ? colors.primary[400] : "#fff"
                                }}
                              >
                                {tableDataNEW !== null &&
                                  [...Array(4)].map((_, i) => {
                                    const uniqueId = `${transferDate.getFullYear()}-${month}-${date} ${addMinutesToTime(time.start, (i) * 15)}/${class_type}/${classesId[index]}`
    
                                    if (tableDataNEW?.[formatDateBack(transferDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]) {
                                      const start = tableDataNEW?.[formatDateBack(transferDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].StartTime;
                                      const end = tableDataNEW?.[formatDateBack(transferDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].EndTime;
                                      count = calculateDifferenceIn15Minutes(start, end)
                                    } else {
                                      if (count > 0) {
                                        --count
                                      } else {
                                        count = 0
                                      }
                                    }
                                    return (
                                        <LessonUnit tType={'before'} transferData={data} changeCourse={changeCourse} count={count} uniqueId={uniqueId} data={tableDataNEW?.[formatDateBack(transferDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]} />
                                    )
                                  })
                                }
                              </Box>
                            )
                          })}
                        </SelectableGroup>
                      }
                    </>
                    

                  )

                })}

              </Box>
            </Box>
          </Box>

        </Box>

        {
          transferChDate && 
          <>
             <h3>異動後課表</h3>
              <Box className='calendar' display={"flex"} m={"20px 0 0"} sx={{
                width: "100%",
                height: "100vh",
                minHeight: "1020px",
                border: "1px solid #000",
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
                      "& .calendar-y-axis": {
                        "& .selected": {
                          backgroundColor: "#2970bc",

                        },
                        "& .selecting": {
                          backgroundColor: "#7bb6f5",

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
                        <Box key={item.start + item.end} className='hour' display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={`calc((100%) /  ${lessonTime.length})`}
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

                <Box className='calendar-content' display={"flex"} overflow={"hidden"} >
                  <Box className='day-of-the-week' minWidth={isMobile ? "100%" : "520px"} >
                    <Box className='calendar-date'>
                      {transferChDate && <h6>{`${chMonth}月${chDate}日(星期${convertToChineseNumber(chDay)})`}</h6>}
                    </Box>
                    <Box display={"flex"} className='calendar-square' >
                      {classes.map((class_type, index) => {
                        let count = 0
                        return (
                          <SelectableGroup
                            disabled={true}
                            allowClickWithoutSelected={false}
                            key={class_type} // 設置唯一的key
                            resetOnStart={true}
                            onSelectionFinish={(selectedItems) => {
                              handleSelectionFinish(selectedItems)
                            }}
                            duringSelection={handleSelectionStart}
                            ref={(ref) => addGroupRef(ref)}
                            style={{ width: `calc(100% / 8)` }}
                            className={`calendar-y-axis`}>

                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} className='class-name' >
                              <p>{class_type}</p>
                            </Box>
                            {lessonTime.map((time, i) => {
                              return (
                                <Box key={time.end + time.start} className='lesson-box' display={"flex"} flexDirection={"column"} width={"100%"} height={`calc((100% - 40px) / ${lessonTime.length})`}
                                  sx={{
                                    backgroundColor: i % 2 === 0 ? colors.primary[400] : "#fff"
                                  }}
                                >
                                  {tableDataChNEW !== null &&
                                    [...Array(4)].map((_, i) => {
                                      const uniqueId = `${transferChDate.getFullYear()}-${month}-${date} ${addMinutesToTime(time.start, (i) * 15)}/${class_type}/${classesId[index]}`

                                      if (tableDataChNEW?.[formatDateBack(transferChDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]) {
                                        const start = tableDataChNEW?.[formatDateBack(transferChDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].StartTime;
                                        const end = tableDataChNEW?.[formatDateBack(transferChDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].EndTime;
                                        count = calculateDifferenceIn15Minutes(start, end)
                                      } else {
                                        if (count > 0) {
                                          --count
                                        } else {
                                          count = 0
                                        }
                                      }
                                      return (
                                        <LessonUnit tType={'after'} transferData={data} changeCourse={changeCourse} count={count} uniqueId={uniqueId} data={tableDataChNEW?.[formatDateBack(transferChDate)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]} />
                                      )
                                    })
                                  }
                                </Box>
                              )
                            })}
                          </SelectableGroup>
                        )
                      })}

                    </Box>
                  </Box>
                </Box>

              </Box>
          </>
        }
        
     </Box>
      
      <DialogActions sx={{ paddingRight: 0, "& button": { padding: "3px 8px", fontSize: "14px" } }}>
        {/* <Button onClick={handleSubmit}>確定</Button> */}
        <Button onClick={handleCancel}>取消</Button>
      </DialogActions>
    </>

  )
}

export default SelectCalendar
