import { useEffect, useRef, useState } from "react";
import "./App.css";

const focusMinutes = 25;
const shortBreakMinutes = 5;
const longBreakMinutes = 15;
const audio = new Audio("/bell.mp3")
function App() {
  const [isStarting, setIsStarting] = useState(false);
  const [pomodoros, setPomodoros] = useState(1);
  const [status, setStatus] = useState("ON_FOCUS");
  const [seconds, setSeconds] = useState(focusMinutes * 60);
  const timerId = useRef();

  useEffect(() => {
    document.title = `${seconds / 60 < 10 ? "0" : ""}${Math.round(
      seconds / 60
    )}:${seconds % 60 < 10 ? "0" : ""}${seconds % 60} - Time to ${
      status === "ON_FOCUS"
        ? "focus"
        : status === "ON_SHORT_BREAK"
        ? "short break"
        : "long break"
    }`;
  }, [seconds,status]);

  useEffect(() => {
    if (seconds == 0) {
      if (status === "ON_FOCUS" && pomodoros % 4 != 0) {
        setStatus("ON_SHORT_BREAK");
        setSeconds(shortBreakMinutes * 60);
      } else if (status === "ON_FOCUS" && pomodoros % 4 == 0) {
        setStatus("ON_LONG_BREAK");
        setSeconds(longBreakMinutes * 60);
      } else if (status === "ON_LONG_BREAK" || status === "ON_SHORT_BREAK") {
        setPomodoros(pomodoros + 1);
        setSeconds(focusMinutes * 60);
        setStatus("ON_FOCUS");
      }
      setIsStarting(false);
      playAudio(audio)
    }
  }, [seconds, status]);

  useEffect(() => {
    if (isStarting && seconds > 0) {
      timerId.current = setTimeout(() => {
        setSeconds((prev) => prev - 1);
        document.title = `${seconds / 60 < 10 ? "0" : ""}${Math.round(
          seconds / 60
        )}:${seconds % 60 < 10 ? "0" : ""}${seconds % 60}`;
      }, 1000);
    }
    return () => clearTimeout(timerId.current);
  });

  useEffect(() => {
    const buttons = document.querySelectorAll(".controll-button");
    buttons.forEach((button) => {
      button.style.background = "none";
    });

    switch (status) {
      case "ON_FOCUS":
        buttons[0].style.backgroundColor = "rgba(0, 0, 0, 0.17)";
        break;
      case "ON_SHORT_BREAK":
        buttons[1].style.backgroundColor = "rgba(0, 0, 0, 0.17)";
        break;
      case "ON_LONG_BREAK":
        buttons[2].style.backgroundColor = "rgba(0, 0, 0, 0.17)";
        break;
    }
  }, [status]);

  const playAudio = (audio) => {
    audio.play()
  }

  const handleChangeStatus = (e, status) => {
    const buttons = document.querySelectorAll(".controll-button");
    buttons.forEach((button) => {
      button.style.background = "none";
    });
    setStatus(status);
    setSeconds(
      (status === "ON_FOCUS"
        ? focusMinutes
        : status == "ON_SHORT_BREAK"
        ? shortBreakMinutes
        : longBreakMinutes) * 60
    );
    setIsStarting(false);
    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.17)";
  };

  return (
    <div
      className="container"
      style={{
        backgroundColor:
          status === "ON_FOCUS"
            ? "#c44848"
            : status === "ON_SHORT_BREAK"
            ? "rgb(55, 137, 134)"
            : "rgb(37, 99, 161)",
      }}
    >
      <div className="wrapper">
        <div className="btn-wrapper">
          <button
            className="controll-button"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.17)" }}
            onClick={(e) => handleChangeStatus(e, "ON_FOCUS")}
          >
            Pomodoro
          </button>
          <button
            className="controll-button"
            onClick={(e) => handleChangeStatus(e, "ON_SHORT_BREAK")}
          >
            Short Break
          </button>
          <button
            className="controll-button"
            onClick={(e) => handleChangeStatus(e, "ON_LONG_BREAK")}
          >
            Long Break
          </button>
        </div>
        <div className="timer">
          {seconds / 60 < 10 ? "0" : ""}
          {Math.floor(seconds / 60)} : {seconds % 60 < 10 ? "0" : ""}
          {seconds % 60}
        </div>
        <div>
          <button
            className="start-button"
            onClick={() => setIsStarting(!isStarting)}
            style={{
              color:
                status === "ON_FOCUS"
                  ? "#c44848"
                  : status === "ON_SHORT_BREAK"
                  ? "rgb(55, 137, 134)"
                  : "rgb(37, 99, 161)",
            }}
          >
            {isStarting ? "PAUSE" : "START"}
          </button>
        </div>
      </div>
      <div className="info-wrapper">
        <div className="pomodoros-amount">#{pomodoros}</div>
        <div className="message">
          {status === "ON_FOCUS" ? "Time to focus!" : "Time to break!"}
        </div>
      </div>
    </div>
  );
}

export default App;
