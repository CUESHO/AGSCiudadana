# 🏙️ AGS Ciudadana

**AGS Ciudadana** es una aplicación móvil diseñada para empoderar a los ciudadanos de Aguascalientes, permitiéndoles reportar problemas urbanos (baches, fallas de alumbrado, fugas de agua, etc.) directamente a las autoridades correspondientes.

## ✨ Características Principales

### 📱 Para Ciudadanos
- **Reportes en Tiempo Real**: Crea reportes con ubicación GPS exacta y fotografías.
- **Categorización**: Clasifica problemas como Baches, Alumbrado, Fugas, Basura o Seguridad.
- **Mapa Interactivo**: Visualiza reportes cercanos en un mapa dinámico.
- **Seguimiento**: Consulta el estado de tus reportes (Pendiente, En Proceso, Resuelto).
- **Perfil de Usuario**: Gestiona tus datos y revisa tu historial de actividad.

### 👷 Para Cuadrillas (Trabajadores)
- **Dashboard Operativo**: Vista exclusiva para trabajadores del municipio.
- **Gestión de Estados**: Actualiza el estatus de los reportes a "En Proceso" o "Resuelto".
- **Mapa de Trabajo**: Visualiza las tareas asignadas geográficamente.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React + Vite
- **Estilos**: Tailwind CSS
- **Mapas**: React Leaflet + OpenStreetMap
- **Base de Datos y Auth**: Firebase (Firestore & Authentication)
- **Móvil**: Capacitor (para generar APK nativo de Android)
- **Iconos**: Lucide React

## � Estructura de Datos y Control

### Base de Datos (Firebase Firestore)

La aplicación utiliza una base de datos NoSQL con dos colecciones principales:

#### 1. Colección `users`
Almacena la información de perfil de los ciudadanos.
```json
{
  "uid": "string (ID único de Firebase Auth)",
  "name": "string (Nombre completo)",
  "email": "string (Correo electrónico)",
  "photoURL": "string | null (URL de foto de perfil)",
  "createdAt": "string (Fecha ISO)"
}
```

#### 2. Colección `reports`
Almacena los reportes generados por los usuarios.
```json
{
  "id": "string (Auto-generado)",
  "userId": "string (Referencia al usuario)",
  "userName": "string (Nombre del reportante)",
  "category": {
    "id": "string (bache, alumbrado, fuga, etc.)",
    "name": "string (Nombre legible)"
  },
  "location": "GeoPoint (Latitud, Longitud)",
  "locationDetails": {
    "address": "string (Dirección aproximada)",
    "lat": "number",
    "lng": "number"
  },
  "description": "string (Detalles del problema)",
  "imageUrls": ["string (URLs de imágenes en Storage)"],
  "status": "string ('Pendiente' | 'En Proceso' | 'Resuelto')",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### Control y Arquitectura

#### Autenticación (`AuthContext`)
- Gestiona el estado global del usuario (login/logout).
- Sincroniza Firebase Auth con la colección `users` en Firestore.
- Protege las rutas privadas: si no hay usuario, redirige a Login.

#### Navegación (`App.jsx`)
- **Pública**: Login, Registro.
- **Privada (Ciudadano)**:
  - `Home`: Mapa y reportes cercanos.
  - `MyReports`: Historial personal.
  - `NewReport`: Formulario de creación.
  - `Profile`: Configuración de cuenta.
- **Privada (Trabajador)**:
  - `WorkerDashboard`: Panel de gestión de cuadrillas.

#### Estado Global
- **ToastContext**: Maneja notificaciones emergentes (éxito/error) en toda la app.
- **NotificationContext**: Gestiona alertas locales y avisos del sistema.

## 📐 Patrones de Diseño

La arquitectura del proyecto sigue las mejores prácticas modernas de React, implementando los siguientes patrones:

### 1. Arquitectura Basada en Componentes
La interfaz se divide en piezas reutilizables e independientes (`Navbar`, `Map`, `Layout`) que se componen para formar vistas complejas (`Pages`). Esto facilita el mantenimiento y la escalabilidad.

### 2. Service Layer (Capa de Servicios)
Toda la lógica de comunicación con Firebase está aislada en la carpeta `src/services/`.
- **Beneficio**: Los componentes de UI no conocen los detalles de la base de datos. Si cambiamos Firebase por otro backend, solo actualizamos los servicios.
- **Ejemplo**: `reportService.js`, `authService.js`.

### 3. Provider / Context Pattern
Se utiliza para la **Inyección de Dependencias** y manejo de estado global.
- **Implementación**: `AuthContext` envuelve la aplicación y "provee" el usuario actual a cualquier componente que lo necesite, evitando el "prop drilling" (pasar datos por múltiples niveles).

### 4. Observer Pattern (Observador)
Implementado a través de los listeners de Firebase.
- **Uso**: La aplicación "observa" cambios en el estado de autenticación (`onAuthStateChanged`) o en la base de datos y reacciona automáticamente actualizando la UI en tiempo real.

### 5. Custom Hooks Pattern
Se encapsula lógica compleja en funciones reutilizables.
- **Ejemplo**: `useAuth()` y `useToast()` abstraen la complejidad de acceder a los contextos, ofreciendo una API limpia para los componentes.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- Android Studio (para compilar la app móvil)

### Pasos para Desarrollo Web
   ```bash
   git clone <url-del-repo>
   cd Aplicacion
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo**
   ```bash
   npm run dev
   ```

### 📱 Compilación para Android

1. **Sincronizar proyecto web con Android**
   ```bash
   npx cap sync android
   ```

2. **Generar APK (Debug)**
   ```bash
   npm run build:apk
   ```
   *El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`*

3. **Abrir en Android Studio** (Opcional)
   ```bash
   npx cap open android
   ```

## 📂 Estructura del Proyecto

```
src/
├── components/   # Componentes reutilizables (Navbar, Map, Layout...)
├── context/      # Estados globales (Auth, Toast, Notifications)
├── pages/        # Vistas principales (Home, NewReport, Profile...)
├── services/     # Lógica de conexión con Firebase
└── App.jsx       # Punto de entrada y enrutamiento
```

## 🔒 Permisos Requeridos
- **Ubicación**: Para geolocalizar los reportes.
- **Cámara/Galería**: Para adjuntar evidencias fotográficas.
- **Internet**: Para sincronizar datos con el servidor.

---
Desarrollado por **Juan Carlos González Macías y Aaron Salvador Castañeda Ruiz** - Proyecto ADN
