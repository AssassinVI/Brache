import { useState } from "react";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import { Box, CssBaseline, ThemeProvider, CircularProgress } from "@mui/material";
import { ColorModeContext, useMode  } from "./theme";
import ModuleManage from "./scenes/module-manage";
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { snackBarOpenAction } from "./redux/action";
import { SystemArchitecture } from "./scenes/system-architecture";
import Authority from "./scenes/authority";
import AdminManagement from "./scenes/admin";
import Login from "./scenes/login";
import Qrcode from "./scenes/qrcode";
import Post from "./scenes/qrcode/post";
import StudentDataList from "./scenes/student";
import TeacherDataList from "./scenes/teacher";
import ClassroomCalendar from "./scenes/calendar";
import SignInSheet from "./scenes/signin-sheet";
import ClassRecord from "./scenes/class-record";
import ClassHistory from "./scenes/class-history";
import ScheduleChange from "./scenes/change-system/scheduleChange";
import ChangeHistory from "./scenes/change-system/changeHistory";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const snackbarOpen = useSelector(state => state.snackbarOpenReducer)
  const dispatch = useDispatch(null)
  const handleClose = () => {
    dispatch(snackBarOpenAction(false));
  };
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* axios讀取 */}
        <div id="loadingBox" style={{
          position:'fixed', 
          zIndex:1000,
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffffa1',
          backdropFilter: 'blur(10px)',
          display:'none',
          justifyContent:'center',
          alignItems:'center'
        }}>
            <CircularProgress color="inherit" />
        </div>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/qrcode" element={<Qrcode />} >
            <Route path=":Tb_index" element={<Post />} />
          </Route>
          <Route path="*" element={<Main setIsSidebar={setIsSidebar} isSidebar={isSidebar} />} />
        </Routes>



        <Snackbar open={snackbarOpen.flag} autoHideDuration={2000} anchorOrigin={{vertical:'top', horizontal:'center'}} onClose={handleClose} sx={{
          // top: "3vh !important",
          // bottom: "auto !important",
          // left: "0 !important",
          // right: "0 !important",
          // margin: "auto",
          // height: "70px",
          // width: "50%",
        }}>
          <Alert variant="filled" severity={snackbarOpen.severity} sx={{ width: '100%' }}>
            {snackbarOpen.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const Main = ({ isSidebar, setIsSidebar }) => {
  return (
    <div className="app" >
      <Sidebar isSidebar={isSidebar} />
      <Box className="content" sx={{ position: "relative",paddingLeft:"270px",paddingTop:"50px","@media all and (max-width:850px)":{padding:"55px 0 0 0"} }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Routes>

          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/calendar/*" element={<ClassroomCalendar />} />
          <Route path="/signin-sheet/*" element={<SignInSheet />} />
          {/* 正式 */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/student" element={<StudentDataList />} />
          <Route path="/teacher" element={<TeacherDataList />} />
          <Route path="/module-manage" element={<ModuleManage />} />
          <Route path="/system-architecture" element={<SystemArchitecture />} />
          <Route path="/authority" element={<Authority />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/class-record/:type" element={<ClassRecord />} />
          <Route path="/class-history" element={<ClassHistory />} />
          <Route path="/schedule-change" element={<ScheduleChange />} />
          <Route path="/change-history" element={<ChangeHistory />} />
          <Route path="*" element={<h1 style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>此功能尚未製作完成</h1>} />
        </Routes>
      </Box>
    </div>
  )
}

export default App;
