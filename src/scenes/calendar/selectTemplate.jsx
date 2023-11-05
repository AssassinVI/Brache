import React, { useRef, useState } from 'react'
import { addMinutesToTime, calculateDifferenceIn15Minutes, getContrastColor } from './getMonday';
import { Box, Button, DialogActions, useMediaQuery } from '@mui/material';
import { SelectableGroup } from 'react-selectable-fast';
import { tokens } from '../../theme';
import { useTheme } from '@emotion/react';
import { createSelectable } from "react-selectable-fast";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const SelectArea = ({ selectableRef, isSelected, isSelecting, uniqueId, data = false, gap }) => {
    return (
        <Box width={"100%"} height={"100%"} className={`${isSelected ? 'selected' : ''} ${isSelecting ? 'selecting' : ''}`} data-uniqueid={uniqueId} ref={selectableRef} position={"relative"}>
            {data && <Box className='lesson-unit' position={"absolute"} left={0} top={0} height={`calc(${100 * gap}% + ${gap + (gap / 4) - 1}px)`} bgcolor={data.t_color} boxShadow={" 0 0 0 1px #000"} sx={{ pointerEvents: "none", color: getContrastColor(data.t_color) }}>{data.c_name}</Box>}
        </Box>
    )
}
const CreateSelectable = createSelectable(SelectArea);
const LessonUnit = ({ data, uniqueId }) => {
    let gap;
    if (data) {
        const start = data.StartTime;
        const end = data.EndTime;
        gap = calculateDifferenceIn15Minutes(start, end)
    }

    return (
        <Box key={data && data.Tb_index} flexBasis="25%" width={"100%"}  >
            {<CreateSelectable uniqueId={uniqueId} data={data} gap={gap} />}
        </Box>
    )
}

const SelectTemplate = ({ tableData, initWeekDay = 0, data, setData, handleCancel }) => {
    const theme = useTheme();

    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕

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

    const weeks = [
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "日",
    ]

    const [week, setWeek] = useState(initWeekDay)

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

    const handleSubmit = () => {
        const sortedSelectableItems = selectedElements.slice().sort((item1, item2) => {
            const [date1, time1] = item1.props.uniqueId.split('/');
            const [date2, time2] = item2.props.uniqueId.split('/');

            if (date1 !== date2) {
                // 先按日期排序
                return new Date(date1) - new Date(date2);
            } else {
                // 如果日期相同，再按開始時間排序
                const [start1] = time1.split('-');
                const [start2] = time2.split('-');
                return start1.localeCompare(start2);
            }
        });
        const endTime = addMinutesToTime(sortedSelectableItems[sortedSelectableItems.length - 1].props.uniqueId.split("/")[0].split(" ")[1], 15);
        const startTime = sortedSelectableItems[0].props.uniqueId.split("/")[0].split(" ")[1];
        const class_type = sortedSelectableItems[0].props.uniqueId.split("/")[1];
        const weekDay = sortedSelectableItems[0].props.uniqueId.split("/")[0].split(" ")[0];

        setData({
            ...data,
            StartTime: startTime,
            EndTime: endTime,
            room_name: class_type,
            c_week: weekDay
        })
        handleCancel()
    }
    return (
        <>
            <Box className='calendar' display={"flex"} m={"20px 0 0"} sx={{
                width: "100%",
                height: "80vh",
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

                <Box className='calendar-content' display={"flex"} overflow={"scroll"} >

                    <Box className='day-of-the-week' minWidth={isMobile ? "100%" : "520px"} >
                        <Box className='calendar-date'>
                            <Box className="scroll-button" display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={
                                {
                                    gap: "10px",
                                    pointerEvents: "none",
                                    "& > div": {
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        padding: "5px",
                                        borderRadius: "50%",
                                        pointerEvents: "auto",
                                        "& svg": {
                                            width: "25px",
                                            height: "25px",
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
                                    if (week > 0) {
                                        const next = week - 1
                                        setWeek(next)

                                    }
                                }}>
                                    <ArrowForwardIcon sx={{ transform: "rotateY(180deg)" }} />
                                </div>
                                {<h6>{`星期${weeks[week]}`}</h6>}
                                <div className="right" onClick={(e) => {
                                    if (week < weeks.length - 1) {
                                        const next = week + 1
                                        setWeek(next)
                                    }
                                }}>
                                    <ArrowForwardIcon />
                                </div>
                            </Box>

                        </Box>
                        <Box display={"flex"} className='calendar-square' >
                            {classes.map((class_type) => {
                                let count = 0
                                return (
                                    <SelectableGroup
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
                                                    {tableData.length !== 0 &&
                                                        [...Array(4)].map((_, i) => {
                                                            const uniqueId = `${weeks[week]} ${addMinutesToTime(time.start, (i) * 15)}/${class_type}`

                                                            if (tableData?.[weeks[week]]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]) {
                                                                const start = tableData?.[weeks[week]]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].StartTime;
                                                                const end = tableData?.[weeks[week]]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)].EndTime;
                                                                count = calculateDifferenceIn15Minutes(start, end)
                                                            } else {
                                                                if (count > 0) {
                                                                    --count
                                                                } else {
                                                                    count = 0
                                                                }
                                                            }
                                                            return (
                                                                <LessonUnit count={count} uniqueId={uniqueId} data={tableData?.[weeks[week]]?.[class_type]?.[addMinutesToTime(time.start, (i) * 15)]} />
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
            <DialogActions sx={{ paddingRight: 0, "& button": { padding: "3px 8px", fontSize: "14px" } }}>
                <Button onClick={handleSubmit}>確定</Button>
                <Button onClick={handleCancel}>取消</Button>
            </DialogActions>

        </>

    )
}

export default SelectTemplate
