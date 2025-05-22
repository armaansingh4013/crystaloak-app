import API from "../../api";
import { getToken } from "../../components/Storage";

export const resetEmployeePassword = async (data) => {
    try {
      const token = await getToken()
      const response = await get(API.payslip+data.id, {
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

export const getPaySlipData = async (employeeId, payType, startDate, endDate) => {
  try {
    const token = await getToken();
    const response = await fetch(
      `${API.payslip}${employeeId}?payType=${payType}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + token
        }
      }
    );

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Failed to fetch pay slip data');
    }

    return res;
  } catch (error) {
    console.error('Pay slip error:', error);
    throw error;
  }
};

export const updatePaySlipData = async (employeeId, data) => {
  try {
    const token = await getToken();
    const response = await fetch(`${API.payslip}${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      },
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Failed to update pay slip');
    }

    return res;
  } catch (error) {
    console.error('Pay slip update error:', error);
    throw error;
  }
};