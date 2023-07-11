const https = require('https');
const config = ("")


function getModrinthModInfo(mod) {
  const url = `https://api.modrinth.com/v2/project/${mod}`;
  const headers = {
    Authorization: "your_authorization_token",
    "Content-Type": "application/json",
    "User-Agent": "your_user_agent",
  };
  const params =
    "id,description,body,published,updated,license,client_side,game_versions,icon_url,donation_url";

  const options = {
    method: "GET",
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          const responseData = JSON.parse(data);
          const filteredData = {};

          // Filter the data
          Object.keys(responseData).forEach((key) => {
            if (params.includes(key)) {
              filteredData[key] = responseData[key];
            }
          });

          resolve(filteredData);
        } else {
          reject(`Request failed with status code ${res.statusCode}`);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

module.exports = {
  getModrinthModInfo: getModrinthModInfo(mod)
};
