# Dental Scheduler

## Overview
The [Dental Scheduler](https://dental-m0kb5j64m-charles-projects-e2f0daab.vercel.app/) is a full-stack application designed to manage dental appointments efficiently. The backend service handles appointment scheduling, rescheduling, and cancellation, as well as managing available time slots. It is built using Node.js and Express, with MongoDB as the database. The frontend is developed using ReactJS and Next.js, providing a dynamic and user-friendly interface for managing appointments.


## Features
- **Appointment Management**: Users can schedule, reschedule, and cancel appointments.
- **Time Slot Management**: Automatically updates available time slots based on appointments.
- **User Authentication**: Secure user authentication to manage appointments.
- **Dentist Manager**: Hidden dentist manager to manage available dentists and its availability.
- **Email Notification**: Sends an email reminder an hour before the appointment.
- **Rate Limiting**: Limits API call to 500 calls per 15 minutes.

## Technologies Used
- **ReactJS**: For building the user interface components of the application.
- **Next.js**: For server-side rendering, static site generation, and routing.
- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing appointment data.
- **Docker**: Containerization for easy deployment and scalability.
- **AWS EC2**: Virtual server to host the backend application.
- **Vercel**: Platform for frontend deployment and hosting.

### Clone the Repository
```bash
git clone https://github.com/charlesausejojr/DentalScheduler-Backend.git
```
---
## System Architecture

The Dental Scheduler application follows a client-server architecture with a clear separation between the frontend and backend. Below is an overview of the architecture:

1. **Frontend (Client)**:
   - Developed using **ReactJS** and **Next.js**.
   - Provides a user-friendly interface for scheduling, rescheduling, and canceling appointments.
   - Communicates with the backend via RESTful API calls to manage appointments and retrieve available time slots.

2. **Backend (Server)**:
   - Built with **Node.js** and **Express**.
   - Handles the business logic for appointment management, including CRUD operations for appointments and time slots.
   - Interacts with the **MongoDB** database to store and retrieve appointment data.

3. **Database**:
   - **MongoDB** serves as the primary data store, utilizing a flexible schema to accommodate various appointment-related data.

4. **Deployment**:
   - The backend is deployed on **AWS EC2** instances using **Docker** containers.
   - Continuous Integration and Continuous Deployment (CI/CD) workflows are managed via **GitHub Actions**.

## Components

1. ##### Frontend Components
   - **Pages**: 
      - ***Root Page***: The entry point to the site. Displays the services offered and a call to action.
      - ***Login/Register***: Enables user to Login and/or Register to the app.
      - ***Dashboard***: Enables user to view, reschedule or cancel his/her appointment.
      - ***Booking***: Enables user to choose from a list of Dentists and book an appointment.
      - ***Dentist Manager***: Hidden page for admins only to add Dentists and modify his/her availability.
   - **Reusable Custom UI Components**:
      - ***AvailableSlots***: Renders the available slots.
      - ***DateSelector***: Enables user to select a date.
      - ***DentistSelector***: Enables user to select a dentist.
   - **Third Party UI Components**: Anything from ShadCN is automatically installed on the application inside the components/ui/ 
   - **APIs**: The api directory is a special folder used to create API routes. These routes allow you to build a backend directly within your Next.js application without needing a separate backend server. Although I can call my backend server directly, I am using this feature in Next.js to show how you can build a fullstack application with Next.js only. In this case, a separate backend server is being used but the application can survive without it.
      - ***appointments***: Calls the backend for Appointment CRUD operations.
      - ***dentists***: Calls the backend for Dentist CRUD operations.
      - ***auth***: Used for logging in, registration and updating of user details.
    - **Context**:
       - ***AuthContext***: The AuthContext provides a global state to manage user authentication and session management. It simplifies accessing user data, checking if a user is authenticated, and implementing login/logout functionality across multiple components.
    - **Hooks**:
       - ***useBooking***: This custom hook, useBooking, manages the state and logic for booking appointments in a dental scheduling system. It handles fetching dentists, user appointments, all appointments, and available slots. It also provides functions to format dates, book an appointment, and filter available slots based on the selected dentist and date. The hook integrates authentication through the useAuth context and ensures up-to-date data using useEffect triggers. It returns relevant state variables and functions to be used across components. This custom hook is being used by the Dashboard and Booking page.

2. ##### Backend Endpoints
- **Appointment Endpoints** (requires authentication)
-- ***POST `/api/appointments`***: Create a new appointment.  
-- ***GET `/api/appointments`***: Retrieve all appointments.  
-- ***GET `/api/appointments/:id`***: Retrieve appointments for a specific user.  
-- ***DELETE `/api/appointments/:id`***: Cancel an appointment.  
-- ***PUT `/api/appointments/:id`***: Update an appointment.  
- **Dentist Endpoints**
-- ***POST `/api/dentists`***: Create a new dentist record.  
-- ***GET `/api/dentists`***: Retrieve a list of all dentists.  
-- ***PUT `/api/dentists/:id`***: Update dentist information.  
- **User Endpoints**
-- ***POST `/api/users/register`***: Register a new user.  
-- ***POST `/api/users/login`***: Authenticate a user and generate a token.  
-- ***PUT `/api/users/update-name`***: Update the user’s name (requires authentication).  

## Database Schema
**Appointment Model**
```json
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "dentist": "ObjectId",
  "date": "String",
  "time": "String",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```
**Dentist Model**
```json
{
    "_id": "ObjectId",
    "name": "String",
    "slots": [
      {
        "date": "String",
        "time": ["String"]
      }...
    ],
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
}
```
**User Model**
```json
{
    "_id": "ObjectId",
    "name": "String",
    "email": "String",
    "password": "String",
    "appointments": ["ObjectId"],
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
  }
```

## Backend Architecture 
#### Why I Used the Model-Controller-Service Architecture
##### 1. **Separation of Concerns**  
- Splits the logic into distinct layers:
  - **Model**: Handles the structure and schema of the data (e.g., User, Appointment).
  - **Controller**: Manages HTTP requests and responses.
  - **Service**: Contains the core business logic, ensuring controllers remain lightweight.

##### 2. **Maintainability and Scalability**  
- Each layer can be independently modified or extended without affecting others, making the code easier to maintain and scale.

##### 3. **Reusability**  
- Services are reusable across different controllers, ensuring DRY (Don't Repeat Yourself) principles.

##### 4. **Improved Testing**  
- Controllers and services can be tested separately, leading to better unit testing and faster debugging.

##### 5. **Clear Workflow**  
- Requests flow logically:  
  **Controller** → **Service** → **Model** → **Database**  
  This ensures a clear data flow and better organization.

---

## Additional information
A private repository for the backend was used to build and deploy: https://github.com/charlesausejojr/DentalScheduler-Backend
The repository contains the Dockerfile and Github workflow.

## GitHub Actions Workflow & AWS EC2
The CI/CD process of the backend is automated using GitHub Actions. A workflow is defined in .github/workflows/cicd.yml, which consists of the following jobs:

### Build Job:

- This job checks out the code from the repository and logs into Docker Hub using stored secrets for the username and password.
- It builds the Docker image and tags it for deployment.
- After building, the image is pushed to Docker Hub, making it accessible for deployment.

### Deploy Job:

- This job is dependent on the build job. It runs on a self-hosted runner (the EC2 instance).
- The job pulls the latest Docker image from Docker Hub.
- It stops and removes any existing container running the application.
- Finally, it runs a new container using the pulled image, ensuring that the latest version of the application is deployed.

## Vercel Deployment

The frontend of the Dental Scheduler application is deployed using Vercel, a platform designed for frontend hosting and serverless functions. Vercel simplifies the deployment process and offers features like automatic scaling, preview deployments, and integration with GitHub.

### Deployment Steps
1. **GitHub Integration**: Connect your GitHub repository to Vercel. This allows Vercel to automatically build and deploy the application whenever changes are pushed to the main branch.
2. **Configuration**: Set up any necessary environment variables in the Vercel dashboard. This includes API keys or other configuration settings required by the frontend application.
3. **Build Settings**: Vercel automatically detects the framework being used (such as Next.js) and applies the appropriate build settings. Custom build commands can be defined if needed.
4. **Automatic Deployments**: Every time changes are pushed to the repository, Vercel triggers a new deployment, ensuring that the latest version of the application is always live.
5. **Preview Deployments**: Vercel provides preview URLs for every pull request, allowing for easy testing and review before merging changes into the main branch.

### Accessing the Application
Once deployed, the frontend application can be accessed via the URL provided by Vercel. Updates and changes are automatically reflected, making it a seamless experience for users.
