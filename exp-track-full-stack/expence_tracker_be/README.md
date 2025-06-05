#  Budget Tracker - Backend

This is the **Backend API** for the **Personal Budget Tracker** web application. It allows users to register, manage categories, track income and expenses, and view financial summaries.

---

## Features

-  User Registration & Authentication
-  Add Income and Expenses
-  Create and Manage Categories (Income / Expense)
-  Get Monthly Budget Summary
-  PostgreSQL database integration
-  Secure (JWT / Session-based auth)

---

## Tech Stack
Language      | Python 3.x 
Framework     | Django REST Framework
Database      | PostgreSQL 
Auth          | JWT


## Setup Instructions


### 1. Clone the Repository
git clone https://github.com/your-username/budget-tracker-backend.git
cd budget-tracker-backend



### 1. Create Virtual Environment

python -m venv venv
source venv/bin/activate 

## Install Dependencies

pip install -r requirements.txt

## Configure PostgreSQL Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'budget_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


### Run Migrations

python manage.py makemigrations
python manage.py migrate

## Create Superuser

python manage.py createsuperuser

## Start Development Server
python manage.py runserver