import './style.css'
import playerIcon from './assets/images/Icon_Smiley.png'
import coinIcon from './assets/images/coin_nobg.png'
import alarmSound from './assets/sounds/mixkit-classic-alarm-995.wav'

type Account = {
  username: string
  password: string
}

const accountsKey = 'stume-accounts'
const currentUserKey = 'stume-current-user'
const coinsKey = 'stume-coins'
const app = document.querySelector<HTMLDivElement>('#app')!
const alarm = new Audio(alarmSound)

let studyTimerRemaining = 0
let studyTimerRunning = false
let studyTimerInterval: number | null = null
let studyTimerEndsAt: number | null = null

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

const getCoins = (username: string | null) => {
  if (!username) {
    return 0
  }

  try {
    const storedCoins = JSON.parse(localStorage.getItem(coinsKey) ?? '{}')
    return typeof storedCoins[username] === 'number' ? storedCoins[username] : 0
  } catch {
    return 0
  }
}

const addCoins = (amount: number) => {
  const username = localStorage.getItem(currentUserKey)
  if (!username) {
    return
  }

  let storedCoins: Record<string, number> = {}
  try {
    const parsedCoins = JSON.parse(localStorage.getItem(coinsKey) ?? '{}')
    if (parsedCoins && typeof parsedCoins === 'object') {
      storedCoins = parsedCoins
    }
  } catch {
    storedCoins = {}
  }

  storedCoins[username] = getCoins(username) + amount
  localStorage.setItem(coinsKey, JSON.stringify(storedCoins))
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

const updateTimerDisplay = () => {
  const timerDisplay = document.querySelector<HTMLElement>('[data-study-timer]')
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(studyTimerRemaining)
  }
}

const stopStudyTimerInterval = () => {
  if (studyTimerInterval !== null) {
    window.clearInterval(studyTimerInterval)
    studyTimerInterval = null
  }
}

const updateStudyTimerRemaining = () => {
  if (!studyTimerRunning || studyTimerEndsAt === null) {
    return
  }

  studyTimerRemaining = Math.max(0, Math.ceil((studyTimerEndsAt - Date.now()) / 1000))
  updateTimerDisplay()

  if (studyTimerRemaining <= 0) {
    finishStudyTimer()
  }
}

const finishStudyTimer = () => {
  stopStudyTimerInterval()
  studyTimerEndsAt = null
  studyTimerRemaining = 0
  studyTimerRunning = false
  addCoins(25)
  void alarm.play().catch((error: unknown) => {
    console.error('Unable to play the study timer alarm.', error)
  })
  renderHome()
}

const startStudyTimer = (durationSeconds: number) => {
  stopStudyTimerInterval()
  studyTimerRemaining = studyTimerRemaining > 0
    ? Math.min(studyTimerRemaining, durationSeconds)
    : durationSeconds
  studyTimerRunning = true
  studyTimerEndsAt = Date.now() + studyTimerRemaining * 1000
  renderStudyTimer()
  updateTimerDisplay()
  studyTimerInterval = window.setInterval(() => {
    updateStudyTimerRemaining()
  }, 250)
}

const leaveStudyTimer = () => {
  updateStudyTimerRemaining()
  stopStudyTimerInterval()
  if (studyTimerRemaining > 0) {
    studyTimerRemaining += 2 * 60
  }
  studyTimerRunning = false
  studyTimerEndsAt = null
  renderHome()
}

const renderStudyTimer = () => {
  app.innerHTML = `
    <main class="study-page">
      <header class="topbar">
        <a class="mini-brand" href="/" aria-label="stume home">${brandMarkup}</a>
        <button class="auth-link" data-study-action="back" type="button">go back</button>
      </header>

      <section class="study-timer-card" role="timer" aria-live="polite">
        <p class="eyebrow"></p>
        <h1></h1>
        <strong data-study-timer>${formatTime(studyTimerRemaining)}</strong>
        <p class="timer-note">stay focused!!</p>
        <div class="timer-controls">
          <button class="action-button timer-control-button" data-study-action="pause" type="button">
            <span class="button-label">${studyTimerRunning ? 'pause' : 'resume'}</span>
          </button>
          <button class="admin-timer-button" data-study-action="admin" type="button">admin: set to 5 sec</button>
        </div>
        <p class="timer-warning"></p>
      </section>
    </main>
  `
}

const renderHome = () => {
  const currentUser = localStorage.getItem(currentUserKey)
  const coins = getCoins(currentUser)
  const accountControls = currentUser
    ? `<span class="welcome-user">Hi ${escapeHtml(currentUser)}!!</span><span class="coin-balance"><img src="${coinIcon}" alt="" aria-hidden="true" /><span>${coins}</span></span><button class="auth-link" data-auth-action="logout" type="button">log out</button>`
    : `<button class="auth-link login-link" data-auth-action="login" type="button">log in</button><button class="auth-button" data-auth-action="signup" type="button">sign up <span aria-hidden="true"></span></button>`

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
        <p class="eyebrow"></p>
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
      <button class="action-button start-button" data-study-action="start" type="button">
        <span class="button-icon icon-play" aria-hidden="true">▶</span>
        <span class="button-label">start studying</span>
        <span class="button-arrow" aria-hidden="true"></span>
      </button>

      <div class="secondary-actions">
        <button class="action-button secondary-button shop-button" type="button">
          <span class="button-icon" aria-hidden="true">✦</span>
          <span class="button-label">shop</span>
          <span class="button-arrow" aria-hidden="true"></span>
        </button>
        <button class="action-button secondary-button wardrobe-button" type="button">
          <span class="button-icon" aria-hidden="true">✿</span>
          <span class="button-label">wardrobe</span>
          <span class="button-arrow" aria-hidden="true"></span>
        </button>
        <button class="action-button secondary-button friends-button" type="button">
          <span class="button-icon" aria-hidden="true">●●</span>
          <span class="button-label">friends</span>
          <span class="button-arrow" aria-hidden="true"></span>
        </button>
        <button class="action-button secondary-button progress-button" type="button">
          <span class="button-icon" aria-hidden="true">↗</span>
          <span class="button-label">progress</span>
          <span class="button-arrow" aria-hidden="true"></span>
          
        </button>
      </div>
    </section>

  </main>
`
}
//there was a ↗ sign by each button but i didn't like it so i removed it

const renderAuth = (mode: 'login' | 'signup', message = '') => {
  const isSignup = mode === 'signup'

  app.innerHTML = `
    <main class="auth-page">
      <header class="topbar">
        <a class="mini-brand" href="/" aria-label="stume home">${brandMarkup}</a>
        <button class="auth-link" data-auth-action="home" type="button">back home</button>
      </header>

      <section class="auth-card" aria-labelledby="auth-title">
        <p class="eyebrow">${isSignup ? 'new player' : ''}</p>
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
            <span class="button-arrow" aria-hidden="true"></span>
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
  const studyAction = target.closest<HTMLElement>('[data-study-action]')?.dataset.studyAction

  if (studyAction === 'start') {
    startStudyTimer(25 * 60)
    return
  }

  if (studyAction === 'admin') {
    startStudyTimer(5)
    return
  }

  if (studyAction === 'pause') {
    if (studyTimerRunning) {
      updateStudyTimerRemaining()
      if (!studyTimerRunning) {
        return
      }

      studyTimerRunning = false
      stopStudyTimerInterval()
      studyTimerEndsAt = null
    } else {
      studyTimerRunning = true
      studyTimerEndsAt = Date.now() + studyTimerRemaining * 1000
      studyTimerInterval = window.setInterval(() => {
        updateStudyTimerRemaining()
      }, 250)
    }
    renderStudyTimer()
    return
  }

  if (studyAction === 'back') {
    leaveStudyTimer()
    return
  }

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
