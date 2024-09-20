let interval; // Variabel global untuk menyimpan referensi interval
let targetTime; // Menyimpan target waktu akhir
let timeLeftAtPause; // Variabel untuk menyimpan waktu tersisa saat dijeda
let totalDuration; // Menyimpan durasi total timer

function startTimer() {
  const timeInput = document.getElementById("time-input").value;

  if (!timeInput) {
    alert("Please enter a valid time!");
    return;
  }

  localStorage.setItem("targetTime", timeInput);  // Simpan di localStorage

  const [targetHour, targetMinute] = timeInput.split(":").map(Number);

  let now = new Date();
  targetTime = new Date(); // Simpan sebagai variabel global
  targetTime.setHours(targetHour, targetMinute, 0, 0);

  // Jika targetTime sudah lewat hari ini, set ke hari berikutnya
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  // Hitung total durasi dari sekarang sampai target waktu
  totalDuration = targetTime - now;

  // Jika ada timer yang sedang berjalan, hentikan terlebih dahulu
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const currentTime = new Date().getTime();
  const timeLeft = targetTime - currentTime;

  if (timeLeft <= 0) {
    clearInterval(interval);
    interval = null; // Reset interval
    document.getElementById("countdown").innerHTML = "Time's up!";
    document.getElementById("alarm-sound").play(); // Mainkan suara alarm
    document.getElementById("stop-alarm-btn").style.display = "block"; // Tampilkan tombol stop alarm
    resetProgressBar(); // Reset progress bar saat timer habis
    return;
  }

  // Hitung jam, menit, dan detik yang tersisa
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  document.getElementById("hours").innerHTML = String(hours).padStart(2, "0");
  document.getElementById("minutes").innerHTML = String(minutes).padStart(2, "0");
  document.getElementById("seconds").innerHTML = String(seconds).padStart(2, "0");

  // Simpan waktu tersisa saat pause
  timeLeftAtPause = timeLeft;

  // Update progress bar dan persentase
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  updateProgressBar(progressPercent);
}

function updateProgressBar(percent) {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = `${percent}%`;
  progressBar.innerHTML = `${Math.round(percent)}%`; // Menampilkan persentase
}

function resetProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%";
  progressBar.innerHTML = "0%"; // Reset persentase ke 0%
}

function pauseTimer() {
  const currentTime = new Date().getTime();
  timeLeftAtPause = targetTime - currentTime; // Simpan waktu tersisa
  
  clearInterval(interval); // Hentikan interval
  interval = null;

  document.getElementById("pause-timer-btn").style.display = "none";
  document.getElementById("resume-timer-btn").style.display = "block";
}

function resumeTimer() {
  const currentTime = new Date().getTime();
  targetTime = new Date(currentTime + timeLeftAtPause); // Hitung ulang targetTime berdasarkan waktu tersisa
  totalDuration = timeLeftAtPause; // Update durasi total berdasarkan waktu tersisa

  interval = setInterval(updateCountdown, 1000); // Mulai kembali interval

  document.getElementById("resume-timer-btn").style.display = "none";
  document.getElementById("pause-timer-btn").style.display = "block";
}

function resetTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null; // Reset interval
  }
  // Hapus waktu tersimpan dari localStorage
  localStorage.removeItem("targetTime");
  // Reset countdown display
  document.getElementById("countdown").innerHTML = "<span id='hours'>00</span>:<span id='minutes'>00</span>:<span id='seconds'>00</span>";
  // Reset input field
  document.getElementById("time-input").value = "";
  // Hentikan alarm dan sembunyikan tombol stop
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.pause();
  alarmSound.currentTime = 0;
  document.getElementById("stop-alarm-btn").style.display = "none";
  resetProgressBar(); // Reset progress bar saat user menekan reset
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTime = localStorage.getItem("targetTime");
  if (savedTime) {
    document.getElementById("time-input").value = savedTime;
    
    // Jika waktu tersimpan, bisa langsung hitung ulang timer
    const [targetHour, targetMinute] = savedTime.split(":").map(Number);
    let now = new Date();
    targetTime = new Date();
    targetTime.setHours(targetHour, targetMinute, 0, 0);

    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    totalDuration = targetTime - now; // Hitung durasi total saat memulai ulang
    if (interval) {
      clearInterval(interval); // Hentikan interval yang ada
    }

    interval = setInterval(updateCountdown, 1000); // Mulai kembali interval
  }

  // Meminta izin notifikasi saat halaman dimuat
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

function stopAlarm() {
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.pause(); // Hentikan suara alarm
  alarmSound.currentTime = 0; // Kembalikan ke awal

  resetTimer(); // Panggil resetTimer untuk mengembalikan tampilan ke kondisi awal
  
  document.getElementById("stop-alarm-btn").style.display = "none"; // Sembunyikan tombol stop alarm
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const themeIcon = document.getElementById("theme-icon");
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
}

function toggleVerticalFullscreen() {
  const countdownDiv = document.getElementById("countdown");

  if (!document.fullscreenElement) {
    countdownDiv.requestFullscreen();
    countdownDiv.classList.add("fullscreen");
    document.getElementById("exit-fullscreen").classList.remove("d-none");  // Tampilkan tombol keluar fullscreen
  } else {
    document.exitFullscreen();
    countdownDiv.classList.remove("fullscreen");
    document.getElementById("exit-fullscreen").classList.add("d-none");  // Sembunyikan tombol keluar fullscreen
  }
}

function toggleHorizontalFullscreen() {
  const countdownDiv = document.getElementById("countdown");

  if (!document.fullscreenElement) {
    countdownDiv.requestFullscreen();
    countdownDiv.classList.add("fullscreen");
    document.getElementById("exit-fullscreen").classList.remove("d-none");  // Tampilkan tombol keluar fullscreen
  } else {
    document.exitFullscreen();
    countdownDiv.classList.remove("fullscreen");
    document.getElementById("exit-fullscreen").classList.add("d-none");  // Sembunyikan tombol keluar fullscreen
  }
}

window.addEventListener("orientationchange", function() {
  const countdownDiv = document.getElementById("countdown");
  
  if (window.screen.orientation.angle === 90 || window.screen.orientation.angle === -90) {
    // Layar dalam orientasi horizontal
    countdownDiv.style.fontSize = "12vh";
  } else {
    // Layar dalam orientasi vertikal
    countdownDiv.style.fontSize = "10vw";
  }
});

document.addEventListener("fullscreenchange", function() {
  const countdownDiv = document.getElementById("countdown");

  if (!document.fullscreenElement) {
    countdownDiv.classList.remove("fullscreen");  // Hapus kelas fullscreen saat keluar
  }
});

document.addEventListener("fullscreenchange", function() {
  const countdownDiv = document.getElementById("countdown");
  const exitButton = document.getElementById("exit-fullscreen");

  if (!document.fullscreenElement) {
    countdownDiv.classList.remove("fullscreen");  // Hapus kelas fullscreen saat keluar
    exitButton.classList.add("d-none");  // Sembunyikan tombol keluar fullscreen
  }
});


function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}