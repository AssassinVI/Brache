// file = Html5QrcodePlugin.jsx
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {

    useEffect(() => {
        // // when component mounts
        // const config = createConfig(props);
        // const verbose = props.verbose === true;
        // // Suceess callback is required.
        // if (!(props.qrCodeSuccessCallback)) {
        //     throw "qrCodeSuccessCallback is required callback.";
        // }
        // const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        // html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
        // // cleanup function when component will unmount
        // return () => {
        //     html5QrcodeScanner.clear().catch(error => {
        //         console.error("Failed to clear html5QrcodeScanner. ", error);
        //     });
        // };

        const html5QrCode = new Html5Qrcode(qrcodeRegionId);
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
           html5QrCode.start({ facingMode: "environment" }, config, props.qrCodeSuccessCallback ).catch((err)=>{
               // $('.devices_txt').html('使用者拒絕或無法取得攝像機權限，請同意權限才能使用');
               document.querySelector(".devices_txt").innerHTML='使用者拒絕或無法取得攝像機權限，請同意權限才能使用';
           });
    }, []);

    return (
        <>
        <div>
          <div id={qrcodeRegionId}></div>
          <p className='devices_txt' style={{textAlign:"center"}}></p>
        </div>
        </>
    );
};

export default Html5QrcodePlugin;