const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill in all required fields",
        error: "Missing required fields",
        details: "Name, email, subject, and message are required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        error: "Invalid email format",
        details: "The email address format is incorrect"
      });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'new'
    });

    await contact.save();

    res.status(201).json({
      message: "Message sent successfully. We'll get back to you soon.",
      contact: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (err) {
    console.error("Error in submitContact:", err);
    res.status(500).json({
      message: "Failed to send message",
      error: "Server error",
      details: err.message
    });
  }
};
