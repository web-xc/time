const timeZones = {
    cn: 8,  // 中国
    us: -5, // 美国（东部标准时间）
    hk: 8, // 香港
    au: 11, // 澳洲（悉尼时间）
    uk: 0,  // 英国（GMT）
    fr: 1,  // 法国（CET）
};

// 全屏模式
document.getElementById("fullscreen-btn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// 判断是否处于夏令时（DST）
function isDST(country) {
    let now = new Date();
    let year = now.getFullYear();

    if (country === 'us') {
        // 美国（东部时间）夏令时：3月第二个星期日2AM - 11月第一个星期日2AM
        let start = new Date(year, 2, 8, 2); // 3月8日是最早可能的第二个星期日
        let end = new Date(year, 10, 1, 2);  // 11月1日是最早可能的第一个星期日

        start.setDate(8 - start.getDay()); // 找到3月的第二个星期日
        end.setDate(1 + (7 - end.getDay()) % 7); // 找到11月的第一个星期日

        return now >= start && now < end;
    }

    if (country === 'uk') {
        // 英国夏令时（BST）：3月最后一个星期日1AM - 10月最后一个星期日2AM
        let start = new Date(year, 2, 31, 1); // 3月31日是最晚可能的最后一个星期日
        let end = new Date(year, 9, 31, 2);  // 10月31日是最晚可能的最后一个星期日

        start.setDate(31 - start.getDay()); // 找到3月的最后一个星期日
        end.setDate(31 - end.getDay()); // 找到10月的最后一个星期日

        return now >= start && now < end;
    }

    if (country === 'hk') {
        return false; // 香港无夏令时
    }

    return false;
}

function createClock(countryId) {
    let clock = document.getElementById(countryId);
    if (!clock) {
        console.warn(`⚠️ Warning: No element with ID "${countryId}" found, skipping...`);
        return;
    }

    let hourHand = document.createElement('div');
    let minuteHand = document.createElement('div');
    let secondHand = document.createElement('div');
    let centerDot = document.createElement('div');

    hourHand.className = 'hand h';
    minuteHand.className = 'hand m';
    secondHand.className = 'hand s';
    centerDot.className = 'center';

    clock.appendChild(hourHand);
    clock.appendChild(minuteHand);
    clock.appendChild(secondHand);
    clock.appendChild(centerDot);

    for (let i = 0; i < 12; i++) {
        let scaleHour = document.createElement('div');
        scaleHour.className = 'scale';
        scaleHour.style.transform = `rotate(${i * 30}deg)`;
        clock.appendChild(scaleHour);
    }

    let num12 = document.createElement('div');
    let num3 = document.createElement('div');
    let num6 = document.createElement('div');
    let num9 = document.createElement('div');

    num12.className = 'number num-12';
    num3.className = 'number num-3';
    num6.className = 'number num-6';
    num9.className = 'number num-9';

    num12.innerText = '12';
    num3.innerText = '3';
    num6.innerText = '6';
    num9.innerText = '9';

    clock.appendChild(num12);
    clock.appendChild(num3);
    clock.appendChild(num6);
    clock.appendChild(num9);

    function updateClock() {
        let now = new Date();
        let utc = now.getTime() + now.getTimezoneOffset() * 60000;
        let offset = timeZones[countryId];

        if (isDST(countryId)) {
            offset += 1;
        }

        let localTime = new Date(utc + 3600000 * offset);
        let h = localTime.getHours() % 12;
        let m = localTime.getMinutes();
        let s = localTime.getSeconds();
        let ms = localTime.getMilliseconds();

        hourHand.style.transform = `translateX(-50%) rotate(${h * 30 + m / 2}deg)`;
        minuteHand.style.transform = `translateX(-50%) rotate(${m * 6}deg)`;

        let secondAngle = s * 6 + (ms / 1000) * 6; // 计算秒针角度，加入毫秒保证平滑
        secondHand.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;

        requestAnimationFrame(updateClock); // 让秒针实时更新
    }

    requestAnimationFrame(updateClock); // 启动动画
}

// 只创建当前 HTML 页面存在的时钟
document.addEventListener("DOMContentLoaded", function () {
    let availableClocks = Array.from(document.querySelectorAll(".clock"))
        .map(clock => clock.id)
        .filter(id => id in timeZones);

    availableClocks.forEach(createClock);
});

// 只创建当前 HTML 页面存在的时钟
Object.keys(timeZones).forEach((key) => {
    // console.log(`正在尝试为创建时钟 ${key}`);
    createClock(key);
});


// 确保 DOM 加载完毕后，初始化时钟
document.addEventListener("DOMContentLoaded", function () {
    // 获取当前 HTML 页面中所有的 .clock 元素，并提取它们的 ID
    let availableClocks = Array.from(document.querySelectorAll(".clock"))
        .map(clock => clock.id)
        .filter(id => id in timeZones); // 只保留 timeZones 里定义的时区 ID

    // 只创建当前页面存在的时钟
    availableClocks.forEach(createClock);

    // 测试时间
    let now = new Date();
    let utc = now.getTime() + now.getTimezoneOffset() * 60000;

    let timeStrings = availableClocks.map(countryId => {
        let offset = timeZones[countryId];

        if (isDST(countryId)) {
            offset += 1;
        }

        let localTime = new Date(utc + 3600000 * offset);
        let hours = localTime.getHours().toString().padStart(2, '0');
        let minutes = localTime.getMinutes().toString().padStart(2, '0');

        let countryName = countryId.toUpperCase();
        return `${countryName} ${hours}:${minutes}`;
    });

    console.log(timeStrings.join(' | '));
});

// 缩放比例1.5倍
document.addEventListener("DOMContentLoaded", function () {
    document.body.style.zoom = "2.5";
});