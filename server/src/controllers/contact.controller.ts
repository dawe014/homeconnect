import { Request, Response } from "express";
import ContactMessage from "../models/contactMessage.model";

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully! We will get back to you shortly.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching messages." });
  }
};

// @desc    Mark a message as read
// @route   PATCH /api/contact/:id/read
// @access  Private (Admin)
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    message.isRead = true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error updating message." });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    await message.deleteOne();
    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting message." });
  }
};
