function playSound(name) {
  const audio = new Audio(`sounds/${name}.mp3`);
  audio.play();
}

// Zuordnung: Taste/ID -> Sound-Dateiname
const soundMap = {
  keyC: "dog",
  keyD: "cat",
  keyE: "cow",
  keyF: "chicken",
  keyG: "bird",
  keyA: "cricket",
  keyB: "goose",
};

// Tastatur: Taste -> Key-ID
const keyboardMap = {
  a: "keyC",
  s: "keyD",
  d: "keyE",
  f: "keyF",
  g: "keyG",
  h: "keyA",
  j: "keyB",
};

// Klick auf Buttons
document.querySelectorAll(".key").forEach((el) => {
  el.addEventListener("click", () => {
    const soundName = soundMap[el.id];
    if (!soundName) return;

    playSound(soundName);

    el.classList.add("active");
    setTimeout(() => el.classList.remove("active"), 200);
  });
});

// Taste drücken 
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;

  const keyId = keyboardMap[e.key.toLowerCase()];
  if (!keyId) return;

  const soundName = soundMap[keyId];
  if (!soundName) return;

  playSound(soundName);

  const el = document.getElementById(keyId);
  if (el) el.classList.add("active");
});

// Taste loslassen, effekt entfernen
document.addEventListener("keyup", (e) => {
  const keyId = keyboardMap[e.key.toLowerCase()];
  if (!keyId) return;

  const el = document.getElementById(keyId);
  if (el) el.classList.remove("active");
});
