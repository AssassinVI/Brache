import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { IsLoading } from "../../components/loading";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import ChangeSheet from "./changeSheet";

export default function YourApproval({listData=[],setListData}){
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery('(max-width:1000px)'); // 媒体查询判断是否为手机屏幕
    const columns = [
        {
            field: "c_name",
            headerName: "課堂名稱",
            flex: isMobile ? 0.7 : 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "keyindate",
            headerName: "申請日期",
            flex: 1,
        },
        {
            field: "change_type",
            headerName: "事由",
            flex: isMobile ? 0.3 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        {rows.row.change_type === "1" && <p>調課</p>}
                        {rows.row.change_type === "2" && <p>換課</p>}
                        {rows.row.change_type === "3" && <p>補簽</p>}
                    </Box>
                )
            }
        },
        {
            field: "modify",
            headerName: "簽核",
            flex: isMobile ? 0.7 : 1,
            renderCell: (rows) => {
                return (
                    <Box display={"flex"} flexWrap={"wrap"} gap={"12px"} width="100%" >
                        <ChangeSheet data={rows.row} crud={"needApproval"} sheetId={rows.row.Tb_index} setListData={setListData}/>
                    </Box>
                )
            }
        },
    ];
    return(
        <Box m={"25px 0"}>
             <Typography variant="h5" sx={{fontWeight:"600"}}>須簽核的異動單</Typography>
             <Box
            m="20px 0 0 0"
            width="100%"
            height="35vh"
            sx={{
                overflowX: "scroll",
                "@media all and (max-width:850px)": {
                    paddingBottom: "40px",
                    height: "40vh"
                },
                "&::-webkit-scrollbar": {
                    display: "none"
                },
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[400],
                    borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[900],
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`,
                },
                "& .MuiDataGrid-row": {
                    borderBottom: "1px solid rgba(224, 224, 224, 1)"
                }
            }}
        >
            {listData ? <DataGrid rowHeight={isMobile ? 95 : 85} rows={listData} getRowId={(row) => row.Tb_index} columns={columns} /> : <IsLoading />}
        </Box>
        </Box>
    )
}