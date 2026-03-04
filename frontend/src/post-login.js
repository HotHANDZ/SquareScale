/**
 * Shared script for regular-user-home, manager-home, admin-home.
 * Ensures user is in sessionStorage (else redirect to login), shows username in badge, handles Back to Login (clear session + redirect).
 */
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
