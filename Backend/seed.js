const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    const admin = await User.findOne({ email: 'admin@staysphere.com' });
    if (!admin) {
        await User.create({ name: 'Super Admin', email: 'admin@staysphere.com', password: 'password123', role: 'Admin' });
        console.log('Admin user created');
    }

    const student = await User.findOne({ email: 'student@staysphere.com' });
    if (!student) {
        await User.create({ name: 'John Student', email: 'student@staysphere.com', password: 'password123', role: 'Student' });
        console.log('Student user created');
    }
    
    console.log('Database seeded successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
