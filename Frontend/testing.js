document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.content-section');
    const sidebarLinks = document.querySelectorAll('.sidebar li');
  
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', () => {
        sidebarLinks.forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
  
        sections.forEach((section) => section.classList.remove('active'));
        const sectionId = link.dataset.section;
        document.getElementById(sectionId).classList.add('active');
      });
    });
  });
  

  // Admin Frontend JS (admin.js)

// Function to switch between sections
function switchSection(activeSection) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(activeSection).classList.remove('hidden');
}

// Handle sidebar clicks to switch content sections
const sidebarItems = document.querySelectorAll('.sidebar li');
sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
        const section = item.getAttribute('data-section');
        switchSection(section);
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

 
// Integrating backend into frontend for deposit management

document.addEventListener('DOMContentLoaded', () => {
    const baseURL = "http://localhost:3000"; // Backend URL

    // Elements for Bank Transfer
    const bankTransferForm = document.querySelector('#bank-transfer form');
    const saveBankTransferBtn = document.querySelector('#save-bank-transfer');

    // Elements for Cryptocurrency
    const cryptoForm = document.querySelector('#crypto form');
    const cryptoDropdown = cryptoForm['crypto-dropdown'];
    const saveCryptoBtn = document.querySelector('#save-crypto');

    // Elements for Digital Wallets
    const digitalWalletsForm = document.querySelector('#digital-wallets form');
    const walletTypeDropdown = digitalWalletsForm['wallet-type'];
    const saveDigitalWalletsBtn = document.querySelector('#save-digital-wallets');

    // Fetch and populate Bank Transfer data
    async function fetchBankTransferData() {
        try {
            const response = await fetch(`${baseURL}/admin/deposit/bank-transfer`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            if (response.ok) {
                const data = await response.json();
                bankTransferForm['bank-name'].value = data.bankDetails?.bankName || '';
                bankTransferForm['routing-number'].value = data.bankDetails?.routingNumber || '';
                bankTransferForm['account-number'].value = data.bankDetails?.accountNumber || '';
                bankTransferForm['account-name'].value = data.bankDetails?.accountName || '';
                bankTransferForm['swift-code'].value = data.bankDetails?.swiftCode || '';
            }
        } catch (error) {
            console.error('Error fetching bank transfer data:', error);
        }
    }

    // Save Bank Transfer data
    saveBankTransferBtn.addEventListener('click', async () => {
        const bankDetails = {
            bankName: bankTransferForm['bank-name'].value,
            routingNumber: bankTransferForm['routing-number'].value,
            accountNumber: bankTransferForm['account-number'].value,
            accountName: bankTransferForm['account-name'].value,
            swiftCode: bankTransferForm['swift-code'].value,
        };

        try {
            const response = await fetch(`${baseURL}/admin/deposit/bank-transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(bankDetails),
            });
            const data = await response.json();
            alert('Bank Transfer details saved successfully!');
        } catch (error) {
            console.error('Error saving bank transfer data:', error);
        }
    });

    // Fetch and populate Cryptocurrency data
    async function fetchCryptoData(cryptocurrency) {
        try {
            const response = await fetch(`${baseURL}/admin/deposit/crypto?cryptocurrency=${cryptocurrency}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            if (response.ok) {
                const data = await response.json();
                cryptoForm['wallet-address'].value = data.walletAddress || '';
                cryptoForm['network'].value = data.network || '';
            } else {
                // Reset fields if no data found
                cryptoForm['wallet-address'].value = '';
                cryptoForm['network'].value = '';
            }
        } catch (error) {
            console.error('Error fetching cryptocurrency data:', error);
        }
    }

    // Save Cryptocurrency data
    saveCryptoBtn.addEventListener('click', async () => {
        const cryptoDetails = {
            cryptocurrency: cryptoForm['crypto-dropdown'].value,
            walletAddress: cryptoForm['wallet-address'].value,
            network: cryptoForm['network'].value,
        };

        try {
            const response = await fetch(`${baseURL}/admin/deposit/crypto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(cryptoDetails),
            });
            const data = await response.json();
            alert('Cryptocurrency details saved successfully!');
        } catch (error) {
            console.error('Error saving cryptocurrency data:', error);
        }
    });

    // Fetch and populate Digital Wallets data
    async function fetchDigitalWalletsData(walletType) {
        try {
            const response = await fetch(`${baseURL}/admin/deposit/digital-wallets?walletType=${walletType}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            if (response.ok) {
                const data = await response.json();
                digitalWalletsForm['wallet-username'].value = data.walletUsername || '';
                digitalWalletsForm['wallet-info'].value = data.walletInfo || '';
            } else {
                // Reset fields if no data found
                digitalWalletsForm['wallet-username'].value = '';
                digitalWalletsForm['wallet-info'].value = '';
            }
        } catch (error) {
            console.error('Error fetching digital wallet data:', error);
        }
    }

    // Save Digital Wallets data
    saveDigitalWalletsBtn.addEventListener('click', async () => {
        const digitalWalletDetails = {
            walletType: digitalWalletsForm['wallet-type'].value,
            walletUsername: digitalWalletsForm['wallet-username'].value,
            walletInfo: digitalWalletsForm['wallet-info'].value,
        };

        try {
            const response = await fetch(`${baseURL}/admin/deposit/digital-wallets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(digitalWalletDetails),
            });
            const data = await response.json();
            alert('Digital Wallet details saved successfully!');
        } catch (error) {
            console.error('Error saving digital wallet data:', error);
        }
    });

    // Event Listeners for Cryptocurrency and Digital Wallets Dropdowns
    cryptoDropdown.addEventListener('change', () => {
        const selectedCrypto = cryptoDropdown.value;
        fetchCryptoData(selectedCrypto);
    });

    walletTypeDropdown.addEventListener('change', () => {
        const selectedWalletType = walletTypeDropdown.value;
        fetchDigitalWalletsData(selectedWalletType);
    });

    // Initialize by fetching Bank Transfer data and resetting Cryptocurrency and Digital Wallets data
    fetchBankTransferData();
    fetchCryptoData(cryptoDropdown.value);
    fetchDigitalWalletsData(walletTypeDropdown.value);
});


// Fetch Holdings and Display
document.getElementById('search-btn').addEventListener('click', async () => {
    const uid = document.getElementById('uid-search').value;
    console.log("Fetching holdings for UID:", uid);

    try {
        const response = await fetch(`https://sterling-edge.onrender.com/admin/user-holdings/${uid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        console.log('Data from backend:', data);

        const holdingsList = document.getElementById('holdings-list');
        holdingsList.innerHTML = ""; // Clear previous content

        if (data.holdings && data.holdings.length === 0) {
            holdingsList.innerHTML = "<p>No holdings found for this user.</p>";
        } else {
            data.holdings.forEach(holding => {
                const holdingElement = document.createElement('div');
                holdingElement.textContent = `${holding.name} (${holding.symbol}): ${holding.amount} units worth $${holding.value}`;
                holdingsList.appendChild(holdingElement);
            });
        }

        // Update total balance display as sum of amounts
        const totalAmount = data.holdings.reduce((total, holding) => total + holding.amount, 0);
        document.getElementById('total-balance').value = totalAmount;

    } catch (error) {
        console.error("Error fetching holdings:", error);
    }
});

// Add New Holding and Update Total Amount
document.getElementById('add-holding-btn').addEventListener('click', async () => {
    const uid = document.getElementById('uid-search').value;
    const name = document.getElementById('holding-name').value;
    const symbol = document.getElementById('holding-symbol').value;
    const amount = parseFloat(document.getElementById('holding-amount').value);
    const value = parseFloat(document.getElementById('holding-value').value);

    try {
        // Add new holding
        const response = await fetch('https://sterling-edge.onrender.com/admin/add-holding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ uid, name, symbol, amount, value })
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        console.log("Holding added successfully");

        // Fetch updated holdings to recalculate total amount
        const updatedHoldingsResponse = await fetch(`https://sterling-edge.onrender.com/admin/user-holdings/${uid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        const updatedData = await updatedHoldingsResponse.json();

        // Calculate the new total amount
        const totalAmount = updatedData.holdings.reduce((total, holding) => total + holding.amount, 0);

        await fetch(`https://sterling-edge.onrender.com/admin/user-balance/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ totalBalance: totalAmount })
        });

        console.log("Total amount updated:", totalAmount);

        document.getElementById('total-balance').value = totalAmount;

    } catch (error) {
        console.error("Error updating holdings or balance:", error);
    }
});


// Event listener for updating total balance from input
document.getElementById('update-balance-btn').addEventListener('click', async () => {
    const uid = document.getElementById('uid-search').value;
    const totalBalance = parseFloat(document.getElementById('total-balance').value);

    if (!uid || isNaN(totalBalance)) {
        console.error("UID or Total Balance input is invalid");
        return;
    }

    try {
        const response = await fetch(`https://sterling-edge.onrender.com/admin/user-balance/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ totalBalance })
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        console.log("Total balance updated successfully:", totalBalance);

    } catch (error) {
        console.error("Error updating total balance:", error);
    }
});

// email API connection to the frontend

document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
  
    // Initialize Quill editor
    var quill = new Quill('#email-body', {
      theme: 'snow',  // 'snow' is a clean and simple theme
      modules: {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['link'],
          ['blockquote', 'code-block'],
          ['image'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          ['clean']  // The "clear formatting" button
        ]
      }
    });
  
    emailForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Get the form values
      const recipients = document.getElementById('email-recipients').value;
      const subject = document.getElementById('email-subject').value;
      const message = quill.root.innerHTML; // Capture the HTML content from the Quill editor
      const statusEl = document.getElementById('email-status');
  
      try {
        const res = await fetch('https://sterling-edge.onrender.com/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` //  Added token for auth
          },
          body: JSON.stringify({ recipients, subject, message }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          statusEl.textContent = 'Email sent successfully!';
          statusEl.style.color = 'green';
          emailForm.reset();
          quill.root.innerHTML = ''; // Clear the editor after sending
        } else {
          statusEl.textContent = data.error || 'Failed to send email.';
          statusEl.style.color = 'red';
        }
      } catch (err) {
        console.error(err);
        statusEl.textContent = 'Something went wrong!';
        statusEl.style.color = 'red';
      }
    });
});
