import {getToken} from '../../components/Storage';
import API from '../../api/index';
export const updateProfile = async data => {
  try {
    const bodyData = {};

    if (data.name) bodyData.name = data.name;
    if (data.email) bodyData.email = data.email;
    if (data.phoneNumber) bodyData.phoneNumber = data.phoneNumber;
    if (data.photo) bodyData.profileImage = data.photo;
    if (data.documents) bodyData.documents = data.documents;

    const token = await getToken();
    const response = await fetch(API.updateProfile, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyData),
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Profile update failed');
    }

    // Store the token securely

    // storeUserData(data.user)

    return {success: true, data: res};
  } catch (error) {
    console.error('Update Profile error:', error);
    return {success: false, message: error.message};
  }
};

export const updatePassword = async data => {
  try {
    const token = await getToken();
    const response = await fetch(API.updatePassword, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword
      }),
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Password reset failed');
    }

    // Store the token securely

    // storeUserData(data.user)

    return {success: true, data: res};
  } catch (error) {
    console.error('Reset Password error:', error);
    return {success: false, message: error.message};
  }
};
