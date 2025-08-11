import { z } from "zod";

export const clientPropertyFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
  price: z.string().min(1, { message: "Price is required." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().min(3, { message: "A valid ZIP code is required." }),
  bedrooms: z.string().min(1, { message: "Bedrooms are required." }),
  bathrooms: z.string().min(1, { message: "Bathrooms are required." }),
  sqft: z.string().min(1, { message: "Square footage is required." }),
  latitude: z.string().min(1, { message: "Latitude is required." }),
  longitude: z.string().min(1, { message: "Longitude is required." }),
  propertyType: z.enum(["House", "Apartment", "Condo"]),
  status: z.enum(["For Sale", "For Rent"]),
});

export const propertyFormSchema = clientPropertyFormSchema.transform(
  (data) => ({
    ...data,
    price: parseFloat(data.price),
    bedrooms: parseInt(data.bedrooms, 10),
    bathrooms: parseInt(data.bathrooms, 10),
    sqft: parseInt(data.sqft, 10),
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
  })
);

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type TContactFormSchema = z.infer<typeof contactFormSchema>;
export type TPropertyFormSchema = z.infer<typeof propertyFormSchema>;
export type TClientPropertyFormSchema = z.infer<
  typeof clientPropertyFormSchema
>;
