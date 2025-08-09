import { Request, Response } from "express";
import Property from "../models/property.model";
import User from "../models/user.model";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalProperties,
      totalUsers,
      totalAgents,
      totalPropertyValue,
      propertiesLast7Days,
      recentProperties,
      recentUsers,
      propertyTypeCounts,
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: "agent" }),
      Property.aggregate([
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Property.find({ createdAt: { $gte: sevenDaysAgo } }).sort({
        createdAt: -1,
      }),
      Property.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("agent", "name"),
      User.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email avatar"),
      Property.aggregate([
        { $group: { _id: "$propertyType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const stats = {
      totalProperties,
      totalUsers,
      totalAgents,
      totalPropertyValue: totalPropertyValue[0]?.total || 0,
      propertiesLast7Days: recentProperties,
      recentListings: recentProperties,
      recentUsers,
      propertyTypeCounts,
    };

    res.json(stats);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};
