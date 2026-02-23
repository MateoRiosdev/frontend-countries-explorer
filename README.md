# 🌍 frontend-countries-explorer

Aplicación web para explorar información sobre países del mundo, construida con React + Vite.

## Nivel actual: 1 – Básico (rama `feature/nivel-1-basico`)

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

La app estará en `http://localhost:5173`

---

## 🛠 Tecnologías

| Herramienta         | Uso                                 |
|---------------------|-------------------------------------|
| React 18            | Librería de UI                      |
| Vite                | Bundler y dev server                |
| React Query v5      | Fetching y caché de datos de la API |
| React Router v6     | Navegación (preparado para Nivel 2) |
| Tailwind CSS v3     | Estilos utilitarios                 |
| Axios               | Cliente HTTP                        |
| React Hook Form     | Formularios (Nivel 2+)              |
| Zod                 | Validación de esquemas (Nivel 2+)   |

---

## 📋 Funcionalidades – Nivel 1

- ✅ Lista de 250+ países consumida desde **REST Countries API**
- ✅ **React Query** para fetching con caché automático (5 min stale time)
- ✅ **Skeletons** mientras se cargan los datos
- ✅ **Búsqueda** en tiempo real por nombre de país
- ✅ **Filtro por región** (África, América, Asia, Europa, Oceanía)
- ✅ **Orden alfabético** A→Z / Z→A con un clic
- ✅ Contador de resultados filtrados
- ✅ Estado de error con opción de reintentar
- ✅ Estado vacío cuando no hay coincidencias
- ✅ Diseño responsive (1 → 2 → 3 → 4 columnas)
- ✅ Animaciones de entrada en las cards con stagger

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── CountryCard.jsx     # Card de cada país
│   ├── CountrySkeleton.jsx # Skeleton loader
│   ├── SearchBar.jsx       # Búsqueda + filtros + sort
│   ├── Header.jsx          # Encabezado
│   ├── ErrorState.jsx      # Estado de error
│   └── EmptyState.jsx      # Sin resultados
├── hooks/
│   └── useCountries.js     # Hook con lógica de fetch, filtrado y orden
├── pages/
│   └── HomePage.jsx        # Página principal
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🌐 API utilizada

**REST Countries** – `https://restcountries.com/v3.1/all`

Campos solicitados: `name`, `flags`, `population`, `region`, `subregion`, `capital`, `cca3`

---

## 🗂 Ramas del repositorio

| Rama                       | Nivel      |
|----------------------------|------------|
| `main`                     | Producción |
| `feature/nivel-1-basico`   | ✅ Nivel 1  |
| `feature/nivel-2-intermedio` | 🔜 Nivel 2 |
| `feature/nivel-3-avanzado` | 🔜 Nivel 3 |
