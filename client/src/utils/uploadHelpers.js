import axios from 'axios';

export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE}/api/products/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.path;
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error(error.response?.data?.msg || 'Upload failed');
  }
};

export const uploadImage = async (file, token) => {
  return uploadFile(file, token);
};

export const uploadModel = async (file, token) => {
  return uploadFile(file, token);
};
