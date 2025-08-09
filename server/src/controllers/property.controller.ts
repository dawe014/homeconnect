import { Request, Response } from "express";
import Property from "../models/property.model";
import { Types } from "mongoose";
import fs from "fs/promises";
import path from "path";

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      address,
      city,
      state,
      zipCode,
      bedrooms,
      bathrooms,
      sqft,
      latitude,
      longitude,
      propertyType,
      status,
    } = req.body;

    const images = (req.files as Express.Multer.File[]).map(
      (file) => `/uploads/${file.filename}`
    );

    const property = new Property({
      title,
      description,
      price,
      address,
      city,
      state,
      zipCode,
      bedrooms,
      bathrooms,
      sqft,
      latitude,
      longitude,
      propertyType,
      status,
      images,
      agent: req.user?._id,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error creating property", error: error.message });
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

    // Check if the user is the owner of the property or an admin
    if (
      !(property.agent as Types.ObjectId).equals(
        req.user!._id as Types.ObjectId
      ) &&
      req.user?.role !== "admin"
    ) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { imagesToDelete } = req.body;
    if (imagesToDelete) {
      const parsedImagesToDelete: string[] = JSON.parse(imagesToDelete);

      if (
        Array.isArray(parsedImagesToDelete) &&
        parsedImagesToDelete.length > 0
      ) {
        for (const imageUrl of parsedImagesToDelete) {
          try {
            const filename = path.basename(imageUrl);
            const filePath = path.join(process.cwd(), "uploads", filename);

            await fs.unlink(filePath);
          } catch (err: any) {
            console.error(
              `Failed to delete file for URL ${imageUrl}:`,
              err.message
            );
          }
        }

        property.images = property.images.filter(
          (img) => !parsedImagesToDelete.includes(img)
        );
      }
    }

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const newImagePaths = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );
      property.images.push(...newImagePaths);
    }

    const {
      title,
      description,
      price,
      address,
      city,
      state,
      zipCode,
      bedrooms,
      bathrooms,
      sqft,
      latitude,
      longitude,
      propertyType,
      status,
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = price;
    if (address) property.address = address;
    if (city) property.city = city;
    if (state) property.state = state;
    if (zipCode) property.zipCode = zipCode;
    if (bedrooms) property.bedrooms = bedrooms;
    if (sqft) property.sqft = sqft;
    if (latitude) property.latitude = latitude;
    if (longitude) property.longitude = longitude;
    if (bathrooms) property.bathrooms = bathrooms;
    if (propertyType) property.propertyType = propertyType;
    if (status) property.status = status;

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
