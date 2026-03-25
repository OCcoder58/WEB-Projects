function playSound(name) {
  const audio = new Audio(`sounds/${name}.mp3`);
  audio.play();
}

// JS objects für keys
const soundKeys = [
  { id: "keyC", note: "C", keyboardKey: "a", sound: "dog" },
  { id: "keyD", note: "D", keyboardKey: "s", sound: "cat" },
  { id: "keyE", note: "E", keyboardKey: "d", sound: "cow" },
  { id: "keyF", note: "F", keyboardKey: "f", sound: "chicken" },
  { id: "keyG", note: "G", keyboardKey: "g", sound: "bird" },
  { id: "keyA", note: "A", keyboardKey: "h", sound: "cricket" },
  { id: "keyB", note: "B", keyboardKey: "j", sound: "goose" },
];

let loadedSequence = [];
let currentIndex = 0;
let isPlaying = false;
let playTimeout = null;

const sequenceContainer = document.getElementById("sequenceContainer");
const statusText = document.getElementById("statusText");
const loadSongBtn = document.getElementById("loadSongBtn");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function getKeyById(id) {
  return soundKeys.find((key) => key.id === id);
}

function getKeyByKeyboard(pressedKey) {
  return soundKeys.find((key) => key.keyboardKey === pressedKey);
}

function getKeyByNote(note) {
  return soundKeys.find((key) => key.note === note);
}

function activateKey(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), 200);
}

function playKey(keyObject) {
  if (!keyObject) return;
  playSound(keyObject.sound);
  activateKey(keyObject.id);
}

// json fetch
async function loadSequence() {
  try {
    const response = await fetch("notes.json");
    const data = await response.json();

    loadedSequence = data.notes;
    currentIndex = 0;
    renderSequence();
    statusText.textContent = "Status: Sequence loaded";
  } catch (error) {
    statusText.textContent = "Status: Could not load notes.json";
    console.error(error);
  }
}

function renderSequence() {
  sequenceContainer.innerHTML = "";

  if (loadedSequence.length === 0) {
    sequenceContainer.innerHTML = "<p>No sequence loaded yet.</p>";
    return;
  }

  loadedSequence.forEach((note, index) => {
    const noteElement = document.createElement("span");
    noteElement.className = "sequence-note";
    noteElement.textContent = `${index + 1}. ${note}`;

    // Klick auf geladene Noten
    noteElement.addEventListener("click", () => {
      const keyObject = getKeyByNote(note);
      playKey(keyObject);
      statusText.textContent = `Status: Played ${note}`;
    });

    sequenceContainer.appendChild(noteElement);
  });
}

function highlightSequenceNote(index) {
  document.querySelectorAll(".sequence-note").forEach((el) => {
    el.classList.remove("active");
  });

  const currentNote = document.querySelectorAll(".sequence-note")[index];
  if (currentNote) currentNote.classList.add("active");
}

function playSequence() {
  if (!isPlaying || currentIndex >= loadedSequence.length) {
    if (currentIndex >= loadedSequence.length && loadedSequence.length > 0) {
      isPlaying = false;
      statusText.textContent = "Status: Sequence finished";
    }
    return;
  }

  const note = loadedSequence[currentIndex];
  const keyObject = getKeyByNote(note);

  playKey(keyObject);
  highlightSequenceNote(currentIndex);
  statusText.textContent = `Status: Playing ${note}`;

  currentIndex++;
  playTimeout = setTimeout(playSequence, 700);
}

function startPlayback() {
  if (loadedSequence.length === 0) {
    statusText.textContent = "Status: Load a sequence first";
    return;
  }

  if (isPlaying) return;

  isPlaying = true;
  playSequence();
}

function pausePlayback() {
  isPlaying = false;
  clearTimeout(playTimeout);
  statusText.textContent = "Status: Playback paused";
}

// reset
function resetApp() {
  isPlaying = false;
  clearTimeout(playTimeout);
  currentIndex = 0;

  document
    .querySelectorAll(".key")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelectorAll(".sequence-note")
    .forEach((el) => el.classList.remove("active"));

  statusText.textContent = "Status: App reset";
}

soundKeys.forEach((keyObject) => {
  const el = document.getElementById(keyObject.id);
  if (!el) return;

  el.addEventListener("click", () => {
    playKey(keyObject);
    statusText.textContent = `Status: Played ${keyObject.note}`;
  });
});

// neue shortcuts für neue buttons
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;

  const pressedKey = e.key.toLowerCase();

  if (pressedKey === "p") {
    startPlayback();
    return;
  }

  if (pressedKey === "o") {
    pausePlayback();
    return;
  }

  if (pressedKey === "r") {
    resetApp();
    return;
  }

  const keyObject = getKeyByKeyboard(pressedKey);
  if (!keyObject) return;

  playKey(keyObject);
});

loadSongBtn.addEventListener("click", loadSequence);
playBtn.addEventListener("click", startPlayback);
pauseBtn.addEventListener("click", pausePlayback);
resetBtn.addEventListener("click", resetApp);
