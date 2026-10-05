import './App.css'
import GlassField from './GlassField'

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="VentureX home">VENTURE<span>X</span></a>
        <nav aria-label="Main navigation"><a href="#about">About</a><a href="#pitch">The pitch</a></nav>
        <a className="header-link" href="#pitch">Explore the event <ArrowIcon /></a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-heading-wrap">
            <h1 id="hero-title">VENTURE<span>X</span></h1>
            <svg className="hero-star" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0 59 34 83 13 68 43 100 50 68 57 83 87 59 66 50 100 41 66 17 87 32 57 0 50 32 43 17 13 41 34Z" /></svg>
          </div>
          <p className="hero-statement">Where student ideas meet the people who can move them forward.</p>
          <div className="hero-actions">
            <a className="primary-action" href="#pitch">Discover the pitch <ArrowIcon /></a>
            <a className="secondary-action" href="#about">About VentureX <ArrowIcon /></a>
          </div>
          <div className="hero-footnote"><span className="footnote-mark" /> <span>Student led startups</span><span className="footnote-cross">×</span><span>Venture capital</span></div>
        </div>

        <div className="hero-visual" aria-label="Interactive glass cubes over a blue, lavender, and white gradient" role="img">
          <div className="glass-window">
            <div className="window-toolbar" aria-hidden="true">
              <span className="window-title"><span className="window-title-dot" /> VENTUREX.EXE</span>
              <span className="window-controls"><i /><i /><i /></span>
            </div>
            <div className="window-art">
              <GlassField />
              <span className="interaction-hint" aria-hidden="true"><span className="hint-dot" /> Move to explore</span>
            </div>
          </div>
        </div>
      </section>

      <section className="intro" id="about">
        <p className="intro-label">THE STAGE IS SET</p>
        <h2>Big ideas deserve a <em>bigger</em> room.</h2>
        <p>VentureX brings student led startups and venture capital investors together for a pitch competition built around new possibilities.</p>
      </section>

      <section className="pitch-strip" id="pitch">
        <span>YOUR IDEA COULD BE NEXT</span>
        <p>Take the stage. Make your case. Move your venture forward.</p>
        <a href="#top" aria-label="Back to top"><ArrowIcon /></a>
      </section>
    </main>
  )
}

export default App
