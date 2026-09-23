require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    // Create Hashed Passwords
    const studentPassword = await bcrypt.hash('password123', 10);
    const organizerPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Create Users
    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@demo.com',
      password: studentPassword,
      role: 'student',
      department: 'Computer Science',
      bio: 'Enthusiastic CS student passionate about web dev and AI.',
    });

    const organizer = await User.create({
      name: 'Dr. Sarah Connor',
      email: 'organizer@demo.com',
      password: organizerPassword,
      role: 'organizer',
      department: 'School of Technology',
      bio: 'Campus Tech Club Lead and Event Coordinator.',
    });

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'admin',
      department: 'Campus IT Administration',
      bio: 'Global administrator for CampusConnect.',
    });

    console.log('Users created: Student, Organizer, Admin');

    // Create Events
    const events = await Event.insertMany([
      {
        title: 'HackCampus 2026 Hackathon',
        description: 'Join 200+ campus developers for a 24-hour coding sprint. Build innovative AI, Web3, and Mobile applications with amazing prizes!',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '09:00 AM - 09:00 AM (Next Day)',
        category: 'Hackathons',
        location: 'Innovation Hub & Lab 4',
        capacity: 100,
        organizer: organizer._id,
      },
      {
        title: 'Full-Stack React & Node Workshop',
        description: 'Hands-on masterclass building production-grade web applications using React 19, Express 5, and MongoDB.',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '02:00 PM - 05:00 PM',
        category: 'Workshops',
        location: 'Main Campus Auditorium B',
        capacity: 40,
        organizer: organizer._id,
      },
      {
        title: 'Annual Cultural Music Fest',
        description: 'Celebration of music, dance, and creative arts featuring student bands, guest performances, and food stalls.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '05:00 PM - 10:00 PM',
        category: 'Cultural & Arts',
        location: 'Open Air Amphitheatre',
        capacity: 250,
        organizer: organizer._id,
      },
      {
        title: 'Inter-College Esports Tournament',
        description: 'Competitive Valorant and FIFA championship. Show off your skills and win the campus trophy!',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '11:00 AM - 06:00 PM',
        category: 'Sports & Gaming',
        location: 'Student Activity Lounge',
        capacity: 32,
        organizer: organizer._id,
      },
    ]);

    console.log('Sample events created');

    // Seed student registration for Hackathon
    await Registration.create({
      student: student._id,
      event: events[0]._id,
      status: 'registered',
    });

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
