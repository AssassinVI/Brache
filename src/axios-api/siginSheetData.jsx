
import axiosInstance from "./axiosInstance";
const signInApi = "https://bratsche.web-board.tw/ajax/course_signIn.php";

export const getAll = async (userId) => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: signInApi,
            data: {
                type: "get_course",
                Tb_index: userId,
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



export const getSignInData = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: signInApi,
            data: {
                type: "signIn_data",
                Tb_index: id
            }
        }).then((data) => {
            func(data)
        })
    } catch (error) {
        console.error(error);
    }

};
export const signInCourse = (data, func, func2) => {
    try {
        axiosInstance({
            method: "POST",
            url: signInApi,
            data: {
                type: "signIn_course",
                ...data
            }
        }).then((res1) => {
            func(res1)
            getSignInData(data.course_id, (res2) => {
                func2(res2)
            })

        })
    } catch (error) {
        console.error(error);
    }

};


export const signIn_tch_all = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: signInApi,
            data: {
                type: "signIn_tch_all",
                ...data
            }
        }).then((res) => {
            func(res)
        })
    } catch (error) {
        console.error(error);
    }

};
