import API from "../../api";

export const getFeedbacks = async () => {
  try {
    const response = await fetch(API.feedback, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Fetching Feedbacks  failed');
    }


    return { success: true, data: res };
  } catch (error) {
    console.error('Feedback get  error:', error);
    return { success: false, message: error.message };
  }
};


export const deleteFeedback = async (data) => {
  try {
    const response = await fetch(API.deleteFeedback+data, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || 'Deleting Feedback  failed');
    }


    return { success: true, data: res };
  } catch (error) {
    console.error('Feedback delete  error:', error);
    return { success: false, message: error.message };
  }
};
