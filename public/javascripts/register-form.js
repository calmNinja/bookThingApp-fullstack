//Avatar URL validator
function validateAvatar() {
  const avatarInput = document.getElementById("avatar");
  const avatarUrl = avatarInput.value.trim();
  const avatarError = document.getElementById("avatar-error");
  const validUrlPattern = /^(http[s]?:\/\/|data:image\/)/i;
  // const imageExtensions = /\.(jpg|jpeg|png|gif|bmp)$/i;
  if (avatarUrl !== "") {
    if (!validUrlPattern.test(avatarUrl)) {
      avatarInput.classList.add("is-invalid");
      avatarError.textContent =
        "Invalid image URL. Please provide a valid image URL";
      return false;
    } else {
      avatarInput.classList.remove("is-invalid");
      avatarError.textContent = ""; //Clear any previous error
    }
  } else {
    avatarInput.classList.remove("is-invalid");
    avatarError.textContent = ""; //Clear error message if url is empty
  }
  return true;
}
function validateForm() {
  const isAvatarValid = validateAvatar();
  if (!isAvatarValid) {
    event.preventDefault();
  }
  return isAvatarValid;
}
