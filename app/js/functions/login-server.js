const http = require('http')
const axios = require("axios");

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/?code=")) {
    const urlParams = new URLSearchParams(req.url.slice(2));
    const code = urlParams.get("code");
    console.log("Code:", code);
    let accessToken = await getAccessToken(code);
    let xboxToken = await xboxAuthenticate(accessToken);
    let xstsResponse = await getXSTSToken(xboxToken);
    let xstsToken = xstsResponse[0];
    let userHash = xstsResponse[1];
    getBearerToken(userHash, xstsToken);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(`
        <html>
          <head></head>
          <body>
          <h1>If you are seeing this, you have failed to login and something has been currupted if you experience this please summit a issue</h1>
          <h1>
            <script>
                window.onload = ()=>{window.close()}
            </script>
          </body>
        </html>
    `);
});

function getBearerToken(userhash, xstsToken) {
  const url =
    "https://api.minecraftservices.com/authentication/login_with_xbox";
  const body = {
    identityToken: `XBL3.0 x=${userhash};${xstsToken}`,
    ensureLegacyEnabled: true,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}

async function getXSTSToken(token) {
  const url = "https://xsts.auth.xboxlive.com/xsts/authorize";
  const body = {
    Properties: {
      SandboxId: "RETAIL",
      UserTokens: [token],
    },
    RelyingParty: "rp://api.minecraftservices.com/",
    TokenType: "JWT",
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };

  return await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      console.log("Got XSTS Token");
      return [data.Token, data.DisplayClaims.xui[0].uhs];
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}

async function getAccessToken(code) {
  const url = "https://login.live.com/oauth20_token.srf";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams();
  body.append("client_id", "6a6bf548-5a82-41f5-9451-88b334cdc77f");
  body.append("client_secret", "nwC8Q~rBtW.hFgXjPPSLRQeuuSd7dkWr4Vg-Sdve");
  body.append("code", code);
  body.append("grant_type", "authorization_code");
  body.append("redirect_uri", "http://localhost:50505");

  return await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Got Access Token");
      return data.access_token;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function xboxAuthenticate(authToken) {
  return await axios
    .post(
      "https://user.auth.xboxlive.com/user/authenticate",
      {
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: "d=" + authToken, // the token
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
    .then((json) => {
      console.log("Got XBOX Token");
      return json.data.Token;
    })
    .catch((e) => console.error("error", e));
}
 

function startJava(params) {
  server.listen(50505)
}

function stopJava(params) {
  server.close()
}
module.export = {
  
}