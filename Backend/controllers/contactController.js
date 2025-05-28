const { writeContact } = require("../utils/contactUtils");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
        error: "Missing required fields"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        error: "Email validation failed"
      });
    }

    const contactData = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: "new"
    };

    await writeContact(contactData);

    res.status(201).json({
      message: "Contact message received successfully",
      contact: {
        id: contactData.id,
        name: contactData.name,
        subject: contactData.subject,
        createdAt: contactData.createdAt
      }
    });
  } catch (err) {
    console.error("Error in submitContact:", err);
    res.status(500).json({
      message: "Error submitting contact form",
      error: err.message
    });
  }
};
