class $i{constructor(){this._el=null,this._done=null,this._transitionType=null,this._transitionName="",this.nuxtApp=re(),this.mainStore=Wm(),this.stackStore=EE(),this.$gsap=this.nuxtApp.$gsap,this.$flip=this.nuxtApp.$flip,this.$lenis=this.nuxtApp.$lenis,this._currentTransitionName=Dt(()=>this.mainStore.pageTransitionName),On(()=>{this._transitionType==="enter"?this._addListeners(Df):this._transitionType==="leave"&&this._addListeners(Of)})}_conditionToPlay(){return this._currentTransitionName.value===this._transitionName}_addListeners(t){za.addEventListener(t,e=>{this._el=e.params.el,this._done=e.params.done,this._conditionToPlay()?_a(()=>{this._play()}):this._currentTransitionName===null&&this._done()})}_play(){console.log("Done --- From empty play"),this._done()}_restoreScrollPosition(){this.$lenis.scrollTo(this.mainStore.savedScrollPosition||0,{immediate:!0,force:!0,onComplete:()=>{this._saveScrollPosition(0)}})}_saveScrollPosition(){this.mainStore.saveScrollPosition(this.$lenis.scroll)}_scrollToTop(){this.$lenis.scrollTo(0,{immediate:!0,force:!0})}_complete(){console.log("Complete --- From empty complete")}}const Lct=Object.freeze(Object.defineProperty({__proto__:null,default:$i},
Symbol.toStringTag,{value:"Module"}));
class zct extends $i{constructor(){super(),this._transitionType="enter",this._transitionName="folder-close"}_play(){const{transitionGroupId:t,transitionPageId:e}=this.stackStore,i=document.querySelector(".stack"),s=Array.from(i.querySelectorAll(".stack-group__inner")),n=s.slice(0,t),c=s[t],a=s.slice(t+1),d=i.querySelectorAll(".stack-cover__desc"),Z=c.querySelector(".stack-cover__category"),o=this.$gsap.timeline({defaults:{duration:.75,ease:"power2.out"},
onStart:()=>{this.$lenis.scrollTo(0,{duration:o.duration(),lock:!0})},
onComplete:()=>{this._done()}});
o.fromTo([...n,...a],{yPercent:120},
{yPercent:0,duration:.9,stagger:.1,ease:"power4.out",clearProps:"yPercent"},
0),o.fromTo(".section-hero__title .line",{y:"2rem",opacity:0},
{y:0,opacity:1,duration:.9,stagger:.2},
0),o.fromTo(".section-hero__desc",{y:"2rem",opacity:0},
{y:0,opacity:1,duration:.65},
.4),o.from(d,{opacity:0,duration:.45},
.9),o.from(Z,{opacity:0,duration:.45},
.4)}}const wct=Object.freeze(Object.defineProperty({__proto__:null,default:zct},
Symbol.toStringTag,{value:"Module"}));
class Rct extends $i{constructor(){super(),this._transitionType="leave",this._transitionName="folder-close",this.transitionDefaults={duration:1.5,ease:"power3.inOut"}}_play(){const t=document.querySelector(".case-content__inner"),e=document.querySelector(".case-folder"),i=document.querySelector(".case-folder__inner"),s=document.querySelector(".case-folder__cover"),n=document.querySelector(".case-folder__cover__front__shadow");
document.querySelector(".case-folder__cover__shadow");
const c=document.querySelector(".case-temp__inner"),a=this.$flip.getState(e);
this.$gsap.set(t,{height:e.offsetHeight}),c.appendChild(e);
const d=this.$flip.from(a,{...this.transitionDefaults,paused:!0,onStart:()=>{e.classList.add("is-frozen"),this.$lenis.scrollTo(0,{duration:Z.duration(),lock:!0}),Z.play()},
onComplete:()=>{this._done()}});
this.$gsap.to(".scrapbook-item",{y:"50vh",duration:.2,ease:"power2.in",onComplete:()=>{d.play()}});
const Z=this.$gsap.timeline({defaults:this.transitionDefaults,paused:!0});
Z.to(s,{rotateY:0,duration:1.5,onComplete:()=>{this.$gsap.set(i,{backgroundColor:"transparent"})}},
0),Z.to(".case-hero-title .char",{xPercent:-150,opacity:0,duration:1.15,stagger:.035,ease:"power2.inOut"},
0),Z.to(n,{opacity:1,duration:1},
0),Z.to(n,{opacity:0,duration:.4},
1),Z.to(".case-folder-scrapbook",{opacity:0,duration:.75},
0)}}const gct=Object.freeze(Object.defineProperty({__proto__:null,default:Rct},
Symbol.toStringTag,{value:"Module"}));
class Sct extends $i{constructor(){super(),this._transitionType="enter",this._transitionName="folder-next",this.isDesktop=zo("(min-width: 1024px)")?.value}_play(){const t=document.querySelector(".case-hero-title"),e=t.getBoundingClientRect().top,i=document.querySelector(".case-content").getBoundingClientRect().top,s=window.innerHeight*.6,n=parseInt(att("--container-offset")?.value||"0",0),c=this.$gsap.timeline({onStart:()=>{this.$lenis.freeze()},
onComplete:()=>{this.$lenis.unfreeze(),this._done()}});
if(this.isDesktop){c.from(".case-folder-sheet",{y:"50vh",duration:.6,ease:"power3.out"},
0),c.from(".case-folder-tags__page .tag.is-visible",{y:"100%",duration:.75,ease:"power3.out",stagger:-.05,clearProps:"y"}),c.from(".case-folder",{y:()=>s-i,duration:.6,ease:"power3.out",clearProps:"y"},
0);
const a=document.querySelector(".page-case")?.classList.contains("--theme-dark");
c.from(t,{y:()=>s-e+n,color:()=>a?"#000":"#fff",scale:.666,duration:.6,ease:"power2.out",clearProps:"all"},
0)}else c.from(".case-hero-title .char",{xPercent:-100,opacity:0,duration:.65,stagger:.025,ease:"power3.out"},
0),c.from(".case-folder",{y:function(){const d=(this.targets()?.[0]).getBoundingClientRect().top;
return window.innerHeight-d},
duration:1,ease:"power3.out",clearProps:"y"},
0),c.from(".case-folder-sheet",{y:"10rem",duration:1,ease:"power3.out"},
.1)}}const Fct=Object.freeze(Object.defineProperty({__proto__:null,default:Sct},
Symbol.toStringTag,{value:"Module"}));
class jct extends $i{constructor(){super(),this._transitionType="leave",this._transitionName="folder-next",this.isDesktop=zo("(min-width: 1024px)")?.value}_play(){const t=this.mainStore.isOverscroll,e=this.$gsap.timeline({onStart:()=>{t||(e.pause(),this.$lenis.freeze(),this.$lenis.scrollTo(document.body.scrollHeight,{duration:1.25,force:!0,onComplete:()=>{e.play()}}))},
onComplete:()=>{this.$lenis.scrollTo(0,{immediate:!0,force:!0,lock:!0,onComplete:()=>{this._done()}})}});
this.isDesktop?(e.to(".case-folder",{y:"-75vh",duration:.35,ease:"power1.in"},
0),e.to(".case-next-folder",{y:()=>`${-10-5*(1-this.mainStore.overscrollProgress)}vh`,duration:.35,ease:"power2.in"},
0)):e.to([".case-folder",".case-next-widget"],{y:"-100vh",duration:.35,ease:"power1.in",clearProps:"y"},
0)}}const Jct=Object.freeze(Object.defineProperty({__proto__:null,default:jct},
Symbol.toStringTag,{value:"Module"}));
class kct extends $i{constructor(t,e){super(),this._transitionType="enter",this._transitionName="folder-open",this.transitionDefaults={duration:1.5,ease:"power3.inOut"}}_play(){this.$gsap.set(".case-folder-tags",{width:0});
const t=document.querySelector(".case-folder"),e=document.querySelector(".case-folder__cover"),i=document.querySelector(".case-folder__cover__front__overlay"),s=document.querySelector(".case-folder__cover__front__shadow"),n=document.querySelector(".case-folder__cover__shadow"),c=document.querySelectorAll(".case-folder-tags__page:not(.--active) .tag.is-visible"),a=document.querySelector(".case-content__inner"),d=this.$flip.getState(t);
a.appendChild(t);
const Z=this.stackStore.isHovered?-3:0,o=this.stackStore.isHovered?"-1rem":0;
this.$gsap.set(e,{rotateY:Z,translateX:o}),this.$flip.from(d,{...this.transitionDefaults,onStart:()=>{u.play()},
onComplete:()=>{this.stackStore.resetHoverState(),this.stackStore.setLockState(!1),this.$gsap.set(".case-folder-tags",{clearProps:"width"}),this._done()}});
const u=this.$gsap.timeline({defaults:this.transitionDefaults,paused:!0});
u.from(".case-hero-title .char",{xPercent:-150,opacity:0,duration:.65,stagger:.025,ease:"power2.out"},
.65),u.fromTo(e,{rotateY:Z},
{rotateY:-180},
0),u.fromTo(e,{translateX:o},
{translateX:0,duration:.5},
0),this.stackStore.transitionPageId===0&&this.stackStore.isHovered&&u.fromTo([i,s],{opacity:1},
{opacity:0,duration:.5},
0),u.to(n,{opacity:1,duration:.35},
.25),u.to(n,{opacity:0,duration:.3},
.6),u.from(c,{yPercent:110,duration:.75,ease:"power3.out",clearProps:"y"},
.85),u.from(".scrapbook-item",{y:"50vh",opacity:0,duration:.5,ease:"power3.out",clearProps:"y"},
1)}}const fct=Object.freeze(Object.defineProperty({__proto__:null,default:kct},
Symbol.toStringTag,{value:"Module"}));
function bJ(l=document,t,e){return[...l.querySelectorAll(t)].filter((i,s)=>s!==e)}class Dct extends $i{constructor(){super(),this._transitionType="leave",this._transitionName="folder-open"}_play(){const{transitionGroupId:t,transitionPageId:e}=this.stackStore,i=document.querySelector(".stack"),s=Array.from(i?.children),n=s.slice(0,t),c=s[t],a=s.slice(t+1),d=bJ(c,".stack-page",e),Z=bJ(c,".stack-page__header",e),o=c.querySelector(".stack-cover__desc"),u=c.querySelector(".stack-cover__category"),b=this.$gsap.timeline({defaults:{duration:.75,ease:"power2.out"},
onStart:()=>{this.$lenis.scrollTo(0,{duration:b.duration(),lock:!0})},
onComplete:()=>{this._done()}});
b.to(".section-hero__desc",{y:"2rem",opacity:0,duration:.45},
.05),b.to(".section-hero__title .line",{y:"2rem",opacity:0,duration:.45,stagger:-.05},
.15),b.to([...n,...a],{yPercent:120,stagger:.1},
0),b.to([o,u],{opacity:0,duration:.15},
0),Z.length>0&&b.to(Z,{yPercent:110,duration:.4},
0),d.length>0&&b.set(d,{display:"none"})}}const Cct=Object.freeze(Object.defineProperty({__proto__:null,default:Dct},
Symbol.toStringTag,{value:"Module"}));
class Uct extends $i{constructor(){super(),this._transitionType="enter",this._transitionName="folder-prev"}_play(){const t=this.$gsap.timeline({defaults:{ease:"power3.out"},
onStart:()=>{},
onComplete:()=>{this.$lenis.unfreeze(),this._done()}});
t.from(".case-hero-title .char",{xPercent:-100,opacity:0,duration:.65,stagger:.025},
0),t.from(".case-folder",{y:function(){const i=(this.targets()?.[0]).getBoundingClientRect().top;
return window.innerHeight-i},
duration:1,clearProps:"y"},
0),t.from(".case-folder-sheet",{y:"10rem",duration:1},
.1)}}const Oct=Object.freeze(Object.defineProperty({__proto__:null,default:Uct},
Symbol.toStringTag,{value:"Module"}));
class vct extends $i{constructor(){super(),this._transitionType="leave",this._transitionName="folder-prev"}_play(){const t=this.$gsap.timeline({defaults:{ease:"power3.out"},
onStart:()=>{t.pause(),this.$lenis.freeze(),this.$lenis.scrollTo(0,{force:!0,onComplete:()=>{t.play()}})},
onComplete:()=>{this._done()}});
t.to(".case-hero-title .char",{xPercent:-100,opacity:0,duration:.65,stagger:.025},
0),t.to(".case-folder",{y:function(){const i=(this.targets()?.[0]).getBoundingClientRect().top;
return window.innerHeight-i},
duration:.65},
0)}}const Ect=Object.freeze(Object.defineProperty({__proto__:null,default:vct},
Symbol.toStringTag,{value:"Module"}));
class Kct extends $i{constructor(){super(),this._transitionType="enter",this._transitionName="page-turn"}_play(){const t=this.$gsap.timeline({defaults:{duration:.75,ease:"power3.in"},
onComplete:()=>{this._done(),this.$lenis.unfreeze()}});
t.from(".case-hero-title .char",{xPercent:150,opacity:0,duration:.5,stagger:-.025,ease:"power2.out"},
.2),t.fromTo(".case-folder__cover",{rotateY:0},
{rotateY:-180},
0),t.from(".scrapbook-item",{y:"50vh",duration:.5,ease:"power3.out",clearProps:"y"},
.55),t.fromTo(".case-folder__cover__front__shadow",{opacity:1},
{opacity:0},
0)}}const Hct=Object.freeze(Object.defineProperty({__proto__:null,default:Kct},
Symbol.toStringTag,{value:"Module"}));
class Pct extends $i{constructor(){super(),this._transitionType="leave",this._transitionName="page-turn"}_play(){this.$gsap.set(".case-hero-title",{zIndex:0});
const t=this.$gsap.timeline({defaults:{duration:.75,ease:"power3.out"},
onStart:()=>{this.$lenis.freeze(),this.$lenis.scrollTo(0,{duration:t.duration(),force:!0})},
onComplete:()=>{this._done()}});
t.to(".scrapbook-item",{y:"50vh",duration:.25,ease:"power2.in"},
0),t.to(".case-hero-title .char",{xPercent:150,opacity:0,duration:.5,stagger:.02},
.15),t.fromTo(".case-folder__cover",{rotateY:-180},
{rotateY:0},
.15),t.fromTo(".case-folder__cover__front__shadow",{opacity:0},
{opacity:1},
.15)}}const Bct=Object.freeze(Object.defineProperty({__proto__:null,default:Pct},
Symbol.toStringTag,{value:"Module"})),KE=(l,t,e)=>{const i=l.timeline({defaults:{duration:1,ease:"power3.out"},
onStart:()=>{t.unfreeze(),t.scrollTo(0,{immediate:!0,force:!0})},
onComplete:()=>{e&&e()}});
i.from(".page-about__inner",{y:"60vh",opacity:0}),i.from(".about-gallery",{y:"-60vh"},
0),i.from(".page-about__close",{y:"60vh",opacity:0},
0),i.from(".about-gallery__inner",{yPercent:100},
0),i.from(".about-gallery__images",{yPercent:-100},
0),i.from([".page-about__title",".page-about__desc"],{opacity:0},
.3)};
class rR extends $i{constructor(){super(),this._transitionType="enter"}_play(){KE(this.$gsap,this.$lenis,this._done.bind(this))}}const Qct=Object.freeze(Object.defineProperty({__proto__:null,aboutTransition:KE,default:rR},
Symbol.toStringTag,{value:"Module"}));
class WR extends $i{constructor(){super(),this._transitionType="leave"}_play(){const t=this.$gsap.timeline({defaults:{duration:.75,ease:"power3.out"},
onStart:()=>{this.$lenis.freeze()},
onComplete:()=>{this._complete(),this._done()}});
t.to(".page-about__inner",{y:"60vh",opacity:0}),t.to(".page-about__close",{y:"60vh",opacity:0},
0),t.to(".about-gallery",{y:"-60vh"},
0),t.to(".about-gallery__inner",{yPercent:100},
0),t.to(".about-gallery__images",{yPercent:-100},
0),t.to([".page-about__title",".page-about__desc"],{opacity:0,duration:.3},
0)}}const Act=Object.freeze(Object.defineProperty({__proto__:null,default:WR},
Symbol.toStringTag,{value:"Module"}));
class _ct extends $i{constructor(){super(),this._transitionType="enter",this._transitionName="about-to-case"}_play(){const t=this.$gsap.timeline({defaults:{duration:1,ease:"power3.out"},
onStart:()=>{this.$lenis.unfreeze()},
onComplete:()=>{this._done()}});
t.from(".page-case__content",{x:"-100vw",duration:.9},
0),t.from(".case-hero-title",{x:"-50vw",duration:.9},
0),t.from(".case-folder-sheet",{x:"-10vw",duration:1},
0),t.from(".scrapbook-item",{x:"-100vw"},
0)}}const qct=Object.freeze(Object.defineProperty({__proto__:null,default:_ct},
Symbol.toStringTag,{value:"Module"}));
class $ct extends WR{constructor(){super(),this._transitionName="about-to-case"}_complete(){this._restoreScrollPosition()}}const tat=Object.freeze(Object.defineProperty({__proto__:null,default:$ct},
Symbol.toStringTag,{value:"Module"}));
class eat extends $i{constructor(){super(),this._transitionType="enter",this._transitionName="about-to-home"}_play(){const t=this.$gsap.timeline({defaults:{duration:.75,ease:"power3.out"},
onComplete:()=>{this.$lenis.unfreeze(),this._done()}});
t.from([".section-hero__desc",".section-hero__title"],{y:"-50vh",stagger:.1},
.25),t.from(".stack",{yPercent:60,duration:.5,ease:"power4.inOut"},
0),t.from(".stack-group",{yPercent:200,scale:1.75,duration:.5,stagger:.015,ease:"power4.inOut",clearProps:"scale, transform"},
0)}}const lat=Object.freeze(Object.defineProperty({__proto__:null,default:eat},
Symbol.toStringTag,{value:"Module"}));
class iat extends WR{constructor(){super(),this._transitionName="about-to-home"}_complete(){this._scrollToTop()}}const sat=Object.freeze(Object.defineProperty({__proto__:null,default:iat},
Symbol.toStringTag,{value:"Module"}));
class nat extends rR{constructor(){super(),this._transitionName="case-to-about"}}const cat=Object.freeze(Object.defineProperty({__proto__:null,default:nat},
Symbol.toStringTag,{value:"Module"}));
class aat extends $i{constructor(){super(),this._transitionType="leave",this._transitionName="case-to-about"}_play(){const t=this.$gsap.timeline({defaults:{duration:1,ease:"power3.inOut"},
onStart:()=>{this._saveScrollPosition(),this.$lenis.freeze()},
onComplete:()=>{this._done()}});
t.to(".page-case__content",{x:"-100vw"},
0),t.to(".case-folder-sheet",{x:"-10vw",duration:.9},
0),t.to(".scrapbook-item",{x:"-100vw",duration:.9},
0)}}const dat=Object.freeze(Object.defineProperty({__proto__:null,default:aat},
Symbol.toStringTag,{value:"Module"}));
class Zat extends rR{constructor(){super(),this._transitionName="home-to-about"}}const oat=Object.freeze(Object.defineProperty({__proto__:null,default:Zat},
Symbol.toStringTag,{value:"Module"}));
class mat extends $i{constructor(){super(),this._transitionType="leave",this._transitionName="home-to-about"}_play(){this.$gsap.set(".stack",{transformOrigin:"top",pointerEvents:"none"});
const t=this.$gsap.timeline({defaults:{duration:.75,ease:"power3.inOut"},
onStart:()=>{this.$lenis.freeze(),this.$lenis.scrollTo(0,{duration:t.duration(),force:!0})},
onComplete:()=>{this._done()}});
t.to([".section-hero__title",".section-hero__desc"],{y:"-50vh",stagger:.1},
0),t.to(".stack",{yPercent:60,scale:1.75},
0)}}const uat=Object.freeze(Object.defineProperty({__proto__:null,default:mat},
Symbol.toStringTag,{value:"Module"}));
