# create_admin.py

import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'budget_track_proj.settings') 

django.setup()

User = get_user_model()

username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@admin.com")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "Admin@123")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print("✅ Superuser created")
else:
    print("ℹ️ Superuser already exists")
