// src/components/UserForm.js
import React, { useState, useEffect } from 'react';

function UserForm({ onSubmit, initialData, isEditMode, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '', 
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        password: '', 
      });
    } else {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.first_name || !formData.last_name) {
        alert('First Name, Last Name, and Email are required.');
        return;
    }
     if (!isEditMode && !formData.password) {
        alert('Password is required for creating a new user.');
        return;
    }
     const dataToSubmit = { ...formData };
     if (isEditMode && !formData.password) {
        delete dataToSubmit.password;
     }

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>{isEditMode ? 'Edit User' : 'Create New User'}</h3>
      <div>
        <label htmlFor="first_name">First Name:</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="last_name">Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={isEditMode ? 'Leave blank to keep unchanged' : ''}
          required={!isEditMode} 
        />
         {!isEditMode && <small>Password is required.</small>}
         {isEditMode && <small>Enter new password to change.</small>}
      </div>
      <div className="form-buttons">
        <button type="submit">{isEditMode ? 'Update User' : 'Create User'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default UserForm;