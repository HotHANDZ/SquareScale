document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-bar a');
    const mainContent = document.querySelector('.home-main');

    //Storing the dashboard screen
    const dashboardContent = mainContent.innerHTML;

    //Chart of Accounts - I think we shoulda just used React or some other framework for SPA ngl
    const chartContent = `
        <h1 class="home-title">Chart of Accounts</h1>
        <div>
            <label for="coa-search-input">Search:</label>
            <input id="coa-search-input" type="text" placeholder="Type account number or name" />
        </div>
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
                    <td><a href="#">001</a></td>
                    <td>Cash</td>
                    <td>Asset</td>
                    <td>$6,542.00</td>
                    <td>admin1</td>
                    <td>2026-01-01</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td><a href="#">010</a></td>
                    <td>Cash</td>
                    <td>Asset</td>
                    <td>$501.00</td>
                    <td>admin1</td>
                    <td>2026-01-05</td>
                    <td>Testing idk he bought a console</td>
                    <td></td>
                </tr>
                <tr>
                    <td><a href="#">022</a></td>
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

    const ledgerContent = `
        <!-- Placeholder, populate later with JS -->
        <h1 class="home-title">001 - Cash</h1>
        <table class="coa-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>ID No.</th>
                    <th>Description</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2020-02-16</td>
                    <td>1</td>
                    <td>Receieved cash idk</td>
                    <td>$6,550.00</td>
                    <td></td>
                    <td>$6,550.00</td>
                </tr>
                <tr>
                    <td>2020-02-18</td>
                    <td>2</td>
                    <td>Spent some cash</td>
                    <td></td>
                    <td>$8.00</td>
                    <td>$6,542.00</td>
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

            if (text === 'Dashboard') {
                mainContent.innerHTML = dashboardContent;
                setActiveLink('Dashboard');

                //Restores back to login button funcitonality
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

                //Event listener for ledger links. Currently it only works for the hard coddded 001 account. Fix later with more JS and API calls.
                const ledgerLinks = document.querySelectorAll('.coa-table a');

                ledgerLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const text = link.textContent.trim();

                        if (text === '001') {
                            mainContent.innerHTML = ledgerContent;
                            setActiveLink('Chart of Accounts');
                        }

                    });
                });
            }
        });
    });


    setActiveLink('Dashboard');
});