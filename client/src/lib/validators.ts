import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be a positive number." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().min(3, { message: "A valid ZIP code is required." }),
  bedrooms: z.coerce
    .number()
    .int()
    .min(0, { message: "Bedrooms cannot be negative." }),
  bathrooms: z.coerce
    .number()
    .int()
    .min(0, { message: "Bathrooms cannot be negative." }),
  sqft: z.coerce
    .number()
    .int()
    .min(1, { message: "Square footage is required." }),
  latitude: z.coerce
    .number()
    .min(-90)
    .max(90, { message: "Invalid latitude." }),
  longitude: z.coerce
    .number()
    .min(-180)
    .max(180, { message: "Invalid longitude." }),
  propertyType: z.enum(["House", "Apartment", "Condo"]),
  status: z.enum(["For Sale", "For Rent"]),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type TContactFormSchema = z.infer<typeof contactFormSchema>;
export type TPropertyFormSchema = z.infer<typeof propertyFormSchema>;
