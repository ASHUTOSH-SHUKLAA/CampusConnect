const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      default: '10:00 AM',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Hackathons', 'Workshops', 'Cultural & Arts', 'Sports & Gaming', 'Club Meetups', 'Seminars & Talks', 'General'],
      default: 'General',
    },
    location: {
      type: String,
      default: 'Main Campus Auditorium',
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1 seat'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
