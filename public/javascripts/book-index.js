/*Javascript for Scroll To Top */
let mybutton = document.getElementById("btn-back-to-top");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

/*Javascript for Search Bar */
document.getElementById("searchbox").addEventListener("input", liveSearch);
function liveSearch() {
  let cards = document.querySelectorAll(".search-books");
  let search_query = document.getElementById("searchbox").value;
  let noResultsMessage = document.getElementById("no-results-message");
  let hasResults = false;

  cards.forEach((card) => {
    let cardText = card.innerText.toLowerCase();
    if (cardText.includes(search_query)) {
      card.classList.remove("is-hidden");
      hasResults = true;
    } else {
      card.classList.add("is-hidden");
    }
  });
  if (hasResults) {
    noResultsMessage.style.display = "none";
  } else {
    noResultsMessage.style.display = "block";
  }
}
