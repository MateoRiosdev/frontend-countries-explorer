# 🌍 frontend-countries-explorer

Aplicación web para explorar información sobre países del mundo, construida con **React + Vite**, con navegación dinámica, vista de detalle y formularios validados.

## 🚀 Nivel actual: 2 – Intermedio (`feature/nivel-2-intermedio`)

---

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/frontend-countries-explorer.git
cd frontend-countries-explorer

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app estará en:

```
http://localhost:5173
```

---

## 🛠 Tecnologías

| Herramienta        | Uso                             |
| ------------------ | ------------------------------- |
| React 18           | Librería de UI                  |
| Vite               | Bundler y dev server            |
| React Query v5     | Fetching + caché inteligente    |
| React Router v6    | Navegación entre páginas        |
| Tailwind CSS v3    | Estilos utilitarios             |
| Axios              | Cliente HTTP                    |
| React Hook Form    | Manejo eficiente de formularios |
| Zod                | Validación de esquemas          |
| REST Countries API | Datos de países                 |
| JSONPlaceholder    | API fake para crear posts       |

---

## 📋 Funcionalidades – Nivel 2

Incluye todo lo del Nivel 1 + nuevas funcionalidades interactivas:

### 🌎 Exploración de países

* ✅ Lista de 250+ países desde REST Countries
* ✅ Búsqueda en tiempo real
* ✅ Filtro por región
* ✅ Orden alfabético A→Z / Z→A
* ✅ Paginación para mejorar performance
* ✅ Estados: loading (skeleton), error, vacío

### 🔍 Vista de detalle

* ✅ Navegación con React Router (`/country/:code`)
* ✅ Página de detalle al hacer clic en un país
* ✅ Información ampliada:

  * Nombre oficial
  * Bandera
  * Capital
  * Región y subregión
  * Población
  * Código país (CCA3)
* ✅ Botón para volver al listado

### 📝 Formulario validado

* ✅ Formulario para crear un post usando JSONPlaceholder
* ✅ Manejo con React Hook Form
* ✅ Validación con Zod:

  * Título obligatorio (mínimo caracteres)
  * Contenido obligatorio
* ✅ Mensajes de error claros
* ✅ Feedback visual al enviar
* ✅ Manejo de estado de éxito

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── CountryCard.jsx
│   ├── CountrySkeleton.jsx
│   ├── SearchBar.jsx
│   ├── Pagination.jsx
│   ├── PostForm.jsx
│   ├── Header.jsx
│   ├── ErrorState.jsx
│   └── EmptyState.jsx
├── hooks/
│   └── useCountries.js
├── pages/
│   ├── HomePage.jsx
│   ├── CountryDetailPage.jsx
│   └── CreatePostPage.jsx
├── routes/
│   └── AppRouter.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🌐 APIs utilizadas

### 🌍 REST Countries

```
https://restcountries.com/v3.1/all
```

Campos utilizados:

* `name`
* `flags`
* `population`
* `region`
* `subregion`
* `capital`
* `cca3`

---

### 📝 JSONPlaceholder

```
https://jsonplaceholder.typicode.com/posts
```

* Método `POST`
* Simulación de creación de contenido

---

## 🧠 Conceptos aplicados en Nivel 2

* React Router con rutas dinámicas
* Manejo de parámetros con `useParams`
* Navegación con `useNavigate`
* Validación de formularios con Zod + React Hook Form
* Mutations con React Query
* Paginación controlada
* Separación de responsabilidades (pages vs components)
* UX mejorada con estados visuales

---

## 🗂 Ramas del repositorio

| Rama                         | Nivel      |
| ---------------------------- | ---------- |
| `main`                       | Producción |
| `feature/nivel-1-basico`     | ✅ Nivel 1  |
| `feature/nivel-2-intermedio` | ✅ Nivel 2  |
| `feature/nivel-3-avanzado`   | 🔜 Nivel 3 |

---

## 🎯 Próximo Nivel – Avanzado

En el Nivel 3 se implementará:

* 🌙 Dark Mode persistente
* 🔄 Infinite Scroll con Intersection Observer
* 🧠 Optimización avanzada con memoización
* 🔎 Query params sincronizados con la URL
* 🚀 Deploy en Vercel
