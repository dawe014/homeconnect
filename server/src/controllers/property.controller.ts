import { Request, Response } from "express";
import Property from "../models/property.model";
import { Types } from "mongoose";
import fs from "fs/promises";
import path from "path";
import cloudinary from "../config/cloudinary.config";

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)

export const createProperty = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required." });
    }

    // Upload images to Cloudinary
    const uploadPromises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "homeconnect_properties" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result!.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        })
    );

    const imageUrls = await Promise.all(uploadPromises);

    const property = new Property({
      ...req.body,
      images: imageUrls, // Cloudinary URLs
      agent: req.user?._id,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error: any) {
    console.error("Error creating property:", error);
    res.status(500).json({
      message: "Error creating property",
      error: error.message,
    });
  }
};

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      searchTerm,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      sort,
      agentId,
    } = req.query;

    const filter: any = { isAvailable: true };
    if (agentId) {
      filter.agent = agentId;
    }
    if (searchTerm) {
      // Search across multiple fields: title, address, city, state
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
        { state: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (propertyType && propertyType !== "all") {
      filter.propertyType = propertyType;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    // Price range filter
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
    // If no price filters are applied, remove the empty price object
    if (Object.keys(filter.price).length === 0) {
      delete filter.price;
    }

    if (bedrooms) {
      filter.bedrooms = { $gte: Number(bedrooms) };
    }

    // Sorting logic
    let sortOption: any = { createdAt: -1 }; // Default sort by newest
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    const properties = await Property.find(filter)
      .populate("agent", "name email")
      .sort(sortOption);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching properties", error: error.message });
  }
};

// @desc    Get a single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "agent",
      "name email"
    );
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error: any) {
    res.status(404).json({ message: "Property not found" });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
// controllers/propertyController.ts

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = (property.agent as Types.ObjectId).equals(
      req.user!._id as Types.ObjectId
    );
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "User not authorized" });
    }

    let currentImages = [...property.images];

    if (req.body.imagesToDelete) {
      const imagesToDelete: string[] = JSON.parse(req.body.imagesToDelete);

      currentImages = currentImages.filter(
        (img) => !imagesToDelete.includes(img)
      );

      for (const imageUrl of imagesToDelete) {
        try {
          if (process.env.CLOUDINARY_URL) {
            const publicIdWithFolder = imageUrl.substring(
              imageUrl.indexOf("homeconnect_properties/")
            );
            const publicId = publicIdWithFolder.substring(
              0,
              publicIdWithFolder.lastIndexOf(".")
            );
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          } else {
            const filename = path.basename(imageUrl);
            const localPath = path.resolve(process.cwd(), "uploads", filename);

            if (localPath.startsWith(path.resolve(process.cwd(), "uploads"))) {
              await fs.unlink(localPath);
            }
          }
        } catch (err) {
          console.error(`Failed to delete image ${imageUrl}:`, err);
        }
      }
    }

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const newImageFiles = req.files as Express.Multer.File[];
      let newImageUrls: string[] = [];

      if (process.env.CLOUDINARY_URL) {
        const uploadPromises = newImageFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "homeconnect_properties" },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result!.secure_url);
                }
              );
              uploadStream.end(file.buffer);
            })
        );
        newImageUrls = await Promise.all(uploadPromises);
      } else {
        newImageUrls = newImageFiles.map(
          (file) => `/${file.path.replace(/\\/g, "/")}`
        );
      }
      currentImages.push(...newImageUrls);
    }

    Object.assign(property, req.body);

    property.images = currentImages;

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error: any) {
    console.error("Error updating property:", error);
    res
      .status(400)
      .json({ message: "Error updating property", error: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Authorization check
    if (
      !(property.agent as Types.ObjectId).equals(
        req.user!._id as Types.ObjectId
      ) &&
      req.user?.role !== "admin"
    ) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await property.deleteOne();

    res.json({ message: "Property removed successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting property", error: error.message });
  }
};

// @desc    Get properties for the logged-in agent
// @route   GET /api/properties/my-listings
// @access  Private (Agent/Admin)
export const getMyListings = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ agent: req.user?._id });
    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching listings", error: error.message });
  }
};

// @desc    Get ALL properties for admin management
// @route   GET /api/properties/all
// @access  Private (Admin)
export const getAllPropertiesForAdmin = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({}).populate("agent", "name email");
    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching properties", error: error.message });
  }
};

// @desc    Toggle property availability (mark as sold/rented)
// @route   PATCH /api/properties/:id/toggle-availability
// @access  Private (Owner/Admin)
export const togglePropertyAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    if (
      !(property.agent as Types.ObjectId).equals(
        req.user!._id as Types.ObjectId
      ) &&
      req.user?.role !== "admin"
    ) {
      return res.status(401).json({ message: "User not authorized" });
    }

    property.isAvailable = !property.isAvailable;
    await property.save();
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
