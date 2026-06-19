# Campfire Badge Club 🔥

Aplicación web de lealtad y recompensas para un bar-restaurante de cerveza artesanal con dos sucursales (Beer Garden y Tavern). Proyecto universitario de Ingeniería de Requerimientos / Diseño de Software.

---

## ¿Qué es este repositorio?

Este repositorio contiene **todo el material del proyecto**: el prototipo navegable, la documentación de requerimientos, los diagramas del proceso y las minutas de las sesiones con el cliente.

## Propósito del sistema

El sistema resuelve la falta de un mecanismo digital de fidelización en el establecimiento. Permite a los clientes registrar sus visitas y consumos, acumular puntos, desbloquear parches coleccionables y consultar su posición en un ranking global. El propietario cuenta con un panel de administración para gestionar el menú de cervezas en tiempo real.

---

## 🗺️ Cómo navegar este repositorio

| Carpeta | Contenido | Empieza aquí si... |
|---|---|---|
| [`/prototipo`](./prototipo) | Prototipo HTML navegable del sistema | quieres **ver y usar la app** |
| [`/documentacion`](./documentacion) | Matriz de requerimientos y matriz de trazabilidad | quieres ver **qué se construyó y por qué** |
| [`/diagramas`](./diagramas) | Diagramas AS-IS, TO-BE y modelo Entidad-Relación | quieres ver **el proceso de negocio y la base de datos** |
| [`/minutas`](./minutas) | Actas de entrevistas y validación con el cliente | quieres ver **cómo se levantaron los requerimientos** |

---

## ▶️ Cómo ver el prototipo

El prototipo es un único archivo HTML, no requiere instalación ni servidor.

1. Descarga o clona este repositorio.
2. Abre `prototipo/index.html` con doble clic, o arrástralo a tu navegador (Chrome, Safari, Firefox o Edge).
3. Inicia sesión con cualquier correo y contraseña de al menos 8 caracteres con un número (ej. `trail@campfirebadge.mx` / `camping123`).
4. Verifica tu edad con cualquier fecha de nacimiento que indique 18 años o más.
5. Explora el dashboard, registra un consumo o visita, revisa el ranking, los parches y el menú On Tap.
6. Para ver el panel de administrador, regresa al login y usa el botón "Panel admin".

### Clonar y ver localmente

```bash
git clone https://github.com/TU_USUARIO/campfire-badge-club.git
cd campfire-badge-club/prototipo
open index.html   # macOS
# o simplemente arrastra index.html a tu navegador
```

---

## 📋 Resumen de requerimientos

La especificación completa está en [`documentacion/Matriz_Requerimientos.xlsx`](./documentacion/Matriz_Requerimientos.xlsx).

- **7 Requerimientos Funcionales** (4 Must-have, 1 Should-have, 2 Could-have)
- **8 Requerimientos No Funcionales** (8 Must-have)

### Requerimientos funcionales Must-have

- **RF-01** — Registro y gestión de usuarios
- **RF-03** — Sistema de recompensas (puntos por visita y consumo)
- **RF-05** — Registro de consumos y visitas
- **RF-06** — Integración con menú digital

### Requerimientos no funcionales Must-have

- **RNF-01** — Disponibilidad 99% mensual
- **RNF-02** — Rendimiento (respuestas < 2 segundos)
- **RNF-03** — Accesibilidad web sin instalación
- **RNF-04** — Compatibilidad móvil
- **RNF-05** — Soporte de 50 usuarios concurrentes
- **RNF-06** — Seguridad (HTTPS, hash de contraseñas, sesiones)
- **RNF-07** — Restricción legal de edad (mayor de 18 años)
- **RNF-08** — Usabilidad sin capacitación previa

---

## 🔗 Trazabilidad requerimientos → prototipo

La matriz completa está en [`documentacion/Matriz_Trazabilidad.xlsx`](./documentacion/Matriz_Trazabilidad.xlsx).

De los 12 requerimientos Must-have:
- **9 completamente cubiertos** en el prototipo
- **1 parcialmente cubierto** — RF-01: falta la edición de perfil, pendiente para la siguiente iteración
- **2 no aplican al prototipo** — RNF-01 (disponibilidad) y RNF-05 (concurrencia), por ser requerimientos de infraestructura no demostrables en HTML estático

### Pantallas del prototipo

| ID | Pantalla |
|---|---|
| PNT-01 | Login |
| PNT-02 | Crear cuenta |
| PNT-03 | Age gate (verificación de edad) |
| PNT-04 | Home |
| PNT-05 | Registrar consumo |
| PNT-06 | Registrar visita |
| PNT-07 | On Tap (menú digital) |
| PNT-08 | Perfil |
| PNT-09 | Admin |
| PNT-10 | Ranking |
| PNT-11 | Parches |

---

## 🛠️ Stack tecnológico

**Prototipo actual:** HTML + CSS + JavaScript vanilla (sin dependencias)

**Stack planeado para producción:**
- Frontend: Next.js + TypeScript + TailwindCSS
- Backend: Supabase
- Base de datos: PostgreSQL
- Hosting: Vercel

---

## 🚧 Estado del proyecto

- [x] Requerimientos levantados y validados con el cliente
- [x] Prototipo navegable funcional
- [x] Matriz de trazabilidad completa
- [ ] Diseño de base de datos preliminar (ver `/diagramas`)
- [ ] Implementación del backend real

Ver sección "Trabajo futuro" en la documentación para el detalle completo de actividades pendientes.

---

## 👥 Stakeholders

| Stakeholder | Rol | Interés | Poder |
|---|---|---|---|
| Propietario del establecimiento | Aprobador | Alto | Alto |
| Cliente frecuente del bar | Usuario | Alto | Medio |
| Mesero / personal de piso | Afectado | Medio | Bajo |
| Equipo de desarrollo | Aprobador | Alto | Alto |
