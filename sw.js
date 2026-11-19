const C='jugyo-v9';
const put=()=>caches.open(C).then(c=>c.add(new Request('./',{cache:'reload'})));
self.addEventListener('install',e=>{e.waitUntil(put().then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('jugyo-v')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?caches.match('./'):null)).then(r=>r||fetch(e.request)));
});
self.addEventListener('message',e=>{
 if(e.data!=='refresh'||!e.source)return;
 e.waitUntil(put().then(()=>e.source.postMessage('refreshed'),()=>e.source.postMessage('refresh-failed')));
});
