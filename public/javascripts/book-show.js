const expandableContent = document.getElementById("expandable-content");
const readMoreBtn = document.getElementById("read-more-btn");
let maxCharacters;

function setMaxCharacters() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 480) return 200;
  if (screenWidth <= 768) return 400;
  if (screenWidth <= 1024) return 600;
  return 846;
}
maxCharacters = setMaxCharacters();

const content = expandableContent.textContent;

//Toggle button text and expand or shrink content accordingly
function trimAndtoggle() {
  const shouldExpand = !expandableContent.classList.contains("expanded");

  if (shouldExpand || content.length > maxCharacters) {
    const trimmedContent = shouldExpand
      ? content
      : content.slice(0, maxCharacters) + " ...";

    expandableContent.textContent = trimmedContent;
    expandableContent.classList.toggle("expanded");
    readMoreBtn.textContent = shouldExpand ? "Read Less" : "Read More";
  }
}

function updateContent() {
  // If the content has less characters than the max character count, hide the button
  if (content.length <= maxCharacters) {
    readMoreBtn.style.display = "none";
  } else {
    // If the content has more characters than the max character count, trim it
    readMoreBtn.style.display = "block";
    trimAndtoggle();
  }
}
updateContent();

window.addEventListener("resize", function () {
  maxCharacters = setMaxCharacters();
  updateContent();
  trimAndtoggle();
});
readMoreBtn.addEventListener("click", function (e) {
  e.preventDefault();
  trimAndtoggle();
});
