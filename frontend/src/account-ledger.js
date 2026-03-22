/**
 * Load ledger JSON for account id from query string (?accountId=).
 */
const API_BASE_URL = "http://localhost:8080";

const moneyFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMoney(n) {
  if (n == null || n === "") return "—";
  const num = typeof n === "number" ? n : parseFloat(String(n).replace(/,/g, ""));
  if (Number.isNaN(num)) return "—";
  return moneyFmt.format(num);
}

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
const ledgerRole = user ? String(user.role || "").toUpperCase() : "";
if (!user || !["ADMIN", "MANAGER", "USER"].includes(ledgerRole)) {
  window.location.href = "index.html";
} else {
  loadLedger();
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

async function loadLedger() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("accountId");
  const sub = document.getElementById("ledgerSubtitle");
  const msg = document.getElementById("ledgerMessage");
  if (!id) {
    if (sub) sub.textContent = "Missing account id.";
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/admin/accounts/${id}/ledger`);
    if (!res.ok) {
      const t = await res.text();
      if (msg) {
        msg.textContent = t || "Could not load ledger.";
        msg.classList.remove("hidden");
      }
      if (sub) sub.textContent = "Error";
      return;
    }
    const data = await res.json();
    const acc = data.account;
    const lines = data.lines || [];
    if (sub) {
      sub.textContent = `${acc.accountNumber} — ${acc.accountName} (normal balance: ${acc.normalSide})`;
    }
    const title = document.getElementById("ledgerAccountTitle");
    if (title) {
      title.textContent = `Ledger: ${acc.accountName}`;
    }
    const tbody = document.querySelector("#ledgerTable tbody");
    if (tbody) {
      tbody.innerHTML = "";
      lines.forEach((line) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${formatDateTime(line.date)}</td>
          <td>${escapeHtml(line.description)}</td>
          <td class="num-cell">${formatMoney(line.debit)}</td>
          <td class="num-cell">${formatMoney(line.credit)}</td>
          <td class="num-cell">${formatMoney(line.balance)}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (e) {
    console.error(e);
    if (msg) {
      msg.textContent = "Could not reach backend.";
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
