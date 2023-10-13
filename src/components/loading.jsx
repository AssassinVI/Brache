import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
export const IsLoading = ({ style }) => {
    return (
        <div className="isLoading" style={{ width: "100%", height: "100%", display: "flex", minHeight: "inherit", justifyContent: "center", alignItems: "center", ...style }}><CircularProgress /></div>
    )
}
