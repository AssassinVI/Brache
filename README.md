# React Admin Dashboard

Build a COMPLETE React Admin Dashboard App | React, Material UI, Data Grid, Light & Dark Mode

Video: https://www.youtube.com/watch?v=wYpCWwD1oz0

For all related questions and discussions about this project, check out the discord: https://discord.gg/2FfPeEk2mX


<!-- const Calendar = ({ tableData, currentDate }) => {
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

  //滑鼠選取
  const [area, setArea] = useState("")
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [selectedElements, setSelectedElements] = useState([]);
  const handleMouseDown = (e) => {
    if (e.target.classList[0] !== "lesson-unit") {
      setSelectedElements([e.target.getAttribute('data-uniqueid')]);
      setIsMouseDown(true)
    }
  }
  const handleMouseMove = (e) => {

    if (isMouseDown && e.target.classList[0] !== "lesson-unit") {
      console.log(1)
      const uniqueId = e.target.getAttribute('data-uniqueid');
      setSelectedElements(prevSelected => [...new Set([...prevSelected, uniqueId])]);


    }
  };
  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  // useEffect(() => {
  //   console.log([...new Set(selectedElements)])
  // }, [selectedElements])

  return (
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
        minWidth: "80px",
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
            "& .calendar-y-axis": {
              pointerEvents: "auto",
              "& .selected": {
                backgroundColor: "#ffcdcd",

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

                    zIndex: "1",
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
      <Box className='calendar-content' display={"flex"} overflow={"scroll"}>
        {getWeekDates(currentDate.year + "-" + currentDate.month + "-" + currentDate.day).map((date, i) => {
          const month = date.getMonth() + 1
          const day = date.getDate()
          return (
            <Box className='day-of-the-week' minWidth={"520px"} >
              <Box className='calendar-date'>
                {date && <h6>{`${month}月${day}日(星期${convertToChineseNumber(i + 1)})`}</h6>}
              </Box>
              <Box display={"flex"} className='calendar-square'>
                {classes.map((class_type) => {
                  return (
                    <Box width={"calc(100%/8)"} className={`calendar-y-axis`}
                      onMouseDown={(e) => {
                        handleMouseDown(e)
                        setArea(class_type)
                      }}
                      onMouseMove={(e) => {
                        if (class_type === area) {
                          handleMouseMove(e)
                        } else {
                          handleMouseUp()
                        }
                      }}

                      onMouseUp={handleMouseUp}
                      key={class_type}
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
                                const uniqueId = `${date.getFullYear()}-${month}-${day}/${class_type}/${addMinutesToTime(time.start, (i) * 15)}`
                                return (
                                  <LessonUnit uniqueId={uniqueId} cla={selectedElements.includes(uniqueId) ? 'selected' : ''} data={tableData?.[formatDateBack(date)]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]} />
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
  )
} -->