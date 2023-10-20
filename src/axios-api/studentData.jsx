
import axiosInstance from "./axiosInstance";
const studentApi = "https://bratsche.web-board.tw/ajax/student.php";

export const getAll = async () => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: studentApi,
            data: {
                type: "get_student"
            },
        });

        let data = response.data;
        data.data = data.data.map((item, i) => {
            const updatedItem = {
                Tb_index: item.Tb_index,
                name: item.name,
                s_sex: item.s_sex === "1" ? "男" : "女",
                s_year: item.s_year,
                s_birthday: item.s_birthday,
                index: i,

            };
            return updatedItem;
        });
        return data
    } catch (error) {
        console.error(error);
    }
};

export const getOne = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: studentApi,
            data: {
                type: "get_student_one",
                Tb_index: id
            }
        }).then((data) => {

            func(data)
            getAll()
        })
    } catch (error) {
        console.error(error);
    }

};

export const updateOne = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: studentApi,
            data: {
                ...data,
                type: "update_student",
            }
        }).then((data) => {
            func(data)
            getAll()
        })

    } catch (error) {
        console.error(error);
    }

};



export const get_student_course_history_one = async (datas) => {
    try {
        const response = await axiosInstance({
            method: "POST",
            url: "https://bratsche.web-board.tw/ajax/course_history.php",
            data: {
                type: "get_student_course_history_one",
                ...datas
            }
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