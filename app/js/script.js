// profile
async function getPlayerUUID(username) {
  const apiUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch player UUID for username '+username);
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function setProfileHead(name) {
  document.getElementById("userProfileHead").src = `https://visage.surgeplay.com/face/${await getPlayerUUID(name)}`
}

function addProfile(name) {
  // document.getElementById("profilePopup").innerHTML=`<a class="profile" id='profile${name}'>${name}</a>`+document.getElementById("profilePopup").innerHTML;
  let profiles = document.getElementsByClassName("profile");
  const profilePopup = document.getElementById("profilePopup");
  profilePopup.insertAdjacentHTML("afterbegin", `<a class="profile" id='profile${name}'>${name}</a>`);

  setTimeout(()=>{
    document.getElementById(`profile${name}`).onclick = () =>{
      console.log("Swapping profiles to "+name)
      window.switchProfile(name)
      setActiveProfile(name);
      setProfileHead(name);
    }
  },100)
  
    
  setActiveProfile(name);
  setProfileHead(name);
}

function setActiveProfile(name) {
  let profiles = document.getElementsByClassName("profile");
  // unselect all profiles
  for(profile of profiles) {
    if(profile.innerHTML==name) {
      profile.classList.add("selectedProfile");
    } else {
      profile.classList.remove("selectedProfile");
    }
  }
}
let profilePopupOpen = false;
window.addEventListener('load',()=>{
  document.getElementById(`close`).onclick = ()=>{
    window.close();
  }
  document.getElementById(`userProfileHead`).onclick = ()=>{
    profilePopupOpen = !profilePopupOpen;
    document.getElementById('profilePopup').style.visibility = profilePopupOpen?"visible":"hidden";
  }
  document.getElementById("addProfile").onclick = ()=>{
    window.open('https://login.live.com/oauth20_authorize.srf?'+
                'client_id=6a6bf548-5a82-41f5-9451-88b334cdc77f&'+
                'response_type=code&'+
                'scope=XboxLive.signin%20XboxLive.offline_access&'+
                'redirect_uri=http://localhost:50505&'+
                'prompt=select_account');
  }
  
  // launch 
  const start = document.getElementById('Start')
  start.onclick = () => {
    console.log('Starting MC');
    window.startMC()
  }
})

setTimeout(()=>{
  addProfile('eveeify')
  // window.open('https://login.live.com/oauth20_authorize.srf?'+
  //               'client_id=6a6bf548-5a82-41f5-9451-88b334cdc77f&'+
  //               'response_type=code&'+
  //               'scope=XboxLive.signin%20XboxLive.offline_access&'+
  //               'redirect_uri=http://localhost:50505&'+
  //               'prompt=select_account');
},100)
