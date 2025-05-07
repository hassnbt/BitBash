import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/jobs'; // Flask API URL

export const getJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    print(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    return [];
  }
};

export const deleteJob = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting job: ", error);
  }
};
