export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(DASHBOARD_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    return new Response('Not Found', { status: 404 });
  }
};

const DASHBOARD_HTML = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#07060c">
<title>ColorX Daily Predictor</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Rajdhani:wght@500;600;700&family=Exo+2:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#07060c; --bg2:#0d0a16; --bg3:#120e1e;
  --card:rgba(22,17,36,.82); --card2:rgba(30,23,48,.72);
  --border:rgba(255,255,255,.08); --border2:rgba(255,255,255,.14);
  --text:#f2eefc; --muted:#9d93bd; --dim:#6f6790;
  --primary:#e0243c; --primary2:#ff4d63; --primary-dim:rgba(224,36,60,.16);
  --accent:#8b5cf6; --accent2:#a78bfa;
  --gold:#f6c453; --gold2:#ffe9a8; --gold-dim:rgba(246,196,83,.16);
  --win:#22d67f; --win-dim:rgba(34,214,127,.16);
  --loss:#ff3b52; --loss-dim:rgba(255,59,82,.16);
  --warn:#ff9f1c; --warn-dim:rgba(255,159,28,.16);
  --info:#38bdf8;
  --grad-primary:linear-gradient(135deg,var(--primary),var(--accent));
  --grad-gold:linear-gradient(135deg,#b8860b,var(--gold) 45%,var(--gold2));
  --sh-1:0 2px 10px rgba(0,0,0,.4);
  --sh-2:0 10px 34px rgba(0,0,0,.55);
  --sh-3:0 20px 60px rgba(0,0,0,.66);
  --ff-d:'Orbitron',ui-sans-serif,system-ui,sans-serif;
  --ff-t:'Exo 2','Rajdhani',ui-sans-serif,system-ui,sans-serif;
  --ff-b:'Rajdhani','Exo 2',ui-sans-serif,system-ui,sans-serif;
}
html,body{height:100%}
body{font-family:var(--ff-b);background:var(--bg);color:var(--text);overflow:hidden;position:fixed;inset:0;width:100%;-webkit-font-smoothing:antialiased}
button,input,select,textarea{font-family:inherit;color:inherit;border:none;background:none;outline:none}
button{cursor:pointer}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:99px}
.hidden{display:none!important}

.bg-stage{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:radial-gradient(120% 90% at 50% -10%,var(--bg3) 0%,var(--bg2) 42%,var(--bg) 100%)}
.bg-aurora{position:absolute;border-radius:50%;filter:blur(70px);opacity:.42;mix-blend-mode:screen}
.bg-aurora.a1{width:62vw;height:62vw;left:-18vw;top:-16vw;background:var(--primary);animation:drift1 21s ease-in-out infinite}
.bg-aurora.a2{width:54vw;height:54vw;right:-16vw;top:14vh;background:var(--accent);animation:drift2 26s ease-in-out infinite}
.bg-aurora.a3{width:48vw;height:48vw;left:14vw;bottom:-20vw;background:#0ea5e9;opacity:.26;animation:drift3 31s ease-in-out infinite}
@keyframes drift1{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(9vw,7vh,0) scale(1.16)}}
@keyframes drift2{0%,100%{transform:translate3d(0,0,0) scale(1.05)}50%{transform:translate3d(-8vw,11vh,0) scale(.9)}}
@keyframes drift3{0%,100%{transform:translate3d(0,0,0) scale(.95)}50%{transform:translate3d(7vw,-9vh,0) scale(1.2)}}
.bg-grid{position:absolute;inset:0;opacity:.16;background-image:linear-gradient(rgba(255,255,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.09) 1px,transparent 1px);background-size:46px 46px;-webkit-mask-image:radial-gradient(80% 62% at 50% 34%,#000 12%,transparent 78%);mask-image:radial-gradient(80% 62% at 50% 34%,#000 12%,transparent 78%)}
.bg-scan{position:absolute;inset:0;opacity:.05;background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(255,255,255,.5) 2px 3px)}
.bg-noise{position:absolute;inset:0;opacity:.035}

.app{position:relative;z-index:2;height:100%;width:100%;max-width:480px;margin:0 auto;display:flex;flex-direction:column;background:transparent;box-shadow:0 0 90px rgba(0,0,0,.7)}
@media(min-width:520px){.app{border-left:1px solid var(--border);border-right:1px solid var(--border)}}

.topbar{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:11px 13px 9px;background:linear-gradient(180deg,rgba(10,8,18,.94),rgba(10,8,18,.55));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border);position:relative;z-index:30}
.topbar::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,var(--primary),var(--accent),transparent);opacity:.65}
.tb-burger{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;gap:3.5px;background:var(--card);border:1px solid var(--border);transition:.22s}
.tb-burger span{display:block;width:15px;height:1.8px;border-radius:2px;background:var(--text);transition:.28s}
.tb-burger:active{transform:scale(.92);border-color:var(--primary)}
.tb-brand{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.tb-title{font-family:var(--ff-d);font-size:14.5px;font-weight:900;letter-spacing:.6px;line-height:1;background:linear-gradient(92deg,#fff 6%,var(--primary2) 42%,var(--gold) 74%,#fff 98%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shine 5.5s linear infinite;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@keyframes shine{to{background-position:220% 0}}
.tb-sub{font-family:var(--ff-t);font-size:8.4px;font-weight:700;letter-spacing:2.1px;color:var(--dim);text-transform:uppercase}
.tb-right{display:flex;align-items:center;gap:6px;flex:0 0 auto}
.lv-pill{font-family:var(--ff-d);font-size:8.2px;font-weight:800;letter-spacing:.9px;padding:4px 8px;border-radius:99px;border:1px solid var(--border2);background:var(--card);color:var(--muted);white-space:nowrap;transition:.35s}
.lv-pill.lv1{color:var(--win);border-color:rgba(34,214,127,.42);background:var(--win-dim);box-shadow:0 0 14px rgba(34,214,127,.22)}
.lv-pill.lv2{color:var(--warn);border-color:rgba(255,159,28,.5);background:var(--warn-dim);box-shadow:0 0 16px rgba(255,159,28,.3);animation:lvPulse 1.15s ease-in-out infinite}
.lv-pill.lv3{color:var(--gold);border-color:rgba(246,196,83,.5);background:var(--gold-dim);box-shadow:0 0 18px rgba(246,196,83,.34);animation:lvPulse .9s ease-in-out infinite}
@keyframes lvPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.72;transform:scale(1.045)}}
.vip-tag{font-family:var(--ff-d);font-size:8px;font-weight:900;letter-spacing:1.1px;padding:4px 7px;border-radius:7px;background:var(--grad-gold);color:#2a1c00;box-shadow:0 3px 12px rgba(246,196,83,.4)}

.stage{flex:1 1 auto;position:relative;overflow:hidden}
.view{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;padding:11px 12px calc(16px + env(safe-area-inset-bottom));opacity:0;visibility:hidden;transform:translateY(12px) scale(.988);transition:opacity .3s,transform .34s,visibility .3s;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.view.active{opacity:1;visibility:visible;transform:none}

.card{background:var(--card);border:1px solid var(--border);border-radius:20px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:var(--sh-2);position:relative;overflow:hidden}
.card+.card{margin-top:11px}
.card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(150deg,rgba(255,255,255,.07),transparent 42%)}
.card-hd{display:flex;align-items:center;gap:8px;padding:11px 13px 9px;border-bottom:1px solid var(--border)}
.card-hd .ic{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;flex:0 0 auto;background:var(--primary-dim);border:1px solid rgba(224,36,60,.3);color:var(--primary2)}
.card-hd .ic svg{width:13px;height:13px}
.card-hd .ttl{font-family:var(--ff-d);font-size:10px;font-weight:800;letter-spacing:1.5px;flex:1;min-width:0}
.card-hd .ttl small{display:block;font-family:var(--ff-t);font-size:8px;font-weight:600;letter-spacing:.9px;color:var(--dim);margin-top:2px}
.card-bd{padding:12px 13px}
.chip{display:inline-flex;align-items:center;gap:5px;font-family:var(--ff-t);font-size:8.6px;font-weight:800;letter-spacing:1px;padding:3.5px 8px;border-radius:99px;background:rgba(255,255,255,.055);border:1px solid var(--border);color:var(--muted);white-space:nowrap}
.chip svg{width:10px;height:10px}
.chip.on{color:var(--win);border-color:rgba(34,214,127,.4);background:var(--win-dim)}
.dot{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 8px currentColor}
.dot.live{animation:blink 1.35s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.28}}

.period-strip{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:14px;background:linear-gradient(120deg,rgba(224,36,60,.11),rgba(139,92,246,.11));border:1px solid var(--border2);margin-bottom:11px;position:relative;overflow:hidden}
.period-strip::after{content:'';position:absolute;top:0;left:-40%;width:34%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.11),transparent);animation:sweepX 3.6s ease-in-out infinite}
@keyframes sweepX{0%{left:-40%}60%,100%{left:120%}}
.ps-lbl{font-family:var(--ff-t);font-size:8px;font-weight:800;letter-spacing:1.7px;color:var(--dim)}
.ps-val{font-family:var(--ff-d);font-size:15px;font-weight:800;letter-spacing:1.1px;color:#fff;line-height:1.15;margin-top:2px;text-shadow:0 0 16px rgba(255,255,255,.28)}
.ps-grow{flex:1;min-width:0}
.icon-btn{width:29px;height:29px;border-radius:9px;display:grid;place-items:center;flex:0 0 auto;background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--muted);transition:.2s}
.icon-btn svg{width:13px;height:13px}
.icon-btn:active{transform:scale(.9);color:var(--primary2);border-color:var(--primary)}
.api-badge{font-family:var(--ff-t);font-size:8.4px;font-weight:800;letter-spacing:1.1px;padding:4px 9px;border-radius:99px;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--dim)}
.api-badge.ok{color:var(--win);border-color:rgba(34,214,127,.42);background:var(--win-dim)}
.api-badge.err{color:var(--loss);border-color:rgba(255,59,82,.42);background:var(--loss-dim)}

.orb-zone{display:flex;flex-direction:column;align-items:center;padding:6px 0 2px}
.orb-shell{position:relative;width:214px;height:214px;display:grid;place-items:center}
.orb-ring{position:absolute;inset:0;transform:rotate(-90deg)}
.orb-ring circle{fill:none;stroke-width:7;stroke-linecap:round}
.orb-ring .rbg{stroke:rgba(255,255,255,.07)}
.orb-ring .rfg{stroke:url(#orbGrad);filter:drop-shadow(0 0 8px var(--primary));transition:stroke-dashoffset .5s cubic-bezier(.4,0,.2,1)}
.orb-ticks{position:absolute;inset:6px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.16) 0deg .7deg,transparent .7deg 6deg);-webkit-mask:radial-gradient(circle,transparent 88%,#000 89%);mask:radial-gradient(circle,transparent 88%,#000 89%);animation:spin 44s linear infinite;opacity:.75}
.orb-ticks.inner{inset:20px;animation-duration:28s;animation-direction:reverse;opacity:.4;background:repeating-conic-gradient(from 0deg,var(--primary2) 0deg .9deg,transparent .9deg 9deg)}
@keyframes spin{to{transform:rotate(360deg)}}
.orb-sweep{position:absolute;inset:14px;border-radius:50%;overflow:hidden;opacity:.5}
.orb-sweep::before{content:'';position:absolute;inset:0;background:conic-gradient(from 0deg,transparent 0deg,transparent 285deg,var(--primary) 350deg,transparent 360deg);animation:spin 3.1s linear infinite;-webkit-mask:radial-gradient(circle,transparent 62%,#000 63%);mask:radial-gradient(circle,transparent 62%,#000 63%)}
.orb-core{position:relative;width:146px;height:146px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center;padding:8px;background:radial-gradient(circle at 34% 26%,rgba(255,255,255,.16),transparent 46%),radial-gradient(circle at 50% 120%,var(--primary-dim),transparent 62%),linear-gradient(150deg,var(--bg3),#0a0812);border:1px solid var(--border2);box-shadow:inset 0 0 34px rgba(0,0,0,.72),0 0 44px var(--primary-dim),var(--sh-2);transition:box-shadow .4s,border-color .4s}
.oc-lbl{font-family:var(--ff-t);font-size:7.6px;font-weight:800;letter-spacing:2.1px;color:var(--dim);text-transform:uppercase}
.oc-pred{font-family:var(--ff-d);font-size:25px;font-weight:900;letter-spacing:1.4px;line-height:1.05;margin:3px 0 1px;color:#fff;text-shadow:0 0 24px currentColor;transition:color .3s}
.oc-pred.big{color:var(--gold)} .oc-pred.small{color:var(--info)}
.oc-pred.skip{color:var(--warn);font-size:19px}
.oc-num{font-family:var(--ff-d);font-size:11.5px;font-weight:800;letter-spacing:2.4px;color:var(--muted);min-height:15px}
.oc-step{font-family:var(--ff-t);font-size:8px;font-weight:800;letter-spacing:1.5px;color:var(--primary2);margin-top:3px;padding:2.5px 9px;border-radius:99px;background:var(--primary-dim);border:1px solid rgba(224,36,60,.34)}
.orb-timer{position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);font-family:var(--ff-d);font-size:19px;font-weight:900;letter-spacing:1px;color:#fff;padding:3px 15px;border-radius:99px;background:rgba(8,6,14,.94);border:1px solid var(--border2);box-shadow:0 6px 22px rgba(0,0,0,.66);z-index:4}
.orb-timer.urgent{color:var(--loss);border-color:rgba(255,59,82,.55);animation:lvPulse .55s ease-in-out infinite}
.orb-timer small{font-size:9px;opacity:.6;margin-left:1px}
.orb-side{position:absolute;display:flex;flex-direction:column;align-items:center;gap:1px;padding:5px 9px;border-radius:11px;background:rgba(10,8,18,.9);border:1px solid var(--border2);box-shadow:var(--sh-1)}
.orb-side .k{font-family:var(--ff-t);font-size:6.8px;font-weight:800;letter-spacing:1.4px;color:var(--dim)}
.orb-side .v{font-family:var(--ff-d);font-size:11px;font-weight:800;color:#fff}
.orb-side.l{left:-9px;top:38%} .orb-side.r{right:-9px;top:38%}

.ribbon{display:none;align-items:center;justify-content:center;gap:7px;margin:12px 0 2px;padding:7px 14px;border-radius:99px;font-family:var(--ff-d);font-size:9.2px;font-weight:800;letter-spacing:1.3px;background:linear-gradient(120deg,rgba(34,214,127,.2),rgba(246,196,83,.2));border:1px solid rgba(34,214,127,.42);color:var(--win);box-shadow:0 0 22px rgba(34,214,127,.24);animation:ribbonIn .5s cubic-bezier(.2,1.5,.4,1)}
.ribbon.show{display:flex}
.ribbon svg{width:12px;height:12px}
@keyframes ribbonIn{from{opacity:0;transform:translateY(-9px) scale(.9)}to{opacity:1;transform:none}}

.seg{display:flex;gap:6px;padding:3.5px;border-radius:13px;background:rgba(0,0,0,.34);border:1px solid var(--border)}
.seg button{flex:1;padding:8px 4px;border-radius:10px;font-family:var(--ff-d);font-size:9px;font-weight:800;letter-spacing:.9px;color:var(--muted);display:flex;align-items:center;justify-content:center;gap:5px;transition:.24s;border:1px solid transparent}
.seg button svg{width:12px;height:12px}
.seg button.on{color:#fff;background:var(--grad-primary);border-color:transparent;box-shadow:0 5px 18px rgba(224,36,60,.4)}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px 14px;border-radius:14px;font-family:var(--ff-d);font-size:10.5px;font-weight:800;letter-spacing:1.3px;transition:.24s;position:relative;overflow:hidden;border:1px solid var(--border2);background:var(--card2);color:var(--text)}
.btn svg{width:14px;height:14px}
.btn:active{transform:scale(.975)}
.btn:disabled{opacity:.42;pointer-events:none}
.btn-primary{background:var(--grad-primary);border-color:transparent;color:#fff;box-shadow:0 8px 26px rgba(224,36,60,.4)}
.btn-primary::after{content:'';position:absolute;top:0;left:-60%;width:44%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:skewX(-20deg);animation:sweepX 3.2s ease-in-out infinite}
.btn-gold{background:var(--grad-gold);border-color:transparent;color:#2a1c00;box-shadow:0 8px 26px rgba(246,196,83,.36)}
.btn-stop{background:linear-gradient(135deg,rgba(255,59,82,.2),rgba(255,59,82,.1));border-color:rgba(255,59,82,.44);color:#ffb3bd}
.btn-stop.on{background:linear-gradient(135deg,#ff3b52,#c81e33);color:#fff;box-shadow:0 8px 26px rgba(255,59,82,.44)}
.btn-ghost{background:rgba(255,255,255,.05);color:var(--muted)}
.btn-sm{padding:8px 12px;font-size:9px;width:auto;border-radius:10px}

.pred-hero{display:flex;flex-direction:column;align-items:center;gap:9px;padding:14px 12px 4px;text-align:center}
.pred-size{font-family:var(--ff-d);font-size:34px;font-weight:900;letter-spacing:3px;line-height:1;background:linear-gradient(180deg,#fff,var(--muted));-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 18px rgba(255,255,255,.16))}
.pred-size.big{background:linear-gradient(180deg,var(--gold2),var(--gold) 55%,#a9761a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(246,196,83,.42))}
.pred-size.small{background:linear-gradient(180deg,#bfe9ff,var(--info) 55%,#0b6ea3);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 22px rgba(56,189,248,.42))}
.pred-size.pop{animation:popIn .5s cubic-bezier(.2,1.6,.4,1)}
@keyframes popIn{0%{transform:scale(.72);opacity:0}60%{transform:scale(1.07)}100%{transform:scale(1);opacity:1}}
.lv-badge{font-family:var(--ff-d);font-size:8.6px;font-weight:800;letter-spacing:1.5px;padding:4.5px 12px;border-radius:99px;border:1px solid rgba(34,214,127,.42);background:var(--win-dim);color:var(--win);transition:.35s}
.dbl-badge{display:none;font-family:var(--ff-d);font-size:8.4px;font-weight:900;letter-spacing:2px;padding:4px 12px;border-radius:99px;background:var(--grad-gold);color:#2a1c00;box-shadow:0 0 22px rgba(246,196,83,.5);animation:dblBeat .95s ease-in-out infinite}
.dbl-badge.show{display:inline-block}
@keyframes dblBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.075)}}

.num-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 13px}
.num-card{position:relative;border-radius:14px;padding:11px 8px 10px;text-align:center;overflow:hidden;border:1px solid var(--border2);background:linear-gradient(160deg,rgba(255,255,255,.06),rgba(255,255,255,.015));transition:.3s}
.num-card .tag{font-family:var(--ff-t);font-size:7.4px;font-weight:800;letter-spacing:1.9px;color:var(--dim);margin-bottom:7px}
.num-card.main{border-color:rgba(246,196,83,.4);box-shadow:0 0 26px rgba(246,196,83,.15),inset 0 0 26px rgba(246,196,83,.07)}
.num-card.main .tag{color:var(--gold)}
.num-card.opp{border-color:rgba(139,92,246,.36);box-shadow:0 0 22px rgba(139,92,246,.13)}
.num-card.opp .tag{color:var(--accent2)}
.num-tile{width:62px;height:62px;margin:0 auto;border-radius:16px;display:grid;place-items:center;position:relative;font-family:var(--ff-d);font-size:29px;font-weight:900;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6);box-shadow:0 9px 26px rgba(0,0,0,.5),inset 0 2px 0 rgba(255,255,255,.3),inset 0 -4px 12px rgba(0,0,0,.36);transition:transform .35s cubic-bezier(.2,1.5,.4,1)}
.num-tile.flip{animation:tileFlip .62s cubic-bezier(.3,1.3,.4,1)}
@keyframes tileFlip{0%{transform:rotateY(0) scale(1)}50%{transform:rotateY(90deg) scale(.84)}100%{transform:rotateY(0) scale(1)}}
.num-tile::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(150deg,rgba(255,255,255,.34),transparent 46%);pointer-events:none}
.num-tile.t-red{background:linear-gradient(145deg,#ff4d5f,#a30d1e)}
.num-tile.t-green{background:linear-gradient(145deg,#2ee08a,#056b3c)}
.num-tile.t-violet{background:linear-gradient(145deg,#b57bff,#4c1d95)}
.num-tile.t-redvio{background:linear-gradient(120deg,#ff4d5f 0 49%,#8b5cf6 51% 100%)}
.num-tile.t-greenvio{background:linear-gradient(120deg,#2ee08a 0 49%,#8b5cf6 51% 100%)}
.num-meta{margin-top:7px;font-family:var(--ff-t);font-size:8px;font-weight:700;letter-spacing:1.1px;color:var(--dim)}

.conf-block{padding:2px 13px 13px}
.conf-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.conf-top .k{font-family:var(--ff-t);font-size:8.4px;font-weight:800;letter-spacing:1.7px;color:var(--dim)}
.conf-top .v{font-family:var(--ff-d);font-size:15px;font-weight:900;color:#fff}
.rail{height:8px;border-radius:99px;background:rgba(0,0,0,.44);border:1px solid var(--border);overflow:hidden;position:relative}
.rail .fill{height:100%;width:0%;border-radius:99px;transition:width .75s cubic-bezier(.3,1,.4,1);background:linear-gradient(90deg,var(--loss),var(--warn) 42%,var(--win) 78%,var(--gold));position:relative}
.rail .fill::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:railShine 2.1s linear infinite}
@keyframes railShine{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.rail-ticks{display:flex;justify-content:space-between;margin-top:4px;font-family:var(--ff-t);font-size:6.8px;font-weight:700;color:var(--dim);letter-spacing:.6px}
.sig-bars{display:flex;align-items:flex-end;gap:2.5px;height:15px}
.sig-bars i{width:3.5px;border-radius:2px;background:rgba(255,255,255,.14);transition:.4s;height:24%}
.sig-bars i.on{background:var(--win);box-shadow:0 0 7px var(--win)}
.sig-bars i:nth-child(2){height:42%}.sig-bars i:nth-child(3){height:60%}.sig-bars i:nth-child(4){height:79%}.sig-bars i:nth-child(5){height:100%}

.strat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;padding:0 13px 13px}
.strat{position:relative;padding:9px 4px 8px;border-radius:13px;text-align:center;overflow:hidden;background:rgba(255,255,255,.045);border:1px solid var(--border);transition:.26s}
.strat .sic{width:26px;height:26px;margin:0 auto 5px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,.07);color:var(--muted);transition:.26s}
.strat .sic svg{width:14px;height:14px}
.strat .snm{font-family:var(--ff-d);font-size:7.4px;font-weight:800;letter-spacing:.7px;color:var(--muted);transition:.26s}
.strat.on{background:linear-gradient(155deg,var(--primary-dim),rgba(139,92,246,.16));border-color:var(--primary);box-shadow:0 6px 20px rgba(224,36,60,.26)}
.strat.on .sic{background:var(--grad-primary);color:#fff;box-shadow:0 4px 14px rgba(224,36,60,.45)}
.strat.on .snm{color:#fff}

.meta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:0 13px 13px}
.meta-cell{padding:8px 6px;border-radius:11px;text-align:center;background:rgba(255,255,255,.04);border:1px solid var(--border)}
.meta-cell .k{font-family:var(--ff-t);font-size:6.9px;font-weight:800;letter-spacing:1.3px;color:var(--dim)}
.meta-cell .v{font-family:var(--ff-d);font-size:11.5px;font-weight:800;color:#fff;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.meta-cell .v.acc{color:var(--win)}

.layers{display:flex;flex-direction:column;gap:6px}
.layer{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:11px;background:rgba(255,255,255,.035);border:1px solid var(--border)}
.layer .ln{font-family:var(--ff-d);font-size:8px;font-weight:800;letter-spacing:1px;width:62px;flex:0 0 auto;color:var(--muted)}
.layer .lb{flex:1;height:5px;border-radius:99px;background:rgba(0,0,0,.42);overflow:hidden}
.layer .lb i{display:block;height:100%;border-radius:99px;transition:width .6s cubic-bezier(.3,1,.4,1)}
.layer .lb i.b{background:linear-gradient(90deg,var(--gold),#ffe9a8)}
.layer .lb i.s{background:linear-gradient(90deg,var(--info),#bfe9ff)}
.layer .lv{font-family:var(--ff-d);font-size:8.4px;font-weight:800;width:34px;text-align:right;flex:0 0 auto}
.layer .lv.b{color:var(--gold)} .layer .lv.s{color:var(--info)}

.trail{display:flex;align-items:center;gap:5px;padding:9px 11px;border-radius:13px;background:rgba(0,0,0,.3);border:1px solid var(--border);margin-bottom:10px;overflow:hidden}
.trail .tl{font-family:var(--ff-t);font-size:7.4px;font-weight:800;letter-spacing:1.3px;color:var(--dim);flex:0 0 auto}
.trail .dots{display:flex;gap:3.5px;flex:1;min-width:0;overflow:hidden;justify-content:flex-end}
.trail .dots i{width:8px;height:8px;border-radius:3px;background:rgba(255,255,255,.1);flex:0 0 auto}
.trail .dots i.w{background:var(--win);box-shadow:0 0 7px rgba(34,214,127,.65)}
.trail .dots i.l{background:var(--loss);box-shadow:0 0 7px rgba(255,59,82,.6)}
.trail .dots i.j{background:var(--gold);box-shadow:0 0 9px rgba(246,196,83,.8)}
.trail .rt{font-family:var(--ff-d);font-size:9.5px;font-weight:800;color:var(--win);flex:0 0 auto}

.sum-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:11px}
.sum-cell{padding:9px 5px;border-radius:13px;text-align:center;background:rgba(255,255,255,.04);border:1px solid var(--border)}
.sum-cell .k{font-family:var(--ff-t);font-size:6.9px;font-weight:800;letter-spacing:1.2px;color:var(--dim)}
.sum-cell .v{font-family:var(--ff-d);font-size:15px;font-weight:900;margin-top:3px;color:#fff}
.sum-cell.w .v{color:var(--win)} .sum-cell.l .v{color:var(--loss)}
.sum-cell.a .v{color:var(--info)} .sum-cell.b .v{color:var(--gold)}

.hist-item{display:flex;gap:10px;padding:10px;border-radius:14px;margin-bottom:8px;background:rgba(255,255,255,.038);border:1px solid var(--border);border-left:3px solid var(--dim);animation:slideIn .34s cubic-bezier(.2,1,.3,1)}
@keyframes slideIn{from{opacity:0;transform:translateX(-13px)}to{opacity:1;transform:none}}
.hist-item.win{border-left-color:var(--win);background:linear-gradient(100deg,var(--win-dim),rgba(255,255,255,.03))}
.hist-item.loss{border-left-color:var(--loss);background:linear-gradient(100deg,var(--loss-dim),rgba(255,255,255,.03))}
.hi-badge{width:34px;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:3px}
.hi-ic{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:#fff}
.hi-ic svg{width:14px;height:14px}
.hi-ic.w{background:linear-gradient(140deg,#2ee08a,#0d8a4e);box-shadow:0 4px 14px rgba(34,214,127,.4)}
.hi-ic.l{background:linear-gradient(140deg,#ff5a6d,#a3121f);box-shadow:0 4px 14px rgba(255,59,82,.4)}
.hi-lbl{font-family:var(--ff-d);font-size:6.4px;font-weight:800;letter-spacing:.6px;color:var(--dim)}
.hi-body{flex:1;min-width:0}
.hi-top{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:5px}
.hi-per{font-family:var(--ff-d);font-size:9.4px;font-weight:800;color:#fff;letter-spacing:.6px}
.hi-vs{display:flex;align-items:center;gap:7px}
.hi-side{flex:1;min-width:0}
.hi-side .k{font-family:var(--ff-t);font-size:6.6px;font-weight:800;letter-spacing:1.1px;color:var(--dim)}
.hi-side .v{display:flex;align-items:center;gap:5px;margin-top:2px}
.hi-side .v b{font-family:var(--ff-d);font-size:10.5px;font-weight:800;letter-spacing:.5px}
.numb{min-width:19px;height:19px;padding:0 5px;border-radius:6px;display:grid;place-items:center;font-family:var(--ff-d);font-size:9.5px;font-weight:900;color:#fff}
.empty{padding:34px 16px;text-align:center;color:var(--dim)}
.empty svg{width:34px;height:34px;opacity:.32;margin-bottom:9px}
.empty .t{font-family:var(--ff-d);font-size:10px;font-weight:800;letter-spacing:1.3px;margin-bottom:5px;color:var(--muted)}
.empty .s{font-family:var(--ff-t);font-size:9.4px;line-height:1.5}

.stat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}
.stat-card{padding:13px 11px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid var(--border);position:relative;overflow:hidden;transition:.28s}
.stat-card .sic{width:29px;height:29px;border-radius:10px;display:grid;place-items:center;margin-bottom:8px;background:rgba(255,255,255,.07);color:var(--muted)}
.stat-card .sic svg{width:15px;height:15px}
.stat-card .sv{font-family:var(--ff-d);font-size:21px;font-weight:900;line-height:1;color:#fff}
.stat-card .sk{font-family:var(--ff-t);font-size:7.6px;font-weight:800;letter-spacing:1.4px;color:var(--dim);margin-top:5px}
.stat-card.w .sic{background:var(--win-dim);color:var(--win)} .stat-card.w .sv{color:var(--win)}
.stat-card.l .sic{background:var(--loss-dim);color:var(--loss)} .stat-card.l .sv{color:var(--loss)}
.stat-card.j .sic{background:var(--gold-dim);color:var(--gold)} .stat-card.j .sv{color:var(--gold)}
.stat-card.a .sic{background:rgba(56,189,248,.15);color:var(--info)} .stat-card.a .sv{color:var(--info)}

.best-card{margin-top:11px;padding:15px;border-radius:14px;text-align:center;position:relative;overflow:hidden;background:linear-gradient(135deg,rgba(246,196,83,.15),rgba(224,36,60,.11));border:1px solid rgba(246,196,83,.36)}
.best-card .k{font-family:var(--ff-t);font-size:8.2px;font-weight:800;letter-spacing:2.1px;color:var(--gold);display:flex;align-items:center;justify-content:center;gap:6px}
.best-card .k svg{width:12px;height:12px}
.best-card .v{font-family:var(--ff-d);font-size:38px;font-weight:900;line-height:1;margin-top:6px;background:var(--grad-gold);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 18px rgba(246,196,83,.4))}

.prof-hero{display:flex;align-items:center;gap:12px;padding:14px 13px}
.avatar{width:56px;height:56px;border-radius:18px;display:grid;place-items:center;flex:0 0 auto;position:relative;background:var(--grad-primary);box-shadow:0 10px 30px rgba(224,36,60,.4);overflow:hidden}
.avatar::after{content:'';position:absolute;inset:0;background:linear-gradient(150deg,rgba(255,255,255,.34),transparent 52%)}
.avatar svg{width:28px;height:28px;color:#fff;position:relative;z-index:2}
.prof-name{font-family:var(--ff-d);font-size:14px;font-weight:900;letter-spacing:.7px}
.prof-rank{font-family:var(--ff-t);font-size:8.4px;font-weight:800;letter-spacing:1.5px;color:var(--gold);margin-top:4px;display:flex;align-items:center;gap:5px}
.sec-title{font-family:var(--ff-d);font-size:9px;font-weight:800;letter-spacing:1.7px;color:var(--muted);margin:15px 2px 8px;display:flex;align-items:center;gap:7px}
.sec-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--border),transparent)}

.menu-item{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:13px;margin-bottom:7px;background:rgba(255,255,255,.038);border:1px solid var(--border);transition:.22s}
.menu-item:active{transform:scale(.985);background:rgba(255,255,255,.07)}
.menu-item .mic{width:29px;height:29px;border-radius:10px;display:grid;place-items:center;flex:0 0 auto;background:rgba(255,255,255,.06);color:var(--muted)}
.menu-item .mic svg{width:14px;height:14px}
.menu-item .mt{flex:1;min-width:0;font-family:var(--ff-t);font-size:11px;font-weight:700;letter-spacing:.35px}
.menu-item .mt small{display:block;font-size:8.4px;font-weight:600;color:var(--dim);margin-top:2px;letter-spacing:.2px}
.menu-item .arr{color:var(--dim)}
.menu-item .arr svg{width:12px;height:12px}

.num-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}
.ball{aspect-ratio:1;border-radius:13px;display:grid;place-items:center;position:relative;font-family:var(--ff-d);font-size:16px;font-weight:900;color:#fff;border:2px solid transparent;transition:.24s cubic-bezier(.2,1.4,.4,1);box-shadow:0 5px 16px rgba(0,0,0,.42),inset 0 2px 0 rgba(255,255,255,.26)}
.ball::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(150deg,rgba(255,255,255,.3),transparent 48%)}
.ball.b-red{background:linear-gradient(145deg,#ff4d5f,#a30d1e)}
.ball.b-green{background:linear-gradient(145deg,#2ee08a,#056b3c)}
.ball.b-violet{background:linear-gradient(145deg,#b57bff,#4c1d95)}
.ball.b-redvio{background:linear-gradient(120deg,#ff4d5f 0 49%,#8b5cf6 51% 100%)}
.ball.b-greenvio{background:linear-gradient(120deg,#2ee08a 0 49%,#8b5cf6 51% 100%)}
.ball.on{border-color:#fff;transform:scale(1.09);box-shadow:0 0 0 3px var(--gold),0 10px 28px rgba(0,0,0,.55)}
.size-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.size-btn{padding:13px;border-radius:13px;font-family:var(--ff-d);font-size:12px;font-weight:900;letter-spacing:2px;background:rgba(255,255,255,.05);border:1px solid var(--border2);color:var(--muted);transition:.24s}
.size-btn.on.big{background:linear-gradient(135deg,var(--gold),#a9761a);color:#2a1c00;border-color:transparent;box-shadow:0 8px 24px rgba(246,196,83,.4)}
.size-btn.on.small{background:linear-gradient(135deg,var(--info),#0b6ea3);color:#03222f;border-color:transparent;box-shadow:0 8px 24px rgba(56,189,248,.4)}
.tog-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid var(--border);margin-bottom:11px}
.tog-row .tt{font-family:var(--ff-t);font-size:10px;font-weight:700}
.tog-row .tt small{display:block;font-size:8.2px;color:var(--dim);margin-top:2px}
.switch{width:40px;height:22px;border-radius:99px;background:rgba(0,0,0,.5);border:1px solid var(--border2);position:relative;flex:0 0 auto;transition:.28s}
.switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--muted);transition:.28s cubic-bezier(.3,1.4,.5,1)}
.switch.on{background:var(--grad-primary);border-color:transparent}
.switch.on::after{left:20px;background:#fff}

.botnav{flex:0 0 auto;display:flex;align-items:center;gap:2px;padding:7px 8px calc(7px + env(safe-area-inset-bottom));background:linear-gradient(0deg,rgba(8,6,14,.98),rgba(8,6,14,.8));backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid var(--border);position:relative;z-index:30}
.botnav::before{content:'';position:absolute;left:0;right:0;top:-1px;height:1px;background:linear-gradient(90deg,transparent,var(--accent),var(--primary),transparent);opacity:.6}
.nv{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px 2px;border-radius:11px;color:var(--dim);transition:.24s;position:relative}
.nv svg{width:17px;height:17px}
.nv span{font-family:var(--ff-t);font-size:7.2px;font-weight:800;letter-spacing:.8px}
.nv.on{color:var(--primary2)}
.nv.on::before{content:'';position:absolute;top:-7px;left:50%;transform:translateX(-50%);width:18px;height:2.4px;border-radius:99px;background:var(--grad-primary);box-shadow:0 0 10px var(--primary)}

.mask{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;visibility:hidden;transition:.3s}
.mask.on{opacity:1;visibility:visible}
.drawer{position:fixed;top:0;bottom:0;left:0;z-index:61;width:262px;max-width:84vw;display:flex;flex-direction:column;background:linear-gradient(180deg,var(--bg3),var(--bg));border-right:1px solid var(--border2);box-shadow:24px 0 70px rgba(0,0,0,.7);transition:transform .34s cubic-bezier(.3,1,.4,1);overflow-y:auto;transform:translateX(-102%)}
.drawer.on{transform:none}
.dw-head{padding:17px 15px 14px;text-align:center;border-bottom:1px solid var(--border);position:relative;overflow:hidden}
.dw-crown{width:42px;height:42px;margin:0 auto 9px;border-radius:14px;display:grid;place-items:center;background:var(--grad-gold);box-shadow:0 9px 26px rgba(246,196,83,.42)}
.dw-crown svg{width:21px;height:21px;color:#2a1c00}
.dw-ttl{font-family:var(--ff-d);font-size:12.5px;font-weight:900;letter-spacing:.8px}
.dw-sub{font-family:var(--ff-t);font-size:7.6px;font-weight:800;letter-spacing:2px;color:var(--dim);margin-top:4px}
.dw-stats{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:13px 14px}
.dw-stat{padding:9px 7px;border-radius:12px;text-align:center;background:rgba(255,255,255,.045);border:1px solid var(--border)}
.dw-stat .k{font-family:var(--ff-t);font-size:6.8px;font-weight:800;letter-spacing:1.2px;color:var(--dim)}
.dw-stat .v{font-family:var(--ff-d);font-size:15px;font-weight:900;margin-top:3px;color:#fff}
.dw-stat.w .v{color:var(--win)} .dw-stat.l .v{color:var(--loss)}
.dw-stat.a .v{color:var(--info)} .dw-stat.b .v{color:var(--gold)}
.dw-stat.full{grid-column:1/-1}
.dw-menu{padding:0 12px 14px;display:flex;flex-direction:column;gap:3px}
.dw-item{display:flex;align-items:center;gap:10px;padding:10px 11px;border-radius:12px;font-family:var(--ff-d);font-size:8.8px;font-weight:800;letter-spacing:1.1px;color:var(--muted);transition:.22s;cursor:pointer}
.dw-item svg{width:14px;height:14px;flex:0 0 auto}
.dw-item.on{background:var(--primary-dim);color:var(--primary2);border:1px solid rgba(224,36,60,.3)}
.dw-sep{margin:9px 4px 5px;font-family:var(--ff-t);font-size:7.2px;font-weight:800;letter-spacing:1.7px;color:var(--dim);border-top:1px solid var(--border);padding-top:11px}
.dw-foot{margin-top:auto;padding:13px;text-align:center;font-family:var(--ff-t);font-size:7.6px;font-weight:700;letter-spacing:.9px;color:var(--dim);border-top:1px solid var(--border)}

.toast{position:fixed;left:50%;bottom:96px;transform:translate(-50%,22px);z-index:90;max-width:88vw;padding:10px 18px;border-radius:99px;opacity:0;visibility:hidden;transition:.32s cubic-bezier(.2,1.3,.4,1);background:rgba(12,9,20,.96);border:1px solid var(--border2);box-shadow:var(--sh-3);font-family:var(--ff-t);font-size:10.5px;font-weight:700;letter-spacing:.4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:var(--text)}
.toast.on{opacity:1;visibility:visible;transform:translate(-50%,0)}
.toast.w{border-color:rgba(34,214,127,.5);color:var(--win)}
.toast.l{border-color:rgba(255,59,82,.5);color:#ffb3bd}
.toast.j{border-color:rgba(246,196,83,.55);color:var(--gold)}

.green-flash{position:fixed;inset:0;z-index:140;pointer-events:none;opacity:0;background:radial-gradient(120% 90% at 50% 50%,transparent 40%,rgba(34,214,127,.3) 100%)}
.green-flash.on{animation:gFlash .85s ease-out}
.gold-flash{position:fixed;inset:0;z-index:140;pointer-events:none;opacity:0;background:radial-gradient(120% 90% at 50% 50%,transparent 34%,rgba(246,196,83,.4) 100%)}
.gold-flash.on{animation:gFlash 1.05s ease-out}
@keyframes gFlash{0%{opacity:0}22%{opacity:1}100%{opacity:0}}

.boot{position:fixed;inset:0;z-index:190;display:grid;place-items:center;background:var(--bg);transition:opacity .5s,visibility .5s}
.boot.off{opacity:0;visibility:hidden}
.boot-in{text-align:center}
.boot-ring{width:64px;height:64px;margin:0 auto 16px;border-radius:50%;position:relative;border:3px solid rgba(255,255,255,.09);border-top-color:var(--primary);border-right-color:var(--accent);animation:spin .85s linear infinite}
.boot-ring::after{content:'';position:absolute;inset:9px;border-radius:50%;border:2px solid rgba(255,255,255,.06);border-bottom-color:var(--gold);animation:spin 1.3s linear infinite reverse}
.boot-t{font-family:var(--ff-d);font-size:11px;font-weight:800;letter-spacing:2.4px;color:var(--muted)}
.boot-s{font-family:var(--ff-t);font-size:8.4px;font-weight:700;letter-spacing:1.1px;color:var(--dim);margin-top:6px;min-height:12px}
</style>
</head>
<body>

<div class="bg-stage">
  <div class="bg-aurora a1"></div><div class="bg-aurora a2"></div><div class="bg-aurora a3"></div>
  <div class="bg-grid"></div><div class="bg-scan"></div><div class="bg-noise"></div>
</div>

<div class="green-flash" id="greenFlash"></div>
<div class="gold-flash" id="goldFlash"></div>

<div class="boot" id="bootScreen">
  <div class="boot-in">
    <div class="boot-ring"></div>
    <div class="boot-t">ColorX Daily Predictor</div>
    <div class="boot-s" id="bootStatus">Initialising neural core…</div>
  </div>
</div>

<div class="mask" id="drawerMask"></div>
<aside class="drawer" id="drawer">
  <div class="dw-head">
    <div class="dw-crown">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.4 18.2h19.2l-1.9 2.9H4.3zM3.1 6.9l4 4 4.9-6.9 4.9 6.9 4-4-2 9.1H5.1z"/></svg>
    </div>
    <div class="dw-ttl">ColorX Daily Predictor</div>
    <div class="dw-sub">PREDICTION COMMAND DECK</div>
  </div>
  <div class="dw-stats">
    <div class="dw-stat w"><div class="k">WINS</div><div class="v" id="dwWin">0</div></div>
    <div class="dw-stat l"><div class="k">LOSSES</div><div class="v" id="dwLoss">0</div></div>
    <div class="dw-stat b"><div class="k">BEST STREAK</div><div class="v" id="dwBest">0</div></div>
    <div class="dw-stat a"><div class="k">STREAK</div><div class="v" id="dwStreak">0</div></div>
    <div class="dw-stat full"><div class="k">ACCURACY</div><div class="v" id="dwAcc">0%</div></div>
  </div>
  <div class="dw-menu">
    <div class="dw-item on" data-go="home"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3z"/></svg>HOME ENGINE</div>
    <div class="dw-item" data-go="predict"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>MANUAL PREDICT</div>
    <div class="dw-item" data-go="history"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>HISTORY</div>
    <div class="dw-item" data-go="stats"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="21" x2="5" y2="11"/><line x1="12" y1="21" x2="12" y2="4"/><line x1="19" y1="21" x2="19" y2="15"/></svg>STATISTICS</div>
    <div class="dw-item" data-go="profile"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1z"/></svg>PROFILE</div>
    <div class="dw-sep">SYSTEM CONTROL</div>
    <div class="dw-item" id="dwReset"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/></svg>RESET STATS</div>
    <div class="dw-item" id="dwCache"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>CLEAR CACHE</div>
  </div>
  <div class="dw-foot">ColorX Daily Predictor © 2026 • V2.0</div>
</aside>

<div class="app" id="app">

  <header class="topbar">
    <button class="tb-burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    <div class="tb-brand">
      <div class="tb-title">ColorX Daily Predictor</div>
      <div class="tb-sub" id="tbSub">Neural Prediction Suite</div>
    </div>
    <div class="tb-right">
      <div class="lv-pill lv1" id="lvPill">LV 1 ● ACTIVE</div>
      <div class="vip-tag">VIP</div>
    </div>
  </header>

  <main class="stage">

    <section class="view active" id="view-home">
      <div class="period-strip">
        <div class="ps-grow">
          <div class="ps-lbl">NEXT PERIOD</div>
          <div class="ps-val" id="periodVal">— — — — —</div>
        </div>
        <button class="icon-btn" id="copyPeriodBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
        <div class="api-badge" id="apiBadge"><i class="dot"></i><span id="apiText">CONNECTING</span></div>
      </div>

      <div class="card">
        <div class="card-hd">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
          <div class="ttl">LIVE ENGINE<small id="engineSub">STANDBY — SELECT MODE</small></div>
          <div class="chip" id="liveChip"><i class="dot"></i>IDLE</div>
        </div>
        <div class="card-bd">
          <div class="orb-zone">
            <div class="orb-shell">
              <svg class="orb-ring" viewBox="0 0 214 214">
                <defs><linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#e0243c"/><stop offset="52%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#f6c453"/>
                </linearGradient></defs>
                <circle class="rbg" cx="107" cy="107" r="99"/>
                <circle class="rfg" id="ringFg" cx="107" cy="107" r="99" stroke-dasharray="622" stroke-dashoffset="622"/>
              </svg>
              <div class="orb-ticks"></div><div class="orb-ticks inner"></div><div class="orb-sweep"></div>
              <div class="orb-core" id="orbCore">
                <div class="oc-lbl" id="orbLbl">SELECT MODE</div>
                <div class="oc-pred" id="orbPred">READY</div>
                <div class="oc-num" id="orbNum">— &amp; —</div>
                <div class="oc-step" id="orbStep">STEP 1</div>
              </div>
              <div class="orb-side l"><div class="k">CONF</div><div class="v" id="chipConf">—</div></div>
              <div class="orb-side r"><div class="k">LEVEL</div><div class="v" id="chipLevel">1</div></div>
              <div class="orb-timer" id="orbTimer">60<small>s</small></div>
            </div>
          </div>

          <div class="ribbon" id="streakRibbon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.1 13a1 1 0 0 0 .8 1.6H10l-1 7.4a1 1 0 0 0 1.9.6L20 11.4a1 1 0 0 0-.9-1.6H14l1-7.3A1 1 0 0 0 13 2z"/></svg>
            <span id="streakRibbonText">+2 WIN STREAK</span>
          </div>

          <div class="meta-grid" style="padding:12px 0 0">
            <div class="meta-cell"><div class="k">PERIOD</div><div class="v" id="metaPeriod">—</div></div>
            <div class="meta-cell"><div class="k">MODE</div><div class="v" id="metaMode">—</div></div>
            <div class="meta-cell"><div class="k">ACCURACY</div><div class="v acc" id="metaAcc">0%</div></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-hd">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg></div>
          <div class="ttl">AI PREDICTION<small id="strategySub">7-LAYER WEIGHTED CONSENSUS</small></div>
          <span class="dbl-badge" id="dblBadge">✦ DOUBLE ✦</span>
        </div>

        <div class="pred-hero">
          <div class="pred-size" id="predSize">— —</div>
          <div class="lv-badge" id="lvBadge">✦ LEVEL 1 · PRIMARY</div>
        </div>

        <div class="num-row">
          <div class="num-card main">
            <div class="tag">MAIN TARGET</div>
            <div class="num-tile t-red" id="mainTile">0</div>
            <div class="num-meta" id="mainMeta">—</div>
          </div>
          <div class="num-card opp">
            <div class="tag">OPPOSITE / HEDGE</div>
            <div class="num-tile t-green" id="oppTile">0</div>
            <div class="num-meta" id="oppMeta">—</div>
          </div>
        </div>

        <div class="conf-block">
          <div class="conf-top">
            <div class="k">CONFIDENCE INDEX</div>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="sig-bars" id="sigBars"><i></i><i></i><i></i><i></i><i></i></div>
              <div class="v" id="confVal">0%</div>
            </div>
          </div>
          <div class="rail"><div class="fill" id="confFill"></div></div>
          <div class="rail-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
        </div>

        <div style="padding:0 13px 13px">
          <div class="sec-title" style="margin:2px 0 8px">LAYER BREAKDOWN</div>
          <div class="layers" id="layerList"></div>
        </div>

        <div class="sec-title" style="padding:0 13px;margin:0 0 8px">STRATEGY CORE</div>
        <div class="strat-grid">
          <button class="strat on" data-strat="NEURAL"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg></div><div class="snm">NEURAL</div></button>
          <button class="strat" data-strat="INVERT"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8h13l-3-3M21 16H8l3 3"/></svg></div><div class="snm">INVERT</div></button>
          <button class="strat" data-strat="MATRIX"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></svg></div><div class="snm">MATRIX</div></button>
          <button class="strat" data-strat="VOID"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg></div><div class="snm">VOID</div></button>
        </div>

        <div style="padding:0 13px 13px;display:flex;gap:7px">
          <button class="btn btn-ghost btn-sm" id="copyPredBtn" style="flex:1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>COPY</button>
          <button class="btn btn-primary btn-sm" id="manualBtn" style="flex:1.4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>RE-ANALYSE</button>
        </div>
      </div>

      <div class="card">
        <div class="card-hd">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg></div>
          <div class="ttl">ENGINE CONTROL<small>WIN GO — BIG / SMALL LOGIC</small></div>
        </div>
        <div class="card-bd" style="display:flex;flex-direction:column;gap:9px">
          <div class="seg" id="modeSeg">
            <button data-mode="30s" class="on">30 SEC</button>
            <button data-mode="1m">1 MIN</button>
          </div>
          <button class="btn btn-primary" id="startBtn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>START ENGINE</button>
          <button class="btn btn-stop" id="stopBtn"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>STOP ENGINE</button>
        </div>
      </div>

      <div class="card">
        <div class="card-hd">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
          <div class="ttl">RECENT ROUNDS<small id="recentSub">LAST 6 DECISIONS</small></div>
          <button class="chip" id="clearHistBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg>CLEAR</button>
        </div>
        <div class="card-bd"><div id="recentList"></div></div>
      </div>
    </section>

    <section class="view" id="view-predict">
      <div class="card">
        <div class="card-hd">
          <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></div>
          <div class="ttl">MANUAL PREDICT<small>LOCK YOUR OWN CALL</small></div>
        </div>
        <div class="card-bd">
          <div class="tog-row">
            <div class="tt">DOUBLE MODE<small>Hedge number = main number (2× payout)</small></div>
            <div class="switch" id="dblSwitch"></div>
          </div>
          <div class="sec-title" style="margin:0 0 9px">SELECT MAIN NUMBER</div>
          <div class="num-grid" id="ballGrid"></div>
          <div class="size-row">
            <button class="size-btn" data-size="BIG">BIG</button>
            <button class="size-btn" data-size="SMALL">SMALL</button>
          </div>
          <button class="btn btn-gold" id="lockBtn" style="margin-top:11px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="4" y="10.5" width="16" height="10.5" rx="2.4"/><path d="M8 10.5V7.4a4 4 0 0 1 8 0v3.1"/></svg>LOCK PREDICTION</button>
        </div>
      </div>
    </section>

    <section class="view" id="view-history">
      <div class="trail">
        <div class="tl">TRAIL</div>
        <div class="dots" id="trailDots"></div>
        <div class="rt" id="trailRate">0%</div>
      </div>
      <div class="sum-grid">
        <div class="sum-cell w"><div class="k">WINS</div><div class="v" id="sumWin">0</div></div>
        <div class="sum-cell l"><div class="k">LOSSES</div><div class="v" id="sumLoss">0</div></div>
        <div class="sum-cell a"><div class="k">RATE</div><div class="v" id="sumRate">0%</div></div>
        <div class="sum-cell b"><div class="k">TOTAL</div><div class="v" id="sumTotal">0</div></div>
      </div>
      <div id="historyList"></div>
    </section>

    <section class="view" id="view-stats">
      <div class="stat-grid">
        <div class="stat-card w"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div><div class="sv" id="stWin">0</div><div class="sk">TOTAL WINS</div></div>
        <div class="stat-card l"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div><div class="sv" id="stLoss">0</div><div class="sk">TOTAL LOSSES</div></div>
        <div class="stat-card a"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg></div><div class="sv" id="stRate">0%</div><div class="sk">ACCURACY</div></div>
        <div class="stat-card j"><div class="sic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><div class="sv" id="stBest">0</div><div class="sk">BEST STREAK</div></div>
      </div>
      <div class="best-card">
        <div class="k"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm0 2h14v2H5z"/></svg>BEST STREAK RECORD</div>
        <div class="v" id="stBestBig">0</div>
      </div>
    </section>

    <section class="view" id="view-profile">
      <div class="card">
        <div class="prof-hero">
          <div class="avatar"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1z"/></svg></div>
          <div>
            <div class="prof-name">ColorX User</div>
            <div class="prof-rank"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5z"/></svg>PREDICTION MASTER</div>
          </div>
        </div>
      </div>
      <div class="sec-title">PREFERENCES</div>
      <div class="menu-item"><div class="mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg></div><div class="mt">Sound Effects<small>Play sounds on results</small></div><div class="switch on" id="soundSwitch"></div></div>
      <div class="menu-item"><div class="mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/></svg></div><div class="mt">Vibration<small>Haptic feedback</small></div><div class="switch on" id="vibeSwitch"></div></div>
      <div class="sec-title">DATA</div>
      <div class="menu-item" id="resetStats"><div class="mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/></svg></div><div class="mt">Reset Statistics<small>Clear all wins/losses</small></div><div class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></div></div>
    </section>

  </main>

  <nav class="botnav">
    <button class="nv on" data-go="home"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3z"/></svg><span>HOME</span></button>
    <button class="nv" data-go="predict"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>PREDICT</span></button>
    <button class="nv" data-go="history"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><span>HISTORY</span></button>
    <button class="nv" data-go="stats"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="21" x2="5" y2="11"/><line x1="12" y1="21" x2="12" y2="4"/><line x1="19" y1="21" x2="19" y2="15"/></svg><span>STATS</span></button>
    <button class="nv" data-go="profile"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1z"/></svg><span>PROFILE</span></button>
  </nav>

</div>

<div class="toast" id="toast"></div>

<script>
var API = {
  "1m": "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json",
  "30s": "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json"
};

var state = {
  mode: "30s",
  data: [],
  history: [],
  pred: null,
  running: false,
  wins: 0,
  losses: 0,
  best: 0,
  streak: 0,
  profit: 0,
  loss: 0
};

function $(id) { return document.getElementById(id); }

function shiftBack(n) { return (n - 1 + 10) % 10; }

function parseData(json) {
  var a = (json && json.data && json.data.list) || (json && json.data) || (json && json.list) || [];
  if (!Array.isArray(a)) return [];
  return a.map(function(x) {
    var raw = Number(x.number != null ? x.number : (x.num != null ? x.num : x.result));
    var n = isFinite(raw) ? shiftBack(raw) : NaN;
    return {
      period: String(x.issueNumber != null ? x.issueNumber : (x.period != null ? x.period : (x.issue != null ? x.issue : (x.id != null ? x.id : "")))),
      number: n,
      size: n >= 5 ? "BIG" : "SMALL",
      time: x.time || "",
      color: x.color || ""
    };
  }).filter(function(x) { return isFinite(x.number) && x.period; })
    .sort(function(a, b) { return b.period.localeCompare(a.period); });
}

async function fetchData() {
  $("apiText").textContent = "FETCHING…";
  $("apiBadge").className = "api-badge";
  try {
    var r = await fetch(API[state.mode] + "?ts=" + Date.now(), { cache: "no-store" });
    var j = await r.json();
    state.data = parseData(j);
    if (!state.data.length) throw new Error("No data");
    $("apiText").textContent = "LIVE";
    $("apiBadge").className = "api-badge ok";
    analyze();
    renderAll();
  } catch (e) {
    $("apiText").textContent = "OFFLINE";
    $("apiBadge").className = "api-badge err";
    if (!state.data.length) seedDemo();
    renderAll();
  }
}

function seedDemo() {
  state.data = [];
  for (var i = 0; i < 30; i++) {
    var raw = (i * 7 + 3) % 10;
    var n = shiftBack(raw);
    state.data.push({
      period: String(100000 + i),
      number: n,
      size: n >= 5 ? "BIG" : "SMALL",
      time: "",
      color: ""
    });
  }
}

function scorePrediction() {
  var a = state.data.slice(0, 20);
  if (!a.length) return { side: "BIG", num: 7, conf: 0.5 };
  var big = a.filter(function(x) { return x.size === "BIG"; }).length;
  var small = a.length - big;
  var side = big >= small ? "BIG" : "SMALL";
  var recent = a.slice(0, 5).filter(function(x) { return x.size === "BIG"; }).length;
  if (recent >= 4) side = "SMALL";
  if (recent <= 1) side = "BIG";
  var freq = [0,0,0,0,0,0,0,0,0,0];
  a.forEach(function(x) { freq[x.number]++; });
  var pool = side === "BIG" ? [5,6,7,8,9] : [0,1,2,3,4];
  pool.sort(function(x, y) { return freq[y] - freq[x]; });
  var num = pool[0];
  var margin = Math.abs(big - small) / a.length;
  var conf = Math.min(0.94, 0.52 + margin * 0.7);
  return { side: side, num: num, conf: conf };
}

function analyze() {
  if (!state.data.length) return;
  var next;
  try { next = String(BigInt(state.data[0].period) + 1n); }
  catch (e) { next = String(Number(state.data[0].period) + 1); }
  state.pred = scorePrediction();
  state.pred.period = next;
}

function numColor(n) {
  if (n === 0) return "violet";
  if (n === 5) return "greenvio";
  if (n % 2 === 0) return "red";
  return "green";
}

function renderPrediction() {
  if (!state.pred) return;
  var p = state.pred;
  var pt = $("orbPred");
  pt.textContent = p.side;
  pt.className = "oc-pred " + (p.side === "BIG" ? "big" : "small");
  var second = p.side === "BIG" ? Math.max(5, (p.num + 2) % 10) : Math.min(4, (p.num + 2) % 5);
  $("orbNum").textContent = p.num + " & " + second;
  $("periodVal").textContent = p.period.slice(-8);
  $("metaPeriod").textContent = p.period.slice(-6);
  $("metaMode").textContent = state.mode.toUpperCase();
  $("engineSub").textContent = state.running ? "ANALYSING…" : "STANDBY";
  $("liveChip").innerHTML = '<i class="dot ' + (state.running ? 'live' : '') + '"></i>' + (state.running ? 'LIVE' : 'IDLE');
  var pct = Math.round(p.conf * 100);
  $("confVal").textContent = pct + "%";
  $("confFill").style.width = pct + "%";
  $("chipConf").textContent = pct + "%";
  var bars = $("sigBars").children;
  for (var i = 0; i < 5; i++) bars[i].className = (i < Math.round(p.conf * 5)) ? "on" : "";
  var ps = $("predSize");
  ps.textContent = p.side;
  ps.className = "pred-size " + (p.side === "BIG" ? "big" : "small");
  ps.classList.remove("pop"); void ps.offsetWidth; ps.classList.add("pop");
  var tile = $("mainTile");
  tile.textContent = p.num;
  tile.className = "num-tile t-" + numColor(p.num) + " flip";
  $("mainMeta").textContent = p.num % 2 === 0 ? "EVEN" : "ODD";
  var ot = $("oppTile");
  ot.textContent = second;
  ot.className = "num-tile t-" + numColor(second) + " flip";
  $("oppMeta").textContent = second % 2 === 0 ? "EVEN" : "ODD";
  renderLayers(p);
  updateRibbon();
}

function renderLayers(p) {
  var big = state.data.slice(0, 20).filter(function(x) { return x.size === "BIG"; }).length;
  var ratio = big / Math.max(1, Math.min(20, state.data.length));
  var layers = [
    { n: "FREQ", v: Math.round(p.conf * 90 + 5), w: 2.4, c: "b" },
    { n: "PATTERN", v: Math.round(p.conf * 85 + 8), w: 2.2, c: "s" },
    { n: "STREAK", v: Math.round(ratio * 100), w: 1.8, c: "b" },
    { n: "AI CORE", v: Math.round(p.conf * 100), w: 3.0, c: "s" }
  ];
  var html = "";
  for (var i = 0; i < layers.length; i++) {
    var L = layers[i];
    html += '<div class="layer"><div class="ln">' + L.n + '</div><div class="lb"><i class="' + L.c + '" style="width:' + L.v + '%"></i></div><div class="lv ' + L.c + '">' + L.v + '%</div><div class="lw">x' + L.w + '</div></div>';
  }
  $("layerList").innerHTML = html;
}

function updateRibbon() {
  var r = $("streakRibbon");
  if (state.streak >= 2) {
    r.className = "ribbon show";
    $("streakRibbonText").textContent = "+" + state.streak + " WIN STREAK";
  } else {
    r.className = "ribbon";
  }
}

function renderHistory() {
  var list = $("historyList");
  if (!state.history.length) {
    list.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg><div class="t">NO HISTORY YET</div><div class="s">Start the engine to begin recording predictions.</div></div>';
    return;
  }
  var html = "";
  for (var i = 0; i < state.history.length; i++) {
    var r = state.history[i];
    var cls = r.result === "win" ? "win" : "loss";
    var icon = r.result === "win" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    html += '<div class="hist-item ' + cls + '"><div class="hi-badge"><div class="hi-ic ' + (r.result === "win" ? "w" : "l") + '">' + icon + '</div><div class="hi-lbl">' + r.result.toUpperCase() + '</div></div><div class="hi-body"><div class="hi-top"><div class="hi-per">#' + r.period + '</div></div><div class="hi-vs"><div class="hi-side"><div class="k">PREDICTED</div><div class="v"><b>' + r.predSide + '</b><span class="numb t-' + numColor(r.predNum) + '">' + r.predNum + '</span></div></div><div class="hi-side"><div class="k">ACTUAL</div><div class="v"><b>' + r.actualSide + '</b><span class="numb t-' + numColor(r.actualNum) + '">' + r.actualNum + '</span></div></div></div></div></div>';
  }
  list.innerHTML = html;
}

function renderRecent() {
  var list = $("recentList");
  if (!state.history.length) {
    list.innerHTML = '<div class="empty" style="padding:20px"><div class="t">READY</div><div class="s">Waiting for first result</div></div>';
    return;
  }
  var html = "";
  var recent = state.history.slice(0, 6);
  for (var i = 0; i < recent.length; i++) {
    var r = recent[i];
    var cls = r.result === "win" ? "win" : "loss";
    html += '<div class="hist-item ' + cls + '" style="margin-bottom:6px"><div class="hi-badge"><div class="hi-ic ' + (r.result === "win" ? "w" : "l") + '" style="width:22px;height:22px">' + (r.result === "win" ? "✓" : "✕") + '</div></div><div class="hi-body" style="display:flex;align-items:center;justify-content:space-between"><div class="hi-per">#' + r.period.slice(-6) + '</div><div class="hi-side"><div class="v"><b>' + r.predSide + '</b> → <b>' + r.actualSide + '</b></div></div></div></div>';
  }
  list.innerHTML = html;
}

function renderStats() {
  var total = state.wins + state.losses;
  var rate = total ? Math.round(state.wins / total * 100) : 0;
  $("dwWin").textContent = state.wins;
  $("dwLoss").textContent = state.losses;
  $("dwBest").textContent = state.best;
  $("dwStreak").textContent = state.streak;
  $("dwAcc").textContent = rate + "%";
  $("sumWin").textContent = state.wins;
  $("sumLoss").textContent = state.losses;
  $("sumRate").textContent = rate + "%";
  $("sumTotal").textContent = total;
  $("trailRate").textContent = rate + "%";
  $("stWin").textContent = state.wins;
  $("stLoss").textContent = state.losses;
  $("stRate").textContent = rate + "%";
  $("stBest").textContent = state.best;
  $("stBestBig").textContent = state.best;
  $("metaAcc").textContent = rate + "%";
  var trail = $("trailDots");
  var dots = "";
  var hist = state.history.slice(0, 20).reverse();
  for (var i = 0; i < hist.length; i++) {
    dots += '<i class="' + (hist[i].result === "win" ? "w" : "l") + '"></i>';
  }
  trail.innerHTML = dots;
}

function renderAll() {
  renderPrediction();
  renderHistory();
  renderRecent();
  renderStats();
}

function toast(t, type) {
  var x = $("toast");
  x.textContent = t;
  x.className = "toast on" + (type ? " " + type : "");
  setTimeout(function() { x.classList.remove("on"); }, 1800);
}

function flash(color) {
  var el = color === "green" ? $("greenFlash") : $("goldFlash");
  el.classList.remove("on");
  void el.offsetWidth;
  el.classList.add("on");
  setTimeout(function() { el.classList.remove("on"); }, 1200);
}

var timerId = null;

function tick() {
  var duration = state.mode === "30s" ? 30 : 60;
  var rem = duration - (Math.floor(Date.now() / 1000) % duration);
  $("orbTimer").innerHTML = rem + '<small>s</small>';
  var ring = $("ringFg");
  var pct = rem / duration;
  ring.style.strokeDashoffset = 622 - (622 * pct);
  if (rem <= 5) $("orbTimer").classList.add("urgent");
  else $("orbTimer").classList.remove("urgent");
  if (rem === 1) setTimeout(resolveRound, 900);
}

var lastResolved = 0;

async function resolveRound() {
  if (!state.running || !state.pred) return;
  if (Date.now() - lastResolved < 2000) return;
  lastResolved = Date.now();
  await fetchData();
  if (!state.data.length) return;
  var actual = state.data[0];
  var predSide = state.pred.side;
  var predNum = state.pred.num;
  var isWin = (actual.size === predSide) || (actual.number === predNum);
  if (isWin) {
    state.wins++;
    state.streak++;
    if (state.streak > state.best) state.best = state.streak;
    flash("green");
    toast("WIN! " + actual.size + " · " + actual.number, "w");
  } else {
    state.losses++;
    state.streak = 0;
    flash("gold");
    toast("LOSS · " + actual.size + " · " + actual.number, "l");
  }
  state.history.unshift({
    period: actual.period,
    predSide: predSide,
    predNum: predNum,
    actualSide: actual.size,
    actualNum: actual.number,
    result: isWin ? "win" : "loss"
  });
  if (state.history.length > 100) state.history.pop();
  analyze();
  renderAll();
}

function startEngine() {
  state.running = true;
  $("startBtn").disabled = true;
  $("stopBtn").classList.add("on");
  $("engineSub").textContent = "ANALYSING…";
  $("liveChip").innerHTML = '<i class="dot live"></i>LIVE';
  toast("ENGINE STARTED · " + state.mode.toUpperCase(), "w");
  fetchData();
}

function stopEngine() {
  state.running = false;
  $("startBtn").disabled = false;
  $("stopBtn").classList.remove("on");
  $("engineSub").textContent = "STANDBY";
  $("liveChip").innerHTML = '<i class="dot"></i>IDLE';
  toast("ENGINE STOPPED", "l");
}

function buildBalls() {
  var g = $("ballGrid");
  var html = "";
  for (var i = 0; i < 10; i++) {
    html += '<button class="ball b-' + numColor(i) + '" data-num="' + i + '">' + i + '</button>';
  }
  g.innerHTML = html;
  g.querySelectorAll(".ball").forEach(function(b) {
    b.onclick = function() {
      g.querySelectorAll(".ball").forEach(function(x) { x.classList.remove("on"); });
      b.classList.add("on");
    };
  });
}

function goPage(name) {
  document.querySelectorAll(".view").forEach(function(v) { v.classList.remove("active"); });
  var pg = $("view-" + name);
  if (pg) pg.classList.add("active");
  document.querySelectorAll(".nv").forEach(function(n) { n.classList.remove("on"); if (n.dataset.go === name) n.classList.add("on"); });
  document.querySelectorAll(".dw-item[data-go]").forEach(function(d) { d.classList.remove("on"); if (d.dataset.go === name) d.classList.add("on"); });
  closeDrawer();
}

function openDrawer() {
  $("drawer").classList.add("on");
  $("drawerMask").classList.add("on");
}
function closeDrawer() {
  $("drawer").classList.remove("on");
  $("drawerMask").classList.remove("on");
}

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() { $("bootScreen").classList.add("off"); }, 1200);

  $("burger").onclick = openDrawer;
  $("drawerMask").onclick = closeDrawer;
  document.querySelectorAll(".dw-item[data-go]").forEach(function(d) {
    d.onclick = function() { goPage(d.dataset.go); };
  });
  document.querySelectorAll(".nv").forEach(function(n) {
    n.onclick = function() { goPage(n.dataset.go); };
  });

  $("modeSeg").querySelectorAll("button").forEach(function(b) {
    b.onclick = function() {
      $("modeSeg").querySelectorAll("button").forEach(function(x) { x.classList.remove("on"); });
      b.classList.add("on");
      state.mode = b.dataset.mode;
      fetchData();
    };
  });

  $("startBtn").onclick = startEngine;
  $("stopBtn").onclick = stopEngine;

  $("copyPeriodBtn").onclick = function() {
    var p = state.pred ? state.pred.period : "";
    navigator.clipboard.writeText(p).then(function() { toast("PERIOD COPIED", "w"); });
  };
  $("copyPredBtn").onclick = function() {
    if (!state.pred) return;
    var txt = state.pred.side + " " + state.pred.num + " #" + state.pred.period;
    navigator.clipboard.writeText(txt).then(function() { toast("PREDICTION COPIED", "w"); });
  };
  $("manualBtn").onclick = function() { analyze(); renderPrediction(); toast("RE-ANALYSED", "w"); };

  $("clearHistBtn").onclick = function() {
    state.history = [];
    renderAll();
    toast("HISTORY CLEARED", "l");
  };

  $("dblSwitch").onclick = function() {
    this.classList.toggle("on");
  };

  $("lockBtn").onclick = function() {
    var sel = document.querySelector(".ball.on");
    var size = document.querySelector(".size-btn.on");
    if (!sel || !size) { toast("SELECT NUMBER & SIZE", "l"); return; }
    toast("PREDICTION LOCKED ✓", "w");
    flash("gold");
  };

  document.querySelectorAll(".size-btn").forEach(function(b) {
    b.onclick = function() {
      document.querySelectorAll(".size-btn").forEach(function(x) { x.classList.remove("on"); });
      b.classList.add("on");
      b.classList.add(b.dataset.size === "BIG" ? "big" : "small");
    };
  });

  $("dwReset").onclick = function() {
    state.wins = 0; state.losses = 0; state.best = 0; state.streak = 0;
    state.history = [];
    renderAll();
    toast("STATS RESET", "l");
    closeDrawer();
  };
  $("dwCache").onclick = function() {
    state.history = []; state.data = [];
    fetchData();
    toast("CACHE CLEARED", "l");
    closeDrawer();
  };
  $("resetStats").onclick = function() {
    state.wins = 0; state.losses = 0; state.best = 0; state.streak = 0;
    state.history = [];
    renderAll();
    toast("STATS RESET", "l");
  };

  document.querySelectorAll(".strat").forEach(function(b) {
    b.onclick = function() {
      document.querySelectorAll(".strat").forEach(function(x) { x.classList.remove("on"); });
      b.classList.add("on");
      analyze();
      renderPrediction();
    };
  });

  buildBalls();
  setInterval(tick, 500);
  setTimeout(fetchData, 1300);
  setInterval(function() {
    if (state.running) fetchData();
  }, 15000);
});
</script>

</body>
</html>`;
