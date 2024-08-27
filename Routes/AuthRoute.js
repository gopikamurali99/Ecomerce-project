const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel'); // Import Admin model
const Customer = require('../models/CustomerModel'); // Import Customer model
const Seller = require('../models/SellerModel'); // Import Seller model
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const jwtToken = process.env.JWT_TOKEN;
const appemail = process.env.APP_EMAIL;
const app_pass = process.env.APP_PASS;
const base_url = process.env.BASE_URL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASS,
    },
});

// Register a new admin
router.post('/register/admin', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        newAdmin.verificationToken = verificationToken;
        await newAdmin.save();

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            text: `Click the link to verify your email: ${verificationLink}`,
        });

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register a new customer
router.post('/register/customer', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new Customer({ name, email, password: hashedPassword});
        await newCustomer.save();

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        newCustomer.verificationToken = verificationToken;
        await newCustomer.save();

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            text: `Click the link to verify your email: ${verificationLink}`,
        });

        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register a new seller
router.post('/register/seller', async (req, res) => {
    const { name, email, password, phone} = req.body;
    try {
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newSeller = new Seller({ name, email, password: hashedPassword, phone });
        await newSeller.save();

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        newSeller.verificationToken = verificationToken;
        await newSeller.save();

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            text: `Click the link to verify your email: ${verificationLink}`,
        });

        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check admin first
        let user = await Admin.findOne({ email });
        if (!user) {
            // Check customer
            user = await Customer.findOne({ email });
            if (!user) {
                // Check seller
                user = await Seller.findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: 'User not found' });
                }
            }
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.constructor.modelName.toLowerCase() }, jwtToken, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.constructor.modelName.toLowerCase() } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Email verification route
router.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    const user = await Admin.findOne({ verificationToken: token });
    if (!user) {
        user = await Customer.findOne({ verificationToken: token });
        if (!user) {
            user = await Seller.findOne({ verificationToken: token });
            if (!user) {
                return res.status(400).json({ message: 'Invalid verification token' });
            }
        }
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        let user = await Admin.findOne({ email });
        if (!user) {
            user = await Customer.findOne({ email });
            if (!user) {
                user = await Seller.findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: 'User not found' });
                }
            }
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send password reset email
        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            text: `Click the link below to reset your password: ${resetLink}`,
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Error sending password reset email' });
    }
});

// Reset password route
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        let user = await Admin.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            user = await Customer.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
            if (!user) {
                user = await Seller.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
                if (!user) {
                    return res.status(400).json({ message: 'Invalid or expired token' });
                }
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

// Logout route
router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;