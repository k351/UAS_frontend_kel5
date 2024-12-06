const express = require('express');
const router = express.Router();
const User = require('../models/user.schema');
const bcrypt = require('bcrypt');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Mendapatkan semua pengguna (hanya untuk admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Menghapus pengguna berdasarkan ID (hanya untuk admin)
router.delete('/delete/:userId', verifyToken, isAdmin, async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Akun berhasil dihapus.' });
    } catch (error) {
        console.error('Error deleting user:', error.message || error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus akun.' });
    }
});

// Mendapatkan data pengguna berdasarkan token
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Mendapatkan alamat pengguna
router.get('/address', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id, 'address');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user.address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Failed to fetch address.' });
    }
});

// Mendapatkan pengaturan pengguna
router.get('/settings', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ message: 'Failed to fetch user settings.' });
    }
});

// Memperbarui profil pengguna
router.put('/settings/update', verifyToken, async (req, res) => {
    try {
        const { name, email, phoneNumber, address } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (address) {
            user.address.street = address.street || user.address.street;
            user.address.city = address.city || user.address.city;
            user.address.country = address.country || user.address.country;
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
});

// Memperbarui kata sandi pengguna
router.put('/settings/password/update', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Harap masukkan semua data.' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Kata sandi saat ini salah.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.status(200).json({ message: 'Kata sandi berhasil diubah.' });
    } catch (error) {
        console.error('Error updating password:', error.message || error);
        res.status(500).json({ message: 'Gagal memperbarui kata sandi.' });
    }
});

// Logout pengguna
router.post('/settings/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful', redirect: '/login' });
});

// Memperbarui alamat pengguna
router.put('/address/update', verifyToken, async (req, res) => {
    const { street, city, country } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.address.street = street;
        user.address.city = city;
        user.address.country = country;

        await user.save();
        res.status(200).json({ message: 'Address updated successfully.', address: user.address });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Failed to update address.' });
    }
});

// Menghapus akun pengguna
router.delete('/settings/delete', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'Akun berhasil dihapus.' });
    } catch (error) {
        console.error('Error deleting user:', error.message || error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus akun.' });
    }
});



module.exports = router;
