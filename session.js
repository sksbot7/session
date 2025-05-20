const axios = require("axios");
const token = "28215b0a7206c1fd1446291c6f8bfb2368fbf5a3975f77feb933ff963eff9c4dcabc6bee7c04bf45cc32b1a821f65494930af7cd36e8c615445069b981830e06"; //get token from hastebin.com

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
