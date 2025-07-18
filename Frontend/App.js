// Initialize Toast and SweetAlert
// Add this at the beginning of your script (or in a separate config file)
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});












// DOM Elements
const sidebar = document.getElementById('sidebar');
const hamburgerMenu = document.getElementById('hamburger-menu');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const body = document.body;

// Function to Toggle Sidebar and Overlay
function toggleSidebar(open) {
    if (open) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        body.classList.add('no-scroll');
    } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }
}

// Event Listeners
hamburgerMenu.addEventListener('click', () => toggleSidebar(true));
closeSidebar.addEventListener('click', () => toggleSidebar(false));
overlay.addEventListener('click', () => toggleSidebar(false));


// Sidebar Navigation Functions


// Function to show the Portfolio section
function showPortfolio() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
      section.style.display = 'none'; // Hide all sections
  });
  document.getElementById('portfolio').style.display = 'block'; // Show Portfolio
}

// Function to show the Market section
function showMarket() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
      section.style.display = 'none'; // Hide all sections
  });
  document.getElementById('market-data').style.display = 'block'; // Show Market Data
}

// Function to show the Trade section
function showTrade() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
      section.style.display = 'none'; // Hide all sections
  });
  document.getElementById('trade').style.display = 'block'; // Show Trade
}

// Function to show the Transactions section
function showTransactions() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
      section.style.display = 'none'; // Hide all sections
  });
  document.getElementById('transactions').style.display = 'block'; // Show Transactions
}

//function to show deposit method
function showDeposit() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('deposit').style.display = 'block';
}

function showDepositBtn() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('deposit').style.display = 'block';
}

//function to show withdrawal

function showWithdrawal() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('withdrawal').style.display = 'block';
}

function showWithdrawalBtn() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('withdrawal').style.display = 'block';
}


function showSettings() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
      section.style.display = 'none'; // Hide all sections
  });
  document.getElementById('settings').style.display = 'block'; // Show Settings
}

function showCalculator() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('calculator').style.display = 'block';
}

// Attach the functions to the sidebar menu items
document.getElementById('portfolio-menu').addEventListener('click', showPortfolio);
document.getElementById('market-menu').addEventListener('click', showMarket);
document.getElementById('trading-menu').addEventListener('click', showTrade);
document.getElementById('transaction-menu').addEventListener('click', showTransactions);
document.getElementById('settings-menu').addEventListener('click', showSettings);
document.getElementById('settings-menu').addEventListener('click', showSettings);
document.getElementById('deposit-menu').addEventListener('click', showDeposit);
document.getElementById('withdrawal-menu').addEventListener('click', showWithdrawal);
document.getElementById('calculator-menu').addEventListener("click", showCalculator);
document.getElementById('showwithdrawal-btn').addEventListener('click', showWithdrawalBtn);
document.getElementById('showDeposit-btn').addEventListener('click', showDepositBtn);

// Initialize the default section
showPortfolio();


// Fetch Market Data Functionality
async function fetchMarketData() {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=7&page=1&sparkline=false';

  try {
      const response = await fetch(url);
      const data = await response.json();

      const marketList = document.getElementById('market-list');
      marketList.innerHTML = ''; // Clear any existing data

      data.forEach(coin => {
          const marketItem = document.createElement('div');
          marketItem.classList.add('market-item');
          marketItem.innerHTML = `
              <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
              <p>Price: $${coin.current_price}</p>
              <button onclick="openTradeModal('${coin.id}', 'buy')">Buy</button>
              <button onclick="openTradeModal('${coin.id}', 'sell')">Sell</button>
          `;
          marketList.appendChild(marketItem);
      });
  } catch (error) {
      console.error("Error fetching market data:", error);
  }
}

fetchMarketData();


//code for custom drop down with icons


document.getElementById('deposit-method').addEventListener('change', function () {
  const method = this.value;
  // Hide all sections
  document.querySelectorAll('#deposit-method-sections .deposit-method-section').forEach(section => {
      section.style.display = 'none';
  });

  // Show the selected section
  if (method) {
      const section = document.getElementById(`${method}-section`);
      if (section) section.style.display = 'block';
  }
});

function copyToClipboard(elementId) {
  const copyText = document.getElementById(elementId);
  navigator.clipboard.writeText(copyText.value).then(() => {
      alert('Copied to clipboard!');
  });
}

// Js code for withdrawal toggle functionality
document.querySelectorAll('.withdrawal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
      document.querySelectorAll('.withdrawal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const method = tab.dataset.method;
      document.querySelectorAll('.withdrawal-method').forEach(methodDiv => {
          methodDiv.style.display = methodDiv.id === `${method}-method` ? 'block' : 'none';
      });
  });
});


function copyToClipboard(elementId) {
  const input = document.getElementById(elementId);
  input.select();
  document.execCommand("copy");
  alert("Copied to clipboard: " + input.value);
}

// Redirect to Support Email Function
function redirectToSupportEmail() {
  const supportEmail = "support@example.com";
  const subject = "Request for Credit/Debit Card Deposit Instructions";
  const body = `Hello,\n\nI would like to deposit funds using my credit or debit card. Please provide me with the necessary instructions to complete the transaction.\n\nThank you!`;

  // Construct the mailto link
  const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Redirect to the mailto link
  window.location.href = mailtoLink;
}


// Redirect to Email Support Function this is for the email 
function redirectToEmailDepositSupport() {
  const supportEmail = "support@example.com";
  const subject = "Request for Deposit Instructions via Email";
  const body = `Hello,\n\nI would like to deposit funds using the 'Deposit through Email' method. Please provide me with the necessary details to complete the transaction.\n\nThank you!`;

  // Construct the mailto link
  const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Redirect to the mailto link
  window.location.href = mailtoLink;
}


// Fetch deposit details from the backend when the page loads
window.addEventListener('DOMContentLoaded', () => {
  fetch(`${API_BASE_URL}/api/deposit-details`)
      .then(response => response.json())
      .then(data => {
          if (data) {
              window.depositData = data;
          }
      })
      .catch(error => console.error('Error fetching deposit data:', error));
});

document.getElementById('deposit-method').addEventListener('change', function () {
const method = this.value;
const depositData = window.depositData;

// Hide all sections
document.querySelectorAll('#deposit-method-sections .deposit-method-section').forEach(section => {
    section.style.display = 'none';
});

// Show the selected section and populate with data
if (method) {
    const section = document.getElementById(`${method}-section`);
    if (section) {
        section.style.display = 'block';

        // Bank Transfer Details
        if (method === 'bank-transfer') {
            document.getElementById('bank-name').value = depositData.bankDetails.bankName || '';
            document.getElementById('routing-number').value = depositData.bankDetails.routingNumber || '';
            document.getElementById('account-number').value = depositData.bankDetails.accountNumber || '';
            document.getElementById('account-name').value = depositData.bankDetails.accountName || '';
            document.getElementById('swift-code').value = depositData.bankDetails.swiftCode || '';
        }

        // Cryptocurrency Details
        if (method === 'cryptocurrency') {
          const cryptoType = document.getElementById('crypto-type').value;
          const cryptoDetails = depositData.cryptoDetails.find(crypto => crypto.type === cryptoType);
      
          if (cryptoDetails) {
              document.getElementById('crypto-wallet').value = cryptoDetails.walletAddress;
              document.getElementById('crypto-network').value = cryptoDetails.network;
          } else {
              document.getElementById('crypto-wallet').value = 'Select a cryptocurrency to see the wallet address';
              document.getElementById('crypto-network').value = 'Select a cryptocurrency to see the network';
          }
      }
      

        // Digital Wallet Details
        if (method === 'digital-wallet') {
          const walletType = document.getElementById('wallet-type').value;
          const walletDetails = depositData.digitalWalletDetails.find(wallet => wallet.type === walletType);
      
          if (walletDetails) {
              document.getElementById('wallet-info').value = walletDetails.details;
          } else {
              document.getElementById('wallet-info').value = 'Select a wallet to see the details';
          }
      }
      
    }
}
});


// Global authentication check that runs immediately
(function checkAuthOnLoad() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        immediateRedirect();
        return;
    }
    
    // Verify token structure (minimal check)
    if (!isValidToken(authToken)) {
        immediateRedirect();
        return;
    }
    
    // Check expiration
    if (isTokenExpired(authToken)) {
        immediateRedirect();
        return;
    }
})();

// Utility functions for token validation
function isValidToken(token) {
    try {
        const parts = token.split('.');
        return parts.length === 3; // Basic JWT structure check
    } catch (e) {
        return false;
    }
}

function isTokenExpired(token) {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.exp * 1000 < Date.now();
    } catch (e) {
        return true; // If we can't decode, treat as expired
    }
}

function immediateRedirect() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html'; // Redirect to login page
}

// Enhanced checkAuthToken function
function checkAuthToken() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken || !isValidToken(authToken)) {
        immediateRedirect();
        return false;
    }
    return true;
}

// Optimized handleUnauthorized function
function handleUnauthorized() {
    immediateRedirect();
}

// Rest of your functions remain the same but with immediate redirects
async function fetchUserInfo() {
    if (!checkAuthToken()) return;

    try {
        const response = await fetch(`${API_BASE_URL}/user-info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  
            }
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        if (!response.ok) throw new Error('Failed to fetch user info');

        const data = await response.json();
        document.getElementById('username').innerText = data.username;
        document.getElementById('UID').innerText = data.uid;
        document.getElementById('status').innerText = data.status;
        document.getElementById('last-login').innerText = data.lastLogin || 'N/A';

    } catch (error) {
        console.error('Error fetching user info:', error);
        immediateRedirect();
    }
}

async function fetchPortfolioData() {
    if (!checkAuthToken()) return;

    try {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        if (!response.ok) throw new Error('Failed to fetch portfolio data');

        const data = await response.json();
        updatePortfolioUI(data);  

    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        immediateRedirect();
    }
}

// Update UI function remains the same
function updatePortfolioUI(data) {
    const totalBalanceEl = document.getElementById('total-balance');
    if (totalBalanceEl) {
        totalBalanceEl.textContent = `$${data.totalBalance.toFixed(2)}`;
    }

    const holdingsContainer = document.querySelector(".holdings");
    if (holdingsContainer) {
        holdingsContainer.innerHTML = data.holdings?.length > 0 
            ? data.holdings.map(holding => `
                <div class="holding">
                    <h4>${holding.name} (${holding.symbol})</h4>
                    <p>Amount: ${holding.amount}</p>
                    <p>Value: $${holding.value.toFixed(2)}</p>
                </div>
            `).join('')
            : `<p>No holdings available.</p>`;
    }
}

// Token expiration check with immediate action
function checkTokenExpiration() {
    const token = localStorage.getItem('authToken');
    if (token && isTokenExpired(token)) {
        immediateRedirect();
    }
}

// Run checks every 30 seconds instead of 60
const tokenCheckInterval = setInterval(checkTokenExpiration, 30000);

// Clean up when leaving the page
window.addEventListener('beforeunload', () => {
    clearInterval(tokenCheckInterval);
});

// Onload - only proceed if we have a valid token
window.onload = function() {
    if (checkAuthToken()) {
        fetchUserInfo();
        fetchPortfolioData();
        checkTokenExpiration();
    }
};

//ROI calculator

document.getElementById('roi-calculator-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const investmentAmount = parseFloat(document.getElementById('investment-amount').value);
    const rateOfReturn = parseFloat(document.getElementById('rate-of-return').value) / 100;
    const investmentDuration = parseInt(document.getElementById('investment-duration').value, 10);

    if (isNaN(investmentAmount) || isNaN(rateOfReturn) || isNaN(investmentDuration)) {
        alert('Please fill out all fields with valid numbers.');
        return;
    }

    // Calculate ROI
    const totalReturn = investmentAmount * Math.pow(1 + rateOfReturn, investmentDuration);
    const roi = totalReturn - investmentAmount;

    // Display the result
    const resultDiv = document.getElementById('roi-result');
    document.getElementById('roi-output').innerText = `After ${investmentDuration} years, your total return will be $${totalReturn.toFixed(2)}, which is an ROI of $${roi.toFixed(2)}.`;
    resultDiv.style.display = 'block';
});


//Withdrawal function integration

document.addEventListener("DOMContentLoaded", () => {
    // Existing DOM elements
    const withdrawButtons = document.querySelectorAll(".withdrawal-submit");
    const modal = document.getElementById("transaction-summary-modal");
    const cancelBtn = document.getElementById("cancel-transaction");
    const confirmBtn = document.getElementById("confirm-transaction");
    const summaryAmount = document.getElementById("summary-amount");
    const summaryMethod = document.getElementById("summary-method");
    const summaryInfo = document.getElementById("summary-info");
    const cryptoForm = document.querySelector("#crypto-method form");
    const bankForm = document.querySelector("#bank-method form");
    const verificationSection = document.querySelector('.custom-card');
    const processingModal = document.getElementById("withdrawal-processing-modal");

    // Store current withdrawal data
    let currentWithdrawal = {
        method: null,
        amount: 0,
        details: {}
    };

    // Withdrawal button handler
    withdrawButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            
            const isCrypto = button.closest(".withdrawal-method").id.includes("crypto");
            currentWithdrawal.method = isCrypto ? "crypto" : "bank";
            
            if (isCrypto) {
                currentWithdrawal.amount = parseFloat(cryptoForm.querySelector("#crypto-amount").value);
                currentWithdrawal.details = {
                    wallet: cryptoForm.querySelector("#crypto-wallet").value,
                    type: cryptoForm.querySelector("#crypto-type").value
                };
                
                summaryAmount.textContent = `$${currentWithdrawal.amount.toFixed(2)}`;
                summaryMethod.textContent = "Crypto Withdrawal";
                summaryInfo.textContent = `Wallet: ${currentWithdrawal.details.wallet}, Type: ${currentWithdrawal.details.type}`;
            } else {
                currentWithdrawal.amount = parseFloat(bankForm.querySelector("#bank-amount").value);
                currentWithdrawal.details = {
                    bankName: bankForm.querySelector("#bank-name").value,
                    accountNumber: bankForm.querySelector("#account-number").value,
                    routingNumber: bankForm.querySelector("#routing-number").value
                };
                
                summaryAmount.textContent = `$${currentWithdrawal.amount.toFixed(2)}`;
                summaryMethod.textContent = "Bank Withdrawal";
                summaryInfo.textContent = `Bank: ${currentWithdrawal.details.bankName}, Account: ${currentWithdrawal.details.accountNumber}`;
            }
            
            modal.classList.remove("hidden");
        });
    });

    // Confirm transaction handler
    confirmBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        verificationSection.style.display = 'block';
    });

    // PIN Verification Logic
    const pinInput = document.getElementById('custom-pin');
    const keyboardKeys = document.querySelectorAll('.keyboard-key');
    
    keyboardKeys.forEach((key) => {
        key.addEventListener('click', function() {
            const keyValue = this.getAttribute('data-key');
            
            if (keyValue === 'clear') {
                pinInput.value = '';
            } else if (keyValue === 'submit') {
                if (pinInput.value.length === 4 || pinInput.value.length === 6) {
                    processWithdrawal(pinInput.value);
                } else {
                    Swal.fire('Error', 'PIN must be 4 or 6 digits', 'error');
                }
            } else if (pinInput.value.length < 6) {
                pinInput.value += keyValue;
            }
        });
    });

    // Process Withdrawal Function
    async function processWithdrawal(pin) {
        processingModal.classList.remove("hidden");
        verificationSection.style.display = 'none';
        
        try {
            // Sanitize the PIN input
            const cleanPin = pin.toString().trim();
            
            // Validate PIN length again before sending
            if (cleanPin.length !== 4 && cleanPin.length !== 6) {
                throw new Error('PIN must be exactly 4 or 6 digits');
            }

            const response = await fetch(`${API_BASE_URL}/process-withdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    pin: cleanPin,
                    ...currentWithdrawal
                })
            });

            // Add better error handling for network issues
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || 
                    `Server responded with status ${response.status}`
                );
            }

            const result = await response.json();
            
            await Swal.fire({
                icon: 'success',
                title: 'Withdrawal Successful!',
                html: `<p>$${currentWithdrawal.amount.toFixed(2)} has been processed.</p>`,
                confirmButtonText: 'Done'
            });
            
            resetForms();
            updateUserBalance(result.newBalance);
            updateHoldings(result.updatedHoldings);
        } catch (error) {
            console.error('Withdrawal error:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Withdrawal Failed',
                text: error.message,
                confirmButtonText: 'OK'
            });
        } finally {
            processingModal.classList.add("hidden");
            pinInput.value = '';
            currentWithdrawal = { method: null, amount: 0, details: {} };
        }
    }

    // Helper functions
    function resetForms() {
        cryptoForm.reset();
        bankForm.reset();
    }
    
    function updateUserBalance(newBalance) {
        const balanceElement = document.getElementById('user-balance');
        if (balanceElement) {
            balanceElement.textContent = newBalance.toFixed(2);
        }
    }
    
    function updateHoldings(holdings) {
        console.log('Holdings updated:', holdings);
    }
});

// Add this to your existing JavaScript
document.addEventListener("DOMContentLoaded", () => {
    const transactionsSection = document.getElementById('transactions');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                const displayStyle = transactionsSection.style.display;
                if (displayStyle === 'block' || displayStyle === '') {
                    loadTransactions();
                }
            }
        });
    });
    
    observer.observe(transactionsSection, { attributes: true });
    
    // Filter event listeners
    document.getElementById('transaction-type-filter').addEventListener('change', loadTransactions);
    document.getElementById('transaction-time-filter').addEventListener('change', loadTransactions);
});

async function loadTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    const typeFilter = document.getElementById('transaction-type-filter').value;
    const timeFilter = document.getElementById('transaction-time-filter').value;
    
    // Show loading state
    transactionsList.innerHTML = `
        <div class="loading-transactions">
            <div class="spinner"></div>
            <p>Loading transactions...</p>
        </div>
    `;
    
    try {
        // Build query params
        const params = new URLSearchParams();
        if (typeFilter !== 'all') params.append('type', typeFilter);
        if (timeFilter !== 'all') params.append('time', timeFilter);
        
        const response = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load transactions');
        
        const transactions = await response.json();
        
        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="no-transactions">
                    <p>No transactions found</p>
                </div>
            `;
            return;
        }
        
        // Render transactions
        transactionsList.innerHTML = transactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-details">
                    <div class="transaction-type ${transaction.type}">
                        ${transaction.type === 'withdrawal' ? '↓ Withdrawal' : '↑ Deposit'}
                        <span class="transaction-status status-${transaction.status}">
                            ${transaction.status}
                        </span>
                    </div>
                    <div class="transaction-method">
                        ${transaction.method ? formatMethod(transaction.method) : ''}
                        ${transaction.details?.type ? `(${transaction.details.type})` : ''}
                    </div>
                    <div class="transaction-date">
                        ${new Date(transaction.createdAt).toLocaleString()}
                    </div>
                </div>
                <div class="transaction-amount">
                    ${transaction.type === 'withdrawal' ? '-' : '+'}$${transaction.amount.toFixed(2)}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading transactions:', error);
        transactionsList.innerHTML = `
            <div class="no-transactions">
                <p>Error loading transactions. Please try again.</p>
            </div>
        `;
    }
}

function formatMethod(method) {
    const methodMap = {
        'crypto': 'Crypto',
        'bank': 'Bank Transfer',
        'digital-wallet': 'Digital Wallet'
    };
    return methodMap[method] || method;
}