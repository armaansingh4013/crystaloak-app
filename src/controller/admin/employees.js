import API from "../../api";
import { getToken } from "../../components/Storage";

export const getAllEmployees = async () => {
  try {
    const token = await getToken()
    const response = await fetch(API.employees, {
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


    return { success: true, data: data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};



export const updateEmployee = async (data) => {
    try {
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      const token = await getToken()
      const response = await fetch(API.employees+"/"+data.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+token
        },
        body:JSON.stringify(data)
      });
  
      const res = await response.json();
  
      if (!response.ok) {
        throw new Error(res.message || 'Fetching failed');
      }
  
 
  
      return { success: true, data: res };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };


export const resetEmployeePassword = async (data) => {
    try {
      const token = await getToken()
      const response = await fetch(API.employees+"/resetpassword/"+data.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+token
        }
      });
  
      const res = await response.json();
  
      if (!response.ok) {
        throw new Error(res.message || 'Fetching failed');
      }
  
 
  
      return { success: true, data: res };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };