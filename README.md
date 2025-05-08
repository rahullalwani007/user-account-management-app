# User Account Management App (Flask API + React Dashboard)

## Project Overview

This project implements a full-stack application for managing user accounts. It consists of:

1.  **Backend API:** A Python Flask application deployed as an AWS Lambda function using the Serverless Framework. It provides CRUD (Create, Read, Update, Delete) operations for user data (first name, last name, email, password) stored in an AWS RDS PostgreSQL database.
2.  **Frontend Dashboard:** A React JS application that provides a user interface to interact with the backend API, allowing users to be created, viewed, updated, and deleted.

## Tech Stack

* **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-Migrate, Serverless Framework, AWS Lambda, AWS API Gateway, AWS RDS (PostgreSQL), AWS SSM Parameter Store
* **Frontend:** React JS, JavaScript (ES6+), CSS
* **Testing:** Postman

## Repository Structure

* `/backend`: Contains the Flask API source code and Serverless deployment configuration.
* `/frontend`: Contains the React dashboard source code.
* `/postman`: Contains the exported Postman collection for API testing.
* `README.md`: This file.

## Quick Start

### Backend

1.  Navigate to the `backend` directory.
2.  Set up a Python virtual environment and install dependencies (`pip install -r requirements.txt`).
3.  Configure local `.env` file (based on `.env.example`) for database connection and secret key.
4.  Run database migrations (`flask db upgrade`).
5.  Run locally: `python wsgi.py` or `gunicorn wsgi:app`.
6.  Deploy to AWS: Configure AWS credentials, set up required AWS resources (RDS, S3 bucket, SSM parameters), and run `serverless deploy --stage dev`.

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install dependencies (`npm install`).
3.  Configure the `.env` file with `REACT_APP_API_BASE_URL` pointing to the deployed backend API endpoint.
4.  Run locally: `npm start`.

## Deployed API Endpoint

The deployed backend API is available at:
`https://d7snd8x1k9.execute-api.eu-north-1.amazonaws.com/api`

## API Testing

A Postman collection (`UserAccountAPI.postman_collection.json`) is included in the `postman/` directory for testing the backend API endpoints. Import it into Postman and configure the `baseUrl` variable.

