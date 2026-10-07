// ============================================================
// CAMPFIRE BADGE CLUB — app.js
// Firebase Auth + Firestore conectado
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// ── Configuración Firebase ────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC8iHg9zQqJ_TR06B_2jepV5y5EG3o8bXE",
  authDomain: "campfire-badgeclub.firebaseapp.com",
  projectId: "campfire-badgeclub",
  storageBucket: "campfire-badgeclub.firebasestorage.app",
  messagingSenderId: "485455216359",
  appId: "1:485455216359:web:865f346e9bab3c979a2c42",
  measurementId: "G-87Z03NXTM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ── Estado global ─────────────────────────────────────────────
let currentUser = null;
let currentUserData = null;

// ── On Tap (menú de cervezas — datos estáticos) ───────────────
const MENU_ITEMS = [
  { name: "Campfire Amber Ale", style: "Amber Ale", desc: "Caramelo, toffee y un toque ahumado. Perfecta para la noche.", price: 85 },
  { name: "Trail Pale Ale", style: "Pale Ale", desc: "Cítrica, refrescante, con lúpulo floral. Ideal para empezar.", price: 80 },
  { name: "Summit Stout", style: "Stout", desc: "Chocolate amargo, café y cuerpo robusto. Para los valientes.", price: 90 },
  { name: "Birch IPA", style: "IPA", desc: "Amarga, resinosa y con aroma tropical intenso.", price: 95 },
  { name: "Ember Wheat", style: "Wheat Beer", desc: "Suave, con notas de plátano y clavo. Muy tomable.", price: 75 },
  { name: "Basecamp Lager", style: "Lager", desc: "Limpia, fresca y equilibrada. El clásico de la casa.", price: 70 },
];

// ── Parches (badges) ──────────────────────────────────────────
const BADGES = [
  { id: "novato", name: "Novato del Fuego", desc: "Registra tu primera visita", points: 0, icon: "🔥" },
  { id: "explorador", name: "Explorador", desc: "Acumula 50 puntos", points: 50, icon: "🧭" },
  { id: "aventurero", name: "Aventurero", desc: "Acumula 150 puntos", points: 150, icon: "⛺" },
  { id: "ranger", name: "Ranger", desc: "Acumula 300 puntos", points: 300, icon: "🏔️" },
  { id: "leyenda", name: "Leyenda Campfire", desc: "Acumula 500 puntos", points: 500, icon: "🏆" },
];

// ── Utilidades ────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add("active");
  // Mostrar/ocultar bottom nav
  const noNav = ["login", "register", "age-gate"];
  const nav = document.getElementById("bottom-nav");
  if (nav) nav.style.display = noNav.includes(id) ? "none" : "flex";
}

function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.className = "toast " + type;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

function calcLevel(points) {
  if (points >= 500) return { level: 5, name: "Leyenda", next: null };
  if (points >= 300) return { level: 4, name: "Ranger", next: 500 };
  if (points >= 150) return { level: 3, name: "Aventurero", next: 300 };
  if (points >= 50)  return { level: 2, name: "Explorador", next: 150 };
  return { level: 1, name: "Novato", next: 50 };
}

// ── Firestore helpers ─────────────────────────────────────────
async function getUserData(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

async function addPoints(uid, pts, type) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    points: increment(pts),
    visits: increment(type === "visit" ? 1 : 0),
    purchases: increment(type === "purchase" ? 1 : 0),
  });
  currentUserData = await getUserData(uid);
}

// ── Auth: Registro ────────────────────────────────────────────
async function handleRegister(e) {
  e.preventDefault();
  const name  = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass  = document.getElementById("reg-pass").value;
  const err   = document.getElementById("reg-error");

  if (!/(?=.*\d).{8,}/.test(pass)) {
    err.textContent = "La contraseña debe tener al menos 8 caracteres y un número.";
    return;
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", cred.user.uid), {
      name, email, points: 0, visits: 0, purchases: 0,
      birthdate: "", ageVerified: false, createdAt: new Date().toISOString()
    });
    err.textContent = "";
    // Ir al age gate
    showScreen("age-gate");
  } catch (ex) {
    err.textContent = ex.code === "auth/email-already-in-use"
      ? "Ese correo ya está registrado."
      : "Error al crear cuenta. Intenta de nuevo.";
  }
}

// ── Auth: Login ───────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  const err   = document.getElementById("login-error");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    err.textContent = "";
  } catch {
    err.textContent = "Correo o contraseña incorrectos.";
  }
}

// ── Age gate ──────────────────────────────────────────────────
async function handleAgeGate(e) {
  e.preventDefault();
  const bdate = document.getElementById("birthdate").value;
  const err   = document.getElementById("age-error");
  if (!bdate) { err.textContent = "Ingresa tu fecha de nacimiento."; return; }
  const birth = new Date(bdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  if (age < 18) {
    err.textContent = "Debes ser mayor de 18 años para acceder.";
    return;
  }
  if (currentUser) {
    await updateDoc(doc(db, "users", currentUser.uid), { birthdate: bdate, ageVerified: true });
    currentUserData = await getUserData(currentUser.uid);
  }
  err.textContent = "";
  renderHome();
  showScreen("home");
}

// ── Pantallas ─────────────────────────────────────────────────
function renderHome() {
  if (!currentUserData) return;
  const lvl = calcLevel(currentUserData.points);
  const pct = lvl.next ? Math.round((currentUserData.points / lvl.next) * 100) : 100;

  document.getElementById("home-name").textContent    = currentUserData.name || "Usuario";
  document.getElementById("home-points").textContent  = currentUserData.points;
  document.getElementById("home-level").textContent   = lvl.name;
  document.getElementById("home-visits").textContent  = currentUserData.visits;
  document.getElementById("home-purchases").textContent = currentUserData.purchases;
  document.getElementById("home-progress").style.width = pct + "%";
  document.getElementById("home-next").textContent    = lvl.next ? `${currentUserData.points} / ${lvl.next} pts para ${BADGES.find(b=>b.points===lvl.next)?.name||"siguiente nivel"}` : "¡Nivel máximo alcanzado!";
}

function renderOntap() {
  const list = document.getElementById("ontap-list");
  if (!list) return;
  list.innerHTML = MENU_ITEMS.map(item => `
    <div class="beer-card">
      <div class="beer-name">🍺 ${item.name}</div>
      <div class="beer-style">${item.style}</div>
      <div class="beer-desc">${item.desc}</div>
      <div class="beer-price">$${item.price} MXN</div>
    </div>
  `).join("");
}

async function renderRanking() {
  const list = document.getElementById("ranking-list");
  const myPos = document.getElementById("my-position");
  if (!list) return;
  try {
    const q = query(collection(db, "users"), orderBy("points", "desc"));
    const snap = await getDocs(q);
    const users = [];
    snap.forEach(d => users.push({ id: d.id, ...d.data() }));
    list.innerHTML = users.map((u, i) => `
      <div class="ranking-item ${u.id === currentUser?.uid ? 'mine' : ''}">
        <span class="rank-pos">#${i+1}</span>
        <span class="rank-name">${u.name || "Usuario"}</span>
        <span class="rank-pts">${u.points} pts</span>
      </div>
    `).join("");
    const myIdx = users.findIndex(u => u.id === currentUser?.uid);
    if (myPos) myPos.textContent = myIdx >= 0 ? `Tu posición: #${myIdx+1}` : "";
  } catch {
    list.innerHTML = "<p>Error cargando ranking.</p>";
  }
}

function renderBadges() {
  const list = document.getElementById("badges-list");
  if (!list || !currentUserData) return;
  const pts = currentUserData.points;
  list.innerHTML = BADGES.map(b => `
    <div class="badge-item ${pts >= b.points ? 'unlocked' : 'locked'}">
      <span class="badge-icon">${b.icon}</span>
      <div class="badge-info">
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
      <span class="badge-status">${pts >= b.points ? '✅' : '🔒'}</span>
    </div>
  `).join("");
}

function renderProfile() {
  if (!currentUserData) return;
  const lvl = calcLevel(currentUserData.points);
  document.getElementById("profile-name").textContent   = currentUserData.name || "Usuario";
  document.getElementById("profile-email").textContent  = currentUserData.email || "";
  document.getElementById("profile-points").textContent = currentUserData.points;
  document.getElementById("profile-level").textContent  = lvl.name;
  document.getElementById("profile-visits").textContent = currentUserData.visits;
}

// ── Registrar consumo ─────────────────────────────────────────
async function handlePurchase(e) {
  e.preventDefault();
  const product = document.getElementById("purchase-product").value.trim();
  if (!product) return;
  await addPoints(currentUser.uid, 5, "purchase");
  const now = new Date();
  document.getElementById("purchase-success-msg").textContent =
    `+5 pts por "${product}" — ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  document.getElementById("purchase-form").style.display = "none";
  document.getElementById("purchase-success").style.display = "block";
  renderHome();
}

// ── Registrar visita ──────────────────────────────────────────
async function handleVisit() {
  await addPoints(currentUser.uid, 10, "visit");
  const now = new Date();
  document.getElementById("visit-success-msg").textContent =
    `+10 pts por tu visita — ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  document.getElementById("visit-btn").style.display = "none";
  document.getElementById("visit-success").style.display = "block";
  renderHome();
}

// ── Logout ────────────────────────────────────────────────────
async function handleLogout() {
  await signOut(auth);
  showScreen("login");
}

// ── onAuthStateChanged ────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    currentUserData = await getUserData(user.uid);
    if (!currentUserData) {
      // Usuario existe en Auth pero no en Firestore (raro) → logout
      await signOut(auth);
      return;
    }
    if (!currentUserData.ageVerified) {
      showScreen("age-gate");
    } else {
      renderHome();
      showScreen("home");
    }
  } else {
    currentUser = null;
    currentUserData = null;
    showScreen("login");
  }
});

// ── Listeners (se conectan cuando el DOM carga) ───────────────
document.addEventListener("DOMContentLoaded", () => {

  // Login
  document.getElementById("login-form")?.addEventListener("submit", handleLogin);
  document.getElementById("goto-register")?.addEventListener("click", () => showScreen("register"));
  document.getElementById("goto-admin")?.addEventListener("click", () => {
    alert("Panel admin: inicia sesión con una cuenta admin.");
  });

  // Registro
  document.getElementById("register-form")?.addEventListener("submit", handleRegister);
  document.getElementById("goto-login")?.addEventListener("click", () => showScreen("login"));

  // Age gate
  document.getElementById("age-form")?.addEventListener("submit", handleAgeGate);

  // Bottom nav
  document.getElementById("nav-home")?.addEventListener("click", () => { renderHome(); showScreen("home"); });
  document.getElementById("nav-ontap")?.addEventListener("click", () => { renderOntap(); showScreen("ontap"); });
  document.getElementById("nav-ranking")?.addEventListener("click", () => { renderRanking(); showScreen("ranking"); });
  document.getElementById("nav-badges")?.addEventListener("click", () => { renderBadges(); showScreen("badges"); });
  document.getElementById("nav-profile")?.addEventListener("click", () => { renderProfile(); showScreen("profile"); });

  // Home → botones
  document.getElementById("btn-purchase")?.addEventListener("click", () => {
    document.getElementById("purchase-form").style.display = "block";
    document.getElementById("purchase-success").style.display = "none";
    showScreen("purchase");
  });
  document.getElementById("btn-visit")?.addEventListener("click", () => {
    document.getElementById("visit-btn").style.display = "block";
    document.getElementById("visit-success").style.display = "none";
    showScreen("visit");
  });

  // Consumo
  document.getElementById("purchase-form")?.addEventListener("submit", handlePurchase);
  document.getElementById("purchase-back")?.addEventListener("click", () => { renderHome(); showScreen("home"); });
  document.getElementById("purchase-done")?.addEventListener("click", () => { renderHome(); showScreen("home"); });

  // Visita
  document.getElementById("visit-btn")?.addEventListener("click", handleVisit);
  document.getElementById("visit-back")?.addEventListener("click", () => { renderHome(); showScreen("home"); });
  document.getElementById("visit-done")?.addEventListener("click", () => { renderHome(); showScreen("home"); });

  // Perfil → logout
  document.getElementById("btn-logout")?.addEventListener("click", handleLogout);
});
