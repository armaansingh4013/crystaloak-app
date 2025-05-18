import API from "../../api";
import { getToken } from "../../components/Storage";

export const fetchShifts = async () => {

    try {
        const token = await getToken()
        const response = await fetch(API.shifts, {
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

export const createShift = async (shiftData) => {
    try {
        
        const token = await getToken()
        const response = await fetch(API.shifts, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },body: JSON.stringify ({
            name: shiftData.name,
            startTime: shiftData.startTime,
            endTime: shiftData.endTime,
            timeZone: shiftData.timeZone,
            description: shiftData.description,
            isDefault: shiftData.isDefault
          }),
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