let profile = null

if (!localStorage.profile){
  playoffline: false
}

document.getElementById('Java-login').onclick = (e) => {
    window.open(
      "https://login.live.com/oauth20_authorize.srf?" +
        "client_id=6a6bf548-5a82-41f5-9451-88b334cdc77f&" +
        "response_type=code&" +
        "scope=XboxLive.signin%20XboxLive.offline_access&" +
        "redirect_uri=http://localhost:50505&" +
        "prompt=select_account"
    );
}

