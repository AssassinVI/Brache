import {useState, useRef, useEffect} from 'react'
import { Box, IconButton, MenuList, MenuItem, ClickAwayListener, Grow, Paper, Popper, ListItemIcon, ListItemText, Typography, Chip, Badge } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import ContentPaste from '@mui/icons-material/ContentPaste';
import * as changeApi from "../../axios-api/changeSystem"
import { useSelector, useDispatch } from "react-redux";
import {useNavigate } from "react-router-dom";
import {notificationListAction} from '../../redux/action'

const Notification=()=>{

    const userData = useSelector(state => state.accessRangeReducer)
    //儲存list資料
    const notificationList = useSelector(state => state.notificationListReducer)
    const navigate=useNavigate(null);
    const dispatch=useDispatch(null);

    //-- 通知按鈕用 --
    const [open, setOpen] = useState(false);
    const [badgeInvisible, setBadgeInvisible]=useState(true);
    const anchorRef = useRef(null);
    const handleToggle = () => {
        if(notificationList.data!==undefined && notificationList.data!==null && 
          (notificationList.data.you_approval.length>0 || notificationList.data.turn_down.length>0 || notificationList.data.student_record.length>0) ){
            setOpen((prevOpen) => !prevOpen);
        }
    };

    const handleClose = (nav) => {
        // if (anchorRef.current && anchorRef.current.contains(event.target)) {
        //   return;
        // }
        navigate(nav);
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        } else if (event.key === 'Escape') {
        setOpen(false);
        }
    }

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    //-- 獲取通知資料 --
    useEffect(()=>{
        if(userData.inform !== null){

            const userId = userData.inform.Tb_index;
            changeApi.course_transfer_notification(userId, 
            (res)=>{
                dispatch(notificationListAction({
                  data: res.data.data,
                }))
            })
        }
        
    }, [userData])

    //-- 有通知資料就顯示 --
    useEffect(()=>{

        if(notificationList.reflash){
          const userId = userData.inform.Tb_index;
          changeApi.course_transfer_notification(userId, 
          (res)=>{
              dispatch(notificationListAction({
                data: res.data.data,
                reflash: false
              }))
          })
        }

        if(notificationList.data!==undefined && notificationList.data!==null && 
          (notificationList.data.you_approval.length>0 || notificationList.data.turn_down.length>0 || notificationList.data.student_record.length>0)){
            setBadgeInvisible(false);
        }
        else{
           setBadgeInvisible(true);
        }

        console.log(notificationList);
    }, [notificationList])

    return(
        <Box>
            <IconButton 
            id="noteBtn" 
            ref={anchorRef}
            aria-controls={open ? 'noteMenu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <Badge color="error" variant="dot" invisible={badgeInvisible}>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
              >
                <Paper sx={{ width: 320, maxWidth: '100%' }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem sx={{display: notificationList.data.you_approval.length ===0 ? 'none':'flex'}} onClick={()=>{handleClose("/schedule-change")}}>
                        <ListItemIcon><ReceiptLong/></ListItemIcon>
                        <ListItemText>您有異動單需要簽核</ListItemText>
                        <Typography variant="body2" color="text.secondary"><Chip label={notificationList.data.you_approval.length} color="error" /></Typography>
                      </MenuItem>
                      <MenuItem sx={{display: notificationList.data.turn_down.length ===0 ? 'none':'flex'}} onClick={()=>{handleClose("/schedule-change")}}>
                        <ListItemIcon><ReceiptLong/></ListItemIcon>
                        <ListItemText>您有異動單被駁回</ListItemText>
                        <Typography variant="body2" color="text.secondary"><Chip label={notificationList.data.turn_down.length} color="error" /></Typography>
                      </MenuItem>
                      <MenuItem sx={{display: notificationList.data.student_record.length ===0 ? 'none':'flex'}} onClick={()=>{handleClose("/class-record")}}>
                        <ListItemIcon><ContentPaste/></ListItemIcon>
                        <ListItemText>{userData.inform.position_type==='3' ? `您有新的上課紀錄表需要紀錄` : `您有上課紀錄表需要審閱`}</ListItemText>
                        <Typography variant="body2" color="text.secondary"><Chip label={notificationList.data.student_record.length} color="error" /></Typography>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Box>
    );
}



export default Notification;