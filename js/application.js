// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  var gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  
  // THÊM BỘ ĐẾM THỜI GIAN 5 PHÚT
  var gameTime = 300; // 5 phút tính bằng giây
  var timerInterval = null;
  
  // Hàm khởi tạo bộ đếm thời gian
  function startTimer() {
    clearInterval(timerInterval);
    gameTime = 300; // Reset về 5 phút
    updateTimerDisplay();
    
    // Xóa cảnh báo nếu có
    var timeValue = document.querySelector('.time-value');
    timeValue.classList.remove('time-warning');
    
    timerInterval = setInterval(function() {
      gameTime--;
      updateTimerDisplay();
      
      // Hiệu ứng cảnh báo khi còn 1 phút
      if (gameTime === 60) {
        timeValue.classList.add('time-warning');
      }
      
      // Kết thúc game khi hết thời gian
      if (gameTime <= 0) {
        clearInterval(timerInterval);
        gameOver();
      }
    }, 1000);
  }
  
  // Hàm cập nhật hiển thị thời gian
  function updateTimerDisplay() {
    var minutes = Math.floor(gameTime / 60);
    var seconds = gameTime % 60;
    
    // Đảm bảo hiển thị 2 chữ số cho giây
    var timeString = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    document.querySelector('.time-value').textContent = timeString;
  }
  
  // Hàm kết thúc game khi hết thời gian
  function gameOver() {
    var message = "Hết thời gian! Điểm của bạn: " + gameManager.score;
    if (typeof Notification !== "undefined") {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          new Notification("Periodic 2048 - Game Over", { body: message });
        }
      });
    }
    
    // Hiển thị thông báo game over
    if (!gameManager.isGameTerminated()) {
      var gameOver = document.createElement("div");
      gameOver.classList.add("game-message", "game-over");
      gameOver.innerHTML = "<p>Hết thời gian!</p><p>Điểm: " + gameManager.score + "</p><div><a class=\"retry-button\">Thử lại</a></div>";
      document.querySelector(".game-container").appendChild(gameOver);
      
      var retryButton = document.querySelector(".retry-button");
      retryButton.addEventListener("click", function () {
        restartGame();
      });
      
      // Đánh dấu game đã kết thúc
      gameManager.keepPlaying = false;
      gameManager.gameOver();
    }
  }
  
  // Hàm khởi động lại game
  function restartGame() {
    // Xóa thông báo game over nếu có
    var gameMessage = document.querySelector(".game-message.game-over");
    if (gameMessage) {
      gameMessage.parentNode.removeChild(gameMessage);
    }
    
    // Khởi động lại game
    gameManager.restart();
    
    // Khởi động lại bộ đếm thời gian
    startTimer();
  }
  
  // Ghi đè hàm restart của GameManager để bao gồm bộ đếm thời gian
  var originalRestart = gameManager.restart;
  gameManager.restart = function() {
    originalRestart.call(this);
    startTimer();
  };
  
  // Ghi đè hàm gameOver của GameManager để dừng bộ đếm thời gian
  var originalGameOver = gameManager.gameOver;
  gameManager.gameOver = function() {
    originalGameOver.call(this);
    clearInterval(timerInterval);
  };
  
  // Bắt đầu bộ đếm thời gian khi game khởi động
  startTimer();
});
