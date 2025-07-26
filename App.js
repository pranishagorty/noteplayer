import React, { useState, useEffect } from "react";

const notes = [
  { name: "Sa", freq: 261.63 },
  { name: "Ri", freq: 293.66 },
  { name: "Ga", freq: 329.63 },
  { name: "Ma", freq: 349.23 },
  { name: "Pa", freq: 392.0 },
  { name: "Da", freq: 440.0 },
  { name: "Ni", freq: 493.88 },
  { name: "Sa (high)", freq: 523.25 },
];

function playFrequency(freq) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
  oscillator.stop(context.currentTime + 1);
}

function App() {
  const [page, setPage] = useState("welcome");
  const [clickedNotes, setClickedNotes] = useState(new Set());
  const [quizNote, setQuizNote] = useState(null);
  const [result, setResult] = useState(null);
  const [lastAnswer, setLastAnswer] = useState(null);

  const handlePlayNote = (freq, name) => {
    playFrequency(freq);
    setClickedNotes((prev) => new Set(prev).add(name));
  };

  const handleGuess = (name) => {
    if (!quizNote) {
      return;
    }
    if (name === quizNote.name) {
      setResult("correct");
    } 
    else {
      setResult("incorrect");
      setLastAnswer(quizNote.name);
    }
  };

  const nextQuizNote = () => {
    setResult(null);
    setLastAnswer(null);
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setQuizNote(randomNote);
    playFrequency(randomNote.freq);
  };

  useEffect(() => {
    if (page === "quiz") {
      nextQuizNote();
    }
  }, [page]);

  if (page === "welcome") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          textAlign: "center",
          backgroundColor: "#FCEFDC",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Welcome to Carnatic Notes Player
        </h1>
        <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
          Click below to hear each note
        </p>
        <button
          onClick={() => setPage("playNotes")}
          style={{
            fontSize: "1.25rem",
            padding: "1rem 2rem",
            backgroundColor: "#BA5282",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start
        </button>
      </div>
    );
  }

  if (page === "playNotes") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#FCEFDC",
          minHeight: "100vh",
        }}
      >
        <h1>Carnatic Scale</h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#555",
            marginTop: "0.5rem",
          }}
        >
          Learn the notes on a scale!
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {notes.map((note) => (
            <button
              key={note.name}
              onClick={() => handlePlayNote(note.freq, note.name)}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.2rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#BA5282",
                color: "white",
                cursor: "pointer",
                opacity: clickedNotes.has(note.name) ? 0.7 : 1,
              }}
            >
              {note.name}
            </button>
          ))}
        </div>

        {clickedNotes.size === notes.length && (
          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={() => setPage("quiz")}
              style={{
                fontSize: "1.25rem",
                padding: "1rem 2rem",
                backgroundColor: "#FFB238",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  if (page === "quiz") {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          position: "relative",
          backgroundColor: "#FCEFDC",
          minHeight: "100vh",
        }}
      >
        <button
          onClick={() => setPage("playNotes")}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#A10028",
            color: "white",
            cursor: "pointer",
          }}
        >
          ← Back to Practice
        </button>

        <h1>Guess the Note</h1>
        <p>Listen carefully and pick the note you heard.</p>

        <div
          style={{
            margin: "1.5rem auto",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            maxWidth: "400px",
          }}
        >
          <button
            onClick={() => playFrequency(quizNote.freq)}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#A10028",
              color: "white",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            Play Note Again
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
            }}
          >
            {notes.map((note) => (
              <button
                key={note.name}
                onClick={() => handleGuess(note.name)}
                disabled={result !== null}
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#BA5282",
                  color: "white",
                  cursor: result === null ? "pointer" : "default",
                  opacity: result === null ? 1 : 0.7,
                }}
              >
                {note.name}
              </button>
            ))}
          </div>

          {result && (
            <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
              {result === "correct" ? (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  Correct!
                </span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Incorrect! The right answer was {lastAnswer}.
                </span>
              )}
            </div>
          )}

          {result && (
            <button
              onClick={nextQuizNote}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#FFB238",
                color: "white",
                cursor: "pointer",
              }}
            >
              Next Note
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default App;
