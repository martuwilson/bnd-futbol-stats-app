# ⚽ Fútbol Stats App

Una aplicación web completa para gestionar estadísticas de fútbol amateur. Permite crear equipos, registrar jugadores, organizar partidos y llevar un seguimiento detallado de las estadísticas individuales y colectivas.

## 🎯 Características del MVP

### 🔐 1. Autenticación
- Registro e inicio de sesión de usuarios
- Cada usuario actúa como administrador de sus propios equipos
- Campos: nombre, apodo (opcional), email, password

### 🧍‍♂️ 2. Gestión de Jugadores
- Crear y editar jugadores
- Asignar jugadores a partidos
- Agregar nuevos jugadores rápidamente durante la creación de partidos
- Campos: nombre, apodo (opcional), posición (opcional)

### 🏟️ 3. Gestión de Partidos
- Crear partidos con fecha y equipos
- Cargar resultados (goles por equipo)
- Registrar estadísticas individuales: goles, asistencias, tarjetas
- Ver historial completo de partidos

### 📊 4. Estadísticas
- Tabla de goleadores
- Tabla de asistencias
- Estadísticas por jugador
- Partidos jugados por jugador

### 🖥️ 5. Dashboard
- Último partido jugado
- Historial rápido
- Estadísticas destacadas

## 🧱 Stack Tecnológico

### 🟠 Frontend (/client)
- **Framework**: Vite + React + TypeScript
- **Estado**: Apollo Client (GraphQL)
- **Estilos**: TailwindCSS (pendiente)
- **Deploy**: Vercel

### 🔵 Backend (/server)
- **Framework**: NestJS + TypeScript
- **API**: GraphQL con Apollo Server
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Validación**: class-validator + class-transformer
- **Deploy**: Railway/Render/VPS

### 🐳 Infraestructura
- **Base de datos**: PostgreSQL con Docker
- **Contenedores**: Docker Compose para desarrollo

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- Docker y Docker Compose
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/martuwilson/bnd-futbol-stats-app.git
cd futbol-stats-app
```

### 2. Configurar la base de datos
```bash
# Levantar PostgreSQL con Docker
docker-compose up -d

# Verificar que esté funcionando
docker ps
```

### 3. Configurar el backend
```bash
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Generar cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma db push

# Ejecutar el servidor en modo desarrollo
npm run start:dev
```

El servidor estará disponible en:
- **API REST**: http://localhost:3002
- **GraphQL Playground**: http://localhost:3002/graphql

### 4. Configurar el frontend (próximamente)
```bash
cd client

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 📋 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/futbolstats"
PORT=3002
JWT_SECRET="your-secret-key" # (próximamente)
```

## 🗄️ Esquema de Base de Datos

### Entidades principales:
- **Users**: Administradores que gestionan equipos
- **Players**: Jugadores del equipo
- **Matches**: Partidos jugados
- **MatchPlayers**: Relación muchos a muchos entre partidos y jugadores
- **PlayerStats**: Estadísticas individuales por partido

### Relaciones:
- Un usuario puede tener muchos jugadores y partidos
- Un partido puede tener muchos jugadores (divididos en equipos)
- Cada jugador tiene estadísticas por partido

## 🛠️ Scripts Disponibles

### Backend (/server)
```bash
npm run start:dev    # Servidor en modo desarrollo
npm run build        # Compilar para producción
npm run start:prod   # Ejecutar en producción
npm test             # Ejecutar tests
```

### Docker
```bash
docker-compose up -d          # Levantar servicios
docker-compose down           # Bajar servicios
docker-compose logs db        # Ver logs de la BD
```

## 📊 API GraphQL

### Ejemplos de Queries y Mutations

#### Crear un usuario:
```graphql
mutation {
  createUser(data: {
    name: "Juan Pérez"
    email: "juan@email.com"
    password: "123456"
    nickname: "Juancho"
  }) {
    id
    name
    email
    nickname
  }
}
```

#### Crear un jugador:
```graphql
mutation {
  createPlayer(data: {
    name: "Lionel Messi"
    nickname: "Leo"
    position: "Delantero"
    userId: "user-id-aqui"
  }) {
    id
    name
    nickname
    position
  }
}
```

#### Obtener estadísticas de goleadores:
```graphql
query {
  topScorers(limit: 10) {
    player {
      name
      nickname
    }
    totalGoals
  }
}
```

## 📁 Estructura del Proyecto

```
futbol-stats-app/
├── client/                 # Frontend React (próximamente)
├── server/                 # Backend NestJS
│   ├── prisma/
│   │   └── schema.prisma   # Esquema de la base de datos
│   ├── src/
│   │   ├── users/          # Módulo de usuarios
│   │   ├── players/        # Módulo de jugadores
│   │   ├── matches/        # Módulo de partidos
│   │   ├── prisma/         # Servicio de Prisma
│   │   └── main.ts         # Punto de entrada
│   ├── .env                # Variables de entorno
│   └── package.json
├── docker-compose.yml      # Configuración de Docker
└── README.md
```

## 🚧 Estado del Desarrollo

### ✅ Completado
- [x] Configuración inicial del proyecto
- [x] Esquema de base de datos con Prisma
- [x] API GraphQL completa con NestJS
- [x] CRUD de usuarios, jugadores y partidos
- [x] Sistema de estadísticas
- [x] Base de datos PostgreSQL con Docker
- [x] Validación de datos

### 🔄 En Progreso
- [ ] Frontend con React + Apollo Client
- [ ] Autenticación JWT
- [ ] UI/UX con TailwindCSS

### 📋 Próximas Funcionalidades
- [ ] Sistema de torneos
- [ ] Exportar estadísticas a PDF
- [ ] Notificaciones en tiempo real
- [ ] App móvil con React Native
- [ ] Integración con APIs de fútbol

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Martin Wilson**
- GitHub: [@martuwilson](https://github.com/martuwilson)

## 🙏 Agradecimientos

- NestJS por el excelente framework
- Prisma por el ORM intuitivo
- Apollo GraphQL por la API moderna
- La comunidad de desarrolladores

---

⭐ Si este proyecto te resulta útil, ¡dale una estrella en GitHub!
