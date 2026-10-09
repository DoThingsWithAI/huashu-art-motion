// 中国登月计划｜huashu-art-motion 原生参数化动画语法
// 不独立实现视频引擎：由 scripts/engine/clip.js 加载本文件，注册 CLIPS.china_moon。
// 时间轴/镜头参数来自 examples/china_moon_2026.json；MO / U / TY 均来自原项目 lib。
// 本片航天器和轨迹为程序化科普示意，不代表精确工程外形或真实比例。
CLIPS.china_moon = (() => {
  const TAU = Math.PI * 2;
  const CL = U.clamp, L = U.lerp;
  const C = {
    bg: '#040917', blue: '#65c7ff', teal: '#64edcf', gold: '#fbd481',
    red: '#ff7a84', paper: '#f5f8ff', mute: '#abbcd6', faint: '#6c829e'
  };
  let stages = [], stars = [], craters = [];
  const e = p => MO.appleOut(CL(p)), s = p => MO.sineInOut(CL(p));
  const p = (t, start, dur) => CL((t - start) / dur);
  function line(g, pts, color, width = 2) {
    g.save(); g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round';
    g.lineJoin = 'round'; g.beginPath();
    pts.forEach((v, i) => i ? g.lineTo(v[0], v[1]) : g.moveTo(v[0], v[1]));
    g.stroke(); g.restore();
  }
  function round(g, x, y, w, h, r, fill, stroke) {
    g.beginPath(); g.roundRect(x, y, w, h, r);
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.4; g.stroke(); }
  }
  function text(g, value, x, y, size = 24, color = C.paper, align = 'left', heavy = false, alpha = 1) {
    TY.text(g, String(value ?? ''), x, y, {size, fam: heavy ? 'PuHui-Bold' : 'PuHui-Medium',
      color, align, base: 'middle', alpha});
  }
  function glow(g, x, y, r, col = C.blue) {
    g.save(); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = r * 7;
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.restore();
  }
  function bg(g, t) {
    g.fillStyle = C.bg; g.fillRect(0, 0, 1280, 720);
    const halo = g.createRadialGradient(850, 340, 10, 850, 340, 660);
    halo.addColorStop(0, '#132d4b'); halo.addColorStop(.5, '#09162a'); halo.addColorStop(1, C.bg);
    g.fillStyle = halo; g.fillRect(0, 0, 1280, 720);
    for (const a of stars) {
      const twinkle = .35 + .4 * Math.sin(t * a.speed + a.phase) ** 2;
      g.globalAlpha = twinkle; g.fillStyle = '#e0edff';
      g.fillRect(a.x, a.y, a.r, a.r);
    }
    g.globalAlpha = 1;
    g.strokeStyle = 'rgba(115,160,203,.08)'; g.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      g.beginPath(); g.arc(900, 350, 125 + i * 80, -.9, 2.3); g.stroke();
    }
  }
  function earth(g, x, y, r, t) {
    g.save(); g.translate(x, y); g.rotate(t * .022);
    let grad = g.createRadialGradient(-r*.3, -r*.3, r*.1, 0, 0, r);
    grad.addColorStop(0, '#7cceec'); grad.addColorStop(.43, '#277bc2');
    grad.addColorStop(.87, '#17417c'); grad.addColorStop(1, '#081a37');
    g.fillStyle = grad; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.arc(0,0,r,0,TAU);g.clip();
    const masses=[[-.34,-.22,.31,.17,.4],[.29,.19,.29,.14,-.7],
      [.10,-.35,.18,.10,.5],[-.48,.42,.16,.12,1]];
    g.fillStyle='#49ab9c'; masses.forEach(m=>{
      g.beginPath();g.ellipse(m[0]*r,m[1]*r,m[2]*r,m[3]*r,m[4],0,TAU);g.fill();
    });
    g.fillStyle='rgba(255,255,255,.18)';
    for(let i=0;i<5;i++){
      g.beginPath(); g.ellipse((i*.31-.63)*r,(i*.26-.48)*r,.25*r,.055*r,.2,0,TAU);g.fill();
    }
    g.restore(); g.strokeStyle='rgba(127,207,255,.34)';g.lineWidth=2;
    g.beginPath();g.arc(0,0,r+3,0,TAU);g.stroke();g.restore();
  }
  function moon(g, x, y, r) {
    g.save();g.translate(x,y);
    const grad=g.createRadialGradient(-r*.36,-r*.39,3,0,0,r);
    grad.addColorStop(0,'#eef5f7');grad.addColorStop(.5,'#b6c1d1');
    grad.addColorStop(1,'#606c81');g.fillStyle=grad;
    g.beginPath();g.arc(0,0,r,0,TAU);g.fill();
    g.beginPath();g.arc(0,0,r,0,TAU);g.clip();
    for(const cr of craters) {
      g.fillStyle='rgba(42,59,78,.17)'; g.beginPath();
      g.ellipse(cr.x*r,cr.y*r,cr.r*r,cr.r*r*.75,cr.rot,0,TAU);g.fill();
      g.strokeStyle='rgba(245,247,255,.17)';g.lineWidth=1.5;
      g.beginPath();g.ellipse(cr.x*r-3,cr.y*r-3,cr.r*r,cr.r*r*.75,cr.rot,2.7,5.7);g.stroke();
    }
    g.restore();
  }
  function route(g, a, b, bend, progress, col=C.blue) {
    const m=[(a[0]+b[0])/2,(a[1]+b[1])/2+bend];
    g.save();g.strokeStyle='rgba(111,176,236,.27)';g.lineWidth=2;
    g.setLineDash([5,9]);g.beginPath();g.moveTo(...a);g.quadraticCurveTo(...m,...b);g.stroke();
    g.setLineDash([]);g.lineWidth=4;g.strokeStyle=col;g.shadowBlur=12;g.shadowColor=col;
    g.beginPath();for(let i=0;i<=100*progress;i++) {
      const u=i/100,v=1-u;
      const x=v*v*a[0]+2*v*u*m[0]+u*u*b[0];
      const y=v*v*a[1]+2*v*u*m[1]+u*u*b[1];
      if(!i)g.moveTo(x,y);else g.lineTo(x,y);
    }g.stroke();g.restore();
    if(progress>0) {
      const u=progress,v=1-u;
      glow(g,v*v*a[0]+2*v*u*m[0]+u*u*b[0],v*v*a[1]+2*v*u*m[1]+u*u*b[1],4,col);
    }
  }
  function rocket(g, x, y, k, t, flame=true) {
    g.save();g.translate(x,y);g.scale(k,k);
    g.fillStyle='#f4f6fb';g.strokeStyle='#96adc7';g.lineWidth=2;
    g.beginPath();g.moveTo(0,-105);g.bezierCurveTo(21,-87,26,-65,26,-36);
    g.lineTo(26,70);g.lineTo(-26,70);g.lineTo(-26,-36);g.bezierCurveTo(-26,-65,-21,-87,0,-105);
    g.closePath();g.fill();g.stroke();
    g.fillStyle='#e05460';g.fillRect(-26,22,52,12);
    g.fillStyle='#7ca7c8';g.fillRect(-26,-28,52,5);
    g.fillStyle='#bacbda';g.beginPath();g.moveTo(-26,20);g.lineTo(-44,75);g.lineTo(-26,66);g.fill();
    g.beginPath();g.moveTo(26,20);g.lineTo(44,75);g.lineTo(26,66);g.fill();
    if(flame){
      const f=90+20*Math.sin(t*24);const grad=g.createLinearGradient(0,65,0,65+f);
      grad.addColorStop(0,'#ffffff');grad.addColorStop(.3,'#ffcf66');
      grad.addColorStop(.8,'#e65c51');grad.addColorStop(1,'rgba(230,70,40,0)');
      g.fillStyle=grad;g.beginPath();g.moveTo(-17,70);g.quadraticCurveTo(0,70+f*1.4,17,70);
      g.fill();
    }
    g.restore();
  }
  function lander(g,x,y,k=1){
    g.save();g.translate(x,y);g.scale(k,k);
    g.fillStyle='#d5e2ef';round(g,-38,-25,76,54,7,'#d4e0ed','#7d9ebb');
    round(g,-31,-15,62,24,4,'#cda95b');
    line(g,[[-28,26],[-65,70],[-84,70]],'#bad5eb',5);
    line(g,[[28,26],[65,70],[84,70]],'#bad5eb',5);
    line(g,[[-53,-20],[-53,-55]],'#e4f3ff',3);
    g.fillStyle='#5486bf';g.fillRect(-82,-27,43,12);g.fillRect(39,-27,43,12);
    glow(g,0,8,3,'#f1f6ff');g.restore();
  }
  function astronaut(g,x,y,k=1,t=0){
    g.save();g.translate(x,y);g.scale(k,k);
    const dx=Math.sin(t*4)*5;
    g.strokeStyle='#e9f1fc';g.lineWidth=8;g.lineCap='round';
    line(g,[[-12,12],[-15,65],[-28+dx,86]],'#e9f1fc',11);
    line(g,[[12,12],[16,64],[27-dx,86]],'#e9f1fc',11);
    g.fillStyle='#e6effb';round(g,-28,-31,56,61,13,'#e6effb','#a3b6d2');
    g.beginPath();g.arc(0,-53,28,0,TAU);g.fill();
    g.fillStyle='#618eb3';g.beginPath();g.ellipse(0,-54,21,17,0,0,TAU);g.fill();
    line(g,[[-23,-20],[-50+dx,19]],'#edf4fe',10);
    line(g,[[23,-20],[51-dx,13]],'#edf4fe',10);
    g.fillStyle='#d84951';g.fillRect(-27,-17,54,8);g.restore();
  }
  function capsule(g,x,y,k=1){g.save();g.translate(x,y);g.scale(k,k);
    g.fillStyle='#e2ebf5';g.beginPath();g.moveTo(-32,24);g.lineTo(-22,-22);
    g.quadraticCurveTo(0,-42,22,-22);g.lineTo(32,24);g.closePath();g.fill();
    round(g,-16,-12,32,12,6,'#7da4d4');g.restore();}
  function grid(g,x,y,w,h,step=32){
    g.strokeStyle='rgba(145,184,219,.10)';g.lineWidth=1;
    for(let px=x;px<=x+w;px+=step)line(g,[[px,y],[px,y+h]],'rgba(145,184,219,.10)',1);
    for(let py=y;py<=y+h;py+=step)line(g,[[x,py],[x+w,py]],'rgba(145,184,219,.10)',1);
  }
  function tag(g,label,x,y,color=C.blue){
    g.save();round(g,x,y,170,30,9,'rgba(16,36,63,.87)','rgba(95,164,207,.35)');
    text(g,label,x+13,y+16,17,color);g.restore();
  }
  function card(g,x,y,w,h,label,value,accent=C.blue,sub=''){
    g.save();round(g,x,y,w,h,16,'rgba(8,23,43,.92)','rgba(125,178,229,.3)');
    round(g,x+13,y+13,4,h-26,2,accent);
    text(g,label,x+33,y+29,18,C.mute);
    text(g,value,x+33,y+65,28,C.paper,'left',true);
    if(sub)text(g,sub,x+33,y+h-20,15,C.mute);
    g.restore();
  }
  function header(g,q,t) {
    text(g,'CHINA LUNAR EXPLORATION  /  中国探月',58,57,18,C.teal);
    const h= e(p(t,0,.7));
    TY.text(g,q.text,59,129,{size:49,fam:'PuHui-Bold',color:C.paper,
      alpha:h,align:'left',base:'middle'});
    if(q.sub)text(g,q.sub,61,178,23,C.mute,'left',false,e(p(t,.35,.7)));
    line(g,[[59,209],[1208,209]],'rgba(116,168,218,.24)',1.5);
  }
  function vignette(g) {
    const v=g.createLinearGradient(0,500,0,720);
    v.addColorStop(0,'rgba(1,5,15,0)');v.addColorStop(1,'rgba(1,5,15,.75)');
    g.fillStyle=v;g.fillRect(0,500,1280,220);
  }
  function stageDraw(g,q,t) {
    const k=q.data?.scene, d=q.data || {}, u=t;header(g,q,u);
    switch(k) {
      case 'intro': {
        earth(g,252,417,145,u);moon(g,990,402,120);
        route(g,[360,377],[881,382],-155,e(p(u,1,3.0)),C.blue);
        card(g,479,340,302,118,'国家目标','2030 年前载人登月',C.gold,'目标仍在稳步推进');
        text(g,'从“绕、落、回”到“登、巡、采、研、回”',640,595,25,C.paper,'center');
        break;
      }
      case 'history': {
        const nodes=[
          ['2007','嫦娥一号','绕月'],['2013','嫦娥三号','月面软着陆'],
          ['2020','嫦娥五号','月球正面采样返回'],['2024','嫦娥六号','月球背面采样返回']
        ];
        line(g,[[134,429],[1142,429]],'rgba(109,178,236,.34)',4);
        nodes.forEach((n,i)=>{
          const x=157+i*324, a=e(p(u,.7+i*.65,.8));
          g.save();g.globalAlpha=a;
          glow(g,x,429,7,C.blue);
          text(g,n[0],x,360,24,C.gold,'center',true);
          text(g,n[1],x,478,24,C.paper,'center',true);
          text(g,n[2],x,516,17,C.mute,'center');
          g.restore();
        });
        text(g,'探月工程三步走：绕月探测 → 月面软着陆 → 采样返回',640,611,23,C.teal,'center');
        break;
      }
      case 'six': {
        earth(g,200,475,95,u);moon(g,1010,444,167);
        lander(g,961,482,.46);
        route(g,[260,420],[866,404],-152,e(p(u,.9,2.6)));
        route(g,[874,493],[282,528],170,e(p(u,3.15,2.7)),C.gold);
        capsule(g,430,395,.7);
        card(g,474,303,285,115,'嫦娥六号 · 2024','1935.3 克',C.gold,'人类首次月背采样返回');
        break;
      }
      case 'seven': {
        moon(g,942,491,218);
        const sx=903+38*Math.cos(u*.8), sy=552+18*Math.sin(u*.8);
        glow(g,930,615,10,C.teal);lander(g,sx,sy,.62);
        g.save();g.strokeStyle='rgba(94,231,223,.5)';g.lineWidth=1.5;g.setLineDash([6,7]);
        g.beginPath();g.ellipse(942,490,262,185,-.25,0,TAU);g.stroke();g.restore();
        card(g,66,299,420,102,'科考重点','月球南极水冰与资源',C.teal);
        card(g,66,419,420,127,'2026-08-23 官方调整','原定发射窗口无法实施',C.red,'不满足发射条件；新的窗口以官方公告为准');
        tag(g,'尚未实施发射',736,613,C.red);
        break;
      }
      case 'eight': {
        moon(g,965,493,228);
        lander(g,861,470,.56);
        round(g,993,423,114,54,15,'#d8e3eb','#87abc9');
        line(g,[[1010,423],[1010,387],[1091,387],[1091,423]],'#b7d6ea',4);
        g.fillStyle='#d9b96e';g.fillRect(1003,403,95,14);
        for(let i=0;i<5;i++)glow(g,746+i*47,553-10*Math.sin(i),3.5,C.gold);
        card(g,74,312,421,116,'公开计划','2028 年前后',C.gold,'嫦娥八号任务');
        card(g,74,447,421,116,'实验方向','月球资源原位利用',C.teal,'为月球科研站建设积累技术');
        break;
      }
      case 'launch': {
        earth(g,1007,510,196,u);
        const fly=e(p(u,1.25,3));
        rocket(g,275,535-220*fly,.84,u,true);
        rocket(g,500,551-250*e(p(u,2.2,3)),.72,u,true);
        route(g,[320,470],[802,332],-80,e(p(u,2,2.4)));
        route(g,[532,485],[877,378],-70,e(p(u,3,2.3)),C.gold);
        tag(g,'第一次发射',190,588);
        tag(g,'第二次发射',420,627,C.gold);
        card(g,735,271,426,116,'载人登月系统','长征十号 + 梦舟 + 揽月',C.blue,'采用两次发射的任务方案');
        break;
      }
      case 'landing': {
        earth(g,140,465,84,u);moon(g,1005,462,188);
        route(g,[217,433],[833,377],-133,e(p(u,.25,2.25)),C.blue);
        const arrived=e(p(u,2.2,1));
        capsule(g,880,355,.8*arrived);
        lander(g,948,339+184*e(p(u,3.3,2.15)),.62*arrived);
        glow(g,949,613,7,C.gold);
        card(g,308,310,366,103,'地月转移','月球轨道交会对接',C.teal);
        card(g,308,435,366,103,'分离与下降','揽月着陆器登陆月面',C.gold);
        break;
      }
      case 'outro': {
        moon(g,1005,480,200);
        lander(g,879,559,.58);
        astronaut(g,1110,561,.62,u);
        earth(g,166,538,90,u);
        route(g,[230,500],[840,457],-102,e(p(u,.2,3.2)),C.teal);
        card(g,340,318,425,126,'2030 年前','中国人首次登月',C.gold,'探索月球 · 向深空进发');
        text(g,'科学考察　·　技术验证　·　登 / 巡 / 采 / 研 / 回',
          575,632,19,C.paper,'center');
        break;
      }
    }
    vignette(g);
  }
  return {
    fonts: ['PuHui-Medium','PuHui-Bold'],
    safe: true,
    init(ctx) {
      const r=U.rng(20261009);
      stars=Array.from({length:175},()=>({
        x:r()*1280,y:r()*720,r:.7+r()*1.9,speed:.3+r()*.6,phase:r()*TAU
      }));
      craters=Array.from({length:28},()=>({
        x:(r()-.5)*1.65,y:(r()-.5)*1.65,r:.018+r()*.07,rot:r()*TAU
      })).filter(z=>z.x*z.x+z.y*z.y<.9);
      stages=ctx.of('stage').map(q=>({
        ...q,dur:Number(q.dur || 6),end:q.at+Number(q.dur || 6)
      }));
      if(!stages.length)throw new Error('china_moon: 至少需要一个 kind=stage 的 cue');
    },
    draw(c,t,ctx) {
      const {box}=ctx;
      c.save(); c.translate(box.x,box.y);c.scale(box.w/1280,box.h/720);
      bg(c,t);
      for(const q of stages) {
        if(t<q.at || t>=q.end)continue;
        const local=t-q.at;
        // 时间轴严格驱动：静帧抽查和 MP4 渲染在相同时刻必定一致。
        const enter=e(p(local,0,.58));
        const leave=1-s(p(local,q.dur-.55,.55));
        c.save();c.globalAlpha=enter*leave;
        stageDraw(c,q,local);c.restore();
      }
      round(c,53,35,1174,2,1,'rgba(140,191,237,.13)');
      round(c,53,35,1174*CL(t/ctx.dur),2,1,C.blue);
      text(c,'月球探测工程  /  PROGRAM OVERVIEW',57,683,15,C.mute);
      text(c,'科普示意 · 非等比例 · 资料截至 2026-10-09',1222,683,14,C.faint,'right');
      c.restore();
    }
  };
})();