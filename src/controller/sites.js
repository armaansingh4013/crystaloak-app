import { getToken } from "../components/Storage";

export const getSites = async (userId) => {
  try {
    const token = await getToken()
    const response = await fetch(API.sites, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      }
    });

    const data = await response.json();
    console.log(data)
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