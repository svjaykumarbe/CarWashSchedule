import React, { useEffect, useState } from 'react';

const UserManager = () => {
  const [users, setUsers] = useState([]);

  // Load users from localStorage or fallback to fetching from users.json
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      fetch('/users.json')
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
          localStorage.setItem('users', JSON.stringify(data)); // Initialize localStorage
        })
        .catch((error) => console.error('Error loading users:', error));
    }
  }, []);

  // Persist users to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Add a new user
  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, { id: prevUsers.length + 1, ...newUser }]);
  };

  // Edit an existing user
  const editUser = (id, updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
    );
  };

  // Delete a user
  const deleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return {
    users, // Provide access to the current user list
    addUser, // Function to add a new user
    editUser, // Function to edit an existing user
    deleteUser, // Function to delete a user
  };
};

export default UserManager;