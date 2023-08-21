import MagicString from "magic-string";
export function refactorStorege(s: MagicString) {
  const code = `import('web-localstorage-plus').then(mod=>{
        const storage = mod.useStorage();
        const initial = (key)=>{
            if(!window.__WEB_STORAGE_OFFLINE__){
                window.__WEB_STORAGE_OFFLINE__ = {};
            }
            if(!Array.isArray(window.__WEB_STORAGE_OFFLINE__[key])){
                window.__WEB_STORAGE_OFFLINE__[key] = []
            }
        }
        const pushOne = (key,data)=>{
            initial(key);
            const foundIndex = window.__WEB_STORAGE_OFFLINE__[key].find(v=>v.id === data.id && v.msg === data.msg)
            if(foundIndex===-1){
                window.__WEB_STORAGE_OFFLINE__[key].push(data)
            }else{
                window.__WEB_STORAGE_OFFLINE__[key].splice(foundIndex,1,data)
            }
            const lastIndex = window.__WEB_STORAGE_OFFLINE__[key].length - 1
            return window.__WEB_STORAGE_OFFLINE__[key][lastIndex]
        }
        const __onMessage = storage.onMessage
        const __postMessage = storage.postMessage
        storage.onMessage = function(...rest){
            const [msg,callback,id] = rest || [];
            const key = 'onmessages'
            initial(key)
            const last = pushOne(key,{
                id,
                msg
            })
            if(last){
                const post = (window.__WEB_STORAGE_OFFLINE__['postmessages'] || []).find(v=>v.msg === msg)
                last.payload = post.payload
            }
            __onMessage.call(storage,msg,callback,false);
        }
        storage.postMessage = function(...rest){
            const [msg,payload,id] = rest || [];
            const key = 'postmessages'
            initial(key)
            pushOne(key,{
                id,
                msg,
                payload
            })
            __postMessage.call(storage,msg,payload);
        }
        storage.online = function(id){
            const postmessages = (window.__WEB_STORAGE_OFFLINE__ || {}).onmessages || []
            const queue =  postmessages.filter(v=>v.id === id)
            if(queue.length){
                queue.forEach(v=>{
                    storage.postMessage(v.msg,v.payload,v.id)
                })
            }
        }
    })`;
  s.append(code);
}
