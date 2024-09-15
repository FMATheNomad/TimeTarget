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
            return;
          }

          const hours = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          document.getElementById("hours").innerHTML = String(hours).padStart(
            2,
            "0"
          );
          document.getElementById("minutes").innerHTML = String(
            minutes
          ).padStart(2, "0");
          document.getElementById("seconds").innerHTML = String(
            seconds
          ).padStart(2, "0");
        }, 1000);
      }

      function resetTimer() {
        if (interval) {
          clearInterval(interval);
          interval = null; // Reset interval
        }
        // Reset countdown display
        document.getElementById("countdown").innerHTML =
          "<span id='hours'>00</span>:<span id='minutes'>00</span>:<span id='seconds'>00</span>";
        // Reset input field (opsional)
        document.getElementById("time-input").value = "";
      }