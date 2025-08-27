# Books App - Actividad 6

Aplicación móvil híbrida de búsqueda de libros que consume la API de Google Books para mostrar información detallada de libros, gestionar favoritos y compartir contenido. Proyecto desarrollado como parte de la actividad académica para demostrar el consumo de APIs externas, navegación entre pantallas y almacenamiento local.

## Objetivo de la Actividad

Desarrollar una aplicación móvil que se conecte a una API externa pública, implemente múltiples pantallas con navegación, maneje almacenamiento local y demuestre funcionalidades avanzadas de una aplicación moderna.

## Acceso a la Aplicación

### Android APK
**[📱 Descargar APK](https://github.com/tunek12421/Actividad6/raw/main/android/app/build/outputs/apk/debug/app-debug.apk)**

#### Instalación en Android:
1. Descargar el APK desde el enlace directo
2. Configurar Android: Ajustes > Seguridad > Permitir "Fuentes desconocidas" 
3. Instalar el archivo APK
4. Ejecutar "Books App"

### Web Application (Desarrollo Local)
```bash
npm install
npm run dev
# Visitar http://localhost:5173
```

## Cumplimiento de Requisitos

### Consumo de API Externa
- Integración con Google Books API para búsqueda de libros
- Peticiones HTTP realizadas mediante fetch API
- Manejo de respuestas JSON estructuradas
- Búsqueda en tiempo real con términos dinámicos

### Navegación y Pantallas Múltiples
- **Pantalla Principal**: Búsqueda de libros con historial
- **Pantalla de Detalles**: Información completa del libro
- **Pantalla de Favoritos**: Gestión de libros guardados
- Navegación fluida entre pantallas usando Ionic Router

### Almacenamiento Local
- Gestión de libros favoritos con LocalStorage
- Persistencia del historial de búsquedas
- Configuración de temas (claro/oscuro)
- Datos almacenados localmente sin dependencia de servidor

### Manejo de Errores
- Validación de libros no encontrados
- Manejo de errores de conectividad de red
- Estados de carga durante peticiones API
- Notificaciones informativas para el usuario

## Funcionalidades Implementadas

### Funcionalidades Requeridas
- **Búsqueda de libros**: Buscar libros por título, autor o término
- **Detalles de libro**: Visualizar información completa incluyendo descripción, autor, fecha
- **Gestión de favoritos**: Agregar/quitar libros de favoritos con almacenamiento local
- **Navegación**: Transición fluida entre pantallas principales

### Funcionalidades Adicionales
- **Historial de búsqueda**: Almacenamiento de términos recientes con acceso rápido
- **Compartir libros**: Funcionalidad social nativa para compartir información de libros
- **Libros similares**: Recomendaciones inteligentes basadas en autor y categoría
- **Temas dinámicos**: Modo claro y oscuro con persistencia de configuración
- **Información detallada**: Portadas, calificaciones, categorías y metadatos completos
- **Optimización de imágenes**: Carga eficiente de portadas de libros

## Instrucciones de Uso

### Búsqueda de Libros
1. Ejecutar la aplicación Books App
2. Ingresar término de búsqueda en el campo principal
3. Presionar "Buscar" o tecla Enter
4. Explorar resultados con portadas y información básica
5. Tocar cualquier libro para ver detalles completos

### Gestión de Favoritos
1. **Agregar**: En pantalla de detalles, presionar ⭐ "Agregar a Favoritos"
2. **Ver favoritos**: Navegar a pestaña "Favoritos" en la barra inferior
3. **Quitar**: En favoritos o detalles, presionar ⭐ para remover
4. **Persistencia**: Favoritos se mantienen entre sesiones de la app

### Funcionalidades Avanzadas
1. **Historial**: Utilizar búsquedas recientes desde el dropdown
2. **Compartir**: Usar botón compartir en detalles de libro
3. **Similares**: Explorar recomendaciones en la sección "Libros Similares"
4. **Temas**: Alternar modo claro/oscuro desde el botón superior

## Tecnologías Implementadas

### Framework y Lenguajes
- **Ionic React**: Framework híbrido para aplicaciones móviles multiplataforma
- **TypeScript**: Lenguaje tipado para desarrollo robusto y mantenible
- **React**: Biblioteca para construcción de interfaces de usuario
- **HTML/CSS**: Estructura y estilos responsivos

### Herramientas de Desarrollo
- **Vite**: Build tool moderno para compilación y optimización
- **Capacitor**: Plataforma para deployment nativo en Android/iOS
- **Node.js**: Entorno de ejecución para desarrollo y build
- **Android Studio**: IDE para builds y debugging Android

### APIs y Servicios
- **Google Books API**: Servicio externo para búsqueda y datos de libros
- **Fetch API**: Cliente HTTP nativo para peticiones web
- **Share API**: API nativa para compartir contenido
- **LocalStorage**: Almacenamiento local del navegador

### Almacenamiento y Estado
- **LocalStorage**: Persistencia de datos del usuario
- **React Hooks**: Manejo de estado y efectos en componentes
- **Context API**: Gestión global de temas y configuración

## Requisitos del Sistema

### Para Android APK
- Android 6.0 (API Level 23) o superior
- Conexión a Internet para búsquedas de libros
- Aproximadamente 4MB de espacio libre
- Permisos de almacenamiento para gestión de favoritos

### Para Desarrollo Local
- Node.js 20+ y npm
- Navegador web moderno con soporte ES2020
- Conexión a Internet activa

## Información Técnica

### Instalación para Desarrollo
```bash
git clone https://github.com/tunek12421/Actividad6.git
cd Actividad6
npm install
npm run dev
```

### Compilación de APK
```bash
npm run build
npx cap sync android
export ANDROID_HOME=/home/tunek/Android/Sdk
cd android && ./gradlew assembleDebug
```

### Configuración de API
La aplicación utiliza la API pública de Google Books sin necesidad de API key. La configuración se encuentra en:
- `src/services/booksService.ts` - Servicio principal de búsqueda
- Base URL: `https://www.googleapis.com/books/v1/volumes`

## Estructura del Proyecto

```
src/
├── components/
│   └── BookImage.tsx           # Componente de imágenes optimizadas
├── pages/
│   ├── SearchPage.tsx          # Pantalla principal con búsqueda
│   ├── BookDetailsPage.tsx     # Detalles completos del libro
│   └── FavoritesPage.tsx       # Gestión de libros favoritos
├── services/
│   ├── booksService.ts         # Integración con Google Books API
│   ├── favoritesService.ts     # Gestión local de favoritos
│   ├── shareService.ts         # Funcionalidad de compartir
│   ├── searchHistoryService.ts # Historial de búsquedas
│   └── similarBooksService.ts  # Motor de recomendaciones
├── types/
│   └── book.ts                 # Definiciones TypeScript para libros
├── App.tsx                     # Componente raíz con navegación
└── main.tsx                    # Punto de entrada de la aplicación
```

## Características Destacadas

### Sistema de Búsqueda Inteligente
- Búsqueda en tiempo real con API de Google Books
- Historial persistente de términos de búsqueda
- Sugerencias rápidas desde búsquedas anteriores
- Manejo de estados vacíos y errores de búsqueda

### Gestión Avanzada de Favoritos
- Almacenamiento local sin dependencia de servidor
- Interfaz dedicada para gestión de favoritos
- Indicadores visuales de estado en toda la aplicación
- Persistencia entre sesiones y reinicios

### Sistema de Recomendaciones
- Algoritmo de libros similares basado en:
  - Mismo autor
  - Categorías relacionadas
  - Análisis de palabras clave del título
  - Calificaciones similares

### Funcionalidad Social
- Compartir nativo del dispositivo cuando disponible
- Fallback a portapapeles para compatibilidad universal
- Mensajes formateados con información rica del libro

## Requisitos Académicos Cumplidos

### Actividad 6 - Consumo de APIs y Navegación
- ✅ **API Externa**: Google Books API completamente integrada
- ✅ **Múltiples Pantallas**: 3 pantallas principales con navegación
- ✅ **Almacenamiento Local**: Favoritos e historial persistentes
- ✅ **Manejo de Errores**: Estados de error y carga implementados
- ✅ **Diseño Mobile**: Componentes Ionic responsivos y optimizados
- ✅ **Build Android**: APK funcional generada y probada

### Funcionalidades Extra Implementadas
- 🚀 **Historial Inteligente**: Búsquedas recientes con acceso rápido
- 🚀 **Compartir Social**: Integración con sistema nativo de compartir
- 🚀 **Recomendaciones**: Sistema de libros similares
- 🚀 **Temas Dinámicos**: Modo claro/oscuro persistente
- 🚀 **Optimización**: Carga lazy de imágenes y caching

## Recursos y Enlaces

- **Repositorio GitHub**: [https://github.com/tunek12421/Actividad6](https://github.com/tunek12421/Actividad6)
- **Descarga Directa APK**: [app-debug.apk](https://github.com/tunek12421/Actividad6/raw/main/android/app/build/outputs/apk/debug/app-debug.apk)
- **Google Books API**: [https://developers.google.com/books](https://developers.google.com/books)
- **Issues y Soporte**: [GitHub Issues](https://github.com/tunek12421/Actividad6/issues)

---

**📚 Desarrollado para Desarrollo de Aplicaciones Móviles - Actividad 6**

*Una aplicación completa que demuestra integración de APIs, navegación móvil, almacenamiento local y funcionalidades sociales modernas.*