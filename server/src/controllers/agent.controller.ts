import { Request, Response } from "express";
import Property from "../models/property.model";

export const getAgentDashboardStats = async (req: Request, res: Response) => {
  try {
    const agentId = req.user?._id;

    const [activeListings, archivedListings, totalValue, recentListings] =
      await Promise.all([
        Property.countDocuments({ agent: agentId, isAvailable: true }),
        Property.countDocuments({ agent: agentId, isAvailable: false }),
        Property.aggregate([
          {
            $match: {
              agent: agentId,
              isAvailable: true,
            },
          },
          { $group: { _id: null, total: { $sum: "$price" } } },
        ]),
        Property.find({ agent: agentId }).sort({ updatedAt: -1 }).limit(5),
      ]);

    const stats = {
      activeListings,
      archivedListings,
      totalValue: totalValue[0]?.total || 0,
      recentListings,
    };

    res.json(stats);
  } catch (error) {
    console.error("Agent Stats Error:", error);
    res.status(500).json({ message: "Server error fetching agent stats" });
  }
};
