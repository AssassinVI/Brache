import axios from 'axios';

// 建立 Axios instance
const axiosInstance = axios.create({
    // headers: {
    //     "Authorization": `Bearer ${sessionStorage["jwt"]}`,
    //     "Refresh-Token": localStorage["refresh_jwt"]
    // }
});


// // 設定請求攔截器
axiosInstance.interceptors.request.use(config => {
    // 在每個請求中自動添加 headers
    config.headers['Authorization'] = `Bearer ${sessionStorage["jwt"]}`;
    config.headers['Refresh-Token'] = localStorage["refresh_jwt"];
    //-- 開啟測試資料庫用 --
    config.headers['Test'] = 'test';
    return config;
}, error => {
    return Promise.reject(error);
});
// 添加response攔截器
axiosInstance.interceptors.response.use(
    (response) => {
        // 檢查response中的data.success屬性是否為false
        //console.log(response);
        //-- 延長token --
        if(response.data.jwt && response.data.jwt.jwt!==''){
            window.sessionStorage.setItem("jwt", response.data.jwt.jwt);
            window.localStorage.setItem("refresh_jwt", response.data.jwt.refresh_jwt);
        }
        else if (response.data && response.data.success === false) {
            // 執行您的操作，例如顯示錯誤訊息、重新導向到錯誤頁面等
            window.location.reload()//透過重新整理讓sideBar的useEffect重新跑一次跳轉頁面
        }
        return response;
    },
    (error) => {
        // 處理response錯誤
        console.log('Error: ', error);
        return Promise.reject(error);
    }
);
// 現在您可以在您的 function 中使用這個 axiosInstance
export default axiosInstance;