import API from "../../api";
import { getToken } from "../../components/Storage";

export const dashboard = async () => {
  try {
    const token = await getToken()
    const response = await fetch(API.adminDashboard, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Fetching failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};