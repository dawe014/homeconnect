# HomeConnect - Full-Stack Real Estate Platform

[HomeConnect Demo GIF](/.github/assets/demo.gif)

**Live Demo:** [https://homeconnect-ruddy.vercel.app/](https://homeconnect-ruddy.vercel.app/)

---

## 📖 About the Project

HomeConnect is a modern, feature-rich real estate listing platform built from the ground up using the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript. The application provides a seamless experience for users to browse properties, for agents to manage their listings, and for administrators to oversee the entire platform.

This project was developed as a comprehensive portfolio piece to showcase skills in full-stack development, modern UI/UX design, and professional application architecture. It covers everything from secure, role-based authentication to dynamic data filtering and interactive mapping.

---

## ✨ Key Features

This platform is divided into three core user experiences:

### 👤 **Public User Features:**

- **Hero Homepage:** A beautiful landing page to welcome users.
- **Advanced Search & Filtering:** Filter properties by keyword, status (For Sale/For Rent), and type.
- **Property Details Page:** A detailed view for each property, including an interactive image gallery lightbox and a location map.
- **Agent Directory:** A public page to view all registered agents and their listings.
- **Static Pages:** A modern "About Us" and "Contact Us" page.
- **Secure Authentication:** Users can register and log in to their accounts.

### 🤵 **Agent Dashboard Features:**

- **Protected Routes:** All dashboard routes are accessible only to authenticated agents and admins.
- **Agent Overview:** A personalized dashboard with key performance indicators (KPIs) like active listings and total property value.
- **Full CRUD for Listings:** Agents can create, read, update, and delete their own property listings.
- **Modern Form Handling:** Forms are powered by `react-hook-form` and `zod` for robust validation and a great user experience.
- **Image Management:** Agents can upload new images and delete existing ones when editing a listing.
- **Mark as Sold/Rented:** Agents can toggle the availability of their properties.

### 👑 **Admin Dashboard Features:**

- **Comprehensive Overview:** A global dashboard with platform-wide stats, including total users, properties, and data visualizations.
- **User Management:** Admins can view a list of all users, search/filter them, edit their roles, and delete accounts.
- **Property Management:** Admins can view and manage _all_ property listings on the platform, with the same controls as agents.
- **Message Inbox:** Admins can view and manage messages submitted through the public contact form.

---

## 🛠️ Tech Stack

This project utilizes a modern and robust tech stack for both the frontend and backend.

### Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)

- **Framework:** React (with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with Headless UI
- **State Management:** React Query for server state & React Context for auth
- **Form Handling:** React Hook Form with Zod for validation
- **Routing:** React Router DOM
- **Mapping:** React-Leaflet
- **Deployment:** Vercel

### Backend

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Image Handling:** Multer for file uploads
- **Deployment:** Render

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- pnpm (or npm/yarn)
- A MongoDB Atlas account or a local MongoDB instance

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/dawe014/homeconnect.git
    cd homeconnect
    ```

2.  **Install dependencies in the root directory:**

    ```sh
    npm install
    ```

3.  **Setup Backend Environment Variables:**

    - Navigate to the `/server` directory: `cd server`
    - Create a `.env` file and add the following variables:
      ```env
      PORT=8000
      DATABASE_URL="your_mongodb_connection_string"
      JWT_SECRET="your_super_secret_jwt_key"
      CLIENT_URL="http://localhost:5173"
      ```

4.  **Setup Frontend Environment Variables:**

    - Navigate to the `/client` directory: `cd ../client`
    - Create a `.env` file and add the following:
      ```env
      VITE_API_BASE_URL="http://localhost:8000/api"
      VITE_API_SERVER_URL="http://localhost:8000"
      ```

5.  **Run the application:**

    - You will need two separate terminal windows.
    - **Terminal 1 (Backend):**
      ```sh
      cd server
      npm run dev
      ```
    - **Terminal 2 (Frontend):**
      ```sh
      cd client
      npm run dev
      ```

    The frontend should now be running on `http://localhost:5173` and the backend on `http://localhost:8000`.

---

## 📬 Contact

Dawit Tamiru – [dawittamiru014@gmail.com](mailto:dawittamiru014@gmail.com)

Project Link: [https://github.com/dawe014/homeconnect](https://github.com/dawe014/homeconnect)
