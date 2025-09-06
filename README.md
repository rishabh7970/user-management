User Management System
A full-stack web application designed for the efficient management of user profiles. This project provides a clean, intuitive interface for administrators to perform complete CRUD (Create, Read, Update, Delete) operations on user data, backed by a robust SpringBoot API and a PostgreSQL database.

Features
View All Users: Display a comprehensive list of all user profiles in a clean, tabular format.

Create New Users: Seamlessly add new users to the system via a dedicated creation form with validation.

Edit & Update: Modify the details of any existing user profile.

Delete Users: Remove users from the database.

Responsive Design: A clean and efficient interface that works on desktops, tablets, and mobile devices.

Tech Stack
This project is built with a modern, full-stack architecture:

Frontend: Angular

Backend: SpringBoot (Java)

Database: PostgreSQL

Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js and npm

Angular CLI

Java JDK (version 17 or higher)

Apache Maven

PostgreSQL

Installation & Setup
Follow these steps to get your development environment set up and running.

1. Clone the repository:

Bash

git clone https://github.com/your-username/user-management-system.git
cd user-management-system
2. Backend Setup (SpringBoot):

Navigate to the backend directory (e.g., cd server).

Create a PostgreSQL database named user_management_db.

Configure the database connection: Open the src/main/resources/application.properties file and update the spring.datasource.url, spring.datasource.username, and spring.datasource.password properties with your local PostgreSQL credentials.

Install dependencies:

Bash

mvn clean install
3. Frontend Setup (Angular):

Navigate to the frontend directory (e.g., cd client).

Install dependencies:

Bash

npm install
Running the Application
You'll need to run the backend and frontend servers in separate terminals.

1. Start the Backend Server:

From the backend directory, run:

Bash

mvn spring-boot:run
The backend API will be running on http://localhost:8080.

2. Start the Frontend Server:

From the frontend directory, run:

Bash

ng serve
Navigate to http://localhost:4200/ in your browser. The application will automatically reload if you change any of the source files.

API Endpoints
The backend provides the following RESTful endpoints:

Method	Endpoint	Description
GET	/api/users	Fetches a list of all users.
GET	/api/users/{id}	Fetches a single user by their ID.
POST	/api/users	Creates a new user.
PUT	/api/users/{id}	Updates an existing user.
DELETE	/api/users/{id}	Deletes a user.

Export to Sheets
<br>

<details>
<summary><strong>Original Angular CLI Command Reference</strong></summary>

Code Scaffolding
Run ng generate component component-name to generate a new component. You can also use ng generate directive|pipe|service|class|guard|interface|enum|module.

Build
Run ng build to build the project. The build artifacts will be stored in the dist/ directory.

Running Unit Tests
Run ng test to execute the unit tests via Karma.

Running End-to-End Tests
Run ng e2e to execute the end-to-end tests.

Further Help
To get more help on the Angular CLI use ng help or go check out the Angular CLI Overview and Command Reference page.
