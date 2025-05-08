const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ // Try to parse JSON error, fallback if not JSON
            error: `HTTP error! status: ${response.status}`,
            details: response.statusText
        }));
        console.error("API Error Data:", errorData);
        const errorMessage = errorData.error ? `${errorData.error}${errorData.details ? `: ${errorData.details}` : ''}` : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }
    if (response.status === 204) {
        return null;
    }
     try {
        return await response.json();
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        throw new Error("Failed to parse server response.");
    }
};

export const getAllUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse(response);
};

export const getUserById = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return handleResponse(response);
};

export const createUser = async (userData) => {
    if (!userData.password) {
        throw new Error("Password is required to create a user.");
    }
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const updateUser = async (userId, userData) => {
    const dataToSend = { ...userData };
    if (!dataToSend.password) {
        delete dataToSend.password;
    }
     if (Object.keys(dataToSend).length === 0) {
        throw new Error("No fields provided for update.");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    });
    return handleResponse(response);
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
         return handleResponse(response); // Let handleResponse throw error
    }
    return null;
};