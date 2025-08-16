# 🧪 GUÍA DE TESTING END-TO-END
# Futbol Stats App - Testing Completo desde Frontend

## 👥 USUARIOS DE PRUEBA

### 🔑 ADMIN (Control Total)
- **Email:** williner.martin@gmail.com
- **Password:** Wert1234!
- **Permisos:** Todo (crear/editar/eliminar partidos, usuarios, etc.)

### 🛡️ MANAGER (Gestión de Partidos)
- **Email:** williner@manager.com
- **Password:** Manager123!
- **Permisos:** Crear/editar partidos, gestionar convocatorias

### 👀 VIEWER (Solo Lectura)
- **Email:** williner@viewer.com
- **Password:** Viewer123!
- **Permisos:** Ver partidos y estadísticas, apuntarse a convocatorias

---

## 🌐 URLS DE TESTING

- **Frontend:** http://localhost:5173
- **Backend GraphQL:** http://localhost:3002/graphql
- **Playground GraphQL:** http://localhost:3002/graphql

---

## 🧪 PLAN DE TESTING END-TO-END

### ✅ FASE 1: Testing del Sistema de Autenticación

1. **🔐 Login/Logout con cada rol:**
   - [ ] Login como ADMIN ✅
   - [ ] Login como MANAGER ✅
   - [ ] Login como VIEWER ✅
   - [ ] Verificar redirección correcta
   - [ ] Probar logout y limpieza de tokens

2. **🛡️ Protección de Rutas:**
   - [ ] Intentar acceder sin login (debe redirigir a /login)
   - [ ] Verificar navegación protegida después del login
   - [ ] Probar refreshing de página con sesión activa

### ✅ FASE 2: Testing de Funcionalidades por Rol

#### 🔑 Como ADMIN (williner.martin@gmail.com):
- [ ] Ver dashboard con datos completos
- [ ] Crear nuevos partidos
- [ ] Editar partidos existentes
- [ ] Eliminar partidos
- [ ] Crear convocatorias
- [ ] Gestionar usuarios
- [ ] Ver todas las estadísticas

#### 🛡️ Como MANAGER (williner@manager.com):
- [ ] Ver dashboard
- [ ] Crear nuevos partidos ✅
- [ ] Editar partidos existentes ✅
- [ ] NO debe poder eliminar partidos ❌
- [ ] Crear y gestionar convocatorias ✅
- [ ] NO debe poder gestionar usuarios ❌

#### 👀 Como VIEWER (williner@viewer.com):
- [ ] Ver dashboard
- [ ] NO debe poder crear partidos ❌
- [ ] NO debe poder editar partidos ❌
- [ ] Puede ver convocatorias ✅
- [ ] Puede apuntarse a convocatorias ✅
- [ ] Ver estadísticas (solo lectura) ✅

### ✅ FASE 3: Testing de API Backend desde Frontend

#### 🏟️ Gestión de Partidos:
- [ ] Crear partido (POST) - Admin/Manager
- [ ] Listar partidos (GET) - Todos
- [ ] Ver partido específico (GET) - Todos
- [ ] Editar partido (PUT) - Admin/Manager
- [ ] Eliminar partido (DELETE) - Solo Admin

#### 📱 Sistema de Convocatorias:
- [ ] Crear convocatoria - Admin/Manager
- [ ] Listar convocatorias activas - Todos
- [ ] Apuntarse a convocatoria - Todos
- [ ] Desapuntarse de convocatoria - Todos
- [ ] Cerrar convocatoria - Admin/Manager

#### 📊 Estadísticas:
- [ ] Ver rankings - Todos
- [ ] Ver estadísticas de jugador - Todos
- [ ] Ver estadísticas de temporada - Todos

### ✅ FASE 4: Testing de UI/UX

#### 📱 Responsive Design:
- [ ] Probar en móvil (375px)
- [ ] Probar en tablet (768px)
- [ ] Probar en desktop (1024px+)
- [ ] Verificar navegación touch-friendly

#### 🎨 Interfaz:
- [ ] Estados de loading
- [ ] Manejo de errores
- [ ] Mensajes de feedback
- [ ] Animaciones y transiciones

---

## 🔧 COMANDOS ÚTILES PARA TESTING

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ver logs del backend
cd server && npm run start:dev

# Reiniciar base de datos (si es necesario)
cd server && npx prisma migrate reset

# Ver todos los usuarios actuales
node test-queries.js
```

---

## 📋 CHECKLIST DE TESTING

### Antes de cada sesión:
- [ ] Backend corriendo en :3002
- [ ] Frontend corriendo en :5173
- [ ] Base de datos conectada
- [ ] Los 3 usuarios de prueba creados

### Durante el testing:
- [ ] Documentar bugs encontrados
- [ ] Verificar permisos de cada rol
- [ ] Probar casos edge (límites, errores)
- [ ] Verificar responsividad móvil

### Después del testing:
- [ ] Commit de cambios necesarios
- [ ] Documentar funcionalidades probadas
- [ ] Planificar próximas mejoras

---

## 🚀 ¡LISTO PARA EMPEZAR!

1. Ve a http://localhost:5173
2. Empieza con el usuario ADMIN
3. Prueba cada funcionalidad sistemáticamente
4. Luego cambia a MANAGER y VIEWER
5. Documenta todo lo que encuentres

¡Que empiece el testing! 🎯
