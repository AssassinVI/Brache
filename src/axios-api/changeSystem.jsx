
import axiosInstance from "./axiosInstance";
const changeApi = "https://bratsche.web-board.tw/ajax/course_transfer.php";

//get all
export const get_course_transfer = async (id,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "get_course_transfer",
                admin_id:id
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};

// get course one
export const course_transfer_one = async (id,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "course_transfer_one",
                course_ch_id:id
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};


//-- 異動單通知 --
export const course_transfer_notification = async (id,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "course_transfer_notification",
                admin_id:id
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};

//簽核
export const signIn_course_transfer = async (data,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "signIn_course_transfer",
                ...data
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};



// delete one
export const delete_course_transfer = async (id,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "delete_course_transfer",
                Tb_index:id
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};

export const select_course = async (data,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "select_course",
                ...data
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};




export const insert_course_transfer = async (data,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "insert_course_transfer",
                ...data
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};

export const update_course_transfer = async (data,func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "update_course_transfer",
                ...data
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};

export const course_transfer_history = async (data, func) => {
    try {
      axiosInstance({
            method: 'post',
            url: changeApi,
            data: {
                type: "course_transfer_history",
                ...data
            },
        }).then((data)=>{
            func(data)
        })

  
    } catch (error) {
        console.error(error);
    }
};