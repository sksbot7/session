const axios = require("axios");
const token = ""; //get token from hastebin.com

async function create(data) {
  try {
    const config = {
      method: 'post',
      url: 'https://hastebin.com/documents',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ content: data })
    };

    const response = await axios(config);
    return { id: response.data.key };
  } catch (error) {
    console.error('Error in create:', error.message);
    throw error;
  }
}
async function get(key) {
  try {
    const config = {
      method: 'get',
      url: `https://hastebin.com/raw/${key}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error in get:', error.message);
    throw error;
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { create, get };
