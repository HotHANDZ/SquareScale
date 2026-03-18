//Data
    const TODAY = '2026-03-03';
    const ROLES = ['Admin','Manager','Analyst','Trader','Auditor','Compliance'];

    let users = [
      { id:1, name:'John Doe',  email:'john.doe@squarescale.com',   role:'admin',    status:'active',   lastLogin:'2026-03-02', passwordExpiry:'2026-02-15', suspended:false, suspendStart:null, suspendEnd:null },
      { id:2, name:'Jane Doe',     email:'jane.doe@squarescale.com',   role:'user',    status:'active',   lastLogin:'2026-03-01', passwordExpiry:'2026-04-10', suspended:false, suspendStart:null, suspendEnd:null },
    ];

    const isExpired  = d  => new Date(d) < new Date(TODAY);
    const isSuspended = u => u.suspended && new Date(u.suspendStart) <= new Date(TODAY) && new Date(u.suspendEnd) >= new Date(TODAY);

    function userStatusLabel(u) {
      if (isSuspended(u)) return 'suspended';
      return u.status;
    }

    function statusBadge(u) {
      const s = userStatusLabel(u);
      const map = { active:'badge-active', inactive:'badge-inactive', suspended:'badge-suspended' };
      const labels = { active:'Active', inactive:'Inactive', suspended:'Suspended' };
      return `<span class="badge ${map[s]}">${labels[s]}</span>`;
    }

    function roleBadge(role) {
      return `<span class="badge badge-role">${role}</span>`;
    }

    function daysBetween(a, b) {
      return Math.floor((new Date(b) - new Date(a)) / 86400000);
    }

    //View switching
    let currentView = 'users';

    function switchView(v) {
      document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
      document.getElementById('view-' + v).classList.add('active');
      document.querySelector(`[data-view="${v}"]`).classList.add('active');
      currentView = v;
      if (v === 'expired')  renderExpired();
    }

    //Render stats
    function renderStats() {
      const active   = users.filter(u => u.status === 'active' && !isSuspended(u)).length;
      const susp     = users.filter(isSuspended).length;
      const expCount = users.filter(u => isExpired(u.passwordExpiry)).length;
      const cards = [
        { label:'Total Users',        value: users.length, cls:'blue'  },
        { label:'Active',             value: active,       cls:'green' },
        { label:'Suspended',          value: susp,         cls:'amber' },
        { label:'Expired Passwords',  value: expCount,     cls:'red'   },
      ];
      document.getElementById('stats-grid').innerHTML = cards.map(c => `
        <div class="stat-card ${c.cls}">
          <div class="stat-value">${c.value}</div>
          <div class="stat-label">${c.label}</div>
        </div>`).join('');

      //Sidebar badge
      document.getElementById('expired-badge').textContent = expCount;
      document.getElementById('expired-badge').style.display = expCount > 0 ? 'inline' : 'none';
    }

    //Render user directory table
    function renderTable() {
      const q = (document.getElementById('search-input').value || '').toLowerCase();
      const filtered = users.filter(u =>
        [u.name, u.email, u.role].some(v => v.toLowerCase().includes(q))
      );

      const tbody = document.getElementById('users-tbody');
      const empty = document.getElementById('users-empty');

      if (filtered.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';

      tbody.innerHTML = filtered.map(u => {
        const expiredClass = isExpired(u.passwordExpiry) ? 'text-red font-bold' : 'text-muted font-mono';
        const expiredIcon  = isExpired(u.passwordExpiry) ? '⚠ ' : '';
        const suspBtn = isSuspended(u)
          ? `<button class="action-btn warn" onclick="unsuspendUser(${u.id})">Unsuspend</button>`
          : `<button class="action-btn warn" onclick="openSuspendModal(${u.id})">Suspend</button>`;
        const toggleLabel = u.status === 'active' ? 'Deactivate' : 'Activate';
        const toggleClass = u.status === 'active' ? 'danger' : 'success';
        return `<tr>
          <td class="col-name">${u.name}</td>
          <td class="col-muted">${u.email}</td>
          <td>${roleBadge(u.role)}</td>
          <td>${statusBadge(u)}</td>
          <td class="col-mono">${u.lastLogin}</td>
          <td><span class="${expiredClass}">${expiredIcon}${u.passwordExpiry}</span></td>
          <td style="white-space:nowrap;">
            <button class="action-btn" onclick="openEditModal(${u.id})">Edit</button>
            <button class="action-btn ${toggleClass}" onclick="toggleStatus(${u.id})">${toggleLabel}</button>
            ${suspBtn}
            <button class="action-btn" onclick="openEmailModal(${u.id})">Email</button>
          </td>
        </tr>`;
      }).join('');
    }

    //Render expired passwords
    function renderExpired() {
      const expired = users.filter(u => isExpired(u.passwordExpiry));
      document.getElementById('expired-sub').textContent =
        expired.length + ' user' + (expired.length !== 1 ? 's require' : ' requires') + ' a password reset as of ' + TODAY + '.';

      const emptyEl = document.getElementById('expired-empty');
      const tableEl = document.getElementById('expired-table');

      if (expired.length === 0) {
        emptyEl.style.display = 'block';
        tableEl.style.display = 'none';
        return;
      }
      emptyEl.style.display = 'none';
      tableEl.style.display = 'table';

      document.getElementById('expired-tbody').innerHTML = expired.map((u, i) => {
        const days = daysBetween(u.passwordExpiry, TODAY);
        return `<tr>
          <td class="col-name">${u.name}</td>
          <td class="col-muted">${u.email}</td>
          <td>${roleBadge(u.role)}</td>
          <td class="text-red font-bold font-mono">${u.passwordExpiry}</td>
          <td><span class="badge badge-overdue">${days}d overdue</span></td>
          <td><button class="action-btn" onclick="openEmailModal(${u.id})">Send Reset Email</button></td>
        </tr>`;
      }).join('');
    }

    //Modal helpers
    function openModal(id)  { document.getElementById(id).classList.add('open'); }
    function closeModal(id) { document.getElementById(id).classList.remove('open'); }

    //Create user
    function createUser() {
      const name  = document.getElementById('new-name').value.trim();
      const email = document.getElementById('new-email').value.trim();
      const role  = document.getElementById('new-role').value;
      if (!name || !email) { showToast('Name and email are required.', 'error'); return; }
      users.push({ id: Date.now(), name, email, role, status:'active', lastLogin:'—', passwordExpiry:'2026-09-01', suspended:false, suspendStart:null, suspendEnd:null });
      document.getElementById('new-name').value  = '';
      document.getElementById('new-email').value = '';
      closeModal('modal-create');
      refresh();
      showToast('User created successfully.');
    }

    //Edit user
    function openEditModal(id) {
      const u = users.find(x => x.id === id);
      document.getElementById('edit-id').value    = u.id;
      document.getElementById('edit-name').value  = u.name;
      document.getElementById('edit-email').value = u.email;
      document.getElementById('edit-role').value  = u.role;
      openModal('modal-edit');
    }

    function saveEdit() {
      const id    = parseInt(document.getElementById('edit-id').value);
      const name  = document.getElementById('edit-name').value.trim();
      const email = document.getElementById('edit-email').value.trim();
      const role  = document.getElementById('edit-role').value;
      if (!name || !email) { showToast('Name and email are required.', 'error'); return; }
      users = users.map(u => u.id === id ? { ...u, name, email, role } : u);
      closeModal('modal-edit');
      refresh();
      showToast('User updated.');
    }

    //Toggle status
    function toggleStatus(id) {
      users = users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u);
      refresh();
      showToast('Status updated.');
    }

    //Suspend
    function openSuspendModal(id) {
      const u = users.find(x => x.id === id);
      document.getElementById('suspend-id').value    = id;
      document.getElementById('suspend-title').textContent = 'Suspend Account — ' + u.name;
      document.getElementById('suspend-start').value = '';
      document.getElementById('suspend-end').value   = '';
      openModal('modal-suspend');
    }

    function applySuspension() {
      const id    = parseInt(document.getElementById('suspend-id').value);
      const start = document.getElementById('suspend-start').value;
      const end   = document.getElementById('suspend-end').value;
      if (!start || !end) { showToast('Please select both dates.', 'error'); return; }
      const u = users.find(x => x.id === id);
      users = users.map(x => x.id === id ? { ...x, suspended:true, suspendStart:start, suspendEnd:end } : x);
      closeModal('modal-suspend');
      refresh();
      showToast(u.name + ' suspended until ' + end + '.', 'warn');
    }

    function unsuspendUser(id) {
      users = users.map(u => u.id === id ? { ...u, suspended:false, suspendStart:null, suspendEnd:null } : u);
      refresh();
      showToast('Suspension lifted.');
    }

    //Email
    function openEmailModal(id) {
      const u = users.find(x => x.id === id);
      document.getElementById('email-target-id').value       = id;
      document.getElementById('email-title').textContent      = 'Send Email — ' + u.name;
      document.getElementById('email-to').textContent         = u.email;
      document.getElementById('email-subject').value          = '';
      document.getElementById('email-body').value             = '';
      openModal('modal-email');
    }

    function sendEmail() {
      const id = parseInt(document.getElementById('email-target-id').value);
      const u  = users.find(x => x.id === id);
      closeModal('modal-email');
      showToast('Email sent to ' + u.name + '.');
    }

    //Toast
    let toastTimer = null;
    function showToast(msg, type = 'success') {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.className   = 'toast show ' + type;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
    }

    //Refresh all
    function refresh() {
      renderStats();
      renderTable();
      if (currentView === 'report')  renderReport();
      if (currentView === 'expired') renderExpired();
    }

    //Close modal
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });

    refresh();