from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """Generates a salted hash for the given password."""
    return generate_password_hash(password)

def verify_password(stored_password_hash, provided_password):
    """Verifies a provided password against a stored hash."""
    return check_password_hash(stored_password_hash, provided_password)