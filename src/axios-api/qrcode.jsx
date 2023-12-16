
import axiosInstance from "./axiosInstance";
const qrcodeApi = "https://bratsche.web-board.tw/ajax/qrcode.php";

export const signIn = (data, func) => {
    try {
        axiosInstance({
            method: 'POST',
            url: qrcodeApi,
            data: {
                ...data,
                type: "signIn",
            },
        }).then((data)=>{
            func(data)
        });
        
        return data
    } catch (error) {
        console.error(error);
    }
};




