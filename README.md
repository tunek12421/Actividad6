# 📚 Aplicación de Libros - Actividad 6

Una aplicación móvil moderna de búsqueda de libros construida con Ionic React, que incluye integración con la API de Google Books, gestión local de favoritos y funciones sociales avanzadas.

## 🚀 Características

### Funcionalidad Principal
- **📖 Búsqueda de Libros**: Búsqueda en tiempo real usando la API de Google Books
- **💖 Gestión de Favoritos**: Guarda y organiza tus libros favoritos localmente
- **🔍 Detalles de Libros**: Información completa de libros con calificaciones, descripciones y metadatos
- **📱 Diseño Mobile-First**: Diseño responsivo optimizado para dispositivos móviles

### Características Avanzadas
- **📤 Compartir Libros**: Comparte libros a través de la API nativa o plataformas de redes sociales (Twitter, Facebook, WhatsApp)
- **🔗 Libros Similares**: Recomendaciones impulsadas por IA basadas en autor, categoría y análisis de contenido
- **🕒 Historial de Búsqueda**: Sugerencias inteligentes con búsquedas recientes y términos populares
- **🌙 Soporte de Temas**: Modo Oscuro/Claro con preferencias persistentes
- **📊 Estadísticas de Búsqueda**: Seguimiento de resultados de búsqueda y participación del usuario

## 📱 Acceder a la Aplicación

### Aplicación Web
**[Probar en Navegador](http://localhost:8100/)** *(Servidor de Desarrollo)*

### APK de Android
**Builds automáticos de APK disponibles vía GitHub Actions**

#### Cómo obtener el APK:
1. Ve a la pestaña **[GitHub Actions](https://github.com/username/Actividad6/actions)**
2. Haz clic en el build exitoso más reciente
3. Descarga el artefacto `books-app-debug` o `books-app-release`
4. Extrae el archivo APK e instala en tu dispositivo Android

#### Instalación en Android:
1. Descarga el artefacto ZIP de GitHub Actions
2. Extrae el archivo `app-debug.apk`
3. Configuración de Android > Seguridad > Permitir "Fuentes desconocidas"
4. Instala el archivo APK
5. Ejecuta la Aplicación de Libros

## 🛠️ Stack Tecnológico

- **Framework**: Ionic React con Capacitor
- **Lenguaje**: TypeScript
- **Herramienta de Build**: Vite
- **API**: API de Google Books
- **Almacenamiento**: Local Storage para favoritos e historial de búsqueda
- **Componentes UI**: Componentes Ionic con temas personalizados

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (18+)
- npm o yarn
- Android Studio (para builds de Android)

### Configuración de Desarrollo
```bash
# Clonar el repositorio
git clone <repository-url>
cd Actividad6

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

### Build de APK Android
```bash
# Build de assets web
npm run build

# Sincronizar con Capacitor
npx cap sync android

# Build manual de APK
cd android
./gradlew assembleDebug  # APK Debug
./gradlew assembleRelease # APK Release
```

## 🔧 Estructura del Proyecto

```
src/
├── pages/              # Páginas de la aplicación
│   ├── SearchPage.tsx  # Interfaz principal de búsqueda con historial
│   ├── FavoritesPage.tsx # Gestión de favoritos
│   └── BookDetailsPage.tsx # Detalles de libro con compartir y libros similares
├── services/           # Servicios de lógica de negocio
│   ├── booksService.ts # Integración con API de Google Books
│   ├── favoritesService.ts # Gestión local de favoritos
│   ├── shareService.ts # Funcionalidad de compartir en redes sociales
│   ├── searchHistoryService.ts # Gestión de historial de búsqueda
│   └── similarBooksService.ts # Motor de recomendaciones de libros
├── types/              # Definiciones de tipos TypeScript
│   └── book.ts         # Interfaces relacionadas con libros
└── theme.css           # Estilos globales y temas oscuro/claro
```

## 🌟 Análisis Profundo de Características

### 🔍 Sistema de Búsqueda Inteligente
- **Integración API en Tiempo Real**: Búsqueda en vivo con API de Google Books
- **Historial Inteligente**: Búsquedas recientes con conteos de resultados y fechas
- **Sugerencias Populares**: Términos de búsqueda populares predefinidos
- **Auto-completar**: Búsqueda con un clic desde el dropdown del historial

### 📚 Recomendaciones Inteligentes de Libros
El algoritmo de libros similares usa 4 estrategias inteligentes:
1. **Basado en Autor**: Libros del mismo autor
2. **Basado en Categoría**: Libros en géneros similares  
3. **Basado en Palabras Clave**: Análisis de similitud de contenido de títulos
4. **Basado en Calificación**: Libros con calificaciones de usuario similares

### 📤 Sistema de Compartir Avanzado
- **API de Compartir Nativa**: Usa el compartir nativo del dispositivo cuando está disponible
- **Integración de Redes Sociales**: Compartir directo a Twitter, Facebook, WhatsApp
- **Respaldo de Portapapeles**: Copia texto formateado cuando no hay compartir nativo disponible
- **Contenido Rico**: Mensajes formateados con detalles del libro y enlaces de búsqueda

### 💾 Gestión de Datos Local
- **Almacenamiento de Favoritos**: Libros guardados localmente con marcas de tiempo
- **Historial de Búsqueda**: Historial de búsqueda persistente con seguimiento de resultados
- **Preferencias de Tema**: Elección de tema del usuario recordada entre sesiones
- **Privacidad Primero**: Todos los datos del usuario almacenados localmente en el dispositivo

## 🎨 Interfaz de Usuario

### Diseño Responsivo
- **Mobile-First**: Optimizado para dispositivos móviles
- **Soporte Tablet**: Diseño de cuadrícula responsiva para pantallas más grandes
- **Amigable al Tacto**: Botones grandes y objetivos táctiles

### Sistema de Temas
- **Detección Automática**: Respeta la preferencia del sistema oscuro/claro
- **Alternancia Manual**: Botón de tema disponible en todas las pantallas
- **Colores Consistentes**: Contraste apropiado en ambos temas
- **Transiciones Suaves**: Cambio de tema animado

## 🔄 Builds Automatizados

### Flujo de Trabajo de GitHub Actions
El proyecto incluye generación automatizada de APK:

- **Disparador**: Builds automáticos en push a rama main/master
- **Multi-formato**: Se generan APKs debug y release
- **Almacenamiento de Artefactos**: APKs almacenados por 30 días para descarga
- **Integración de Release**: Commits etiquetados crean releases de GitHub

### Proceso de Build
1. **Configuración de Entorno**: Node.js 18 + Java 17 + Android SDK
2. **Instalación de Dependencias**: `npm ci` para builds reproducibles
3. **Build Web**: `npm run build` crea assets web optimizados
4. **Sync de Capacitor**: Actualiza proyecto nativo de Android
5. **Generación de APK**: Gradle construye APKs debug y release
6. **Subida de Artefactos**: APKs subidos como artefactos de GitHub Actions

## 🚨 Cumplimiento de Requisitos

### Requisitos de Actividad 6 ✅
- **✅ Integración API de Google Books**: Búsqueda de libros en tiempo real
- **✅ Múltiples Pantallas**: Búsqueda, Detalles, Favoritos con navegación
- **✅ Almacenamiento Local**: Favoritos guardados persistentemente en dispositivo
- **✅ Manejo de Errores**: Errores de red, resultados vacíos, fallos de API
- **✅ Estados de Carga**: Spinners e indicadores de carga
- **✅ Diseño Mobile-First**: Componentes Ionic responsivos

### Características Adicionales ✅
- **✅ Búsqueda Avanzada**: Historial y sugerencias
- **✅ Compartir Social**: Soporte para múltiples plataformas
- **✅ Recomendaciones de Libros**: Libros similares impulsados por IA
- **✅ Soporte de Temas**: Cambio de modo Oscuro/Claro
- **✅ Generación de APK**: Builds móviles automatizados

## 📊 Rendimiento y Optimización

- **Eficiencia de API**: Cache inteligente y optimización de peticiones
- **Carga Perezosa**: Componentes e imágenes cargados bajo demanda
- **Local-First**: Acceso instantáneo a favoritos e historial
- **Imágenes Optimizadas**: Miniaturas de portadas de libros responsivas
- **Tamaño de Bundle**: Build optimizado con tree-shaking

## 🔐 Privacidad y Seguridad

- **Solo Datos Locales**: Sin seguimiento de usuario o análisis
- **Privacidad de API**: Solo consultas de búsqueda enviadas a API de Google Books
- **Compartir Seguro**: Usa APIs oficiales de plataforma para compartir social
- **Sin Datos Personales**: Sin recolección de información personal

## 📱 Requisitos del Sistema

### Versión Web
- Navegador moderno con soporte ES2020
- Conexión a internet activa para llamadas a API

### APK Android
- Android 6.0 (API Level 23) o superior
- Conexión a internet para búsquedas de libros
- ~4MB espacio de almacenamiento
- Opcional: Permiso de cámara para futuro escaneo de código de barras

## 🏗️ Desarrollo y Contribución

### Scripts Disponibles
- `npm run dev` - Iniciar servidor de desarrollo (http://localhost:8100)
- `npm run build` - Build para producción
- `npm run preview` - Vista previa del build de producción

### Calidad de Código
- **TypeScript**: Seguridad de tipos completa
- **ESLint**: Linting de código y consistencia
- **Arquitectura de Componentes**: Componentes modulares y reutilizables
- **Capa de Servicio**: Lógica de negocio separada

## 📄 Licencia y Uso Académico

Este proyecto se desarrolla como parte del coursework de Desarrollo de Aplicaciones Móviles - Actividad 6. 

### Cumplimiento Académico
- **Desarrollo Original**: Construido desde cero con fines educativos
- **Integración de API**: Demuestra consumo de API del mundo real
- **Mejores Prácticas**: Sigue estándares de desarrollo móvil
- **Documentación**: Documentación de proyecto comprensiva

---

**Construido con ❤️ para el Curso de Desarrollo de Aplicaciones Móviles - Actividad 6**

**Demo en Vivo**: http://localhost:8100/ (Desarrollo)  
**GitHub Actions**: Builds automáticos de APK disponibles en pestaña Actions