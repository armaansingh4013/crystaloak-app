import API from "../../api";

export const getInquiries = async () => {
  try {
    const response = await fetch(API.inquiry, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Fetching Inquiries  failed');
    }


    return { success: true, data: res };
  } catch (error) {
    console.error('Inquiries get  error:', error);
    return { success: false, message: error.message };
  }
};
