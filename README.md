# Course Sharing Platform

## Overview
This is a **Course Sharing** web application built using Django REST Framework (DRF) for the backend and React for the frontend. The platform allows users to upload, share, and access courses on various topics with authentication and authorization.

## Features
- User authentication (JWT-based login/register)
- Upload and manage courses and lessons
- Browse available courses
- Download course materials
- Search and filter courses
- CORS support for frontend integration
- Responsive UI with React

## Technologies Used
### Backend (Django REST Framework)
- Django 5.1.6
- Django REST Framework
- Simple JWT for authentication
- SQLite (default, can be switched to PostgreSQL/MySQL)
- CORS Headers for frontend integration

### Frontend (React)
- React.js with Vite
- Axios for API calls
- Tailwind CSS for styling

## Installation
### Prerequisites
Ensure you have the following installed:
- Python (3.8+)
- Node.js & npm
- MongoDB or PostgreSQL (if using a database other than SQLite)
- Any required dependencies from `requirements.txt` and `package.json`

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/raufnizam/course-sharing.git
   ```
2. Navigate to the backend directory:
   ```sh
   cd course-sharing/backend
   ```
3. Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
4. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
5. Apply database migrations:
   ```sh
   python manage.py migrate
   ```
6. Create a superuser (optional):
   ```sh
   python manage.py createsuperuser
   ```
7. Run the development server:
   ```sh
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm run dev
   ```

## API Endpoints
### Authentication
- `POST auth/register/` - Register a new user
- `POST auth/login/` - User login, returns JWT tokens
- `GET auth/profile/` - Retrieve user profile

### Courses & Lessons
- `GET api/courses/` - List all courses
- `POST api/courses/` - Create a new course
- `GET api/courses/{id}/` - Retrieve a specific course
- `GET api/lessons/` - List all lessons
- `POST api/lessons/` - Create a new lesson

## Usage
- Register or log in to your account.
- Upload a course by providing details and files.
- Browse or search for available courses.
- Download materials as needed.

## Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```sh
   git push origin feature-branch
   ```
5. Open a Pull Request.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries or suggestions, feel free to reach out to the repository owner.

