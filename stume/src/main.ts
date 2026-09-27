import './style.css'
import playerIcon from './assets/images/Icon_Smiley.png'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="home">
    <header class="topbar">
      <a class="mini-brand" href="/" aria-label="stume home">
        <span class="brand-letter brand-s">s</span><span class="brand-letter brand-t">t</span><span class="brand-letter brand-u">u</span><span class="brand-letter brand-m">m</span><span class="brand-letter brand-e">e</span>
      </a>
      <div class="topbar-note"><span class="status-dot"></span></div>
    </header>


    <section class="hero" aria-labelledby="welcome-title">
      <div class="doodle doodle-star" aria-hidden="true"></div>
      <div class="doodle doodle-spark" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow">welcome to</p>
        <h1 id="welcome-title" class="wordmark" aria-label="stume">
          <span class="brand-letter brand-s">s</span><span class="brand-letter brand-t">t</span><span class="brand-letter brand-u">u</span><span class="brand-letter brand-m">m</span><span class="brand-letter brand-e">e</span>
        </h1>
        <p class="tagline"><br><span></span></p>
      </div>
    </section>

    <section class="player-showcase" aria-label="Player">
      <h2>Player</h2>
      <img src="${playerIcon}" alt="Player icon" />
    </section>

    <section class="actions" aria-label="Study actions">
      <button class="action-button start-button" type="button">
        <span class="button-icon icon-play" aria-hidden="true">▶</span>
        <span class="button-label">start studying</span>
        <span class="button-arrow" aria-hidden="true">↗</span>
      </button>

      <div class="secondary-actions">
        <button class="action-button secondary-button shop-button" type="button">
          <span class="button-icon" aria-hidden="true">✦</span>
          <span class="button-label">shop</span>
          <span class="button-arrow" aria-hidden="true">↗</span>
        </button>
        <button class="action-button secondary-button wardrobe-button" type="button">
          <span class="button-icon" aria-hidden="true">✿</span>
          <span class="button-label">wardrobe</span>
          <span class="button-arrow" aria-hidden="true">↗</span>
        </button>
        <button class="action-button secondary-button friends-button" type="button">
          <span class="button-icon" aria-hidden="true">●●</span>
          <span class="button-label">friends</span>
          <span class="button-arrow" aria-hidden="true">↗</span>
        </button>
        <button class="action-button secondary-button progress-button" type="button">
          <span class="button-icon" aria-hidden="true">↗</span>
          <span class="button-label">progress</span>
          <span class="button-arrow" aria-hidden="true">↗</span>
        </button>
      </div>
    </section>

    
  </main>
`
