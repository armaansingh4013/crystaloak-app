
import API from "../api";
import {getToken} from "../components/Storage"

const uploadPhotos = async (formData) => {

const token = await getToken()
console.log('====================================');
console.log(formData);
console.log('====================================');
try{
const response = await fetch(API.uploadPhoto, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': '*/*',
        'Content-Type': 'multipart/form-data',
  },
  body: formData
});

const data = await response.json();



    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }


    return { success: true, data: data};
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, message: error.message };
  }
};

export default uploadPhotos;