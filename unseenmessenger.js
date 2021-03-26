
function getCookie(e) {
   const t = `; ${document.cookie}`,
      s = t.split(`; ${e}=`);
   if (2 === s.length) return s.pop().split(";").shift()
}

let sw_typing = !1;
c_user = getCookie("c_user");
ds_user_id = getCookie("ds_user_id");
is_messenger_site = !!window.location.href.startsWith("https://www.messenger.com/t");
let settings = {
   fb_unseen: true,
   fb_typing: true,
   mess_unseen: true,
   mess_typing: true
};
debug = true;

window.WebSocketProxy = new Proxy(window.WebSocket, {
   construct: function (e, t) {
      const s = new e(...t);
      var n = e => { };
      const i = e => {
         s.removeEventListener("open", n), s.removeEventListener("close", i)
      };
      return s.addEventListener("open", n), s.addEventListener("close", i), s.send = new Proxy(s.send, {
         apply: function (t, s, n) {
            console.log("1");
            let i = new Uint8Array(n[0]);
            if (!i || i.length < 100 || 1500 < i.length) return t.apply(s, n);
            var r = (new TextDecoder).decode(i);
            if (!((is_messenger_site ? settings.mess_typing : settings.fb_typing) && r.includes('"type":4') && r.includes('\\"label\\":\\"3\\"') && r.includes("is_typing"))) {
               if ((is_messenger_site ? settings.mess_unseen : settings.fb_unseen) && r.includes('"type":3') && r.includes('\\"label\\":\\"21\\"') && r.includes("last_read_watermark_ts")) try {
                  r = "", i.map(e => r += String.fromCharCode(e));
                  let e = r.replace(/\\\\\\"thread_id\\\\\\"\:[0-9]+,\\\\\\"last_read/g, `\\\\\\"thread_id\\\\\\":${c_user},\\\\\\"last_read`);
                  return n[0] = new Uint8Array(e.split("").map(e => e.charCodeAt(0))), void t.apply(s, n)
               } catch (e) {
                  return void t.apply(s, n)
               }
               return t.apply(s, n)
            }
         }
      }), s
   }
});
window.WebSocket = WebSocketProxy;
console.log("Script loaded"); 
