const translateFromText = document.querySelector(".from-text");
const translateToText = document.querySelector(".to-text");
const chageIcon = document.querySelector(".change");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateButton = document.querySelector("button");

selectTag.forEach((tag, id) => {
  for (let countryCode in countries) {
    let selected =
      id == 0
        ? countryCode == "en-GB"
          ? "selected"
          : ""
        : countryCode == "mk-MK"
        ? "selected"
        : "";
    let option = `<option ${selected} value="${countryCode}">${countries[countryCode]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

chageIcon.addEventListener("click", () => {
  let temporaryText = translateFromText.value;
  let temporaryLanguage = selectTag[0].value;
  translateFromText.value = translateToText.value;
  translateToText.value = temporaryText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = temporaryLanguage;
});

translateFromText.addEventListener("keyup", () => {
  if (!translateFromText.value) {
    translateToText.value = "";
  }
});

translateButton.addEventListener("click", () => {
  let text = translateFromText.value.trim();
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;
  if (!text) return;
  translateToText.setAttribute("placeholder", "Translating...");
  let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      translateToText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          translateToText.value = data.translation;
        }
      });
      translateToText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!translateFromText.value || !translateToText.value) return;
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(translateFromText.value);
      } else {
        navigator.clipboard.writeText(translateToText.value);
      }
    } else {
      let vocalization;
      if (target.id == "from") {
        vocalization = new SpeechSynthesisUtterance(translateFromText.value);
        vocalization.lang = selectTag[0].value;
      } else {
        vocalization = new SpeechSynthesisUtterance(translateToText.value);
        vocalization.lang = selectTag[1].value;
      }
      speechSynthesis.speak(vocalization);
    }
  });
});
