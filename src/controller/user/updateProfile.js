export const updateProfile = async (data) => {
  try {
    console.log(data)
    const token = await getToken()
    const response = await fetch(API.updateProfile, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
        name:data.name, email:data.email, profileImage:data.photo 
      })
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Attendance Check In  failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: res };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};