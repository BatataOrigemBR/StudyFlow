let workDuration = 25;
let breakDuration = 5;
let minutes = workDuration;
let seconds = 0;
let isWorking = true;
let isRunning = false;
let intervalId;
let completedCycles = 0;
let studyGoal = 1;

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

let inactivityTimeout;
const inactivityTime = 300000; // 5 minutos de inatividade (em milissegundos)

function resetInactivityTimer() {
    clearInterval(inactivityTimeout);
    inactivityTimeout = setTimeout(pauseTimer, inactivityTime);
}

function pauseTimer() {
    if (isRunning) {
        pauseResumeTimer();
    }
}

function updateDisplay() {
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(() => {
            if (minutes === 0 && seconds === 0) {
                clearInterval(intervalId);
                isRunning = false;
                document.getElementById('alarm').play();
                if (isWorking) {
                    minutes = breakDuration;
                    showModal("Tempo de estudo terminou. Hora de descansar!");
                } else {
                    minutes = workDuration;
                    showModal("Tempo de descanso terminou. Hora de estudar!");
                    completedCycles++;
                    updateCycleCounter();
                }
                isWorking = !isWorking;
                updateDisplay();
            } else {
                if (seconds === 0) {
                    minutes--;
                    seconds = 59;
                } else {
                    seconds--;
                }
                updateDisplay();
            }
        }, 1000);
    }
}

function pauseResumeTimer() {
    if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
    } else {
        startTimer();
    }
}

function resetTimer() {
    clearInterval(intervalId);
    isRunning = false;
    isWorking = true;
    minutes = workDuration;
    seconds = 0;
    updateDisplay();
}

function showModal(message) {
    document.getElementById('modal-text').textContent = message;
    document.getElementById('custom-modal').style.display = 'block';
    setTimeout(function () {
        document.getElementById('custom-modal').style.display = 'none';
        document.getElementById('alarm').pause();
    }, 3000);
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseResumeTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

document.getElementById('workDuration').addEventListener('change', function () {
    workDuration = parseInt(this.value, 10);
    if (!isRunning) {
        minutes = workDuration;
        seconds = 0;
        updateDisplay();
    }
});

document.getElementById('breakDuration').addEventListener('change', function () {
    breakDuration = parseInt(this.value, 10);
    if (!isRunning && !isWorking) {
        minutes = breakDuration;
        seconds = 0;
        updateDisplay();
    }
});

document.getElementById('studyGoal').addEventListener('change', function () {
    studyGoal = parseInt(this.value, 10);
    updateCycleCounter();
});

function updateCycleCounter() {
    const cycleCounter = document.getElementById('cycle-counter');
    cycleCounter.textContent = `${completedCycles} / ${studyGoal} Ciclos`;
    if (completedCycles >= studyGoal) {
        showModal("Você atingiu sua meta de estudo!");
        pauseTimer();
    }
}

updateDisplay();
updateCycleCounter();
