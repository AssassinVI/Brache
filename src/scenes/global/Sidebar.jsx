import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useSelector, useDispatch } from "react-redux";
import { menuInAction, systemTreeAction, adminAction } from "../../redux/action";
import { fetchData } from "../../axios-api/systemData";
import { Accordion, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IsLoading } from "../../components/loading"
import axiosInstance from "../../axios-api/axiosInstance";
import * as Icons from '@mui/icons-material'
const Item = ({ treeData, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const renderSelectedIcon = (target) => {
    const IconComponent = Icons[target];
    return IconComponent ? <IconComponent /> : null;
  };
  if (treeData.children && treeData.children.length > 0) {
    return (
      <Accordion sx={
        {
          backgroundColor: "transparent",
          boxShadow: "none",
          "&::before": {
            display: "none"
          },
          "& > .MuiAccordionSummary-root": {
            padding: 0,
            paddingRight: "10px",
            "& > .MuiAccordionSummary-content": {
              margin: 0
            }
          }
        }
      }>

        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <MenuItem
            // active={selected === getIconUrl(treeData.MT_Name).children[0] || selected === getIconUrl(treeData.MT_Name).children[1]}
            style={{
              color: colors.grey[100],
            }}
            onClick={() => {
              if (treeData.router_url) {
                setSelected(treeData.router_url)
              }
            }}
            icon={renderSelectedIcon(treeData.router_icon)}
          >
            <Typography>{treeData.MT_Name}</Typography>
            {treeData.router_url && <Link to={treeData.router_url} />}

          </MenuItem>
        </AccordionSummary>
        {
          treeData.children.map((child) => (

            <MenuItem
              key={child.Tb_index}
              active={selected === child.router_url}
              style={{
                color: colors.grey[100],
                paddingLeft: '2em',
              }}
              onClick={() => setSelected(child.router_url)}
              icon={renderSelectedIcon(child.router_icon)}
            >
              <Typography>{child.MT_Name}</Typography>
              {child.router_url && <Link to={child.router_url} />}
            </MenuItem>
          ))
        }
      </Accordion >
    );
  } else {
    return (
      <MenuItem
        active={selected === treeData.router_url}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(treeData.router_url)}
        icon={renderSelectedIcon(treeData.router_icon)}
      >
        <Typography>{treeData.MT_Name}</Typography>
        {treeData.router_url && <Link to={treeData.router_url} />}
      </MenuItem>
    );
  }
};


const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(null)
  const [selected, setSelected] = useState(location.pathname);
  const menuIn = useSelector(state => state.menuInReducer.flag)
  const adminData = useSelector(state => state.accessRangeReducer)
  const dispatch = useDispatch(null)
  const navigate = useNavigate(null)
  useEffect(()=>{
    console.log(adminData)
  },[adminData])

  //登入後儲存系統架構資料到Redux以及登入者姓名及id
  const userDataStored = () => {
    axiosInstance({
      method: "POST",
      url: "https://bratsche.web-board.tw/ajax/login_ajax.php",
      data: {
        type: "admin"
      }
    }).then((res) => {
      if (res.data.success) {
        const buildTree = (data, parentId) => {
          const hashMap = new Map();
          // 將數據以 parentId 作為鍵值，建立哈希表
          for (const item of data) {
            if (!hashMap.has(item.parent_id)) {
              hashMap.set(item.parent_id, []);
            }
            hashMap.get(item.parent_id).push(item);
          }
          // 使用遞迴構建樹狀結構
          const build = (parentId) => {
            const children = hashMap.get(parentId) || [];

            // 對子節點進行排序，根據參數 orderBy
            children.sort((a, b) => a.OrderBy - b.OrderBy);

            return children.map(child => ({
              Tb_index: child.Tb_index,
              MT_Name: child.MT_Name,
              is_data: child.is_data,
              orderBy: child.OrderBy,
              p_delete: child.p_delete,
              p_insert: child.p_insert,
              p_update: child.p_update,
              router_url: child.router_url,
              router_icon: child.router_icon,
              children: build(child.Tb_index),
            }));
          };
          return build(parentId);
        };

        const treeData = buildTree(res.data.data.permissions, "");
    
        dispatch(adminAction(treeData, {
          name: res.data.data.Group_name,
          access: res.data.data.name,
          Tb_index: res.data.data.Tb_index
        }))
      } else {
        window.alert("尚未登入或連線愈時，請重新登入")
        navigate("/")
      }

    })
  }
  useEffect(() => {
    //初始頁面進入時拿系統架構後端的資料到redux，才能讓模組權限使用
    const sendData = (data) => {
      dispatch(systemTreeAction(data))
    }
    fetchData(sendData)
    //menu渲染用
    userDataStored()
  }, [])

  return (
    <Box
      sx={{
        position:"fixed",
        left:"0",
        top:"0",
        height: "100%",
        zIndex: 900,
        "@media all and (max-width:850px)": {
          position: "fixed",
          left: `${menuIn ? "0" : "-80%"}`,
          top: "0",
          transition: "0.65s",
          height: "100%",
        },
        "& .pro-sidebar-layout::-webkit-scrollbar": {
          width: "5px"
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  巴雀藝術
                </Typography>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }} />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="500"
                  sx={{ m: "10px 0 6px 0" }}
                >
                  {adminData.inform && adminData.inform.name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {adminData.inform && adminData.inform.access}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>

            {adminData.data ? adminData.data.map((item, i) => {
              return (
                <Item
                  treeData={item}
                  selected={selected}
                  setSelected={setSelected}
                  key={item.Tb_index}
                  isData={item.is_data === "1" ? true : false}
                />
              )
            }) : <IsLoading />}

          </Box>
        </Menu>
      </ProSidebar>
      {/* 手機板會有的完全退出按鈕 */}
      <Box sx={{
        display: "none",
        position: "absolute",
        "@media all and (max-width:850px)": {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "50px",
          height: "50px",
          right: "-25px",
          borderRadius: "50%",
          top: "18px",
          zIndex: 1008,
          backgroundColor: colors.grey[900],
          overflow: "hidden"
        },
      }} onClick={() => {
        dispatch(menuInAction(false));
      }}>
        <ArrowLeftIcon sx={{ width: "40px", height: "auto", marginRight: "-3.5px" }} />
      </Box>

    </Box >
  );
};

export default Sidebar;



