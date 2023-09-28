// Javascript for Want To Read Button
const wantToReadButton = document.getElementById("want-to-read-btn");
wantToReadButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const bookId = wantToReadButton.getAttribute("data-book-id");
});
