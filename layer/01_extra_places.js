/* ======================================================================
   SINGAPORE LAYER 01: the eight places the game adds later (7-Eleven, Din Tai Fung,
   observation deck, viewpoint, night-market stalls, breakfast shop, bookstore),
   plus clean-up of the Taipei "front" spots and reach distances.
   Coordinates are approximate starting points. Tune them in the browser:
   each place has a door (the shop) and the game looks up the nearest Street View
   panorama to it. If the sign is off-screen, nudge the door a few metres.
   ====================================================================== */

try{
 const setPlace=(k,o)=>{
  const p=PLACES[k];if(!p){console.warn("[SG] no place",k);return}
  Object.assign(p,o,{pano:""});
  delete p.nightPano;delete p.nightHead;
 };

 setPlace("seven",{cn:"7-ELEVEN 牛车水店",py:"Qī-Shíyī Niúchēshuǐ diàn",en:"7-Eleven (Chinatown)",kind:"Convenience store",door:{lat:1.28335,lng:103.84455},head:0,hours:[0,24],tag:"超"});
 setPlace("bfshop",{cn:"老街坊早餐店",py:"Lǎo jiēfang zǎocān diàn",en:"Neighbourhood breakfast stall",kind:"Breakfast stall",door:{lat:1.28365,lng:103.84330},head:90,tag:"早"});

 setPlace("dtf",{cn:"鼎泰丰 滨海湾店",py:"Dǐngtàifēng Bīnhǎiwān diàn",en:"Din Tai Fung (Marina Bay Sands)",kind:"Restaurant",door:{lat:1.28385,lng:103.85885},head:135,hours:[11,21],tag:"包"});
 setPlace("obs",{cn:"金沙空中花园观景台",py:"Jīnshā Kōngzhōng Huāyuán Guānjǐngtái",en:"SkyPark Observation Deck",kind:"Observatory",door:{lat:1.28345,lng:103.86065},head:90,hours:[10,21],tag:"高"});
 setPlace("eslite",{cn:"大众书局 滨海广场店",py:"Dàzhòng Shūjú Bīnhǎi Guǎngchǎng diàn",en:"Popular Bookstore (Marina Square)",kind:"Bookstore",door:{lat:1.29130,lng:103.85710},head:0,tag:"书"});

 setPlace("rocks",{cn:"亨德森波浪桥",py:"Hēngdésēn Bōlàngqiáo",en:"Henderson Waves",kind:"Viewpoint",door:{lat:1.27412,lng:103.81940},head:300,hours:[0,24],tag:"山"});

 setPlace("jipai",{cn:"武吉士街 炸鸡摊",py:"Wǔjíshì jiē zhájī tān",en:"Bugis Street fried chicken stall",kind:"Street food",door:{lat:1.30015,lng:103.85565},head:0,hours:[16,24],tag:"鸡"});
 setPlace("balloon",{cn:"射气球",py:"shè qìqiú",en:"Balloon game stall",kind:"Street game",door:{lat:1.30040,lng:103.85540},head:90,hours:[16,24],tag:"玩"});

 /* the second area is a ridge walk, not a bridge only */
 Object.assign(AREAS.xiangshan,{cn:"南部山脊",py:"Nánbù Shānjǐ",en:"Southern Ridges"});

 /* Taipei "front" spots are street positions facing a Taipei shop: drop them so the game
    walks you to the door itself, and use one reach distance everywhere */
 Object.values(PLACES).forEach(p=>{delete p.front;p.reach=24});
}catch(e){console.error("[SG] extra places layer failed",e)}
