/**
 * Load /admin/event-logs for administrators.
 */
const API_BASE_URL = "http://localhost:8080";

function getSessionUser() {
  const raw = sessionStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const user = getSessionUser();
const evRole = user ? String(user.role || "").toUpperCase() : "";
if (!user || !["ADMIN", "MANAGER", "USER"].includes(evRole)) {
  window.location.href = "index.html";
} else {
  loadEvents();
}

function formatDateTime(val) {
  if (val == null) return "—";
  if (Array.isArray(val) && val.length >= 3) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = val;
    const dt = new Date(y, mo - 1, d, h, mi, s);
    return Number.isNaN(dt.getTime()) ? String(val) : dt.toLocaleString();
  }
  const dt = new Date(val);
  if (!Number.isNaN(dt.getTime())) return dt.toLocaleString();
  return String(val);
}

async function loadEvents() {
  const tbody = document.querySelector("#eventLogTable tbody");
  const msg = document.getElementById("eventLogMessage");
  try {
    const res = await fetch(`${API_BASE_URL}/admin/event-logs`);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const rows = await res.json();
    if (!tbody) return;
    tbody.innerHTML = "";
    rows.forEach((e) => {
      const tr = document.createElement("tr");
      const uid = e.performedByUserId != null ? e.performedByUserId : e.userId;
      tr.innerHTML = `
        <td>${escapeHtml(e.id)}</td>
        <td>${escapeHtml(e.entityType)}</td>
        <td>${escapeHtml(e.entityId)}</td>
        <td>${escapeHtml(e.action)}</td>
        <td>${escapeHtml(uid)}</td>
        <td>${escapeHtml(e.performedByUsername ?? "—")}</td>
        <td>${formatDateTime(e.createdAt)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    if (msg) {
      msg.textContent = "Could not load event log.";
      msg.classList.remove("hidden");
    }
  }
}

function escapeHtml(s) {
  if (s == null) return "";
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
