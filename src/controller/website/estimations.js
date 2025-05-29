import API from "../../api";
import { getToken } from "../../components/Storage";

export const getEstimations = async () => {
  try {
    const token = await getToken()
    const response = await fetch(API.estimations, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,

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
