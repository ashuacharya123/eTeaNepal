// routes/users.js
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route    GET api/users/me
// @desc     Get current user's details
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/users/me
// @desc     Update current user's details
// @access   Private
router.put('/me', auth, async (req, res) => {
    const { name, email } = req.body;
    const userFields = {};

    if (name) userFields.name = name;
    if (email) userFields.email = email;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/users/change-password
// @desc     Change user's password
// @access   Private
router.put('/change-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    DELETE api/user/me
// @desc     Delete current user's account
// @access   Private
router.delete('/me', auth, async (req, res) => {
    try {
        // Assuming the password is sent in the request body
        const { password } = req.body;
        if(!password) { return res.status(401).json({ msg: 'Password is required' });}

        // Find the user by the authenticated user's ID
        const user = await User.findById(req.user.id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Password incorrect' });
        }

        // Delete the user
        await User.deleteOne({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
