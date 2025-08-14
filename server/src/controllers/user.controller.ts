import { Request, Response } from "express";
import User from "../models/user.model";
import Property from "../models/property.model";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import cloudinary from "../config/cloudinary.config";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

// @desc    Get all users with filtering and searching
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, searchTerm } = req.query;

    const filter: any = {};

    if (role && typeof role === "string" && role !== "all") {
      filter.role = role;
    }

    // Add search term filter if provided
    if (searchTerm && typeof searchTerm === "string") {
      // Create a case-insensitive regex search on name and email fields
      filter.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// @desc    Update a user's details (e.g., role)
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUserByAdmin = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUserByAdmin = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "agent") {
      const propertyCount = await Property.countDocuments({ agent: user._id });
      if (propertyCount > 0) {
        return res.status(400).json({
          message: "Cannot delete agent. Reassign their properties first.",
        });
      }
    }

    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// @desc    Get all users with the 'agent' role, including their property count
// @route   GET /api/users/agents
// @access  Public
export const getAgents = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    const matchStage: any = { role: "agent" };

    if (searchTerm) {
      matchStage.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const agents = await User.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "agent",
          as: "properties",
        },
      },

      {
        $addFields: {
          propertyCount: { $size: "$properties" },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          avatar: 1,
          createdAt: 1,
          propertyCount: 1,
        },
      },
    ]);

    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user's own profile (name, email)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name
    user.name = req.body.name || user.name;

    // Update email if different
    if (req.body.email && req.body.email !== user.email) {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      user.email = req.body.email;
    }

    // Upload avatar to Cloudinary if provided
    if (req.file && req.file.buffer) {
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "homeconnect_avatars" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result!);
            }
          );
          uploadStream.end(req.file!.buffer);
        }
      );
      user.avatar = result.secure_url;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      token: generateToken((updatedUser._id as Types.ObjectId).toString()),
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// @desc    Change user's own password
// @route   PUT /api/users/profile/password
// @access  Private
export const changeUserPassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide both current and new passwords" });
  }

  const user = await User.findById(req.user?._id).select("+password");

  if (user && (await user.comparePassword(currentPassword))) {
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } else {
    res.status(401).json({ message: "Invalid current password" });
  }
};
