import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  propertyType: "House" | "Apartment" | "Condo";
  status: "For Sale" | "For Rent";
  isAvailable: boolean;
  images: string[];
  agent: IUser["_id"];
}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    sqft: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    propertyType: {
      type: String,
      enum: ["House", "Apartment", "Condo"],
      required: true,
    },
    status: {
      type: String,
      enum: ["For Sale", "For Rent"],
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    images: [{ type: String }],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model<IProperty>("Property", PropertySchema);
export default Property;
