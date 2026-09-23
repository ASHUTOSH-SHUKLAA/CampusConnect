const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getEvents = async (req, res, next) => {
  try {
    const { search, category, status, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    let sortOptions = { date: 1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'capacity') sortOptions = { capacity: -1 };

    const events = await Event.find(query)
      .populate('organizer', 'name email department avatar')
      .sort(sortOptions);

    // Attach current registration count to each event
    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({
          event: event._id,
          status: 'registered',
        });
        return {
          ...event.toObject(),
          registeredCount: registrationCount,
        };
      })
    );

    res.json(eventsWithCount);
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email department avatar');
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const registeredCount = await Registration.countDocuments({ event: event._id, status: 'registered' });
    res.json({ ...event.toObject(), registeredCount });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, category, location, capacity, imageUrl } = req.body;

    if (!title || !description || !date || !capacity) {
      return res.status(400).json({ message: 'Title, description, date, and capacity are required.' });
    }

    if (capacity < 1) {
      return res.status(400).json({ message: 'Capacity must be at least 1 seat.' });
    }

    const event = new Event({
      title,
      description,
      date,
      time: time || '10:00 AM',
      category: category || 'General',
      location: location || 'Main Campus Auditorium',
      capacity: Number(capacity),
      imageUrl: imageUrl || '',
      organizer: req.user.id,
    });

    await event.save();
    const populatedEvent = await Event.findById(event._id).populate('organizer', 'name email department');
    res.status(201).json(populatedEvent);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Verify ownership or admin privileges
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only edit your own events.' });
    }

    const allowedFields = ['title', 'description', 'date', 'time', 'category', 'location', 'capacity', 'imageUrl', 'status'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();
    const updatedEvent = await Event.findById(event._id).populate('organizer', 'name email department');
    res.json(updatedEvent);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Security Check: Verify ownership or admin role
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only delete your own events.' });
    }

    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ event: req.params.id });

    res.json({ message: 'Event and associated registrations deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only event organizer or admin can view attendee lists.' });
    }

    const registrations = await Registration.find({ event: req.params.id, status: 'registered' })
      .populate('student', 'name email department avatar createdAt')
      .sort({ registrationDate: -1 });

    res.json(registrations);
  } catch (err) {
    next(err);
  }
};
