import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
    const [breakLengthState, setBreakLengthState] = useState(5);
    const breakLength = useRef(breakLengthState);
    breakLength.current = breakLengthState;
    const [sessionLengthState, setSessionLengthState] = useState(25);
    const sessionLength = useRef(sessionLengthState);
    sessionLength.current = sessionLengthState;
    const [timePassedState, setTimePassedState] = useState(0);
    const timePassed = useRef(timePassedState);
    timePassed.current = timePassedState;
    const accumulated = useRef(0);
    const [sessionState, setSessionState] = useState(true);
    const session = useRef(sessionState);
    session.current = sessionState;
    const [pausedState, setPausedState] = useState(true);
    const paused = useRef(pausedState);
    paused.current = pausedState;
    const time = useRef(Date.now());
    
    const decreaseTime = (diff) => {
        setTimePassedState(accumulated.current + Math.floor(diff / 1000));
    }

    const reset = () => {
        setBreakLengthState(5);
        setSessionLengthState(25);
        setTimePassedState(0);
        setSessionState(true);
        setPausedState(true);
        document.getElementById("beep").currentTime = 0
        document.getElementById("beep").pause()
    }

    const changeSession = () => {
        setTimePassedState(0);
        setSessionState(!session.current);
        accumulated.current = 0;
        time.current = Date.now();
    }

    const startStop = () => {
        setPausedState(!paused.current);
        accumulated.current = timePassed.current;
        time.current = Date.now();
    }

    const decrementBreak = () => {
        if (breakLength.current > 1) {
            setBreakLengthState(breakLength.current - 1);
        }
    }

    const incrementBreak = () => {
        if (breakLength.current < 60) {
            setBreakLengthState(breakLength.current + 1);
        }
    }

    const decrementSession = () => {
        if (sessionLength.current > 1) {
            setSessionLengthState(sessionLength.current - 1);
        }
    }

    const incrementSession = () => {
        if (sessionLength.current < 60) {
            setSessionLengthState(sessionLength.current + 1);
        }
    }

    const manageTime = () => {
        let timeLeft = (session.current ? sessionLength.current : breakLength.current) * 60 - timePassed.current
        if (!paused.current) {
            if (timeLeft == 0) {
                document.getElementById("beep").currentTime = 0
                document.getElementById("beep").play()
            }
            if (timeLeft >= 0) {
                decreaseTime(Date.now() - time.current);
            } else {
                changeSession();
            }
        }
    }

    useEffect(() => {
        let interval = setInterval(() => manageTime(), 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <audio preload="auto" id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
            <Controls
                incrementBreak={incrementBreak}
                decrementBreak={decrementBreak}
                incrementSession={incrementSession}
                decrementSession={decrementSession}
                breakLength={breakLengthState}
                sessionLength={sessionLengthState}
            />
            <Timer
                timeLeft={(sessionState ? sessionLengthState : breakLengthState) * 60 - timePassedState}
                reset={reset}
                startStop={startStop}
                session={sessionState}
                paused={pausedState}
            />
        </div>
    )
  }

const Controls = (props) => {
  return (
      <div className="control">
        <div>
            <div id="break-label">
                Break Length
            </div>
            <div className="buttons">
                <div id="break-decrement" className="button-left" onClick={props.decrementBreak}>
                    <DecrementButton />
                </div>
                <div id="break-length">
                    {props.breakLength}
                </div>
                <div id="break-increment" className="button-right" onClick={props.incrementBreak}>
                    <IncrementButton />
                </div>
            </div>
        </div>
        <div>
            <div id="session-label">
                Session Length
            </div>
            <div className="buttons">
                <div id="session-decrement" className="button-left" onClick={props.decrementSession}>
                    <DecrementButton />
                </div>
                <div id="session-length">
                    {props.sessionLength}
                </div>
                <div id="session-increment" className="button-right" onClick={props.incrementSession}>
                    <IncrementButton />
                </div>
            </div>
        </div>
      </div>
  )
}

const Timer = (props) => {
    let timeLeft = props.timeLeft > 0 ? props.timeLeft : 0;
    let secondsLeft = timeLeft % 60;
    let minutesLeft = (timeLeft - secondsLeft) / 60;
    return (
        <div>
            <div className="timer">
                <div className="labels">
                    <div id="timer-label">
                        {props.session ? "Session" : "Break"}
                    </div>
                </div>
                <div className="buttons">
                    <div id="start_stop" onClick={props.startStop}>
                        <ButtonStartStop paused={props.paused}/>
                    </div>
                    <div id="time-left">
                        {("00" + minutesLeft).slice(-2)}:{("00" + secondsLeft).slice(-2)}
                    </div>
                    <div id="reset" onClick={props.reset}>
                        <RestartButton />
                    </div>
                </div>
            </div>   
        </div>
    )
}

const ButtonStartStop = (props) => {
    if (!props.paused) return (<i className="fa-solid fa-circle-pause"></i>);
    return (<i className="fa-solid fa-circle-play"></i>);
}

const RestartButton = () => (<i className="fa-solid fa-arrow-rotate-right"></i>)

const IncrementButton = () => (<i className="fa-solid fa-circle-arrow-up"></i>)

const DecrementButton = () => (<i className="fa-solid fa-circle-arrow-down"></i>)

export default App;
