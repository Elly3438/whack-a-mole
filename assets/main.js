document.addEventListener('DOMContentLoaded', function() {
  const BASE_TIMER = 15;
  const BASE_SCORE = 0;
  const SCORE_INCREMENT = 10;
  const MIN_WAIT_TIME = 200;
  const MAX_WAIT_TIME = 2000;
  const MIN_UP_TIME = 400;
  const MAX_UP_TIME = 1500;
  let timer;
  let score;
  let isStopped = true;
  // store any dom elements
  const startBtn = document.querySelector('.wag__start-btn');
  const stopBtn = document.querySelector('.wag__stop-btn');
  const scoreSpan = document.querySelector('.wag__score span');
  const timerContainer = document.querySelector('.wag__timer');
  const timerSpan = document.querySelector('.wag__timer span');
  const holes = document.querySelectorAll('.wag__geth');
  // timeout arrays
  const waitTimeouts = [];
  const popupTimeouts = [];

  /**
   * Generates a random integer
   * @param {Number} min The min time
   * @param {Number} max The max time
   * @return {Number} The generated time
   */
  function getPopupTime(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Starts the game. Resets any values
   * @return {Undefined} Returns nothing
   */
  function startGame() {
    let countdown = BASE_TIMER;
    isStopped = false;
    score = BASE_SCORE;
    scoreSpan.textContent = score;
    timerSpan.textContent = BASE_TIMER;
    startBtn.classList.add('wag__btn-hide');
    stopBtn.classList.remove('wag__btn-hide');
    timerContainer.classList.add('wag__timer-show');

    holes.forEach(function(hole, index) {
      startGethPopup(hole, index);
    });

    timer = setInterval(function() {
      countdown = countdown - 1;

      if (countdown === 0) {
        timerSpan.textContent = 'GAME OVER';
        clearInterval(timer);
        stopGame();
      } else {
        timerSpan.textContent = countdown;
      }
    }, 1000);
  }

  /**
   * Stops the game and clears all timeouts and timers
   * @return {Undefined} Returns nothing
   */
  function stopGame() {
    clearInterval(timer);
    isStopped = true;
    startBtn.classList.remove('wag__btn-hide');
    stopBtn.classList.add('wag__btn-hide');
    waitTimeouts.forEach(function(timer) {
      clearTimeout(timer);
    });
    popupTimeouts.forEach(function(timer) {
      clearTimeout(timer);
    });

    holes.forEach(function(hole) {
      hole.classList.remove('wag__geth-visible');
      hole.classList.remove('wag__geth-clicked');
    });
  }

  /**
   * Starts the process of showing and hiding the Geth
   * @param {Element} hole The hole element to show or hide
   * @param {Number} index The index of the hole to be able to store the timeouts for clearing
   * @return {Undefined} Returns nothing
   */
  function startGethPopup(hole, index) {
    const popupTime = getPopupTime(MIN_WAIT_TIME, MAX_WAIT_TIME);

    waitTimeouts[index] = setTimeout(function() {
      const upTime = getPopupTime(MIN_UP_TIME, MAX_UP_TIME);
      hole.classList.add('wag__geth-visible');
      hole.classList.remove('wag__geth-clicked');

      popupTimeouts[index] = setTimeout(function() {
        hole.classList.remove('wag__geth-visible');
        startGethPopup(hole, index);
      }, upTime);
    }, popupTime);
  }

  /**
   * Creates the click handler for clicking on the Geth
   * @param {Number} index The hole index
   * @return {Function} Returns the handler
   */
  function createGethClickHandler(index) {
    return function(event) {
      score = score + SCORE_INCREMENT;
      scoreSpan.textContent = score;
      clearTimeout(waitTimeouts[index]);
      clearTimeout(popupTimeouts[index]);
      event.currentTarget.classList.remove('wag__geth-visible');
      event.currentTarget.classList.add('wag__geth-clicked');

      if (!isStopped) {
        startGethPopup(event.currentTarget, index);
      }
    };
  }

  // attach handlers
  startBtn.addEventListener('click', startGame);
  stopBtn.addEventListener('click', stopGame);
  holes.forEach(function(hole, index) {
    hole.addEventListener('click', createGethClickHandler(index));
  });
});
