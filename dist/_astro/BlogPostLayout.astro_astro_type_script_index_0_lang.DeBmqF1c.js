const t=document.querySelector("button.goback");t?.addEventListener("click",()=>{window.history.back()});const e=document.querySelector("button.copy");e?.addEventListener("click",()=>{navigator.clipboard.writeText(window.location.href)});const n=document.querySelector("button.tweet"),o="https://twitter.com/intent/tweet?text="+window.location.href;n?.addEventListener("click",()=>{window.open(o,"_blank")});