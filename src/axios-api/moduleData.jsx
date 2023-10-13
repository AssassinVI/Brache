

import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
const moduleApi = "https://bratsche.web-board.tw/ajax/module.php";
export const useGetAll = () => {
    const [moduleData, setModuleData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axiosInstance({
                method: 'post',
                url: moduleApi,
                data: {
                    type: "get_Module"
                },
            });

            let data = response.data;
            data.data = data.data.map((item, i) => {
                const updatedItem = { ...item, index: i };
                return updatedItem;
            });

            setModuleData(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        moduleData: moduleData,
        refetchData: fetchData
    };
};

export const useGetOne = (id) => {
    const [moduleData, setModuleData] = useState(null);

    const fetchData = async (id) => {
        try {
            const response = await axiosInstance({
                method: "POST",
                url: moduleApi,
                data: {
                    type: "get_Module_one",
                    Tb_index: id
                }
            });
            console.log(response)

            setModuleData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(id);
    }, []);

    return moduleData
};

export const updateOne = (data) => {

    const fetchData = (data) => {
        try {
            axiosInstance({
                method: "POST",
                url: moduleApi,
                data: {
                    ...data,
                    type: "update_Module",
                }
            })

        } catch (error) {
            console.error(error);
        }
    };


    return fetchData
};


