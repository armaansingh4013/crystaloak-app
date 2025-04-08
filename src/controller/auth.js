import API from "../api";

const loginUser = async (employeeCode, password) => {
  try {
    const response = await fetch(API.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeCode, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

   

    return { success: true, data: data};
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};

export default loginUser;
