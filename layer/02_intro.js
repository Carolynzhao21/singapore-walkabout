/* ======================================================================
   SINGAPORE LAYER 02: the opening film
   The Taipei film used Taipei photos and anime art. Until Singapore pictures exist
   (see ART TO MAKE in the repo notes) the film runs as words over the dark
   background, so no Taipei imagery shows. Pinyin for new lines is added to PYMAP,
   because the game looks pinyin up by the exact sentence.
   ====================================================================== */
try{
 const L=(i,o)=>{if(CINE_SHOTS[i])Object.assign(CINE_SHOTS[i],o)};
 L(0,{cn:"那年夏天，我一个人飞到了新加坡。",en:"That summer, I flew to Singapore on my own."});
 L(1,{cn:"口袋里有一点钱，还有一张易通卡，",en:"A little money in my pocket, an EZ-Link card,"});
 L(5,{cn:"欢迎光临！第一次来新加坡吗？",en:"Welcome! Is this your first time in Singapore?"});
 L(10,{cn:"我的狮城生活——",en:"My life in the Lion City—"});
 /* no Taipei pictures: drop every background photo and piece of key art */
 CINE_SHOTS.forEach(s=>{s.bg=null;delete s.art});

 Object.assign(PYMAP,{
  "那年夏天，我一个人飞到了新加坡。":"Nà nián xiàtiān, wǒ yí ge rén fēi dàole Xīnjiāpō.",
  "口袋里有一点钱，还有一张易通卡，":"Kǒudài lǐ yǒuyìdiǎn qián, háiyǒu yì zhāng Yìtōngkǎ,",
  "欢迎光临！第一次来新加坡吗？":"Huānyíngguānglín! Dìyīcì lái Xīnjiāpō ma?",
  "我的狮城生活——":"Wǒ de Shīchéng shēnghuó - -"
 });
}catch(e){console.error("[SG] intro layer failed",e)}
