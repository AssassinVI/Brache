

import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
const authorityApi = "https://bratsche.web-board.tw/ajax/admin_group.php";

export const useGetAll = () => {
    const [authorityData, setAuthorityData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axiosInstance({
                method: 'post',
                url: authorityApi,
                data: {
                    type: "get_admin_group"
                },
            });

            let data = response.data;
            data.data = data.data.map((item, i) => {
                const updatedItem = { ...item, index: i };
                return updatedItem;
            });

            setAuthorityData(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        authorityData: authorityData,
        refetchData: fetchData
    };
};

export const getOne = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: authorityApi,
            data: {
                type: "get_admin_group_one",
                Tb_index: id
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
            url: authorityApi,
            data: {
                ...data,
                type: "update_admin_group",
            }
        }).then((data) => {
            func(data)
        })

    } catch (error) {
        console.error(error);
    }

};

export const insertOne = (data, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: authorityApi,
            data: {
                ...data,
                type: "insert_admin_group",
            }
        }).then((data) => {
            func(data)
        })

    } catch (error) {
        console.error(error);
    }

};
export const deleteOne = (id, func) => {
    try {
        axiosInstance({
            method: "POST",
            url: authorityApi,
            data: {
                Tb_index: id,
                type: "delete_admin_group",
            }
        }).then((data) => {
            func(data)
        })

    } catch (error) {
        console.error(error);
    }

};

