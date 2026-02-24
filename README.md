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
│   ├── CountryCard.jsx      <- Renderiza la card individual de cada país
│   ├── CountrySkeleton.jsx  <- Skeleton loader mientras cargan los datos
│   ├── SearchBar.jsx        <- Búsqueda, filtro por región y orden alfabético
│   ├── Pagination.jsx       <- Paginación de la lista de países
│   ├── PostForm.jsx         <- Formulario para crear un nuevo post
│   ├── Header.jsx           <- Encabezado principal de la aplicación
│   ├── ErrorState.jsx       <- UI mostrada cuando ocurre un error en el fetch
│   └── EmptyState.jsx       <- Estado vacío cuando no hay resultados
├── hooks/
│   └── useCountries.js      <- Hook con lógica de fetch, caché, filtros y orden
├── pages/
│   ├── HomePage.jsx         <- Página principal que compone la vista
│   ├── CountryDetailPage.jsx<- Página de detalle de un país
│   └── CreatePostPage.jsx   <- Página para crear un nuevo post
├── routes/
│   └── AppRouter.jsx        <- Define rutas y navegación con React Router
├── App.jsx                  <- Componente raíz de la aplicación
├── main.jsx                 <- Punto de entrada que monta React en el DOM
└── index.css                <- Estilos globales y configuración de Tailwind
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
