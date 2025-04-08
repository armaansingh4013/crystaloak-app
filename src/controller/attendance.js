import API from "../api";
import { getToken } from "../components/Storage";

export const attendanceStatus = async (userId) => {
  try {
    const token = await getToken()
    const response = await fetch(API.attendanceStatus+userId, {
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


export const attendanceCheckIn = async (dataInput) => {
    try {
        console.log(dataInput)
      const token = await getToken()
      const response = await fetch(API.attendanceCheckIn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+token
        },
        body:JSON.stringify({
            "userId":dataInput.userId,
            "location":dataInput.location.split(" "),
            "photo":dataInput.photo,
            "siteId":dataInput.siteId
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Attendance Check In  failed');
      }
  
      // Store the token securely
   
      // storeUserData(data.user)
  
      return { success: true, data: data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

 export const attendanceCheckOut = async (dataInput) => {
    try {
      const token = await getToken()
      const response = await fetch(API.attendanceCheckOut, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+token
        },
        body:JSON.stringify({
            "userId":dataInput.userId,
            "location":dataInput.location.split(" "),
            "photo":dataInput.photo,
            "siteId":dataInput.siteId
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Attendance Check In  failed');
      }
  
      // Store the token securely
   
      // storeUserData(data.user)
  
      return { success: true, data: data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

// export default attendanceStatus,attendanceCheckIn,attendanceCheckOut};
export const workImagesPost = async (data) => {
  try {
    console.log(data)
    const token = await getToken()
    const response = await fetch(API.postWorkImages, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
          "images":data.images,
          "message":data.message
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


export const userAttendance = async (userId) => {
  try {
    const token = await getToken()
    const response = await fetch(API.userAttendance+userId, {
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
