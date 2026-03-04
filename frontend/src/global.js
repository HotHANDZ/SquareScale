// Simple login wiring: frontend -> backend (/auth/login)
const API_BASE_URL = "http://localhost:8080";

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("userName");
const passwordInput = document.getElementById("password");

const badge = document.getElementById("loggedInBadge");
const badgeUsername = document.getElementById("loggedInUsername");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      username: usernameInput?.value?.trim(),
      password: passwordInput?.value ?? "",
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Login failed");
        return;
      }

      const data = await res.json();

      // Requirement: show username (and picture placeholder) top-right after login.
      if (badge && badgeUsername) {
        badgeUsername.textContent = data.username;
        badge.style.display = "flex";
      }
    } catch (e) {
      console.error(e);
      alert("Could not reach backend. Make sure Spring Boot is running on port 8080.");
    }
  });
}

