import { Box, IconButton, useMediaQuery, } from "@mui/material";
// import { useContext } from "react";
// import { ColorModeContext, tokens } from "../../theme";

import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

import Notification from './Notification';

import { useDispatch } from "react-redux";
import { menuInAction, clearReduxStateAction } from "../../redux/action";
import { useNavigate } from "react-router-dom";
//import { Qrcode } from "../teacher";
const Topbar = () => {

  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  const dispatch = useDispatch(null)
  const navigate = useNavigate()

  return (
    <Box display="flex" justifyContent={isMobile ? "space-between" : "flex-end"} alignItems={"center"} p={2} sx={{
      position:"fixed",
      left:0,
      top:0,
      backgroundColor:"#FCFCFC",
      zIndex:800,
      width:"100%"
    }}>
      {/* menu hamburger */}
      <MenuIcon sx={
        {
          display: "none",
          width: "30px",
          height: "30px",
          "@media all and (max-width:850px)": {
            display: "block"
          }
        }
      } onClick={() => dispatch(menuInAction(true))} />
      {/* SEARCH BAR */}
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      {/* ICONS */}
      <Box display="flex">
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton> */}
        {/* <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        <Box display={"flex"} alignItems={"center"} gap={"7px"}>
          
          { //-- 自己的Qrcode --
            /* {userData?.inform?.Tb_index && <Qrcode value={userData.inform.Tb_index} />} */
          }

          {/* 通知功能 */}
          <Notification/>

          <IconButton onClick={() => {
            if (window.confirm("確認登出系統?")) {
              window.localStorage.removeItem("refresh_jwt")
              window.sessionStorage.removeItem("jwt")
              dispatch(clearReduxStateAction())
              navigate("/")
            }
          }}>
            <LogoutIcon />
          </IconButton>
          
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
