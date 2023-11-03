const expandableContent = document.getElementById("expandable-content");
const readMoreBtn = document.getElementById("read-more-btn");
const maxCharacters = 846;

// Display the text length
const content = expandableContent.textContent;
const characterCount = content.length;
console.log("Character count: " + characterCount);

// If the content has less characters than the max character count, hide the button
if (expandableContent.textContent.length <= maxCharacters) {
  readMoreBtn.style.display = "none";
} else {
  // If the content has more characters than the max character count, trim it
  const trimmedContent = content.slice(0, maxCharacters) + " ...";
  expandableContent.textContent = trimmedContent;
}

readMoreBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (expandableContent.classList.contains("expanded")) {
    // If the content is expanded, trim it again
    const trimmedContent = content.slice(0, maxCharacters) + " ...";
    expandableContent.textContent = trimmedContent;
    expandableContent.classList.remove("expanded");
    readMoreBtn.textContent = "Read More";
  } else {
    expandableContent.textContent = content; // Restore the full content
    expandableContent.classList.add("expanded");
    readMoreBtn.textContent = "Read Less";
  }
});
