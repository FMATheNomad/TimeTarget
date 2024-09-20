let interval; // Variabel global untuk menyimpan referensi interval

function startTimer() {
  const timeInput = document.getElementById("time-input").value;

  if (!timeInput) {
    alert("Please enter a valid time!");
    return;
  }

  const [targetHour, targetMinute] = timeInput.split(":").map(Number);

  let now = new Date();
  let targetTime = new Date();
  targetTime.setHours(targetHour, targetMinute, 0, 0);

  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  // Jika ada timer yang sedang berjalan, hentikan terlebih dahulu
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeLeft = targetTime - currentTime;

    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null; // Reset interval
      document.getElementById("countdown").innerHTML = "Time's up!";
      document.getElementById("alarm-sound").play(); // Mainkan suara alarm
      document.getElementById("stop-alarm-btn").style.display = "block"; // Tampilkan tombol stop alarm

      // Tampilkan notifikasi browser
      if (Notification.permission === "granted") {
        new Notification("Time's up!", {
          body: "Your countdown has finished!",
          icon: "https://via.placeholder.com/128" // Ganti dengan URL ikon yang Anda inginkan
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Time's up!", {
              body: "Your countdown has finished!",
              icon: "https://via.placeholder.com/128"
            });
          }
        });
      }

      return;
    }

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("hours").innerHTML = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerHTML = String(minutes).padStart(2, "0");
    document.getElementById("seconds").innerHTML = String(seconds).padStart(2, "0");
  }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  // Periksa jika izin belum diberikan
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});


function resetTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null; // Reset interval
  }
  // Reset countdown display
  document.getElementById("countdown").innerHTML = "<span id='hours'>00</span>:<span id='minutes'>00</span>:<span id='seconds'>00</span>";
  // Reset input field
  document.getElementById("time-input").value = "";
  // Hentikan alarm dan sembunyikan tombol stop
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.pause();
  alarmSound.currentTime = 0;
  document.getElementById("stop-alarm-btn").style.display = "none";
}


function stopAlarm() {
  resetTimer(); // Panggil resetTimer untuk mengembalikan tampilan ke kondisi awal
}
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    // Ubah ikon sesuai mode
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

  
  