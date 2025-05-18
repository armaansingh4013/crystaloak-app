import API from "../api";
import { getToken } from "../components/Storage";

export const getSites = async (userId) => {
  try {
    const token = await getToken()
    const response = await fetch(API.sites, {
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

export const getEnabledSites = async (userId) => {
  try {
    const token = await getToken()
    const response = await fetch(API.enabledSites, {
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

export const addSites = async (name) => {
  try {
    const token = await getToken()
    const response = await fetch(API.sites, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
        name:name, 
        address:"address", 
        location:[10,10],
         radius:10
      })
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

export const updateSites = async (data) => {
  try {
    const token = await getToken()
    const response = await fetch(API.sites+"/"+data.siteId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
        name:data.name, 
        address:"address", 
        location:[10,10],
         radius:10,
         isActive:data.enabled
      })
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || 'Fetching failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: res };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};






export const addSiteHoliday = async (data) => {
  try {
    const token = await getToken()
    const id = data.id
    const response = await fetch(API.sites+"/"+id+"/holidays", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
        date:data.date, 
        description:data.description, 
      
      })
    });

    const res = await response.json();
    
    if (!response.ok) {
      throw new Error(res.message || 'Fetching failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: res };
  } catch (error) {
    console.error('Site Holiday posting error:', error);
    return { success: false, message: error.message };
  }
};
export const updateSiteHoliday = async (data) => {
  try {
    const token = await getToken()
    const id = data.id
    const response = await fetch(API.sites+"/"+id+"/holidays", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify({
        date:data.date, 
        description:data.description, 
      
      })
    });

    const res = await response.json();
    
    if (!response.ok) {
      throw new Error(res.message || 'Updating failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: res };
  } catch (error) {
    console.error('Site Holiday updation error:', error);
    return { success: false, message: error.message };
  }
};

export const deleteSiteHoliday = async (data) => {
  try {
    const token = await getToken()
    const id = data.id
    const date = data.date
    const response = await fetch(API.sites+"/"+id+"/holidays/"+date, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      }
    });

    const res = await response.json();
    
    if (!response.ok) {
      throw new Error(res.message || 'Deletion failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: res };
  } catch (error) {
    console.error('Site Holiday Deletion error:', error);
    return { success: false, message: error.message };
  }
};

export const getSiteHoliday = async (siteId) => {
  try {
    const token = await getToken()
    const response = await fetch(API.sites+"/"+siteId+"/holidays", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      }
    });

    const res = await response.json();
    
    if (!response.ok) {
      throw new Error(res.message || 'Fetching failed');
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: res };
  } catch (error) {
    console.error('Site Holiday fetching error:', error);
    return { success: false, message: error.message };
  }
};