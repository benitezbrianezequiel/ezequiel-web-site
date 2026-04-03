# Deploy en VPS con Debian 13

Este proyecto esta preparado para correr como app SSR de Node en un VPS, con `systemd` para el proceso, `nginx` escuchando en `8080` y Cloudflare Tunnel apuntando a `http://localhost:8080`.

## Arquitectura

- Cloudflare Tunnel -> `http://localhost:8080`
- `nginx` en `localhost:8080`
- app Astro SSR en `127.0.0.1:4321`
- SQLite persistente en `/var/lib/ezequiel-web-site/blog.db`

## Requisitos del servidor

- Debian 13
- `git`, `curl`, `nginx`, `node`, `npm`, `systemd`
- repo clonado en `/var/www/ezequiel-web-site`

## Variables de entorno

Crear `/etc/ezequiel-web-site.env`:

```env
ADMIN_USER=admin
ADMIN_PASSWORD=changeme
SESSION_SECRET=replace-with-a-long-random-secret
SITE_URL=https://ezequielbenitez.site
DB_PATH=/var/lib/ezequiel-web-site/blog.db
```

## Instalar systemd

```bash
sudo cp deploy/ezequiel-web-site.service /etc/systemd/system/ezequiel-web-site.service
sudo systemctl daemon-reload
sudo systemctl enable ezequiel-web-site
```

## Instalar nginx

```bash
sudo cp deploy/nginx-ezequiel-web-site.conf /etc/nginx/sites-available/ezequiel-web-site.conf
sudo ln -s /etc/nginx/sites-available/ezequiel-web-site.conf /etc/nginx/sites-enabled/ezequiel-web-site.conf
sudo nginx -t
sudo systemctl reload nginx
```

Si ya tienes otro server block activo en `8080`, integra este bloque ahi en lugar de duplicarlo.

## Primer deploy

```bash
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

El script:

- actualiza el repo con `git fetch` y `git pull --ff-only`
- instala dependencias con `npm ci`
- compila con `npm run build`
- asegura la ruta persistente de SQLite
- reinicia `systemd`
- valida salud en `127.0.0.1:4321` y en `http://127.0.0.1:8080/`

## Variables opcionales del script

```bash
APP_DIR=/var/www/ezequiel-web-site \
BRANCH=main \
SERVICE_NAME=ezequiel-web-site \
ENV_FILE=/etc/ezequiel-web-site.env \
DATA_DIR=/var/lib/ezequiel-web-site \
HEALTHCHECK_URL=http://127.0.0.1:8080/ \
./scripts/deploy-vps.sh
```

## Cloudflare Tunnel

En Cloudflare, configura el route/origin del tunnel hacia:

```text
http://localhost:8080
```

No hace falta separar `/es`, `/en` o `/blog` en servicios distintos si todos los paths pertenecen a esta misma app.

## Verificacion rapida

```bash
curl -I http://127.0.0.1:8080/
curl -I http://127.0.0.1:8080/es/
curl -I http://127.0.0.1:8080/en/
curl -I http://127.0.0.1:8080/es/blog/
curl -I http://127.0.0.1:8080/admin/login
systemctl status ezequiel-web-site --no-pager
journalctl -u ezequiel-web-site -n 100 --no-pager
```
