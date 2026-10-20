// Source of the script served at /script.js. It runs on third-party sites: no dependency, no storage,
// no cookie, and it must never throw or log on the host page. The only thing it ever writes to
// localStorage is the owner's opt-out flag, set by visiting the site once with ?no-track.
export const TRACKING_SCRIPT = `(function(){
try{
var d=document,w=window,n=navigator,s=d.currentScript;
if(!s||n.doNotTrack==="1"||n.webdriver)return;
try{
var o=new URLSearchParams(location.search).get("no-track"),ls=w.localStorage;
if(o!==null){if(o==="0")ls.removeItem("statly_ignore");else ls.setItem("statly_ignore","1")}
if(ls.getItem("statly_ignore"))return;
}catch(e){}
var key=s.getAttribute("data-key");
if(!key)return;
var endpoint=new URL("/api/p",s.src).href;
var id,url,ref=d.referrer,acc=0,shownAt=0;

function send(body){
  try{
    var data=JSON.stringify(body);
    if(n.sendBeacon&&n.sendBeacon(endpoint,new Blob([data],{type:"text/plain"})))return;
    fetch(endpoint,{method:"POST",body:data,keepalive:true,credentials:"omit",headers:{"Content-Type":"text/plain"}}).catch(function(){});
  }catch(e){}
}
function newId(){
  var a=new Uint8Array(12);
  w.crypto.getRandomValues(a);
  return btoa(String.fromCharCode.apply(null,a)).replace(/\\+/g,"-").replace(/\\//g,"_");
}
function elapsed(){return acc+(shownAt?Date.now()-shownAt:0)}
function report(){if(id)send({key:key,type:"duration",id:id,duration:elapsed()})}
function pageview(){
  try{
    var href=location.href;
    if(href===url)return;
    report();
    id=newId();
    url=href;
    acc=0;
    shownAt=d.visibilityState==="visible"?Date.now():0;
    send({key:key,type:"pageview",id:id,url:href,referrer:ref});
    ref=href;
  }catch(e){}
}

d.addEventListener("visibilitychange",function(){
  if(d.visibilityState==="hidden"){report();acc=elapsed();shownAt=0}
  else shownAt=Date.now();
});
var push=history.pushState;
history.pushState=function(){var r=push.apply(this,arguments);pageview();return r};
w.addEventListener("popstate",pageview);
pageview();
}catch(e){}
})();
`;
