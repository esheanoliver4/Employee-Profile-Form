Employee Profile App

This is a full-stack web application for submitting and storing employee profiles, including personal information, skills, department, resume, and profile image.
🛠️ Tech Used

Frontend

    React.js

    Axios (for API calls)

    SweetAlert2 (for alerts)

    CSS (for styling)

Backend

    Node.js

    Express.js

    MongoDB (Cloud using MongoDB Atlas)

    Mongoose (for MongoDB schema & queries)

    Multer (for file uploads)

📁 Folder Structure

employee-profile/
├── backend/
│   ├── config/             # DB config
│   │   └── db.js
│   ├── controllers/
│   │   └── employee.controller.js
│   ├── models/
│   │   └── employee.model.js
│   ├── routes/
│   │   └── employee.routes.js
│   ├── services
│   │   └── employee.service.js
│   ├── uploads/            # Uploaded files (resume, profileImage)
│   ├── app.js              # Express app setup
│   └── server.js           # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeProfileForm.js
│   │   │   └── EmployeeProfileForm.css
│   │   ├── data/
│   │   │   ├── departments.json
│   │   │   └── skills.json
│   │   └── App.js
│   └── public/
│
└── README.md

🌐 API Endpoints
Method	Endpoint	Description
POST	/api/employees	Create new employee profile

    Accepts multipart/form-data including resume and profile image.

🚀 How to Run
1. Clone the Repo

git clone https://github.com/esheanoliver4/Employee-Profile-Form.git
cd employee-profile

2. Backend Setup

cd backend
npm install

🔌 Setup .env file in backend/

MONGO_URI=your_mongodb_connection_string
PORT=5000

Start backend server:

node server.js

3. Frontend Setup

cd frontend
npm install
npm start

Frontend will run on: http://localhost:3000
Backend API runs on: http://localhost:5000
✅ Features

    Submit full employee profile

    Upload resume and profile picture

    Form validation on backend

    Loading indicator and alerts using SweetAlert2

    Data stored in MongoDB Cloud