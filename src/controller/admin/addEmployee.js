import API from '../../api';
import {getToken} from '../../components/Storage';

export const addEmployee = async data => {
  try {
    const token = await getToken ();
    const response = await fetch (API.addEmployee, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },

      body: JSON.stringify ({
        name: data.name,
        email: data.email,
        phoneNumber: data.phone,
        department: data.department,
        designation: data.designation,
      }),
    });

    const res = await response.json ();

    if (!response.ok) {
      throw new Error (res.message || 'Fetching failed');
    }

    // Store the token securely

    // storeUserData(data.user)

    return {success: true, data: res};
  } catch (error) {
    console.error ('Login error:', error);
    return {success: false, message: error.message};
  }
};
