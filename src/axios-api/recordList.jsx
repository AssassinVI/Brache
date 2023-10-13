
import axiosInstance from "./axiosInstance";
const recordApi = "https://bratsche.web-board.tw/ajax/course_records.php";

export const get_teacher_course = async (datas) => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: recordApi,
            data: {
                type: "get_teacher_course",
                teacher_id: datas.userId,
                StartDate:datas.date
            },
        });

        let data = response.data;
        data.data = data.data.map((item, i) => {
            const updatedItem = {
                ...item,
                index: i,
            };
            return updatedItem;
        });
        return data
    } catch (error) {
        console.error(error);
    }
};



export const get_course_record_one = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: recordApi,
            data: {
                type: "get_course_record_one",
                record_id: id
            }
        }).then((data) => {
            func(data)
        })
    } catch (error) {
        console.error(error);
    }

};

export const set_teacher_record_signIn = (data,func) => {
    try {
        axiosInstance({
            method: "POST",
            url: recordApi,
            data: {
                type: "set_teacher_record_signIn",
                ...data
            }
        }).then((res)=>{
            func(res)
        })
    } catch (error) {
        console.error(error);
    }

};


//老師填寫備註
export const set_teacher_record_remark = (data,func) => {
    try {
        axiosInstance({
            method: "POST",
            url: recordApi,
            data: {
                type: "set_teacher_record_remark",
                ...data
            }
        }).then((res)=>{
            func(res)
        })
    } catch (error) {
        console.error(error);
    }

};

//學生填寫練習時間
export const set_student_course_record = (data,func) => {
    try {
        axiosInstance({
            method: "POST",
            url: recordApi,
            data: {
                type: "set_student_course_record",
                ...data
            }
        }).then((res)=>{
            func(res)
        })
    } catch (error) {
        console.error(error);
    }

};