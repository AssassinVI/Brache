
export function getWeekDates(mondayStr) {
    function parseISODate(dateStr) {
        const parts = dateStr.split('-');
        if (parts.length !== 3) {
            throw new Error('Invalid date format');
        }

        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // 月份是 0 到 11 的數字表示
        const day = parseInt(parts[2]);

        // 使用手動解析的方式創建 Date 物件
        const date = new Date(year, month, day);

        // 檢查日期是否有效
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        return date;
    }
    const monday = parseISODate(mondayStr);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date);
    }
    return weekDates;
}

//-- 計算出第幾周的星期一日期 --
// export function getDateOfMondayInWeek(todayDate) {
//     const today = new Date(todayDate);
//     const currentWeekDay = today.getDay(); // 当前日期是星期几 (0=星期日, 1=星期一, ..., 6=星期六)
//     const daysUntilMonday = (currentWeekDay === 0) ? 6 : (currentWeekDay - 1); // 计算当前日期距离上一个星期一的天数
  
//     const daysToSubtract = (daysUntilMonday + 7); // 计算需要减去的天数
//     const mondayDate = new Date(today);
//     mondayDate.setDate(today.getDate() - daysToSubtract);
  
//     return mondayDate;
// }

//-- 計算出第幾周的星期一日期 --
export function getDateOfMondayInWeek(year, month, weekNumber) {
    // 创建一个指定年份和月份的日期对象
    const date = new Date(year, month - 1, 1);
  
    // 计算这个月的第一个星期一
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() + 1);
    }
  
    // 然后根据所需的周数，加上相应的天数
    date.setDate(date.getDate() + (weekNumber - 1) * 7);
  
    const mondayDate=new Date(year, month - 1, date.getDate());
    return mondayDate;
}


export function getWeekInfoForDate(today) {
    function getMondayOfCurrentWeek(today) {
        // 获取今天是一周中的第几天（0 表示周日，1 表示周一，依此类推）
        const dayOfWeek = today.getDay();

        // 计算相对于周一的偏移量
        const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // 获取当周的周一的日期
        const monday = new Date(today);
        monday.setDate(today.getDate() - offset);

        // 格式化日期为字符串（例如：YYYY-MM-DD）
        const formattedMonday = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;

        return formattedMonday;
    }

    function getWeekNumberForDate(monday) {
        const date = new Date(monday)
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeekOfFirstDay = firstDayOfMonth.getDay(); // 获取该月第一天是星期几（0 表示周日，1 表示周一，依此类推）

        const firstMondayOfMonth = new Date(firstDayOfMonth);
        firstMondayOfMonth.setDate(firstDayOfMonth.getDate() + (8 - dayOfWeekOfFirstDay) % 7);

        const timeDiff = date.getTime() - firstMondayOfMonth.getTime();
        const daysSinceFirstMonday = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        const weekNumber = Math.ceil((daysSinceFirstMonday + 1) / 7);

        return weekNumber;
    }

    const monday = getMondayOfCurrentWeek(today);
    const year = new Date(monday).getFullYear();
    const month = new Date(monday).getMonth() + 1;
    const day = new Date(monday).getDate();
    const weekNumber = getWeekNumberForDate(monday);

    return {
        year: year,
        month: month,
        day: day,
        weekNumber: weekNumber
    };
}

export function formatDateBack(inputDateStr) {
    // Step 1: Parse the input date string to create a Date object
    const date = new Date(inputDateStr);

    // Step 2: Format the Date object to the desired output format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Create the formatted date string in the format 'YYYY-MM-DD'
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

export function convertToChineseNumber(number) {
    const chineseNumbers = ['日', '一', '二', '三', '四', '五', '六', '日', '八', '九'];

    if (number >= 0 && number <= 9) {
        return chineseNumbers[number];
    } else {
        return number.toString().split('').map(digit => chineseNumbers[parseInt(digit)]).join('');
    }
}

//轉換資料成表格形式
export function dataTransformTable(dataArr, type) {

    const formattedData = dataArr.reduce((result, item) => {
        const formattedDate = type !== "template" ? item.c_date : item.c_week; // 日期字串直接作為 key

        // 將物件按日期分類，若日期還不存在，先建立一個物件
        if (!result[formattedDate]) {
            result[formattedDate] = {};
        }

        const roomName = item.room_name; // 取得 room name

        // 將物件按 room name 分類，若 room name 還不存在，先建立一個物件
        if (!result[formattedDate][roomName]) {
            result[formattedDate][roomName] = {};
        }

        const startTime = item.StartTime; // 取得 start time

        // 將物件按 start time 分類，若 start time 還不存在，直接放入該課程物件
        if (!result[formattedDate][roomName][startTime]) {
            result[formattedDate][roomName][startTime] = item;
        }

        return result;
    }, {});
    return formattedData;
}


//-- 轉換資料成表格形式(模板) --
export function dataTransformTableTemplate(dataArr) {

    const formattedData = dataArr.reduce((result, item) => {
        const formattedDate = item.c_week_num; // 第幾周直接作為 key

        // 將物件按第幾周分類，若第幾周還不存在，先建立一個物件
        if (!result[formattedDate]) {
            result[formattedDate] = {};
        }

        const week = item.c_week; // 取得星期
        if (!result[formattedDate][week]) {
            result[formattedDate][week] = {};
        }

        const roomName = item.room_name; // 取得 room name

        // 將物件按 room name 分類，若 room name 還不存在，先建立一個物件
        if (!result[formattedDate][week][roomName]) {
            result[formattedDate][week][roomName] = {};
        }

        const startTime = item.StartTime; // 取得 start time

        // 將物件按 start time 分類，若 start time 還不存在，直接放入該課程物件
        if (!result[formattedDate][week][roomName][startTime]) {
            result[formattedDate][week][roomName][startTime] = item;
        }

        return result;
    }, {});
    return formattedData;
}


export function addMinutesToTime(inputTime, minutesToAdd) {
    // 將時間字串轉換為 Date 物件
    const timeParts = inputTime.split(":");
    const dateObj = new Date();
    dateObj.setHours(parseInt(timeParts[0], 10));
    dateObj.setMinutes(parseInt(timeParts[1], 10));

    // 加上指定的分鐘數
    dateObj.setMinutes(dateObj.getMinutes() + minutesToAdd);

    // 取得結果時間字串（包含秒數）
    const resultTime = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}:00`;

    return resultTime;
}

export function calculateDifferenceIn15Minutes(startTime, endTime) {
    if (typeof startTime === "string" && typeof endTime === "string") {
        const startTimeParts = startTime.split(":");
        const endTimeParts = endTime.split(":");

        // 將時間字串轉換為分鐘數
        const startMinutes = parseInt(startTimeParts[0], 10) * 60 + parseInt(startTimeParts[1], 10);
        const endMinutes = parseInt(endTimeParts[0], 10) * 60 + parseInt(endTimeParts[1], 10);

        // 計算兩個時間之間相差的分鐘數
        const differenceInMinutes = endMinutes - startMinutes;

        // 計算相差的 15 分鐘數量
        const differenceIn15Minutes = Math.floor(differenceInMinutes / 15);

        return differenceIn15Minutes;
    }

}

export function getContrastColor(color) {
    // 將顏色轉換成十六進位格式
    function convertToHexColor(color) {
        function isValidHexColor(color) {
            return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
        }

        function isValidRGBColor(color) {
            return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*\d+(\.\d+)?)?\s*\)$/.test(color);
        }

        if (isValidHexColor(color)) {
            return color;
        }

        if (isValidRGBColor(color)) {
            const rgbValues = color.match(/\d+/g).map(Number);
            const hexValues = rgbValues.map((value) => value.toString(16).padStart(2, '0'));
            return `#${hexValues.join('')}`;
        }

        // 如果都不是有效格式，可以在這裡處理其他顏色格式，例如顏色名稱等

        throw new Error('Invalid color format');
    }

    // 計算亮度（Brightness）值
    function getBrightness(hexColor) {
        const rgb = hexColor.match(/\w{2}/g).map((hex) => parseInt(hex, 16));
        return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    }

    const hexColor = convertToHexColor(color);
    const brightness = getBrightness(hexColor);

    // 根據亮度值選擇文字顏色
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

//-- 以周一為準，算出某月有幾周 --
export function countMondaysInMonth(year, month) {
    let count = 0;
    const date = new Date(year, month - 1, 1);
  
    while (date.getMonth() === month - 1) {
      if (date.getDay() === 1) {
        count++;
      }
      date.setDate(date.getDate() + 1);
    }
  
    return count;
}