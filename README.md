# 🌍 Frontend Countries Explorer

Aplicación web para explorar información sobre países del mundo, construida con **React + Vite**.

> Proyecto progresivo por niveles de dificultad 🚀

---

## 🚀 Demo local

```bash
npm install
npm run dev
```

La app estará disponible en:

```
http://localhost:5173
```

---

## 🛠 Stack Tecnológico

| Tecnología          | Descripción                                 |
| ------------------- | ------------------------------------------- |
| **React 18**        | Librería para construir interfaces          |
| **Vite**            | Bundler ultrarrápido y dev server           |
| **React Query v5**  | Fetching, caché y manejo de estado servidor |
| **React Router v6** | Navegación (usado desde Nivel 2)            |
| **Tailwind CSS v3** | Framework de estilos utilitarios            |
| **Axios**           | Cliente HTTP                                |
| **React Hook Form** | Manejo de formularios (Nivel 2+)            |
| **Zod**             | Validación de esquemas (Nivel 2+)           |

---

📋 Funcionalidades — Nivel 1 (Básico)

✔ Lista de 250+ países consumidos desde REST Countries API

✔ Fetching con React Query

✔ Skeleton loaders mientras cargan los datos

✔ Búsqueda en tiempo real por nombre

✔ Filtro por región:

* África

* América

* Asia

* Europa

* Oceanía

✔ Orden alfabético:

* A → Z

* Z → A

✔ Contador dinámico de resultados

✔ Estado de error con botón de reintentar

✔ Estado vacío cuando no hay coincidencias

✔ Diseño responsive (1 → 2 → 3 → 4 columnas)

✔ Animaciones stagger en las cards

---

## 🗂 Estructura del Proyecto

```
src/
├── components/
│   ├── CountryCard.jsx      <- Renderiza la card individual de cada país
│   ├── CountrySkeleton.jsx  <- Skeleton loader mientras cargan los datos
│   ├── SearchBar.jsx        <- Búsqueda, filtro por región y orden alfabético
│   ├── Header.jsx           <- Encabezado principal de la aplicación
│   ├── ErrorState.jsx       <- UI mostrada cuando ocurre un error en el fetch
│   └── EmptyState.jsx       <- Estado vacío cuando no hay resultados
├── hooks/
│   └── useCountries.js      <- Hook con lógica de fetch, caché, filtros y orden
├── pages/
│   └── HomePage.jsx         <- Página principal que compone la vista
├── App.jsx                  <- Componente raíz de la aplicación
├── main.jsx                 <- Punto de entrada que monta React en el DOM
└── index.css                <- Estilos globales y configuración de Tailwind
```

---

## 🌐 API Utilizada

**REST Countries API**
`https://restcountries.com/v3.1/all`

Campos utilizados:

* `name`
* `flags`
* `population`
* `region`
* `subregion`
* `capital`
* `cca3`

---

## 🌳 Ramas del Repositorio

| Rama                         | Estado        |
| ---------------------------- | ------------- |
| `main`                       | 🟢 Producción |
| `feature/nivel-1-basico`     | ✅ Nivel 1     |
| `feature/nivel-2-intermedio` | 🔜 Nivel 2    |
| `feature/nivel-3-avanzado`   | 🔜 Nivel 3    |
