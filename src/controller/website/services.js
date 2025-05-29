import API from "../../api";
import { getToken } from "../../components/Storage";

export const addService = async (data) => {
  try {
    
    const token = await getToken()
    const response = await fetch(API.services, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
          "images":data.images,
          "name":data.name
      })
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Adding Services  failed');
    }


    return { success: true, data: res };
  } catch (error) {
    console.error('Service add error:', error);
    return { success: false, message: error.message };
  }
};

export const updateService = async (data) => {
  try {
    
    const token = await getToken()
    const response = await fetch(API.services+"/"+data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
          "addImages":data.addImages,
          "removeImages":data.removeImages,
          "name":data.name
      })
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Updating Service  failed');
    }


    return { success: true, data: res };
  } catch (error) {
    console.error('Service update error:', error);
    return { success: false, message: error.message };
  }
};


export const getService = async () => {
  try {
    const response = await fetch(API.services, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Fetching Services  failed');
    }


    return { success: true, data: res };
  } catch (error) {
    console.error('Service add error:', error);
    return { success: false, message: error.message };
  }
};
