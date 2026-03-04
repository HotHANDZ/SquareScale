// Shared script for post-login home pages: enforce login, show user badge, provide logout.
(function () {
  const userJson = sessionStorage.getItem("user");
  if (!userJson) {
    window.location.href = "index.html";
    return;
  }
  const user = JSON.parse(userJson);

  const badge = document.getElementById("loggedInBadge");
  const badgeUsername = document.getElementById("loggedInUsername");
  if (badge && badgeUsername) {
    badgeUsername.textContent = user.username;
    badge.style.display = "flex";
  }

  const backBtn = document.getElementById("backToLogin");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      sessionStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
})();
