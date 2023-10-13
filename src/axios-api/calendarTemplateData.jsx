
import axiosInstance from "./axiosInstance";
const templateApi = "https://bratsche.web-board.tw/ajax/course_template.php";

export const get_course_template_list = async () => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: templateApi,
            data: {
                type: "get_course_template_list",
            },
        });

        let data = response.data;
        data.data = data.data.map((item, i) => {
            const updatedItem = {
                ct_title: item.ct_title,
                ct_remark: item.ct_remark,
                OnLineOrNot: item.OnLineOrNot,
                Tb_index: item.Tb_index,
                index: i,
            };
            return updatedItem;
        });
        return data
    } catch (error) {
        console.error(error);
    }
};

export const get_course_template_list_one = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
            data: {
                type: "get_course_template_list_one",
                Tb_index: id
            }
        }).then((data) => {
            func(data)
        })
    } catch (error) {
        console.error(error);
    }

};




export const update_course_list = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
            data: {
                ...data,
                type: "update_course_list",
            }
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }

};

export const insert_course_list = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
            data: {
                ...data,
                type: "insert_course_list",
            }
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }

};



export const delete_course_list = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
            data: {
                Tb_index: id,
                type: "delete_course_list",
            }
        }).then((res) => {
            func(res)
        })

    } catch (error) {
        console.error(error);
    }

};

//模板本身


export const get_course_template = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
            data: {
                type: "get_course_template",
                ct_list_id: id
            }
        }).then((data) => {
            func(data)
        })
    } catch (error) {
        console.error(error);
    }

};

export const get_course_template_one = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
            data: {
                type: "get_course_template_one",
                Tb_index: id
            }
        }).then((data) => {
            func(data)
        })
    } catch (error) {
        console.error(error);
    }

};


export const update_course = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
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

export const insert_course = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
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

export const delete_course = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: templateApi,
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