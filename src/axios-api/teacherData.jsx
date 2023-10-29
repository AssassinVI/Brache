
import axiosInstance from "./axiosInstance";
const teacherApi = "https://bratsche.web-board.tw/ajax/teacher.php";

export const getAll = async () => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: teacherApi,
            data: {
                type: "get_teacher"
            },
        });

        let data = response.data;
        data.data = data.data.map((item, i) => {
            const updatedItem = {
                Tb_index: item.Tb_index,
                name: item.name,
                s_sex: item.s_sex === "1" ? "男" : "女",
                index: i,
                t_skill: item.t_skill,
                t_color:item.t_color,
                qrcodeUrl: item.qrcodeUrl,
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
            url: teacherApi,
            data: {
                type: "get_teacher_one",
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
            url: teacherApi,
            data: {
                ...data,
                type: "update_teacher",
            }
        }).then((data) => {
            func(data)
            getAll()
        })

    } catch (error) {
        console.error(error);
    }

};



