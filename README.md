# tablero_andres

## Guía de Instalación
### 1. Crear entorno virtual de Python
```sh
# 1. Ir al backend del monorepo
cd backend

# 2. Crear entorno virtual
python3 -m venv .venv

# 3. Activar entorno virtual
source .venv/bin/activate

# 4. Instalar dependencias
python3 -m pip install -r requirements.txt
```

---

### 2. Clonar `.env.example`
```sh
sudo cp .env.example .env
```

---

### 3. Creación de la BDD

```sh
# 1. Acceder a psql como superusuario
sudo -u postgres psql

# 2. Crear el usuario (cambia 'tu_contraseña_segura' por la que vayas a usar)
CREATE USER rdc_user WITH PASSWORD 'tu_contraseña_segura';

# 3. Crear la base de datos asignando al nuevo usuario como propietario (OWNER)
CREATE DATABASE rdc_db OWNER rdc_user;

# 4. Otorgar todos los privilegios sobre la base de datos al usuario
GRANT ALL PRIVILEGES ON DATABASE rdc_db TO rdc_user;

# 5. Salir de psql
\q
```

---

### 4. Configuración de Variables de Entorno (`.env`)

Una vez que ejecutes los comandos anteriores en tu terminal de Linux (Debian 12), los valores correspondientes para tu archivo de configuración de entorno quedarán definidos de la siguiente manera:

```ini
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=rdc_user
DB_PASSWORD=tu_contraseña_segura
DB_NAME=rdc_db
```

---

### 5. Realizar migraciones

Crear tablas ejecutando el siguiente comando:

```sh
alembic upgrade head
```

---

### 6. Crear usuario

Ejecutar script de creación de usuario:

```sh
python3 -m src.scripts.seed_users
```

---

### 7. Configurar Frontend (Nginx)

Para que el SPA funcione correctamente con rutas limpias y evitar errores 404 al recargar, se debe configurar Nginx en tu máquina local:

1. **Crear archivo de configuración**:
   ```sh
   sudo nano /etc/nginx/sites-available/tablero-andres.conf
   ```

2. **Pegar la siguiente configuración** (ajusta la ruta de `root` a tu carpeta actual):
   ```nginx
   server {
       listen 8080;
       server_name localhost;

       # ¡IMPORTANTE! Ajusta esta ruta a tu directorio real
       root /home/nolan/hobbies/tablero_andres/frontend;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       include /etc/nginx/mime.types;
   }
   ```

3. **Habilitar el sitio y reiniciar Nginx**:
   ```sh
   # Crear el enlace simbólico
   sudo ln -s /etc/nginx/sites-available/tablero-andres.conf /etc/nginx/sites-enabled/

   # Verificar sintaxis
   sudo nginx -t

   # Reiniciar servicio
   sudo systemctl restart nginx
   ```

4. **Acceso**:
   El frontend estará disponible en `http://localhost:8080`


