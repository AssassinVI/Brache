import * as React from 'react';
import {Autocomplete, Box, TextField} from '@mui/material';
import { useState, useEffect } from 'react';

export default function StudentSelect({ studentAll, data, setData, type, author }) {
  //  const [autocompleteStudentAll, setAutocompleteStudentAll] = useState([]);

  console.log(type)

  return(
    <Box sx={{
      '& .MuiInputBase-input': {
        fontSize: '18px'
      }
    }}>
      <Autocomplete
        options={studentAll}
        getOptionLabel={(option) => option.name}
        id="controlled-demo"
        readOnly={type=='needApproval' ? true:false}
        // disableClearable
        onChange={(event, newValue) => {
          // setSearchStudent(newValue===null ? null: newValue.Tb_index);
          setData({
            ...data,
            student: [newValue],
          });
        }}
        renderInput={(params) => (
            <TextField {...params} label="查詢學生" variant="standard" />
        )}
        defaultValue={data.student===undefined ? []:data.student[0]}
        sx={{width:'200px'}}
      />
    </Box>
  )
}