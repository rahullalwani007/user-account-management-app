import React from 'react';

function UserList({ users, onEdit, onDelete }) {
  if (!users || users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div className="user-list">
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => onEdit(user.id)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(user.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;