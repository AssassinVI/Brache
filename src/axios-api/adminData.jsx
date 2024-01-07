
import axiosInstance from "./axiosInstance";
const adminApi = "https://bratsche.web-board.tw/ajax/admin.php";

export const getAll = async () => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: adminApi,
            data: {
                type: "get_admin"
            },
        });

        let data = response.data;
        data.data = data.data.map((item, i) => {
            const updatedItem = { ...item, index: i };
            return updatedItem;
        });
        return data
    } catch (error) {
        console.error(error);
    }
};

//-- 權限篩選 --
export const getTypeAll = async (admin_per) => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: adminApi,
            data: {
                type: "get_type_admin",
                admin_per: admin_per
            },
        });

        let data = response.data;
        data.data = data.data.map((item, i) => {
            const updatedItem = { ...item, index: i };
            return updatedItem;
        });
        return data
    } catch (error) {
        console.error(error);
    }
};

//-- 關鍵字查詢 --
export const getNameAll = async (keyword) => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: adminApi,
            data: {
                type: "get_name_admin",
                adminName: keyword
            },
        });

        let data = response.data;
        data.data = data.data.map((item, i) => {
            const updatedItem = { ...item, index: i };
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
            url: adminApi,
            data: {
                type: "get_admin_one",
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
            url: adminApi,
            data: {
                ...data,
                type: "update_admin",
            }
        }).then((data) => {
            func(data)
            getAll()
        })

    } catch (error) {
        console.error(error);
    }

};

export const insertOne = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: adminApi,
            data: {
                ...data,
                type: "insert_admin",
            }
        }).then((data) => {
            func(data)
            getAll()
        })

    } catch (error) {
        console.error(error);
    }

};
export const deleteOne = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: adminApi,
            data: {
                Tb_index: id,
                type: "delete_admin",
            }
        }).then((data) => {
            func(data)
            getAll()
        })

    } catch (error) {
        console.error(error);
    }

};