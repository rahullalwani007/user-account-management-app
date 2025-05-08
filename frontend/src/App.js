// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import { getAllUsers, createUser, updateUser, deleteUser, getUserById } from './services/userService';
import './App.css'; 

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); 

  // Fetch users from the API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data || []); 
    } catch (err) {
      setError(`Failed to fetch users: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFormSubmit = async (formData) => {
     setIsLoading(true);
     setError(null);
     try {
         if (isEditMode && selectedUser) {
            const result = await updateUser(selectedUser.id, formData);
            alert(result.message || 'User updated successfully!'); 
            setSelectedUser(null); 
            setIsEditMode(false);
            setShowForm(false);
         } else {
             const result = await createUser(formData);
              alert(result.message || 'User created successfully!'); 
             setShowForm(false);
         }
         await fetchUsers();
     } catch (err) {
         setError(`Operation failed: ${err.message}`);
         console.error(err);
          alert(`Operation failed: ${err.message}`); 
     } finally {
         setIsLoading(false);
     }
  };

  const handleEditClick = async (userId) => {
     setError(null);
     setIsLoading(true);
     try {
        const userData = await getUserById(userId);
        setSelectedUser(userData);
        setIsEditMode(true);
        setShowForm(true); 
     } catch (err) {
         setError(`Failed to fetch user data: ${err.message}`);
         console.error(err);
          alert(`Failed to fetch user data: ${err.message}`);
     } finally {
         setIsLoading(false);
     }

  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
       setIsLoading(true);
       setError(null);
       try {
           await deleteUser(userId);
           alert('User deleted successfully!');
           await fetchUsers(); 
       } catch (err) {
           setError(`Failed to delete user: ${err.message}`);
           console.error(err);
            alert(`Failed to delete user: ${err.message}`);
       } finally {
           setIsLoading(false);
       }
    }
  };

   const handleCancelForm = () => {
    setShowForm(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setError(null); 
   };

   const handleShowCreateForm = () => {
       handleCancelForm();
       setShowForm(true);
   };


  return (
    <div className="App">
      <h1>User Account Management</h1>

      {isLoading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

        {!showForm && (
            <button onClick={handleShowCreateForm} className="add-user-btn">
             + Add New User
            </button>
        )}


      {showForm && (
         <UserForm
            onSubmit={handleFormSubmit}
            initialData={selectedUser}
            isEditMode={isEditMode}
            onCancel={handleCancelForm}
         />
      )}


      <UserList
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}

export default App;