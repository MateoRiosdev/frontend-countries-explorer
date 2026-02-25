# 🌍 Countries Explorer

Una SPA completa construida con React que combina dos APIs públicas —  
**REST Countries** y **JSONPlaceholder** — con un CRUD funcional, sistema de  
notificaciones, arquitectura modular y UI de nivel producción.

---

## ✨ Características

| Nivel | Funcionalidad |
|-------|--------------|
| 1 | Listado de países con búsqueda, filtros por región, paginación y skeletons |
| 2 | Detalle de país, rutas con React Router, comentarios por país con Zod |
| 3 | CRUD completo de Posts, notificaciones Toast, modal de confirmación, Navbar global |

---

## 🛠 Stack tecnológico

- **React 18** + Vite
- **React Router v6** — navegación SPA
- **TanStack Query v5** — fetching, caché e invalidación
- **React Hook Form** + **Zod** — formularios con validación tipada
- **Axios** — peticiones HTTP para CRUD
- **Tailwind CSS v3** — utilidades de estilos
- **Context API** — sistema global de notificaciones (Toast)

---

## 🗂 Estructura del proyecto

```
src/
├── api/
│   ├── countries.js       # REST Countries API (fetch nativo)
│   ├── posts.js           # JSONPlaceholder CRUD (Axios)
│   └── comments.js        # Comentarios por país (Axios)
│
├── context/
│   └── ToastContext.jsx   # Sistema global de notificaciones
│
├── features/
│   └── posts/
│       ├── PostCard.jsx       # Card con acciones inline (editar/eliminar)
│       └── PostFormFields.jsx # Esquema Zod + componentes de campo reutilizables
│
├── components/
│   ├── ui/
│   │   └── Modal.jsx          # Modal accesible (Escape + click fuera)
│   ├── Navbar.jsx             # Navegación global Countries ↔ Posts
│   ├── CommentsSection.jsx    # Sección de comentarios por país con formulario
│   ├── CountryCard.jsx        # Tarjeta de país con link a detalle
│   ├── Pagination.jsx         # Paginación con elipsis
│   ├── SearchBar.jsx          # Input de búsqueda + info de paginación
│   ├── ScrollToTopButton.jsx  # Botón flotante con transición CSS
│   └── CountrySkeleton.jsx    # Skeleton animado (shimmer)
│
├── hooks/
│   ├── useCountries.js        # React Query: lista de países
│   ├── useCountryDetail.js    # React Query: detalle + fronteras
│   ├── usePosts.js            # React Query: lista de posts paginada
│   ├── usePost.js             # React Query: post individual
│   ├── usePostComments.js     # React Query: comentarios de un post
│   ├── useCreatePost.js       # Mutación: crear post
│   ├── useUpdatePost.js       # Mutación: actualizar post
│   ├── useDeletePost.js       # Mutación: eliminar post
│   ├── useComments.js         # React Query: comentarios por país
│   └── useCreateComment.js   # Mutación: crear comentario
│
└── pages/
    ├── HomePage.jsx           # Listado de países (Nivel 1)
    ├── CountryDetailPage.jsx  # Detalle de país + comentarios (Nivel 2)
    ├── PostsPage.jsx          # Lista de posts con CRUD (Nivel 3)
    ├── PostDetailPage.jsx     # Detalle de post + comentarios (Nivel 3)
    ├── PostCreatePage.jsx     # Formulario crear post (Nivel 3)
    └── PostEditPage.jsx       # Formulario editar post (Nivel 3)
```

---

## 🚀 Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/MateoRiosdev/frontend-countries-explorer.git
cd frontend-countries-explorer
git checkout nivel3
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### 4. Build de producción

```bash
npm run build
npm run preview   # previsualizar el build
```

---

## 📡 APIs utilizadas

### REST Countries
- **URL base:** `https://restcountries.com/v3.1`
- **Uso:** `GET /all`, `GET /alpha/:code`, `GET /alpha?codes=...`
- **Librería:** `fetch` nativo

### JSONPlaceholder
- **URL base:** `https://jsonplaceholder.typicode.com`
- **Endpoints usados:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/posts?_start=N&_limit=10` | Lista paginada |
| GET    | `/posts/:id` | Detalle de post |
| POST   | `/posts` | Crear post |
| PUT    | `/posts/:id` | Editar post |
| DELETE | `/posts/:id` | Eliminar post |
| GET    | `/posts/:id/comments` | Comentarios del post |
| POST   | `/comments` | Crear comentario |

> **Nota:** JSONPlaceholder es una API de prueba. Las escrituras (POST/PUT/DELETE) simulan el comportamiento pero no persisten en el servidor. Los posts creados y eliminados se almacenan localmente con `localStorage`.

---

## 🔗 Rutas de la aplicación

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage | Lista de países con búsqueda, filtros y paginación |
| `/country/:code` | CountryDetailPage | Detalle de país + países fronterizos + comentarios |
| `/posts` | PostsPage | Lista de posts con paginación |
| `/posts/new` | PostCreatePage | Formulario para crear nuevo post |
| `/posts/:id` | PostDetailPage | Detalle de post + comentarios |
| `/posts/:id/edit` | PostEditPage | Formulario para editar post |

---

## 🧩 Decisiones de arquitectura

- **`features/posts/`** — lógica específica de la feature Posts (tarjeta, esquema Zod compartido) separada de `components/` genéricos
- **`context/ToastContext`** — sistema de notificaciones global, evita prop drilling. Expone `toast.success()`, `toast.error()`, `toast.info()`
- **`cca3ToPostId()`** — función determinística que mapea cada código de país a un `postId` de JSONPlaceholder, garantizando que cada país siempre cargue los mismos comentarios base
- **localStorage** — persiste posts creados localmente ya que JSONPlaceholder no persiste escrituras reales
- **React Query `invalidateQueries`** — tras cada mutación, invalida el caché afectado para sincronizar la UI automáticamente

---

## 🗂 Ramas del repositorio

| Rama                         | Nivel      |
| ---------------------------- | ---------- |
| `main`                       | Producción |
| `feature/nivel-1-basico`     | ✅ Nivel 1  |
| `feature/nivel-2-intermedio` | ✅ Nivel 2  |
| `feature/nivel-3-avanzado`   | ✅ Nivel 3  |

> Prueba técnica — Frontend Developer · Niveles 1, 2 y 3 completos

---

## 🌐 Deploy

Aplicación desplegada en **Vercel**:  
👉 [https://frontend-countries-explorer.vercel.app](https://frontend-countries-explorer.vercel.app)

---

## 👤 Autor

**Mateo Julio Gomero Rios**  
GitHub: [@MateoRiosdev](https://github.com/MateoRiosdev)
