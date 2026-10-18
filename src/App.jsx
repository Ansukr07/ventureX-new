import { useEffect, useState } from 'react'
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
function Footer(){return <footer className="folder-footer"><div className="scale"><span/><small>0  4  8  16　　　　 32</small></div><span>© 2026</span><a href="https://tubikstudio.com/" target="_blank" rel="noreferrer">CRAFTED WITH ♥ BY <u>TUBIK STUDIO</u></a><span className="footer-seal">◕</span></footer>}
function CompassRow(){return <div className="compass-row" aria-hidden="true">{Array.from({length:7},(_,i)=><span className={'compass compass-'+i} key={i}><i/>N</span>)}</div>}
function TabShape({name}){const path="M1.1449 0H-521.145C-531.065 0-540.343 4.90374-545.932 13.0999L-558.55 31.6066C-563.837 39.3607-572.615 44-582 44H62C52.6151 44 43.8369 39.3607 38.5499 31.6066L25.9318 13.0999C20.3434 4.90373 11.0649 0 1.1449 0Z";return <><svg className="tab-side tab-start" viewBox="0 0 62 44" preserveAspectRatio="none" aria-hidden="true"><path d={path} fill="currentColor"/></svg><span className="tab-middle">{name}</span><svg className="tab-side tab-end" viewBox="0 0 62 44" preserveAspectRatio="none" aria-hidden="true"><path d={path} fill="currentColor"/></svg></>}
function Home({go}){
 const [active,setActive]=useState(3)
 const [hoveredFile,setHoveredFile]=useState(null)
 useEffect(()=>{document.title='Mosby’s Files—American Modernist Architecture'},[])
 return <main className="home">
  <section className="intro" id="hero"><h1>VENTURE X</h1></section>
  <section className="archive"><div className="stack">{groups.map((g,i)=>{
   const previewIndex=hoveredFile?.group===i?hoveredFile.index:g.files[0]
   const showPreview=hoveredFile?.group===i
   return <article key={g.label} onMouseLeave={()=>setHoveredFile(null)} className={'folder '+(active===i?'open':'')+(showPreview?' has-file-preview':'')} style={{'--color':g.color,'--preview-color':cases[previewIndex].color,'--preview-ink':cases[previewIndex].slug==='i-m-pei'?'#191919':'#fff','--i':i,'--after':i>active?1:0}}>
    <div className="tab-row" style={{zIndex:i*4+(showPreview?7:2)}}>{g.files.map(index=><Link key={index} to={'/cases/'+cases[index].slug} go={go} className={'folder-tab '+(cases[index].slug==='i-m-pei'?'tab-dark':'')} style={{'--tab-color':cases[index].color}} onMouseEnter={()=>setHoveredFile({group:i,index})} onFocus={()=>setHoveredFile({group:i,index})} onBlur={()=>setHoveredFile(null)}><TabShape name={cases[index].name}/></Link>)}</div>
    <div className="cover-lip" aria-hidden="true"/>
    <div className="folder-face" style={{zIndex:i*4+1}} role="button" tabIndex={0} onClick={()=>setActive(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setActive(i)}}} aria-expanded={active===i} aria-label={g.label+' folder'}><span className="folder-category">{g.label} <b>{active===i?'⌄':'‹'}</b></span><span className="folder-description">{g.description}</span>{active===i&&<div className="folder-open-content"><CompassRow/><Footer/></div>}</div>
    <div className={'file-preview-cover'+(showPreview?' is-active':'')} style={{zIndex:i*4+6}} aria-hidden="true"><span className="folder-category">{g.label} <b>{active===i?'⌄':'‹'}</b></span></div>
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
