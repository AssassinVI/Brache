

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { systemTreeAction } from "../redux/action";
import axiosInstance from "./axiosInstance";
const systemApi = "https://bratsche.web-board.tw/ajax/maintable.php";


export const useGetAll = () => {
    const [systemData, setSystemData] = useState(null);
    const dispatch = useDispatch(null)
    const fetchData = async (func) => {
        try {
            const response = await axiosInstance({
                method: 'post',
                url: systemApi,
                data: {
                    type: "get_maintable"
                },
            });

            let data = response.data;

            const buildTree = (data, parentId) => {
                const treeData = data.reduce((tree, item) => {
                    if (item.parent_id === parentId) {
                        const child = {
                            id: item.Tb_index,
                            name: item.MT_Name,
                            module: item.Mod_name,
                            orderBy: item.OrderBy,
                            is_data: item.is_data,
                            children: buildTree(data, item.Tb_index)
                        };
                        tree.push(child);
                    }
                    return tree;
                }, []);
                return treeData
            }
            const treeData = buildTree(data.data, "")
            setSystemData(treeData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (systemData) {
            dispatch(systemTreeAction(systemData))
        }
    }, [systemData])

    return {
        systemData: systemData,
        refetchData: fetchData
    };
};

export const getOne = (id, func) => {

    try {
        axiosInstance({
            method: "POST",
            url: systemApi,
            data: {
                type: "get_maintable_one",
                Tb_index: id
            }
        }).then((data) => {
            func(data)
        })
    } catch (error) {
        console.error(error);
    }
};

export const updateOne = (data, refetchData) => {
    try {
        axiosInstance({
            method: "POST",
            url: systemApi,
            data: {
                ...data,
                type: "update_maintable",
            }
        }).then(() => {
            refetchData()
        })

    } catch (error) {
        console.error(error);
    }
};

export const newOne = (data, refetchData) => {
    try {
        axiosInstance({
            method: "POST",
            url: systemApi,
            data: {
                ...data,
                type: "insert_maintable",
            }
        }).then(() => {
            refetchData()
        })

    } catch (error) {
        console.error(error);
    }

};

export const updateOrderBy = (data, refetchData) => {

    try {
        axiosInstance({
            method: "POST",
            url: systemApi,
            data: {
                treeData: data,
                type: "sort_maintable",
            }
        }).then(() => {
            refetchData()
        })

    } catch (error) {
        console.error(error);
    }

}

export const deleteOne = (data, refetchData) => {
    try {
        axiosInstance({
            method: "POST",
            url: systemApi,
            data: {
                Tb_index: data,
                type: "delete_maintable",
            }
        }).then(() => {
            refetchData()
        })

    } catch (error) {
        console.error(error);
        return false
    }

};




//for sidebar
export const fetchData = async (func) => {
    try {
        const response = await axiosInstance({
            method: 'post',
            url: systemApi,
            data: {
                type: "get_maintable"
            },
        });

        let data = response.data;
        const buildTree = (data, parentId) => {
            const treeData = data.reduce((tree, item) => {

                if (item.parent_id === parentId) {
                    const child = {
                        id: item.Tb_index,
                        name: item.MT_Name,
                        module: item.Mod_name,
                        orderBy: item.OrderBy,
                        is_data: item.is_data,
                        children: buildTree(data, item.Tb_index)
                    };
                    tree.push(child);
                }
                return tree;
            }, []);
            return treeData
        }
        const treeData = buildTree(data.data, "")
        func(treeData)
    } catch (error) {
        console.error(error);
    }
};
