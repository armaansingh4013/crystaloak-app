import API from "../../api";
import { getToken } from "../../components/Storage";

export const fetchHoliday = async () => {

    try {
        const token = await getToken()
        const response = await fetch(API.holidays, {
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

export const createHoliday = async (shiftData) => {
    try {
        
        const token = await getToken()
        const response = await fetch(API.holidays, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },body: JSON.stringify ({
            name: shiftData.name,
            date: shiftData.date,
            description: shiftData.description
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

export const updateHoliday = async (holidayId, holidayData) => {
    try {
        const token = await getToken()
        console.log(holidayId)
        const response = await fetch(`${API.holidays}/${holidayId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },
          body: JSON.stringify({
            name: holidayData.name,
            date: holidayData.date,
            description: holidayData.description
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Update failed');
        }
    
        return { success: true, data: data };
      } catch (error) {
        console.error('Update error:', error);
        return { success: false, message: error.message };
      }
};

export const deleteHoliday = async (holidayId) => {
    try {
        const token = await getToken()
        const response = await fetch(`${API.holidays}/${holidayId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Delete failed');
        }
    
        return { success: true, data: data };
      } catch (error) {
        console.error('Delete error:', error);
        return { success: false, message: error.message };
      }
}; 