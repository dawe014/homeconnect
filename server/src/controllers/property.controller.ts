import { Request, Response } from "express";
import Property from "../models/property.model";

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
    const filter: any = {};
    if (req.query.city) {
      filter.city = new RegExp(req.query.city as string, "i");
    }
    if (req.query.propertyType) {
      filter.propertyType = req.query.propertyType;
    }

    const properties = await Property.find(filter).populate(
      "agent",
      "name email"
    );
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

// ... I will add Update and Delete later
