# Despliegue en Vercel

Variables requeridas: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_STUDIO_NAME`. Vincular una base Postgres desde Vercel Marketplace, ejecutar `pnpm db:push` contra esa base y luego desplegar. No almacenar secretos como variables `NEXT_PUBLIC_*`.
