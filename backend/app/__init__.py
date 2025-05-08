import os
from flask import Flask
from dotenv import load_dotenv
from .models import db, User 
from .routes import main_bp
from flask_migrate import Migrate 

def create_app(config_name=None):
    load_dotenv()
    app = Flask(__name__)

    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("No DATABASE_URL set for Flask application")

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'a_default_fallback_secret_key')

    db.init_app(app)
    migrate = Migrate(app, db) 

    app.register_blueprint(main_bp, url_prefix='/api')


    return app