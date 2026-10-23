/* ======================================================================
   SINGAPORE LAYER 00: Google Maps key, Street View fallback, world data
   This file is injected INSIDE the game's closure by build.py, just before
   the START block, so it can see and change PLACES, AREAS, HOME, CAST, etc.
   Every section is wrapped separately: if one fails, the rest still run
   and the game still starts.
   ====================================================================== */

/* ---- A. Google Maps key: never hard-coded; asked once and kept in this browser ---- */
try{
 const _loadMaps=loadMaps;
 loadMaps=function(key){
  let k=key||"";
  try{k=k||localStorage.getItem("sgw_maps_key")||""}catch(e){}
  if(!k){
   k=(window.prompt("Paste your Google Maps API key (Maps JavaScript API turned on). It is stored only in this browser.")||"").trim();
   if(k){try{localStorage.setItem("sgw_maps_key",k)}catch(e){}}
  }
  if(!k)return Promise.reject(new Error("A Google Maps key is needed to show Street View. Tap the button to try again."));
  return _loadMaps(k).catch(e=>{try{localStorage.removeItem("sgw_maps_key")}catch(_){}throw e});
 };
}catch(e){console.error("[SG] key layer failed",e)}

/* ---- B. Places have no stored Street View panorama IDs in Singapore yet:
        when a place has an empty pano id, look the panorama up by its door coordinates ---- */
try{
 const _showPano=showPano;
 showPano=function(id,heading,fallback){
  if(!id&&fallback){
   return jumpTo(fallback,heading,google.maps.StreetViewSource.GOOGLE,50).then(ok=>{
    if(!ok)return jumpTo(fallback,heading,google.maps.StreetViewSource.DEFAULT,200);
    return ok;
   });
  }
  return _showPano(id,heading,fallback);
 };
}catch(e){console.error("[SG] showPano layer failed",e)}

/* ---- C. World: hostel, places and areas (Chinatown, Marina Bay, Southern Ridges, Bugis).
        Coordinates are approximate and meant to be tuned in the browser.
        Internal ids (ximen, t101, xiangshan, jiantan) are kept on purpose so saves,
        scenes and the MRT code keep working; only what the player sees changes. ---- */
try{
 const SG_HOSTEL={lat:1.28362,lng:103.84398};
 HOME.room.pano="";HOME.room.lat=SG_HOSTEL.lat;HOME.room.lng=SG_HOSTEL.lng;HOME.room.head=0;
 HOME.corridor.pano="";HOME.corridor.lat=SG_HOSTEL.lat;HOME.corridor.lng=SG_HOSTEL.lng;HOME.corridor.head=90;

 const setPlace=(k,o)=>{
  const p=PLACES[k];if(!p){console.warn("[SG] no place",k);return}
  Object.assign(p,o,{pano:""});
  delete p.nightPano;delete p.nightHead;
 };
 setPlace("hostel",{cn:"牛车水旅舍",py:"Niúchēshuǐ Lǚshè",en:"Chinatown Shophouse Hostel",kind:"Your hostel",door:SG_HOSTEL,head:90,hours:[0,24],tag:"住"});
 setPlace("bakery",{cn:"亚坤咖椰吐司",py:"Yàkūn Kāyē Tǔsī",en:"Ya Kun Kaya Toast",kind:"Kopitiam",door:{lat:1.28375,lng:103.84895},head:90,hours:[7.5,17],tag:"咖"});
 setPlace("temple",{cn:"天福宫",py:"Tiānfú Gōng",en:"Thian Hock Keng Temple",kind:"Temple",door:{lat:1.28100,lng:103.84790},head:180,hours:[7.5,17],tag:"庙"});
 setPlace("tiger",{cn:"老虎堂",py:"Lǎohǔtáng",en:"Tiger Sugar",kind:"Bubble tea",door:{lat:1.28470,lng:103.84410},head:300,hours:[11,22],tag:"茶"});
 setPlace("aychung",{cn:"麦士威小贩中心",py:"Màishìwēi Xiǎofàn Zhōngxīn",en:"Maxwell Food Centre",kind:"Hawker centre",door:{lat:1.28044,lng:103.84472},head:200,hours:[7,21],tag:"贩"});
 setPlace("donki",{cn:"DONKI",py:"Donki",en:"Don Don Donki",kind:"Discount store",door:{lat:1.28870,lng:103.84620},head:135,hours:[10,24],tag:"买"});
 setPlace("toilet",{cn:"阿福煮炒",py:"Āfú Zhǔchǎo",en:"Ah Hock Zi Char",kind:"Zi char restaurant",door:{lat:1.28290,lng:103.84370},head:180,hours:[11.5,21.5],tag:"餐"});
 setPlace("station",{cn:"牛车水地铁站",py:"Niúchēshuǐ Dìtiě Zhàn",en:"Chinatown MRT Station",kind:"MRT",door:{lat:1.28455,lng:103.84385},head:315,hours:[5.5,24],tag:"地"});

 const setArea=(k,o)=>{if(!AREAS[k]){console.warn("[SG] no area",k);return}Object.assign(AREAS[k],o)};
 const NE="#9016b2",DT="#005ec4",CC="#fa9e0d";
 setArea("ximen",{cn:"牛车水",py:"Niúchēshuǐ",en:"Chinatown",ln:"NE",lc:NE,start:{lat:1.28385,lng:103.84425},head:70});
 setArea("t101",{cn:"滨海湾",py:"Bīnhǎiwān",en:"Marina Bay",ln:"DT",lc:DT,start:{lat:1.28345,lng:103.85935},head:20});
 setArea("xiangshan",{cn:"亨德森波浪桥",py:"Hēngdésēn Bōlàngqiáo",en:"Henderson Waves",ln:"CC",lc:CC,start:{lat:1.27455,lng:103.81935},head:300});
 setArea("jiantan",{cn:"武吉士",py:"Wǔjíshì",en:"Bugis",ln:"DT",lc:DT,start:{lat:1.30045,lng:103.85575},head:0});
}catch(e){console.error("[SG] world layer failed",e)}

/* ---- D. The Taipei MRT network is still in the game until the Singapore network
        (next update) replaces it, so the MRT map is switched off for now ---- */
try{
 openMRT=function(){toast("🚇 地铁 MRT: the Singapore network is coming in the next update.",3800)};
}catch(e){console.error("[SG] MRT stub failed",e)}
