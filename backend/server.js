require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Models ---
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'organizer'], default: 'student' }
});
const User = mongoose.model('User', UserSchema);

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    category: { type: String },
    capacity: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Event = mongoose.model('Event', EventSchema);

const RegistrationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    registrationDate: { type: Date, default: Date.now }
});
const Registration = mongoose.model('Registration', RegistrationSchema);

// --- Middleware ---
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const organizerMiddleware = (req, res, next) => {
    if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Organizer access required' });
    next();
};

// --- Routes: Auth ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Routes: Events ---
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', authMiddleware, organizerMiddleware, async (req, res) => {
    try {
        const event = new Event({ ...req.body, organizer: req.user.id });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/events/:id', authMiddleware, organizerMiddleware, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        await Registration.deleteMany({ event: req.params.id });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Routes: Registrations ---
app.post('/api/events/:id/register', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const existingReg = await Registration.findOne({ student: req.user.id, event: req.params.id });
        if (existingReg) return res.status(400).json({ message: 'Already registered' });

        const count = await Registration.countDocuments({ event: req.params.id });
        if (count >= event.capacity) return res.status(400).json({ message: 'Event is full' });

        const registration = new Registration({ student: req.user.id, event: req.params.id });
        await registration.save();
        res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/me/events', authMiddleware, async (req, res) => {
    try {
        const registrations = await Registration.find({ student: req.user.id }).populate('event');
        res.json(registrations.map(r => r.event));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/events/:id/register', authMiddleware, async (req, res) => {
    try {
        await Registration.findOneAndDelete({ student: req.user.id, event: req.params.id });
        res.json({ message: 'Registration cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
