var content = document.querySelector(".content");
var talk = document.querySelector(".talk");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function () {
  talk.classList.add("active");
};

recognition.onresult = function (event) {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  let msg = content.value + " " + transcript;

  talk.classList.remove("active");
  content.textContent = msg;
};

talk.addEventListener("click", () => {
  recognition.abort();
  recognition.start();
});

// Text to speech

const speechBtn = document.querySelector(".speech");
const voiceList = document.querySelector("select");
var isSpeaking = true;

speechBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (content.value !== "") {
    if (!synth.speaking) {
      textToSpeech(content.value);
    }
    if (content.value.length > 50) {
      if (isSpeaking) {
        synth.resume();
        isSpeaking = false;
        speechBtn.innerText = "Pause Speech";
      } else {
        synth.pause();
        isSpeaking = true;
        speechBtn.innerText = "Resume Speech";
      }
      setInterval(() => {
        console.log(synth.speaking);
        if (!synth.speaking && !isSpeaking) {
          speechBtn.innerText = "Convert To Speech";
          isSpeaking = true;
        }
      });
    } else {
      speechBtn.innerText = "Convert To Speech";
    }
  }
});

let synth = speechSynthesis;

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }
  speechSynthesis.speak(utterance);
}

function voices() {
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? true : false;

    let option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    option.selected = selected;
    voiceList.insertAdjacentElement("beforeend", option);
  }
}

voices();

synth.addEventListener("voiceschanged", voices);
