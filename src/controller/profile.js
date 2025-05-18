import API from "../api/index";
import {getToken,  storeUserData} from "../components/Storage"

const getProfile = async () => {
  try {
    const token = await getToken()
    const response = await fetch(API.profile, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};

export default getProfile;
