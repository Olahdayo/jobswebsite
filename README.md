# Jobs Portal Project

## Description

This project is a job portal application built with Laravel for the backend and Vue.js for the frontend. It allows users to browse job listings, apply for jobs, and manage their profiles.

## Project Structure

```
jobsportal/
├── backend/       # Laravel backend
└── frontend/      # Vue.js frontend
```

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [XAMPP](https://www.apachefriends.org/index.html) installed on your local machine.
- Composer installed for managing PHP dependencies.
- Node.js and npm installed for managing JavaScript dependencies.

## Installation

1. **Download the Project:**

   - Clone the repository or download the ZIP file and extract it.

   ```bash
   git clone <repository-url>
   ```

2. **Set Up the Backend:**

   - Open a terminal and navigate to the `backend` directory:

   ```bash
   cd path/to/jobsportal/backend
   ```

   - Install the PHP dependencies using Composer:

   ```powershell
   composer install
   ```

   - Create a `.env` file by copying the example file:

   ```powershell
   cp .env.example .env
   ```

   - Update the `.env` file with your database connection settings.

   - Run the migrations and seeders:

   ```powershell
   php artisan migrate --seed
   ```

4. **Start the Backend Server:**

   - Start the Laravel development server:

   ```powershell
   php artisan serve
   ```

   - The backend will be accessible at `http://localhost:8000`.

5. **Set Up the Frontend:**

   - Open another terminal and navigate to the `frontend` directory:

   ```powershell
   cd path/to/jobsportal/frontend
   ```

   - Install the JavaScript dependencies using npm:

   ```powershell
   npm install
   ```

6. **Start the Frontend Development Server:**

   - Run the Vue development server:

   ```powershell
   npm run dev
   ```

   - The frontend will be accessible at `http://localhost:8080` (or the port specified in the terminal).

## Accessing the Application

- Open your web browser and navigate to:
  - Backend: `http://localhost:8000`
  - Frontend: `http://localhost:8080`

## Contributing

If you want to contribute to this project, please fork the repository and submit a pull request.


## Contact

For any inquiries, please contact [OLADAYO](mailto:devoladayo@gmail.com).

##GOODLUCK>>>>>>>>>>
