const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registerForEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const studentId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({ message: 'This event has been cancelled.' });
    }

    // Check if already registered
    let existingReg = await Registration.findOne({ student: studentId, event: eventId });
    if (existingReg) {
      if (existingReg.status === 'registered') {
        return res.status(400).json({ message: 'You are already registered for this event.' });
      } else {
        // Re-activate registration
        existingReg.status = 'registered';
        existingReg.registrationDate = new Date();
        await existingReg.save();
        return res.json({ message: 'Registration reactivated successfully.' });
      }
    }

    // Check capacity
    const currentCount = await Registration.countDocuments({ event: eventId, status: 'registered' });
    if (currentCount >= event.capacity) {
      return res.status(400).json({ message: 'Sorry, this event has reached maximum capacity.' });
    }

    const registration = new Registration({
      student: studentId,
      event: eventId,
      status: 'registered',
    });

    await registration.save();
    res.status(201).json({ message: 'Successfully registered for event!' });
  } catch (err) {
    next(err);
  }
};

exports.cancelRegistration = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const studentId = req.user.id;

    const registration = await Registration.findOneAndDelete({ student: studentId, event: eventId });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    res.json({ message: 'Registration cancelled successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const registrations = await Registration.find({ student: studentId, status: 'registered' })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email department' },
      })
      .sort({ registrationDate: -1 });

    const registeredEvents = await Promise.all(
      registrations
        .filter((r) => r.event !== null)
        .map(async (r) => {
          const registeredCount = await Registration.countDocuments({
            event: r.event._id,
            status: 'registered',
          });
          return {
            ...r.event.toObject(),
            registrationId: r._id,
            registrationDate: r.registrationDate,
            registeredCount,
          };
        })
    );

    res.json(registeredEvents);
  } catch (err) {
    next(err);
  }
};
