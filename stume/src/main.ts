import './style.css'
import playerIcon from './assets/images/Icon_Smiley.png'

type Account = {
  username: string
  password: string
}

const accountsKey = 'stume-accounts'
const currentUserKey = 'stume-current-user'
const app = document.querySelector<HTMLDivElement>('#app')!

const brandMarkup = `
  <span class="brand-letter brand-s">s</span><span class="brand-letter brand-t">t</span><span class="brand-letter brand-u">u</span><span class="brand-letter brand-m">m</span><span class="brand-letter brand-e">e</span>
`

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const getAccounts = (): Account[] => {
  const storedAccounts = localStorage.getItem(accountsKey)

  if (!storedAccounts) {
    return []
  }

  try {
    const accounts = JSON.parse(storedAccounts)
    return Array.isArray(accounts)
      ? accounts.filter((account): account is Account =>
          typeof account?.username === 'string' && typeof account?.password === 'string')
      : []
  } catch {
    return []
  }
}

const setCurrentUser = (username: string | null) => {
  if (username) {
    localStorage.setItem(currentUserKey, username)
  } else {
    localStorage.removeItem(currentUserKey)
  }
}

const renderHome = () => {
  const currentUser = localStorage.getItem(currentUserKey)
  const accountControls = currentUser
    ? `<span class="welcome-user">hi, ${escapeHtml(currentUser)}</span><button class="auth-link" data-auth-action="logout" type="button">log out</button>`
    : `<button class="auth-link" data-auth-action="login" type="button">log in</button><button class="auth-button" data-auth-action="signup" type="button">sign up <span aria-hidden="true">↗</span></button>`

  app.innerHTML = `
  <main class="home">
    <header class="topbar">
      <a class="mini-brand" href="/" aria-label="stume home">${brandMarkup}</a>
      <div class="auth-controls">${accountControls}</div>
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
      <h2>${currentUser ? escapeHtml(currentUser) : 'Player'}</h2>
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
}

const renderAuth = (mode: 'login' | 'signup', message = '') => {
  const isSignup = mode === 'signup'

  app.innerHTML = `
    <main class="auth-page">
      <header class="topbar">
        <a class="mini-brand" href="/" aria-label="stume home">${brandMarkup}</a>
        <button class="auth-link" data-auth-action="home" type="button">back home</button>
      </header>

      <section class="auth-card" aria-labelledby="auth-title">
        <p class="eyebrow">${isSignup ? 'new player' : 'welcome back'}</p>
        <h1 id="auth-title">${isSignup ? 'sign up' : 'log in'}</h1>
        <p class="auth-intro">${isSignup ? '' : ''}</p>
        <form class="auth-form" data-auth-form="${mode}">
          <label for="username">username</label>
          <input id="username" name="username" type="text" minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" autocomplete="username" required />
          <label for="password">password</label>
          <input id="password" name="password" type="password" minlength="6" autocomplete="${isSignup ? 'new-password' : 'current-password'}" required />
          <p class="form-message${message ? ' is-visible' : ''}" role="alert">${message}</p>
          <button class="action-button start-button auth-submit" type="submit">
            <span class="button-label">${isSignup ? 'create account' : 'log in'}</span>
            <span class="button-arrow" aria-hidden="true">↗</span>
          </button>
        </form>
        <p class="auth-switch">${isSignup ? 'already have an account?' : 'new to stume?'}
          <button class="text-button" data-auth-action="${isSignup ? 'login' : 'signup'}" type="button">${isSignup ? 'log in' : 'sign up'}</button>
        </p>
      </section>
    </main>
  `
}

const showAuthError = (message: string) => {
  const formMessage = document.querySelector<HTMLParagraphElement>('.form-message')
  if (formMessage) {
    formMessage.textContent = message
    formMessage.classList.add('is-visible')
  }
}

renderHome()

app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const actionElement = target.closest<HTMLElement>('[data-auth-action]')
  const action = actionElement?.dataset.authAction

  if (action === 'login' || action === 'signup') {
    renderAuth(action)
  } else if (action === 'home') {
    renderHome()
  } else if (action === 'logout') {
    setCurrentUser(null)
    renderHome()
  }
})

app.addEventListener('submit', (event) => {
  const form = event.target as HTMLFormElement
  const mode = form.dataset.authForm

  if (mode !== 'login' && mode !== 'signup') {
    return
  }

  event.preventDefault()
  const formData = new FormData(form)
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const accounts = getAccounts()
  const normalizedUsername = username.toLowerCase()

  if (mode === 'signup') {
    if (accounts.some((account) => account.username.toLowerCase() === normalizedUsername)) {
      showAuthError('that username is already taken.')
      return
    }

    accounts.push({ username, password })
    localStorage.setItem(accountsKey, JSON.stringify(accounts))
    setCurrentUser(username)
    renderHome()
    return
  }

  const account = accounts.find((item) => item.username.toLowerCase() === normalizedUsername && item.password === password)
  if (!account) {
    showAuthError('username or password is incorrect.')
    return
  }

  setCurrentUser(account.username)
  renderHome()
})
