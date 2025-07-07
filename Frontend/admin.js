//Token verification and redirection for admin page

// (async () => {
//     const token = localStorage.getItem('adminToken');
//     if (!token) {
//         return window.location.replace('admin-Log.html');
//     }
//     try {
//         const res = await fetch('http://localhost:3000/admin/verify-token', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         if (!res.ok) {
//             localStorage.removeItem('adminToken');
//             window.location.replace('admin-Log.html');
//         }
//     } catch (err) {
//         console.log('Token Verification Failed', err);
//         localStorage.removeItem('adminToken');
//         window.location.replace('admin-Log.html');
//     }
// }) ();


// DOM Elements
const sidebar = document.getElementById('sidebar');
const hamburgerMenu = document.getElementById('hamburger-menu');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const sidebarLinks = document.querySelectorAll('.sidebar ul li');
const contentSections = document.querySelectorAll('.content-section');

// Function to Toggle Sidebar
function toggleSidebar(open) {
  if (open) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
}

// Add Event Listeners for Sidebar
hamburgerMenu.addEventListener('click', () => toggleSidebar(true));
closeSidebar.addEventListener('click', () => toggleSidebar(false));
overlay.addEventListener('click', () => toggleSidebar(false));

// Tab Switch Function
function switchTab(sectionId) {
  // Deactivate all links and hide all sections
  sidebarLinks.forEach(link => link.classList.remove('active'));
  contentSections.forEach(section => section.classList.remove('active', 'hidden'));

  // Activate clicked link and corresponding section
  document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
  document.getElementById(sectionId).classList.add('active');
  toggleSidebar(false); // Close sidebar on mobile
}

// Add Event Listeners to Sidebar Links
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    const sectionId = link.getAttribute('data-section');
    switchTab(sectionId);
  });
});

// Initialize First Tab
switchTab('bank-transfer');

 
// Integrating backend into frontend for deposit management

document.addEventListener('DOMContentLoaded', () => {

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
            const response = await fetch(`${API_BASE_URL}/admin/deposit/bank-transfer`, {
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
            const response = await fetch(`${API_BASE_URL}/admin/deposit/bank-transfer`, {
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
            const response = await fetch(`${API_BASE_URL}/admin/deposit/crypto?cryptocurrency=${cryptocurrency}`, {
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
            const response = await fetch(`${API_BASE_URL}/admin/deposit/crypto`, {
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
            const response = await fetch(`${API_BASE_URL}/admin/deposit/digital-wallets?walletType=${walletType}`, {
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
            const response = await fetch(`${API_BASE_URL}/admin/deposit/digital-wallets`, {
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
        const response = await fetch(`${API_BASE_URL}/admin/user-holdings/${uid}`, {
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
        const response = await fetch(`${API_BASE_URL}/admin/add-holding`, {
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
        const updatedHoldingsResponse = await fetch(`${API_BASE_URL}/admin/user-holdings/${uid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        const updatedData = await updatedHoldingsResponse.json();

        // Calculate the new total amount
        const totalAmount = updatedData.holdings.reduce((total, holding) => total + holding.amount, 0);

        await fetch(`${API_BASE_URL}/admin/user-balance/${uid}`, {
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
        const response = await fetch(`${API_BASE_URL}/admin/user-balance/${uid}`, {
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

//Js for custom inyteraction in pin generation

document.addEventListener("DOMContentLoaded", () => {
    const pinTypeDropdown = document.getElementById("pin-type");
    const expirationDropdown = document.getElementById("expiration-time");
    const customExpirationSection = document.getElementById("custom-expiration");
    const customDurationInput = document.getElementById("custom-duration");
    const customDurationHoursInput = document.getElementById("custom-duration-hours");
    const customDurationDaysInput = document.getElementById("custom-duration-days");
    const generatePinButton = document.getElementById("generate-pin");
    const pinFeedback = document.getElementById("pin-feedback");
    const generatedPinElement = document.getElementById("generated-pin");
    const expirationTimeDisplay = document.getElementById("expiration-time-display");
    const copyPinButton = document.getElementById("copy-pin");

    // Show or hide custom expiration time section
    expirationDropdown.addEventListener("change", () => {
        if (expirationDropdown.value === "custom") {
            customExpirationSection.style.display = "block"; // Show the custom expiration section
        } else {
            customExpirationSection.style.display = "none"; // Hide the custom expiration section
        }
    });

    // Handle PIN generation
    generatePinButton.addEventListener("click", async () => {
        let pinType = parseInt(pinTypeDropdown.value, 10); // Convert PIN length to number
        let expirationTime = expirationDropdown.value; // Expiration time as string

        // If custom expiration time is selected, gather custom values
        if (expirationTime === "custom") {
            const customDuration = parseInt(customDurationInput.value || 0, 10);
            const customDurationHours = parseInt(customDurationHoursInput.value || 0, 10);
            const customDurationDays = parseInt(customDurationDaysInput.value || 0, 10);

            // Convert custom time to minutes
            expirationTime = customDuration + (customDurationHours * 60) + (customDurationDays * 1440);
        } else {
            expirationTime = parseInt(expirationTime, 10); // Convert predefined value to number
        }

        console.log("===== FRONTEND LOGS =====");
        console.log("Selected PIN Length (pinType):", pinType);
        console.log("Selected Expiration Time (minutes):", expirationTime);

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert("You must be logged in to generate a PIN.");
            return;
        }

        try {
            // Log the request payload
            const payload = {
                pinLength: pinType,
                expirationTime: expirationTime
            };
            console.log("Payload sent to backend:", payload);

            // Make the API call to generate and store the PIN
            const response = await fetch(`${API_BASE_URL}/admin/generate-pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`  
                },
                body: JSON.stringify(payload)
            });

            console.log("Backend response status:", response.status);

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const data = await response.json();
            console.log("Response from backend:", data);

            if (data.message === "PIN generated successfully") {
                // Display the generated PIN
                generatedPinElement.textContent = data.pin;

                // Convert expirationAt to local time zone
                const expirationAtUTC = new Date(data.expirationAt); // Convert from UTC
                const expirationAtLocal = expirationAtUTC.toLocaleString(); // Convert to local time
                expirationTimeDisplay.textContent = expirationAtLocal;

                // Show the feedback region
                pinFeedback.classList.remove("hidden");
            } else {
                alert("Error generating PIN: " + data.message);
            }
        } catch (error) {
            console.error("Error during PIN generation:", error);
            alert("There was an error with the request.");
        }
    });

    // Handle the "Copy PIN" button functionality
    copyPinButton.addEventListener("click", () => {
        const pin = generatedPinElement.textContent;
        if (pin) {
            navigator.clipboard.writeText(pin)
                .then(() => {
                    alert("PIN copied to clipboard!");
                })
                .catch(err => {
                    console.error("Error copying PIN:", err);
                    alert("Failed to copy PIN.");
                });
        } else {
            alert("No PIN to copy.");
        }
    });
});

 
document.getElementById('deletePinsBtn').addEventListener('click', async () => {
    if (confirm("Are you sure you want to delete all pins? This action cannot be undone.")) {
        try {
            const token = localStorage.getItem("authToken"); // Assuming you're storing JWT in localStorage
            const response = await fetch(`${API_BASE_URL}/admin/pins`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            document.getElementById('statusMessage').textContent = data.message;
        } catch (error) {
            console.error("Error deleting pins:", error);
            document.getElementById('statusMessage').textContent = "Failed to delete pins.";
        }
    }
});
 

 
// Receipt Generation js
document.addEventListener('DOMContentLoaded', function() {
    // Generate Receipt Button
    document.getElementById('generate-btn').addEventListener('click', function() {
      // Get form values
      const clientName = document.getElementById('client-name').value;
      const amount = parseFloat(document.getElementById('payment-amount').value);
      const description = document.getElementById('payment-description').value;
      const method = document.getElementById('payment-method').value;
      const trackingId = document.getElementById('tracking-id').value;
      
      // Generate receipt HTML
      const receiptHTML = `
        <div class="receipt-header">
          <div class="receipt-logo">Elite Edge Market</div>
          <div class="receipt-title">PAYMENT RECEIPT</div>
          <div class="receipt-meta">
            <span>Receipt #: R${Math.floor(Math.random() * 1000)}</span>
            <span>Date: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        
        <div class="receipt-body">
          <div class="receipt-row">
            <span class="receipt-label">Paid to:</span>
            <span class="receipt-value">${clientName}</span>
          </div>
          
          <div class="receipt-row">
            <span class="receipt-label">Description:</span>
            <span class="receipt-value">${description}</span>
          </div>
          
          <div class="receipt-row">
            <span class="receipt-label">Amount:</span>
            <span class="receipt-value receipt-amount">$${amount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</span>
          </div>
          
          <div class="receipt-row">
            <span class="receipt-label">Method:</span>
            <span class="receipt-value">${method}</span>
          </div>
          
          <div class="tracking-id">
            Tracking ID: <strong>${trackingId || 'N/A'}</strong>
          </div>
        </div>
        
        <div class="receipt-footer">
          <p>Thank you for trading with us.</p>
          <p>Elite Edge Market LLC</p>
          <p>Financial Street, New York, NY</p>
          <p>contact@tradingfirm.com | (555) 123-4567</p>
        </div>
      `;
      
      // Insert into receipt container
      document.getElementById('receipt-printable').innerHTML = receiptHTML;
      
      // Show receipt preview
      document.getElementById('receipt-output').classList.remove('hidden');
    });
  
    // Save as PNG
    document.getElementById('save-png').addEventListener('click', function() {
      html2canvas(document.getElementById('receipt-printable')).then(canvas => {
        const link = document.createElement('a');
        link.download = `elite-edge-payment-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  
    // Save as PDF
    document.getElementById('save-pdf').addEventListener('click', async function() {
        try {
            // Use html2canvas with better rendering options
            const canvas = await html2canvas(document.getElementById('receipt-printable'), {
                scale: 2, // Higher quality
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            
            // Initialize jsPDF
            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a5'
            });
            
            // Calculate dimensions to fit A5
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add image to PDF
            pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Save the PDF
            pdf.save(`payment-receipt-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please check console for details.');
        }
    });
  });