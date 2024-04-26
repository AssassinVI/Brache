import * as React from 'react';
import {Autocomplete, Box, TextField} from '@mui/material';
import { useState, useEffect } from 'react';

export default function TeacherSelect({ teacherAll, data, setData, setName='teacher_id', type, author }) {
  //  const [autocompleteTeacherAll, setAutocompleteTeacherAll] = useState([]);

  return(
    <Box sx={{
      '& .MuiInputBase-input': {
        fontSize: '18px'
      }
    }}>
      <Autocomplete
        options={teacherAll}
        getOptionLabel={(option) => option.name}
        id="controlled-demo"
        // disableClearable
        readOnly={type=='needApproval' ? true:false}
        onChange={(event, newValue) => {
          // setSearchStudent(newValue===null ? null: newValue.Tb_index);
          // console.log(data)
          let dataObj=data;
          if(setName=='teacher_id'){
            dataObj.teacher_id=newValue.Tb_index;
          }
          else if(setName=='change_teacher_id'){
            dataObj.change_teacher_id=newValue.Tb_index;
          }
          setData(dataObj);

        }}
        renderInput={(params) => (
            <TextField {...params} label="老師" variant="standard" />
        )}
        defaultValue={
          teacherAll.find((item, index) => {
            if(setName=='teacher_id'){
              return item.Tb_index===data.teacher_id
            }
            else if(setName=='change_teacher_id'){
              return item.Tb_index===data.change_teacher_id
            }
            
          })
        }
        sx={{width:'200px'}}
      />
    </Box>
  )
}