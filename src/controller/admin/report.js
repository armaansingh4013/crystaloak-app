import API from "../../api/index";
import { getToken } from "../../components/Storage";

export const getEnabledEmployees = async () => {
  try {
    const token = await getToken();
    
    const response = await fetch(API.enabledEmployees, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.message || "Failed to fetch enabled employees");
    }

    // Store the token securely
 
    // storeUserData(data.user)

    return { success: true, data: data };
  } catch (error) {
    console.error("Error in getEnabledEmployees:", error);
    return { success: false, message: error.message };
  }
};

export const getReport = async (data) => {
  try {
    const token = await getToken();
    const response = await fetch(API.report+`?employeeId=`+data.employeeId+`&startDate=`+data.startDate+`&endDate=`+data.endDate, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    });

    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message || "Fetching failed");
    }

    return { success: true, data: res };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: error.message };
  }
};

export const generatePDFReport = async (data) => {
  try {
    const token = await getToken();
    const response = await fetch(API.generatePDF, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate PDF");
    }

    // Get the PDF as base64 string
    const pdfBase64 = await response.text();
    return { success: true, data: pdfBase64 };
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return { success: false, message: error.message };
  }
};