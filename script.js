let alarmTime = null;

// Update Jam Realtime
function updateClock() {
    const now = new Date();
    let h = now.getHours();
    let m = String(now.getMinutes()).padStart(2, '0');
    let s = String(now.getSeconds()).padStart(2, '0');
    let ampm = h >= 12 ? 'PM' : 'AM';
    
    h = h % 12 || 12; // Format 12 jam
    h = String(h).padStart(2, '0');

    document.getElementById('time').innerHTML = `${h}:${m}:${s}<span>${ampm}</span>`;
    
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString('en-US', options).toUpperCase();

    // Cek Alarm
    if (alarmTime) {
        updateCountdown(now);
    }
}

// Update Hitung Mundur Alarm
function updateCountdown(now) {
    let diff = alarmTime - now;
    
    if (diff <= 0) {
        alert("Wake up! Alarm is ringing!");
        stopAlarm();
        return;
    }

    let hh = Math.floor(diff / 3600000);
    let mm = Math.floor((diff % 3600000) / 60000);
    let ss = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('displayCountdown').innerText = 
        `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

// Fungsi Simpan Alarm dari Modal
function saveAlarm() {
    const hStr = document.getElementById('h-select').value;
    const mStr = document.getElementById('m-select').value;
    const title = document.getElementById('alarm-title').value;

    document.getElementById('displayAlarmTitle').innerText = title;
    document.getElementById('displayAlarmTime').innerText = `${hStr}:${mStr}`;
    document.getElementById('activeAlarmContainer').style.display = 'block';

    const now = new Date();
    alarmTime = new Date();
    
    let parts = hStr.split(' '); // "04 AM" -> ["04", "AM"]
    let hr = parseInt(parts[0]);
    let ampm = parts[1];

    if (ampm === 'PM' && hr < 12) hr += 12;
    if (ampm === 'AM' && hr === 12) hr = 0;
    
    alarmTime.setHours(hr, parseInt(mStr), 0);
    
    // Jika waktu sudah lewat, set untuk besok
    if (alarmTime < now) {
        alarmTime.setDate(now.getDate() + 1);
    }

    toggleModal(false);
}

function stopAlarm() {
    alarmTime = null;
    document.getElementById('activeAlarmContainer').style.display = 'none';
}

function toggleModal(show) {
    document.getElementById('alarmModal').style.display = show ? 'flex' : 'none';
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeIcon i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Inisialisasi Data Dropdown dan Grid
function init() {
    const hSelect = document.getElementById('h-select');
    const mSelect = document.getElementById('m-select');
    const grid = document.getElementById('quickButtons');

    // Isi Dropdown Jam
    for(let i=1; i<=12; i++) {
        let val = String(i).padStart(2, '0');
        hSelect.innerHTML += `<option value="${val} AM">${val} AM</option>`;
    }
    for(let i=1; i<=12; i++) {
        let val = String(i).padStart(2, '0');
        hSelect.innerHTML += `<option value="${val} PM">${val} PM</option>`;
    }

    // Isi Dropdown Menit
    for(let i=0; i<60; i++) {
        let val = String(i).padStart(2, '0');
        mSelect.innerHTML += `<option value="${val}">${val}</option>`;
    }

    // Data Quick Alarm (English Text - Sesuai Permintaan)
    const quickAlarms = [
        { time: '04:00 AM', text: 'Rise early and start your journey before the world wakes up.' },
        { time: '05:00 AM', text: 'Early birds catch the dreams that others are still sleeping on.' },
        { time: '06:00 AM', text: 'Good morning! It is time to chase your goals with passion.' },
        { time: '07:00 AM', text: 'Wake up with determination, go to bed with satisfaction.' },
        { time: '08:00 AM', text: 'The sun is up and so are you. Let’s make today count.' },
        { time: '12:00 PM', text: 'Noon break. Refresh your mind and recharge your energy.' },
        { time: '01:00 PM', text: 'Keep going! The day is still young and full of potential.' },
        { time: '05:00 PM', text: 'Work hard in silence, let your success be your noise.' },
        { time: '08:00 PM', text: 'Time to wind down. Reflect on your wins for today.' },
        { time: '11:00 PM', text: 'Rest well. A great tomorrow starts with a peaceful sleep.' }
    ];

    // Buat Tombol Grid Secara Otomatis
    quickAlarms.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'alarm-card-item';

        const btn = document.createElement('button');
        btn.className = 'btn-quick-time';
        btn.innerText = item.time;
        btn.onclick = () => { 
            const p = item.time.split(' ');
            document.getElementById('h-select').value = p[0] + " " + p[1];
            document.getElementById('m-select').value = "00";
            saveAlarm();
        };

        const desc = document.createElement('div');
        desc.className = 'alarm-card-desc';
        desc.innerText = item.text;

        itemDiv.appendChild(btn);
        itemDiv.appendChild(desc);
        grid.appendChild(itemDiv);
    });
}

// Jalankan aplikasi
init();
setInterval(updateClock, 1000);
updateClock();
