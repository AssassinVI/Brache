
import axiosInstance from "./axiosInstance";
const calendarApi = "https://bratsche.web-board.tw/ajax/course.php";


export const getCourseAll = async (start, end) => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: calendarApi,
            data: {
                type: "get_course_all",
                s_date: start,
                e_date: end
            },
        });

        let data = response.data;
        return data
    } catch (error) {
        console.error(error);
    }
};


export const getAll = async (start, end) => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: calendarApi,
            data: {
                type: "get_course",
                s_date: start,
                e_date: end
            },
        });

        let data = response.data;
        return data
    } catch (error) {
        console.error(error);
    }
};

export const getOne = (id, func, is_c_state=true) => {
    try {
        axiosInstance({
            method: "POST",
            url: calendarApi,
            data: {
                type: "get_course_one",
                Tb_index: id,
                is_c_state: is_c_state
            }
        }).then((data) => {
            func(data)
        })
    } catch (error) {
        console.error(error);
    }

};

export const updateOne = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: calendarApi,
            data: {
                ...data,
                type: "update_course",
            }
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }

};

export const insertOne = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: calendarApi,
            data: {
                ...data,
                type: "insert_course",
            }
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }
};



export const deleteOne = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: calendarApi,
            data: {
                Tb_index: id,
                type: "delete_course",
            }
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }

};


export const import_course = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: "https://bratsche.web-board.tw/ajax/course_template.php",
            data: {
                ...data,
                type: "import_course",
            },
            //-- POST資料前 --
            transformRequest(data, headers){
                const loadingDOM=document.getElementById('loadingBox');
                loadingDOM.style.display='flex';
                const formData = new FormData();
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        formData.append(key, data[key]);
                    }
                }
                return formData;
            },
            //-- 接收資料後 --
            transformResponse(data){
                const loadingDOM=document.getElementById('loadingBox');
                loadingDOM.style.display='none';
                return JSON.parse(data);
            },
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }

};


export const delete_template_course = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: "https://bratsche.web-board.tw/ajax/course_template.php",
            data: {
                ...data,
                type: "delete_template_course",
            }
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }

};


//-- 課程請假 --
export const askForLeave = (data, func) => {
    try {
        axiosInstance({
            method: 'POST',
            url: "https://bratsche.web-board.tw/ajax/qrcode.php",
            data: {
                ...data,
                type: "askForLeave",
            },
        }).then((data)=>{
            func(data)
        });
        
        return data
    } catch (error) {
        console.error(error);
    }
};


//-- 撈出被覆蓋的請假課程 --
export const get_cover_askForLeave = (data, func) => {
    try {
        axiosInstance({
            method: 'POST',
            url: calendarApi,
            data: {
                ...data,
                type: "cover_askForLeave",
            },
        }).then((data)=>{
            func(data)
        });
        
        return data
    } catch (error) {
        console.error(error);
    }
};