# SquareScale User Manual

SquareScale is a web application for **chart-of-accounts management**, **double-entry journal entries** with an **approval workflow**, a **financial ratios dashboard**, and **administrative tools** for users and audit visibility. This manual describes what end users see and how to complete common tasks.

---

## Table of contents

1. [Before you start](#1-before-you-start)
2. [Signing in and signing out](#2-signing-in-and-signing-out)
3. [User roles](#3-user-roles)
4. [The home dashboard](#4-the-home-dashboard)
5. [Navigation bar](#5-navigation-bar)
6. [Chart of accounts](#6-chart-of-accounts)
7. [Journal entries](#7-journal-entries)
8. [Event log (audit trail)](#8-event-log-audit-trail)
9. [Administrator: user management](#9-administrator-user-management)
10. [Requesting a new account (first-time users)](#10-requesting-a-new-account-first-time-users)
11. [Forgot password](#11-forgot-password)
12. [Account security and lockout](#12-account-security-and-lockout)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Before you start

### What you need

- **Backend**: Java 17 and the Spring Boot application running (default URL: `http://localhost:8080`).
- **Database**: MySQL running and configured for the backend (see project configuration).
- **Frontend**: Open the pages under the `frontend` folder in a web browser. The README describes using Live Server or opening `index.html` directly. The frontend expects the backend to be reachable at `http://localhost:8080`.

### Recommended startup order

1. Start MySQL (if it is not already running).
2. Start the backend until it reports that the server is listening (for example, on port 8080).
3. Open the frontend login page (`index.html`).

If the backend is not running, login and most actions will fail with a connection error.

### Demo accounts (first-time startup)

If your database was loaded from the project seed **`database/squarescale_db/squarescale_users.sql`**, these **shared** accounts work for anyone who runs that script (for example after cloning from GitHub). **Usernames are case-sensitive.**

| Role | Username | Password |
|------|----------|----------|
| **ADMIN** | `Admin` | `1234` |
| **MANAGER** | `Manager` | `1234` |
| **USER** (accountant) | `User` | `1234` |

The same file also includes older class-style accounts (for example `adminBrandon`, `managerBrandon`, `regularBrandon`, and similar names for other teammates), all with password **`1234`**, if you need extra users.

If you already have a database and only need these three accounts added or refreshed, run **`database/squarescale_db/add_shared_demo_users.sql`** in MySQL (it upserts user IDs 16–18).

**Note:** Passwords in that SQL dump are stored as **plain text** for class demos. When you log in successfully, the application may **replace** them with a **BCrypt** hash. If login fails after a reset, see `database/squarescale_db/unlock_user.sql` and the comments there (wrong attempts can lock an account). For anything beyond a local demo, change these passwords and use normal security practices.

---

## 2. Signing in and signing out

### Login

1. Open **`index.html`** (SquareScale: Login).
2. Enter your **username** and **password**.
3. Click **Login**.

On success, the application stores your session in the browser and sends you to a **home page** that depends on your role (see [User roles](#3-user-roles)).

If login fails, read the message shown (invalid credentials, inactive account, suspension, or lockout). See [Account security and lockout](#12-account-security-and-lockout).

### Log out

After you sign in, the top navigation includes **Log out**. Click it to clear your session and return to the login experience.

---

## 3. User roles

| Role | Typical use | Highlights |
|------|-------------|------------|
| **USER** | Accountant | Create journal entries, view lists and details, view chart of accounts and event log, use dashboard. |
| **MANAGER** | Supervisor | Same as USER, plus **approve** or **reject** pending journal entries. |
| **ADMIN** | System administrator | Full user lifecycle (create, edit, activate, deactivate, suspend), expired-password report, simulated user email, plus **create, edit, and deactivate** chart-of-accounts entries. |

If you try to open an admin-only page with the wrong role, the application redirects you to the appropriate home page or login.

---

## 4. The home dashboard

After login, your **home** page (`regular-user-home.html`, `manager-home.html`, or `admin-home.html`) loads a **dashboard** that includes:

- **Financial ratios**: Liquidity, leverage, profitability, and turnover-style metrics computed from **active** accounts in the chart of accounts. Values may show as good, borderline, needs attention, or no data, with a legend on screen.
- **Refresh**: A control to reload ratio data from the server.
- **Quick navigation**: Shortcuts to major areas (for example, Chart of Accounts, Journal, Event Log). Some tiles appear only for **ADMIN** (such as all users and add user).

**Notifications** (when applicable):

- Pending journal entries (useful for managers and administrators).
- **Expired passwords** list for **ADMIN** (users whose password was last changed before the policy window).

---

## 5. Navigation bar

On pages that use the application shell, the top bar typically includes:

- **Home**: Returns to your role’s home dashboard.
- **Chart of accounts**: Opens the chart of accounts.
- **Event log**: Opens the audit trail list.
- **Journal**: Opens the journal hub (create entries or view the list).
- **Log out**: Ends your session.

A small **calendar** control is available for picking a date; it is for **reference** in the UI, not a substitute for entry dates on forms.

The logo and your **username** also appear in the bar.

---

## 6. Chart of accounts

Open **Chart of accounts** from the nav or dashboard (`admin-accounts.html`).

### What everyone can do

- **Browse** accounts.
- **Search and filter** by name, number, category, subcategory, balance range, and active status (depending on what the screen exposes).
- **Open** an account to see details.
- **View a ledger-style summary** for an account (summary line derived from the chart data).

### What only administrators can do

Administrators can **add**, **edit**, and **deactivate** accounts when the backend receives their user identity as required by the API. Other roles should treat this area as **read-only** for changes.

**Rules you should know:**

- Account **numbers** are numeric only and follow class conventions (for example, ranges associated with assets, liabilities, equity, revenue, and expense).
- Each account has a **normal side** (debit or credit), **category** and **subcategory**, and a **statement** type (income statement, balance sheet, or retained earnings).
- **Deactivation** is blocked if the account **balance is greater than zero**.

Changes that administrators make to accounts are recorded for the **event log**.

---

## 7. Journal entries

Open **Journal** from the nav (`journal.html`). You will see two paths:

### New journal entry (`journal-entry.html`)

Use this to **create** an entry:

1. Enter the **date** and **description**.
2. Add **lines**: each line is a **debit** or **credit** to a selected **active** account, with an amount and optional line description.
3. **Totals**: Debits must **equal** credits before submission.
4. **Attachments** (optional): attach supporting files; they are stored with the entry.
5. Submit the entry. It is saved in **pending** status until a manager or administrator acts on it.

Entry types (such as regular versus adjusting) follow the options on the form and backend.

### View journal entries (`journal-list.html`)

Use this to **list** entries and:

- **Filter** by status, entry type, date range, and search text.
- **Open** an entry to see lines, metadata, and **download attachments**.

**Managers and administrators** can **approve** or **reject** pending entries from the detail view. **Rejection** should include a **reason** when the workflow requires it. Approving posts the entry to the accounts according to the application logic.

---

## 8. Event log (audit trail)

Open **Event log** (`admin-event-log.html`) to see a **read-only** list of recorded events: what kind of entity changed, what action occurred, which user was associated, and when. This supports accountability, especially for chart-of-accounts changes.

---

## 9. Administrator: user management

Administrators use **admin-home.html** and related pages.

### All users

- View a table of users: identifiers, roles, email, **active** flag, and **suspension** information where applicable.
- **Activate** or **deactivate** a user.
- **Suspend** a user for a period (for example, extended leave) using the start and end date/time the workflow asks for.
- **Edit** a user: name, email, role, and optionally set a **new password** (subject to validation).
- **Send email** (in the current project build this is **simulated** on the server side; it may not deliver real mail).

### Add user (`admin-add-user.html`)

- Create users with roles **ADMIN**, **MANAGER**, or **USER**.
- The system **generates a username** from the person’s name and a date-based suffix. You must assign an initial password that meets policy.

### Expired passwords report

- Lists users whose password was last set **more than three months ago** (per backend logic). Use this to prompt password updates or follow your organization’s procedure.

---

## 10. Requesting a new account (first-time users)

From the login page, follow **New User** (`create-user.html`). Submit the form with **first name, last name, address, date of birth, and email**.

The server **accepts** the request and returns a confirmation message. In the current implementation, notification to an administrator is **simulated** (for example, logged on the server). An administrator must still **create** your real login separately.

---

## 11. Forgot password

From the login page, open **Forgot password** (`forgot-password.html`).

1. Enter your **email** and **User ID** (your **username**). The server verifies that they match a single user.
2. Complete the **security questions** shown in the app. *(In the current project, these prompts are a fixed demonstration set on the page—not personalized per user.)*
3. Enter a **new password** that satisfies the rules:
   - At least **8** characters
   - **Starts with a letter**
   - Contains at least one **letter**, one **number**, and one **special** character
4. Submit. The new password cannot be the same as your current password.

After a successful reset, sign in with the new password on **`index.html`**.

---

## 12. Account security and lockout

- **Inactive** users cannot sign in until an administrator **activates** them.
- **Suspended** users cannot sign in until the suspension period has passed (and any related flags are cleared per your admin process).
- **Failed login attempts**: After **three** incorrect passwords, the account is treated as locked/suspended per application rules, and you may need an **administrator** to restore access.

Passwords are stored with **strong hashing** in normal operation; legacy plain-text passwords may be upgraded when you log in successfully.

---

## 13. Troubleshooting

| Problem | What to try |
|--------|-------------|
| “Could not reach backend” or network errors | Confirm Spring Boot is running on port **8080** and no firewall is blocking it. |
| Login works but data is empty | Confirm **MySQL** is running and seeded or populated as expected. |
| Cannot approve journals | Confirm your role is **MANAGER** or **ADMIN** and you are using the journal list detail actions. |
| Cannot add or edit accounts | Only **ADMIN** may change accounts; ensure you are signed in as an administrator and using the correct workflow. |
| Forgot password says email or User ID is wrong | Use the exact **username** the administrator gave you and the email on file. |

---

## Document information

This manual describes the SquareScale application as implemented in this repository (frontend static pages plus Spring Boot API). Behavior that depends on **database content**, **server configuration**, or future code changes may differ; when in doubt, refer to your course or project administrator.
