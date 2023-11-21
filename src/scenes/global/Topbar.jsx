import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from "react-redux";
import { menuInAction, clearReduxStateAction } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import { Qrcode } from "../teacher";
const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
  const dispatch = useDispatch(null)
  const navigate = useNavigate()
  const userData = useSelector(state => state.accessRangeReducer)

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
          <IconButton onClick={() => {
            if (window.confirm("確認登出系統?")) {
              window.localStorage.removeItem("refresh_jwt")
              window.sessionStorage.removeItem("jwt")
              dispatch(clearReduxStateAction())
              navigate("/")
            }
          }}>
            <NotificationsIcon />
          </IconButton>
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
