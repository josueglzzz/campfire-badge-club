const taps = [
  {id:1,name:'Bosque IPA',    style:'India Pale Ale', price:85, on:true },
  {id:2,name:'Fuego Negro',   style:'Imperial Stout', price:95, on:true },
  {id:3,name:'Amber Trail',   style:'American Amber', price:80, on:true },
  {id:4,name:'Cedar Wheat',   style:'Witbier',        price:75, on:true },
  {id:5,name:'Smoke & Oak',   style:'Rauchbier',      price:90, on:true },
  {id:6,name:'Campfire Lager',style:'Munich Lager',   price:70, on:true },
  {id:7,name:'Pino Bitter',   style:'English Bitter', price:78, on:false},
  {id:8,name:'Night Saison',  style:'Saison',         price:88, on:false},
]
let ageGateDest = 'home'

// Screens that show main nav
const mainScreens = ['s-home','s-ontap','s-ranking','s-badges','s-profile']

function showScreen(id) {
  document.querySelectorAll('.screen,.fullscreen').forEach(s => s.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  const isMain = mainScreens.includes(id)
  document.getElementById('bnav').style.display = isMain ? 'flex' : 'none'
  // Show/hide ranking sticky footer
  const footer = document.getElementById('rank-footer')
  footer.classList.toggle('visible', id === 's-ranking')
}

function navTo(id, idx) {
  showScreen(id)
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'))
  const btn = document.getElementById('ni-' + idx)
  if (btn) btn.classList.add('active')
}

// ── AUTH ──
function validatePass(p) {
  const e = []
  if (p.length < 8) e.push('La contraseña debe tener al menos 8 caracteres.')
  if (!/\d/.test(p)) e.push('Debe incluir al menos un número.')
  return e
}
function doLogin() {
  const email = document.getElementById('l-email').value.trim()
  const pass  = document.getElementById('l-pass').value
  const box   = document.getElementById('l-err')
  if (!email || !pass) {
    box.innerHTML = '<div class="err-msg">⚠️ Ingresa tu correo y contraseña.</div>'
    box.style.display = 'block'
    return
  }
  if (!email.includes('@') || pass.length < 3) {
    box.innerHTML = '<div class="err-msg">⚠️ Correo o contraseña incorrectos.</div>'
    box.style.display = 'block'
    return
  }
  box.style.display = 'none'
  goAgeGate('home')
}
function doRegister() {
  const name  = document.getElementById('r-name').value.trim()
  const email = document.getElementById('r-email').value.trim()
  const pass  = document.getElementById('r-pass').value
  const errs  = []
  if (!name) errs.push('El nombre es obligatorio.')
  if (!email.includes('@')) errs.push('Correo inválido.')
  errs.push(...validatePass(pass))
  const box = document.getElementById('r-err')
  if (errs.length) { box.innerHTML = errs.map(e=>`<div class="err-msg">⚠️ ${e}</div>`).join(''); box.style.display='block'; return }
  box.style.display = 'none'
  goAgeGate('home')
}
function goAgeGate(dest) {
  ageGateDest = dest
  document.getElementById('ag-date').value = ''
  document.getElementById('ag-err').style.display = 'none'
  showScreen('s-agegate')
}
function checkAge() {
  const val = document.getElementById('ag-date').value
  const box = document.getElementById('ag-err')
  if (!val) { box.innerHTML='<div class="err-msg">⛔ Ingresa tu fecha de nacimiento.</div>'; box.style.display='block'; return }
  const birth = new Date(val), today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  if (age < 18) { box.innerHTML='<div class="err-msg">⛔ Debes tener 18 años o más para acceder.</div>'; box.style.display='block'; return }
  box.style.display = 'none'
  if (ageGateDest === 'admin') { showScreen('s-admin'); renderTaps() }
  else navTo('s-home', 0)
}

// ── REGISTER BEER ──
function submitBeer() {
  const name   = document.getElementById('rb-name').value.trim()
  const style  = document.getElementById('rb-style').value.trim()
  const branch = document.getElementById('rb-branch').value
  const box    = document.getElementById('rb-err')
  const errs   = []
  if (!name)  errs.push('El nombre de la cerveza es obligatorio.')
  if (!style) errs.push('El estilo es obligatorio.')
  if (errs.length) { box.innerHTML=errs.map(e=>`<div class="err-msg">⚠️ ${e}</div>`).join(''); box.style.display='block'; return }
  box.style.display = 'none'
  const now = new Date()
  const ts  = now.toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
  document.getElementById('rb-sname').textContent = `${name} · ${branch}`
  document.getElementById('rb-stime').textContent = `📅 ${ts}`
  document.getElementById('rb-form').style.display = 'none'
  document.getElementById('rb-success').style.display = 'flex'
}
function resetBeer() {
  document.getElementById('rb-name').value = ''
  document.getElementById('rb-style').value = ''
  document.getElementById('rb-err').style.display = 'none'
  document.getElementById('rb-form').style.display = 'block'
  document.getElementById('rb-success').style.display = 'none'
}

// ── REGISTER VISIT ──
function submitVisit() {
  const branch = document.getElementById('v-branch').value
  const t      = document.getElementById('v-time').value
  const now    = new Date()
  const ts     = now.toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
  document.getElementById('v-sname').textContent = branch
  document.getElementById('v-stime').textContent = `📅 ${t ? t+' hrs' : ts}`
  document.getElementById('v-form').style.display    = 'none'
  document.getElementById('v-success').style.display = 'flex'
}

// ── ADMIN TAPS ──
function renderTaps() {
  document.getElementById('tap-list').innerHTML = taps.map(b=>`
    <div class="tap-card">
      <div class="tap-dot ${b.on?'on':'off'}"></div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:500">${b.name}</div>
        <div style="font-size:11px;color:var(--text3)">${b.style} · <span style="color:var(--amber-l)">$${b.price} MXN</span></div>
      </div>
      <div class="toggle ${b.on?'on':''}" onclick="toggleTap(${b.id})">
        <div class="toggle-thumb" style="${b.on?'left:23px;background:#22C55E':''}"></div>
      </div>
    </div>`).join('')
  document.getElementById('a-ontap-count').textContent = taps.filter(x=>x.on).length
}
function toggleTap(id) {
  taps.find(x=>x.id===id).on ^= 1
  const badge = document.getElementById('a-update-badge')
  badge.style.display = 'inline'
  setTimeout(()=>badge.style.display='none', 4000)
  renderTaps()
}

showScreen('s-login')
