import { useEffect, useRef, useState } from 'react'
import cases from './cases.json'
import about from './about.json'
import './App.css'

const groups=[
 {color:'#1E4BD7',label:'Organic & Early Modernism',description:'The movement that broke from European convention before Europe finished writing its manifesto. Buildings designed around human life, natural landscape, and open space — where structure followed environment, not the other way around. The root system beneath everything American Modernism would later become.',files:[0,1]},
 {color:'#0C7C68',label:'Expressive',description:'Where function alone was never enough. These architects pushed form, material, and structure into territory that was confrontational, sculptural, and deeply personal. Every surface carried an argument, every material choice a point of view. Buildings that refused to stand quietly in the background and never apologized for it.',files:[2]},
 {color:'#592070',label:'Monumental Modernism',description:'Architecture at the scale of civilization — civic, institutional, and built to outlast the moment. These buildings draw on mass, geometry, and the precise control of light to create spaces that feel both inevitable and timeless. Modernism stripped of sentimentality, left with only what matters.',files:[3,4,5]},
 {color:'#D71E1E',label:'Contextual & Transitional Architecture',description:'Architecture shaped by place, culture, and continuity rather than formal invention alone. Mix of tradition and modernity through local materials, historical reference, and environmental logic that resist the impulse to impose and choose instead to belong. A quiet but foundational thread in the fabric of American architectural identity.',files:[6,7]}
]
function useRoute(){const [path,setPath]=useState(location.pathname);useEffect(()=>{const f=()=>setPath(location.pathname);addEventListener('popstate',f);return()=>removeEventListener('popstate',f)},[]);function go(next){if(next!==location.pathname){history.pushState({},'',next);setPath(next)}window.scrollTo({top:0,behavior:'instant'})}return[path,go]}
function Link({to,go,children,...props}){return <a href={to} onClick={e=>{e.preventDefault();go(to)}} {...props}>{children}</a>}
function Footer(){return <footer className="folder-footer"><img className="scale" src="/footer/scale.svg" alt="Architectural scale"/><span className="footer-year">© 2026</span><a href="https://tubikstudio.com/" target="_blank" rel="noreferrer"><span>CRAFTED WITH ♥ BY <u>TUBIK STUDIO</u></span><img className="footer-seal" src="/footer/tubik_logo.svg" alt="Tubik Studio"/></a></footer>}
const compassImages=['f.png','f-1.png','f-2.avif','f-3.png','f-4.png','f-5.png','f-6.avif']
function CompassRow(){
 const row=useRef(null)
 useEffect(()=>{
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame=0
  let pointer=null
  const draw=()=>{
   frame=0
   if(!pointer||motion.matches)return
   // Measure unrotated wrappers before updating the image transforms.
   const compasses=Array.from(row.current?.children??[])
   const angles=compasses.map(el=>{
    const rect=el.getBoundingClientRect()
    return Math.atan2(pointer.y-rect.top-rect.height/2,pointer.x-rect.left-rect.width/2)*180/Math.PI+45
   })
   compasses.forEach((el,i)=>{el.firstElementChild.style.transform=`rotate(${angles[i]}deg)`})
  }
  const move=e=>{
   if(e.pointerType==='touch'||motion.matches)return
   pointer={x:e.clientX,y:e.clientY}
   if(!frame)frame=requestAnimationFrame(draw)
  }
  const reset=()=>{
   if(frame)cancelAnimationFrame(frame)
   frame=0
   for(const el of row.current?.children??[])el.firstElementChild.style.transform=''
  }
  window.addEventListener('pointermove',move,{passive:true})
  motion.addEventListener('change',reset)
  return()=>{
   window.removeEventListener('pointermove',move)
   motion.removeEventListener('change',reset)
   if(frame)cancelAnimationFrame(frame)
  }
 },[])
 return <div ref={row} className="compass-row" aria-hidden="true">{compassImages.map((src,i)=><span className={'compass'+(i===0||i===3?' hide-on-mobile':'')} key={src}><img src={'/footer/'+src} alt="" draggable="false"/></span>)}</div>
}
function TabShape({name}){const path="M1.1449 0H-521.145C-531.065 0-540.343 4.90374-545.932 13.0999L-558.55 31.6066C-563.837 39.3607-572.615 44-582 44H62C52.6151 44 43.8369 39.3607 38.5499 31.6066L25.9318 13.0999C20.3434 4.90373 11.0649 0 1.1449 0Z";return <><svg className="tab-side tab-start" viewBox="0 0 62 44" preserveAspectRatio="none" aria-hidden="true"><path d={path} fill="currentColor"/></svg><span className="tab-middle">{name}</span><svg className="tab-side tab-end" viewBox="0 0 62 44" preserveAspectRatio="none" aria-hidden="true"><path d={path} fill="currentColor"/></svg></>}
function Home({go}){
 const [hovered,setHovered]=useState(null)
 const [unfolded,setUnfolded]=useState(false)
 function preview(group,page){
  setHovered({group,page})
  setUnfolded(false)
 }
 function resetPreview(){
  setHovered(null)
  setUnfolded(false)
 }
 useEffect(()=>{document.title='Mosby’s Files—American Modernist Architecture'},[])
 return <main className="home">
  <section className="intro" id="hero"><h1>VENTURE X</h1></section>
  <section className="archive"><div className="stack">{groups.map((g,i)=>{
   const selected=hovered?.group===i
   const later=hovered!==null&&i>hovered.group
   const expanded=selected||(!hovered&&i===groups.length-1)
   return <article key={g.label} onMouseLeave={resetPreview}
    className={'folder'+(later?' is-rotated':'')+(later&&unfolded?' is-unfolded':'')}
    style={{'--color':cases[g.files[0]].color,'--i':i,'--remaining':groups.length-i-1}}>
    <div className="folder-inner">
     <div className={'folder-face'+(selected?' is-rotated':'')+(selected&&hovered.page===0?' is-hovered':'')+(expanded?' is-unfolded':'')}>
      <span className="folder-category"><span className="folder-category-label">{g.label}</span><svg className="folder-category-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M2.5 3.75L6.17542 8.25L9.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
      <span className="folder-description">{g.description}</span>
      {i===groups.length-1&&<div className="folder-open-content"><CompassRow/><Footer/></div>}
     </div>
     {g.files.map((index,page)=><Link key={index} to={'/cases/'+cases[index].slug} go={go}
      className={'folder-sheet'+(selected&&page<hovered.page?' is-rotated':'')}
      style={{'--sheet-color':cases[index].color,'--page':page}}
      aria-label={'Explore '+cases[index].name}
      onMouseEnter={()=>preview(i,page)} onFocus={()=>preview(i,page)}
      onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))resetPreview()}}>
      <span className="tab-row" aria-hidden="true">{g.files.map((tabIndex,slot)=><span key={tabIndex}
       className={'folder-tab'+(slot===page?' is-visible':'')+(cases[index].slug==='i-m-pei'?' tab-dark':'')}
       style={{'--tab-color':cases[index].color}}><TabShape name={cases[tabIndex].name}/></span>)}</span>
      <span className="folder-unfold-area" onMouseEnter={()=>setUnfolded(true)} onMouseLeave={()=>setUnfolded(false)}/>
     </Link>)}
    </div>
   </article>
  })}</div></section>
 </main>
}
function FilePage({entry,go}){
 const group=groups.find(g=>g.files.some(i=>cases[i].slug===entry.slug))
 const peers=group.files.map(i=>cases[i])
 const [preview,setPreview]=useState(null)
 const shown=peers.find(item=>item.slug===preview) || entry
 useEffect(()=>{document.title=entry.name+'—Mosby’s Files'},[entry])
 return <main className="case-page" key={entry.slug} style={{'--case-color':shown.color}}>
  <section className="case-hero"><h1>{shown.name}</h1></section>
  <div className="case-folder">
   <div className="case-edge">{peers.map(item=><Link key={item.slug} to={'/cases/'+item.slug} go={go} className={item.slug===entry.slug?'current':''} style={{'--peer-color':item.color}} onMouseEnter={()=>setPreview(item.slug)} onMouseLeave={()=>setPreview(null)} onFocus={()=>setPreview(item.slug)} onBlur={()=>setPreview(null)}>{item.name}</Link>)}</div>
   <div className="case-content-switch" key={shown.slug}>
    <article className="paper dossier"><div className="holes" aria-hidden="true">{Array.from({length:9},(_,i)=><i key={i}/>)}</div><div className="dossier-left"><div className="portrait"><img src={shown.images[0]} alt={shown.name}/><span className="paperclip" aria-hidden="true"/></div><div className="life-info">{shown.info.map((line,i)=><p key={i} className={i%2===0?'info-label':''}>{line}</p>)}</div></div><div className="bio">{shown.bio.map((p,i)=><p key={i} className={i===0?'dropcap':''}>{p}</p>)}</div></article>
    <div className="projects">{shown.notes.map((note,i)=><section className={'project project-'+i} key={i}><div className="project-photos">{shown.images.slice(1+i*2,3+i*2).map((src,j)=><a href={src} target="_blank" rel="noreferrer" className="project-photo" key={src} aria-label={'Open image of '+note.title}><img src={src} alt={note.title+' photograph '+(j+1)} loading="lazy"/></a>)}</div><div className="project-note paper"><h2>{note.title}</h2><p>{note.text}</p></div></section>)}{shown.images.length>shown.notes.length*2+1&&<div className="extra-photos">{shown.images.slice(1+shown.notes.length*2).map((src,i)=><img key={src} src={src} alt={shown.name+' archival image '+(i+1)} loading="lazy"/>)}</div>}</div>
   </div>
  </div>
  <div className="case-bottom"><p>EXPLORE THE FILES</p><div>{cases.filter(c=>c.slug!==entry.slug).slice(0,4).map(c=><Link key={c.slug} to={'/cases/'+c.slug} go={go}>{c.name} ↗</Link>)}</div></div>
 </main>
}
function About({go}){useEffect(()=>{document.title='About Mosby’s Files—The Archive & The Idea'},[]);return <main className="about-page"><article className="about-paper paper"><button className="about-close" onClick={()=>go('/')} aria-label="Close About">×</button><h1>{about.title}</h1>{about.images[0]&&<figure><img src={about.images[0]} alt="Salk Institute by Louis Kahn"/><figcaption>{about.texts[0]}</figcaption></figure>}{about.texts.slice(4,-1).map((p,i)=><div key={i}>{i===5&&about.images[1]&&<figure><img src={about.images[1]} alt="National Assembly Building"/><figcaption>{about.texts[1]}</figcaption></figure>}{i===9&&about.images[2]&&<figure><img src={about.images[2]} alt="Yale Art and Architecture Building"/><figcaption>{about.texts[2]}</figcaption></figure>}<p>{p}</p></div>)}<p className="signature">{about.texts.at(-1)}</p></article></main>}
export default function App(){const [path,go]=useRoute();const entry=cases.find(c=>path==='/cases/'+c.slug);return <div className="app">{entry?<FilePage key={entry.slug} entry={entry} go={go}/>:path==='/about'?<About go={go}/>:<Home go={go}/>}</div>}
