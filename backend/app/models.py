from flask_sqlalchemy import SQLAlchemy
from app.utils import hash_password
import uuid 

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False) 

    def __init__(self, email, first_name, last_name, password):
        self.email = email.lower()
        self.first_name = first_name
        self.last_name = last_name
        self.set_password(password)

    def set_password(self, password):
        self.password_hash = hash_password(password)

    def check_password(self, password):
        return verify_password(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name
        }

    def __repr__(self):
        return f'<User {self.email}>'