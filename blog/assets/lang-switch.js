/* Destiny Atelier blog — universal language switch
   Usage: include <script src="assets/lang-switch.js" defer></script>
   The script auto-injects a top-right EN/中文 toggle.
   Pages that have full Chinese content should add data-zh attributes on every translatable node.
   Pages without data-zh will show a banner "Chinese version coming soon" and link back to the index.
*/
(function(){
  function ready(fn){
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function getLang(){
    try {
      var saved = localStorage.getItem("da_lang");
      if (saved === "zh" || saved === "en") return saved;
    } catch(e){}
    if (navigator.language && navigator.language.indexOf("zh") === 0) return "zh";
    return "en";
  }

  function setLangPref(lang){
    try { localStorage.setItem("da_lang", lang); } catch(e){}
  }

  function applyLang(lang){
    var nodes = document.querySelectorAll("[data-en]");
    var hasFull = nodes.length > 6;
    for (var i=0; i<nodes.length; i++){
      var n = nodes[i];
      var v = n.getAttribute("data-" + lang);
      if (v != null) n.innerHTML = v; // innerHTML so embedded <strong>/<em> render correctly
    }
    document.documentElement.lang = (lang === "zh") ? "zh-CN" : "en";
    var en = document.getElementById("da-lang-en");
    var zh = document.getElementById("da-lang-zh");
    if (en) en.classList.toggle("active", lang === "en");
    if (zh) zh.classList.toggle("active", lang === "zh");

    var banner = document.getElementById("da-lang-banner");
    if (lang === "zh" && !hasFull){
      if (!banner){
        banner = document.createElement("div");
        banner.id = "da-lang-banner";
        banner.style.cssText = "background:rgba(200,168,78,0.08);border:1px solid rgba(200,168,78,0.25);border-radius:8px;padding:14px 18px;margin:0 0 28px;color:#c8a84e;font-size:0.9rem;text-align:center;line-height:1.7;";
        banner.innerHTML = '本文中文版即将上线。当前页面是英文原文。<br><a href="index.html" style="color:#c8a84e;text-decoration:underline;">← 返回博客主页（已支持中英切换）</a>';
        var article = document.querySelector("article") || document.querySelector(".container") || document.body;
        var first = article.querySelector("header") ? article.querySelector("header").nextElementSibling : article.firstElementChild;
        article.insertBefore(banner, first || article.firstChild);
      }
    } else if (banner) {
      banner.parentNode.removeChild(banner);
    }
  }

  function injectSwitcher(){
    if (document.getElementById("da-lang-switch")) return;
    var box = document.createElement("div");
    box.id = "da-lang-switch";
    box.style.cssText = "position:fixed;top:14px;right:14px;z-index:9999;font-family:Georgia,serif;font-size:0.78rem;letter-spacing:1px;background:rgba(15,15,15,0.92);backdrop-filter:blur(6px);border:1px solid rgba(200,168,78,0.2);border-radius:6px;padding:4px;display:flex;gap:2px;";
    box.innerHTML =
      '<button id="da-lang-en" type="button" style="background:none;border:none;color:#a89878;padding:5px 10px;cursor:pointer;border-radius:4px;font-family:inherit;font-size:inherit;letter-spacing:inherit;">EN</button>' +
      '<button id="da-lang-zh" type="button" style="background:none;border:none;color:#a89878;padding:5px 10px;cursor:pointer;border-radius:4px;font-family:inherit;font-size:inherit;letter-spacing:inherit;">中文</button>';
    document.body.appendChild(box);

    var style = document.createElement("style");
    style.textContent = "#da-lang-switch button.active{background:#c8a84e;color:#0f0f0f;} #da-lang-switch button:not(.active):hover{color:#c8a84e;}";
    document.head.appendChild(style);

    document.getElementById("da-lang-en").onclick = function(){ setLangPref("en"); applyLang("en"); };
    document.getElementById("da-lang-zh").onclick = function(){ setLangPref("zh"); applyLang("zh"); };
  }

  ready(function(){
    injectSwitcher();
    applyLang(getLang());
  });
})();
