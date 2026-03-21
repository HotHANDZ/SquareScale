//Manager and regular user basically have the same perms rn for sprint 2, so this JS is a direct copy of regular-user-home.js for now.
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-bar a');
    const mainContent = document.querySelector('.home-main');

    //Storing the dashboard screen
    const dashboardContent = mainContent.innerHTML;

    //Chart of Accounts - I think we shoulda just used React or some other framework for SPA ngl
    const chartContent = `
        <h1 class="home-title">Chart of Accounts</h1>
        <table class="coa-table">
            <thead>
                <tr>
                    <th>Account Number</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Created By</th>
                    <th>Date Created</th>
                    <th>Comments</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Test data, populate later with JS -->
                <tr>
                    <td>001</td>
                    <td>Cash</td>
                    <td>Asset</td>
                    <td>$6,542.00</td>
                    <td>admin1</td>
                    <td>2026-01-01</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>010</td>
                    <td>Cash</td>
                    <td>Asset</td>
                    <td>$501.00</td>
                    <td>admin1</td>
                    <td>2026-01-05</td>
                    <td>Testing idk he bought a console</td>
                    <td></td>
                </tr>
                <tr>
                    <td>022</td>
                    <td>Cash</td>
                    <td>Asset</td>
                    <td>$2,521.00</td>
                    <td>admin1</td>
                    <td>2026-05-015</td>
                    <td>Ngl i forgot how accounting works</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    `;

    //Highlights current nav bar link
    function setActiveLink(linkText) {
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.textContent.trim() === linkText) {
                link.parentElement.classList.add('active');
            }
        });
    }

    //Event listeners for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const text = link.textContent.trim();

            //Restores back to login button funcitonality
            if (text === 'Dashboard') {
                mainContent.innerHTML = dashboardContent;
                setActiveLink('Dashboard');
                const backBtn = document.getElementById("backToLogin");
                if (backBtn) {
                    backBtn.addEventListener("click", function () {
                        sessionStorage.removeItem("user");
                        window.location.href = "index.html";
                    });
                }
            } else if (text === 'Chart of Accounts') {
                mainContent.innerHTML = chartContent;
                setActiveLink('Chart of Accounts');
            }
        });
    });

    
    setActiveLink('Dashboard');
});