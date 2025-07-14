const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { type } = require('os');
const { permission } = require('process');
const cron = require('node-cron');
 
 
const app = express();


// // Serve static files from the frontend folder for development
// app.use(express.static(path.join(__dirname, '../frontend')));

// // Route to serve home.html for the homepage for development
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });


// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Enable CORS for all routes for Developqent purposes and testing


// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Cors for production

// Allow specific origin
app.use(cors({
  origin: 'https://www.eliteedgemarket.org',  
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//Mongodb conig and connect
const db = process.env.MONGO_URI;

mongoose.connect(db).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


// Middleware to authenticate JWT tokens for users
const authenticateJWT = (req, res, next) => {
    console.log('Authenticating JWT...');
    
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.log('Authorization token missing');
        return res.status(403).json({ message: 'No token provided' });
    }

    console.log('Received Token:', token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        console.log('Decoded Token:', user); // Log decoded JWT payload
        req.user = user;
        next();
    });
};


// User Schema
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    lastLogin: {type: String, default: null},
    status: {type: String, default: "Inactive"}, 
    uid: { type: String, required: true, unique: true },
    totalBalance: { type: Number, default: 0 },  
    holdings: [
        {
            name: { type: String },
            symbol: { type: String },
            amount: { type: Number },
            value: { type: Number }
        }
    ] 
});

const User = mongoose.model('User', UserSchema);

// deposit schema definition and model
const depositSchema = new mongoose.Schema({
  method: { type: String, required: true },
  bankDetails: {
      bankName: String,
      routingNumber: String,
      accountNumber: String,
      accountName: String,
      swiftCode: String,
  },
  cryptoDetails: [
      {
          cryptocurrency: { type: String, required: true },
          walletAddress: String,
          network: String,
      },
  ],
  digitalWalletDetails: [
      {
          walletType: { type: String, required: true },
          walletUsername: String,
          walletInfo: String,
      },
  ],
});

// Initialize the Deposit model
const Deposit = mongoose.model('Deposit', depositSchema);

//PIN GENERATION DATABASE

// PIN Schema definition and model
const pinSchema = new mongoose.Schema({
  pinCode: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
  expirationAt: { type: Date, required: true }, 
  status: { type: String, enum: ['active', 'expired'], default: 'active' } 
});


const Pin = mongoose.model('Pin', pinSchema);

// Fetch Bank Transfer Data
app.get('/admin/deposit/bank-transfer', authenticateJWT, async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ method: 'bank-transfer' });
    res.json(deposit || {});
  } catch (error) {
    console.error('Error fetching bank transfer data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save Bank Transfer Data
app.post('/admin/deposit/bank-transfer', authenticateJWT, async (req, res) => {
  const { bankName, routingNumber, accountNumber, accountName, swiftCode } = req.body;
  try {
    let deposit = await Deposit.findOneAndUpdate(
      { method: 'bank-transfer' },
      { 
        bankDetails: { 
          bankName, 
          routingNumber, 
          accountNumber, 
          accountName, 
          swiftCode 
        },
        $unset: { cryptoDetails: "", digitalWalletDetails: "" }  // Remove any unwanted fields
      },
      { new: true, upsert: true }
    );
    res.json(deposit);
  } catch (error) {
    console.error('Error saving bank transfer data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch Cryptocurrency Data
app.get('/admin/deposit/crypto', authenticateJWT, async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ method: 'crypto' });
    res.json(deposit?.cryptoDetails || []);
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Save Cryptocurrency Data
app.post('/admin/deposit/crypto', authenticateJWT, async (req, res) => {
  const { cryptocurrency, walletAddress, network } = req.body;

  try {
    // Find the deposit document for 'crypto'
    let deposit = await Deposit.findOne({ method: 'crypto' });

    // If the deposit document exists
    if (deposit) {
      // Check if the cryptocurrency already exists in the array
      const existingCrypto = deposit.cryptoDetails.find(
        (crypto) => crypto.cryptocurrency === cryptocurrency
      );

      if (existingCrypto) {
        // If the cryptocurrency exists, update only that entry
        await Deposit.updateOne(
          { method: 'crypto', 'cryptoDetails.cryptocurrency': cryptocurrency },
          {
            $set: {
              'cryptoDetails.$.walletAddress': walletAddress,
              'cryptoDetails.$.network': network,
            },
          }
        );
      } else {
        // If the cryptocurrency doesn't exist, add it to the array
        await Deposit.updateOne(
          { method: 'crypto' },
          {
            $push: {
              cryptoDetails: {
                cryptocurrency,
                walletAddress,
                network,
              },
            },
          }
        );
      }
    } else {
      // If the 'crypto' deposit document doesn't exist, create it
      deposit = new Deposit({
        method: 'crypto',
        cryptoDetails: [{ cryptocurrency, walletAddress, network }],
      });
      await deposit.save();
    }

    // Now, ensure that if there are any unwanted fields, like 'digitalWalletDetails', they are excluded or unset
    await Deposit.updateOne(
      { method: 'crypto' },
      {
        $unset: { digitalWalletDetails: "" }, // Remove 'digitalWalletDetails' if unnecessary
      }
    );

    res.status(200).json({ message: 'Cryptocurrency details saved successfully!' });
  } catch (error) {
    console.error('Error saving cryptocurrency data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch Digital Wallets Data
app.get('/admin/deposit/digital-wallets', authenticateJWT, async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ method: 'digital-wallets' });
    res.json(deposit?.digitalWalletDetails || []);
  } catch (error) {
    console.error('Error fetching digital wallet data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save Digital Wallet Data
app.post('/admin/deposit/digital-wallets', authenticateJWT, async (req, res) => {
  const { walletType, walletUsername, walletInfo } = req.body;

  try {
    // Find the deposit document for 'digital-wallets'
    let deposit = await Deposit.findOne({ method: 'digital-wallets' });

    // If the deposit document exists
    if (deposit) {
      // Check if the walletType already exists in the array
      const existingWallet = deposit.digitalWalletDetails.find(
        (wallet) => wallet.walletType === walletType
      );

      if (existingWallet) {
        // If the walletType exists, update only that entry
        await Deposit.updateOne(
          { method: 'digital-wallets', 'digitalWalletDetails.walletType': walletType },
          {
            $set: {
              'digitalWalletDetails.$.walletUsername': walletUsername,
              'digitalWalletDetails.$.walletInfo': walletInfo,
            },
          }
        );
      } else {
        // If the walletType doesn't exist, add it to the array
        await Deposit.updateOne(
          { method: 'digital-wallets' },
          {
            $push: {
              digitalWalletDetails: {
                walletType,
                walletUsername,
                walletInfo,
              },
            },
          }
        );
      }
    } else {
      // If the 'digital-wallets' deposit document doesn't exist, create it
      deposit = new Deposit({
        method: 'digital-wallets',
        digitalWalletDetails: [{ walletType, walletUsername, walletInfo }],
      });
      await deposit.save();
    }

    // Now, ensure that if there are any unwanted fields, like 'cryptoDetails', they are excluded or unset
    await Deposit.updateOne(
      { method: 'digital-wallets' },
      {
        $unset: { cryptoDetails: "" }, // Remove 'cryptoDetails' if unnecessary
      }
    );

    res.status(200).json({ message: 'Digital wallet details saved successfully!' });
  } catch (error) {
    console.error('Error saving digital wallet data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Sample route to get deposit details from the database
app.get('/api/deposit-details', async (req, res) => {
  try {
      const depositDetails = await Deposit.findOne(); // Fetch the first deposit details document (you may adjust based on your data model)
      
      if (!depositDetails) {
          return res.status(404).send('Deposit details not found');
      }
      
      res.json(depositDetails); // Send back the deposit details in JSON format
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});



  

// User sign up and login routes...

app.post('/signup', async (req, res) => {
    const { fullName, email, username, password, phone } = req.body;

    try {
        const lowerEmail = email.toLowerCase();
        const lowerUsername = username.toLowerCase();

        // Check if the user already exists with the same email or username
        const existingUser = await User.findOne({ 
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a shortened UID
        const uid = uuidv4().slice(0, 8);

        // Create new user with lowercase email and username, and shortened UID
        const user = new User({ 
            fullName, 
            email: lowerEmail, 
            username: lowerUsername, 
            password: hashedPassword, 
            phone,
            uid,  
            balance: 0,  
            holdings: []  
        });
        
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("Received login request:", req.body);

  try {
      // Convert username/email to lowercase for case-insensitive comparison
      const user = await User.findOne({ 
          $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }] 
      });
      
      console.log("User found in database:", user);

      if (!user) {
          console.log("User not found");
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log("Password mismatch");
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update status to 'Active' and set lastLogin to the current date and time
      user.status = 'Active';
      user.lastLogin = new Date().toISOString();  // You can format it as you prefer (e.g., 'YYYY-MM-DD HH:MM:SS')

      // Save the updated user data
      await user.save();

      // Create JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

      res.json({ 
          token, 
          username: user.username,   
          name: user.name || user.username // Optionally include the full name if available
      });
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: 'Server error' });
  }
});


//Backend to get user details

app.get('/user-info', async (req, res) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the user based on the decoded user ID
        const user = await User.findById(decoded.id).select('username uid status lastLogin');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user information
        res.json({
            username: user.username,
            uid: user.uid,
            status: user.status,
            lastLogin: user.lastLogin,
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Fetch Holdings for a User by UID
app.get('/admin/user-holdings/:uid', authenticateJWT, async (req, res) => {
    const { uid } = req.params;  

    try {
        
        const user = await User.findOne({ uid: uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            holdings: user.holdings   
        });

    } catch (error) {
        console.error('Error fetching user holdings:', error);
        res.status(500).json({ message: 'Server error occurred' });
    }
});

//route to add new holding

app.post('/admin/add-holding', authenticateJWT, async (req, res) => {
    const { uid, name, symbol, amount, value } = req.body;
    try {
        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add the new holding
        user.holdings.push({ name, symbol, amount, value });
        
        // Calculate new total balance (sum of all holding VALUES)
        const totalBalance = user.holdings.reduce((sum, holding) => sum + holding.value, 0);
        user.totalBalance = totalBalance;
        
        await user.save();
        res.json({ 
            message: 'Holding added successfully', 
            holdings: user.holdings,
            totalBalance: user.totalBalance
        });
    } catch (error) {
        console.error('Error adding holding:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Update user's total balance
app.put('/admin/user-balance/:uid', authenticateJWT , async (req, res) => {
    const { uid } = req.params;
    const { totalBalance } = req.body;

    try {
        const user = await User.findOneAndUpdate({ uid }, { totalBalance }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Total balance updated successfully", totalBalance });
    } catch (error) {
        console.error("Error updating total balance:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// Backend route to get user portfolio
app.get('/portfolio', authenticateJWT, async (req, res) => {
  try {
      console.log('PORTFOLIO REQUEST - User ID:', req.user.id);
      const user = await User.findById(req.user.id);
      
      if (!user) {
          console.log('USER NOT FOUND FOR ID:', req.user.id);
          return res.status(404).json({ message: 'User not found' });
      }

      console.log('USER FOUND - Balance:', user.totalBalance, 'Holdings:', user.holdings.length);
      
      res.json({
          totalBalance: user.totalBalance || 0, // Ensure never undefined
          holdings: user.holdings            
      });
  } catch (error) {
      console.error('PORTFOLIO ERROR:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
//Database for admin

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['General_admin', 'sub_admin'],
    default: 'sub_admin',
  },

  permissions: {
    canManageUsers: { type: Boolean, default: false },
    canSendEmails: { type: Boolean, default: false },
    canManageHoldings: { type: Boolean, default: false },
    canGeneratePins: { type: Boolean, default: false },
    canSendEmails: { type: Boolean, default: false },
    canAddDigitalWallets: { type: Boolean, default: false },
    canAddBankTransfer: { type: Boolean, default: false },
    canAddCrypto: { type: Boolean, default: false },
    canManageSubadmins: { type: Boolean, default: false },
  },

  status: {
    type: String,
    enum: ['Active', 'revoked', 'disabled'],
    default: 'disabled',
  },

  LastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// middleware to update the updatedAt field on every save
adminSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
})
const Admin = mongoose.model('Admin', adminSchema);


// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, admin) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.admin = admin;
    next();
  });
};

//Token Verification routes

app.get('/admin/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid', admin: req.admin });
}
);

// seeding the database with admin credentials
const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            $or: [
                { email: process.env.ADMIN_EMAIL },
                { username: process.env.ADMIN_USERNAME }
            ]
        });

        if (existingAdmin) {
            console.log('Admin already exists in database');
            return;
        }

        // Only create new admin if one doesn't exist
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const admin = new Admin({
            fullName: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            username: process.env.ADMIN_USERNAME,
            password: hashedPassword,
            role: 'General_admin',
            permissions: {
                canManageUsers: true,
                canSendEmails: true,
                canManageHoldings: true,
                canGeneratePins: true,
                canAddDigitalWallets: true,
                canAddBankTransfer: true,
                canAddCrypto: true,
                canManageSubadmins: true
            },
            status: 'Active',
        });

        await admin.save();
        console.log('Admin seeded successfully');
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

// Only seed admin if not in production or explicitly needed
if (process.env.NODE_ENV !== 'production') {
    seedAdmin();
}

 

// Role permission checker
const authorize = (permission) => {
  return async (req, res, next) => {
    const adminRecord = await Admin.findById(req.admin.id);
    if (!adminRecord || !adminRecord.permissions[permission]) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

//admin login route
app.post('/old/admin/login', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Received admin login request:", req.body);

  try {
      // Find admin by username or email
      const admin = await Admin.findOne({
          $or: [
              { username: username || '' }, 
              { email: email || '' }
          ]
      });

      // If admin not found
      if (!admin) {
          console.log("Admin account not found");
          return res.status(404).json({ message: 'Account not found. Please check your credentials.' });
      }

      // Check if account is active
      if (admin.status !== 'Active') {
          console.log("Admin account is not active");
          return res.status(403).json({ message: 'Your account is not active. Please contact support.' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
          console.log("Invalid password");
          return res.status(401).json({ message: 'Incorrect password' });
      }

      // Update last login
      admin.LastLogin = new Date();
      await admin.save();

      // Create JWT token
      const token = jwt.sign(
          { 
              id: admin._id,
              username: admin.username,
              email: admin.email,
              role: admin.role 
          },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
      );

      console.log("Admin login successful, token generated");
      return res.status(200).json({ 
          token,
          user: {
              id: admin._id,
              fullName: admin.fullName,
              email: admin.email,
              role: admin.role
          }
      });
  } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({ message: 'Server error' });
  }
});

//Route to generate pin
const SALT_ROUNDS = 10; // Adjust the salt rounds for encryption strength

// Generate PIN API

app.post('/admin/generate-pin', authenticateJWT, async (req, res) => {
  const { pinLength, expirationTime } = req.body;

  console.log("===== BACKEND LOGS =====");
  console.log("Received pinLength (from frontend):", pinLength);
  console.log("Received expirationTime (from frontend):", expirationTime);

  try {
    // Validate input
    if (![4, 6].includes(pinLength)) {
      console.error("Error: PIN length must be 4 or 6 digits.");
      return res.status(400).json({ message: 'PIN length must be 4 or 6 digits' });
    }

    if (!expirationTime || isNaN(expirationTime)) {
      console.error("Error: Valid expiration time is required.");
      return res.status(400).json({ message: 'Valid expiration time is required' });
    }

    // Generate random PIN
    const rawPin = Array(pinLength)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join(''); // Generate a random 4 or 6-digit PIN
    console.log("Generated raw PIN:", rawPin);

    // Encrypt the PIN
    const encryptedPin = await bcrypt.hash(rawPin, SALT_ROUNDS);
    console.log("Encrypted PIN:", encryptedPin);

    // Calculate expiration timestamp
    const expirationAt = new Date(Date.now() + expirationTime * 60 * 1000); // Convert minutes to milliseconds
    console.log("Calculated expirationAt (timestamp):", expirationAt);

    // Save the PIN to the database
    const pin = new Pin({
      pinCode: encryptedPin,
      expirationAt,
    });

    await pin.save();
    console.log("PIN saved to database successfully.");

    // Return the raw PIN and expiration details to the admin
    res.status(200).json({
      message: 'PIN generated successfully',
      pin: rawPin, // Send the raw PIN to the admin
      expirationAt,
    });
  } catch (error) {
    console.error("Error generating PIN:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule job to run every minute
cron.schedule('* * * * *', async () => {
  console.log('Running background job to expire PINs...');
  try {
      const result = await Pin.updateMany(
          { status: 'active', expirationAt: { $lt: new Date() } },
          { status: 'expired' }
      );

      if (result.modifiedCount > 0) {
          console.log(`${result.modifiedCount} PIN(s) marked as expired.`);
      } else {
          console.log('No PINs to expire at this time.');
      }
  } catch (error) {
      console.error('Error expiring PINs:', error);
  }
});

// Verify PIN Route
app.post('/verify-pin', async (req, res) => {
  const { pin } = req.body;

  // Validate PIN input
  if (!pin || (pin.length !== 4 && pin.length !== 6)) {
    return res.status(400).json({ message: 'Invalid PIN format. PIN must be 4 or 6 digits.' });
  }

  try {
    // Search for the PIN in the database (regardless of status or expiration)
    const pinRecords = await Pin.find({});  

    let pinMatch = null;
    for (const record of pinRecords) {
      const isMatch = await bcrypt.compare(pin, record.pinCode);
      if (isMatch) {
        pinMatch = record;
        break;
      }
    }

    if (!pinMatch) {
      // PIN does not exist in the database
      return res.status(400).json({ message: 'Invalid PIN. Please try again.' });
    }

    // Check if the PIN is expired
    if (pinMatch.expirationAt < new Date() || pinMatch.status === 'expired') {
      return res.status(404).json({ message: 'PIN expired. Please request a new PIN.' });
    }

    // PIN is valid and active
    return res.status(200).json({
      message: 'Transaction approved! The money is on its way to your bank.',
    });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Route to delete all pins
app.delete('/admin/pins', authenticateJWT, async (req, res) => {
  try {
      await Pin.deleteMany({});  
      res.status(200).json({ message: 'All pins have been successfully deleted.' });
  } catch (error) {
      console.error('Error deleting pins:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Transaction Model
const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdrawal', 'transfer']
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    method: {
        type: String,
        enum: ['crypto', 'bank', 'digital-wallet', 'other']
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'failed', 'cancelled']
    },
    details: {
        type: Object
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

// Process Withdrawal
app.post('/process-withdrawal', authenticateJWT, async (req, res) => {
    const { pin, method, amount, details } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!pin || !method || !amount || !details) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Verify PIN
        const pinRecord = await Pin.findOne({});
        const isPinValid = pinRecord && await bcrypt.compare(pin, pinRecord.pinCode);
        
        if (!isPinValid) {
            return res.status(400).json({ message: 'Invalid PIN' });
        }
        if (pinRecord.expirationAt < new Date() || pinRecord.status === 'expired') {
            return res.status(400).json({ message: 'PIN expired' });
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check sufficient funds
        if (user.totalBalance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Process crypto withdrawal
        if (method === 'crypto') {
            const cryptoHolding = user.holdings.find(h => 
                h.symbol === details.type.toUpperCase() || 
                h.name.toLowerCase() === details.type.toLowerCase()
            );

            if (!cryptoHolding || cryptoHolding.amount < amount) {
                return res.status(400).json({ 
                    message: `Insufficient ${details.type} holdings`
                });
            }

            // Deduct from crypto holding
            cryptoHolding.amount -= amount;
            if (cryptoHolding.amount <= 0) {
                user.holdings = user.holdings.filter(h => h._id !== cryptoHolding._id);
            }
        }

        // Deduct from total balance
        user.totalBalance -= amount;

        // Create transaction record
        const transaction = new Transaction({
            userId,
            type: 'withdrawal',
            amount,
            method,
            status: 'completed',
            details
        });

        // Save changes
        await user.save();
        await transaction.save();

        res.status(200).json({
            message: 'Withdrawal processed successfully',
            newBalance: user.totalBalance,
            updatedHoldings: user.holdings
        });

    } catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({ message: 'Error processing withdrawal' });
    }
});
 
// Get user transaction history
app.get('/transactions', authenticateJWT, async (req, res) => {
    try {
        const { type, time } = req.query;
        const userId = req.user.id;

        const query = { userId };
        
        // Type filter
        if (type && ['withdrawal', 'deposit'].includes(type)) {
            query.type = type;
        }
        
        // Time filter
        let dateFilter = {};
        if (time === 'week') {
            dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        } else if (time === 'month') {
            dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        }
        
        if (Object.keys(dateFilter).length > 0) {
            query.createdAt = dateFilter;
        }
        
        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transaction history' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 