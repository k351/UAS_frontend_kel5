const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('./api/models/user.schema');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Seeder connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

const seedUsers = async () => {
    try {
        const users = [
            {
                email: "admin@example.com",
                password: "securePassword123", // Plain text password to hash
                name: "Admin User",
                address: {
                    street: "Jl. Admin",
                    city: "Jakarta",
                    country: "Indonesia"
                },
                phoneNumber: "081234567890",
                role: "admin"
            },
            {
                email: "user@example.com",
                password: "securePassword456", // Plain text password to hash
                name: "Regular User",
                address: {
                    street: "Jl. User",
                    city: "Bandung",
                    country: "Indonesia"
                },
                phoneNumber: "081298765432",
                role: "user"
            }
        ];

        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                // Hash the password before saving
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                // Replace the plain text password with the hashed password
                userData.password = hashedPassword;

                // Save the user to the database
                await User.create(userData);
                console.log(`User ${userData.email} has been created`);
            } else {
                console.log(`User ${userData.email} already exists`);
            }
        }
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seeder
seedUsers();
