# Runbook operativo

- Salud: `GET /api/health`.
- Si el chat falla, verificar `DATABASE_URL` y conectividad de Postgres.
- Revisar consultas urgentes y derivaciones desde `/admin`.
- Ante incidente de privacidad, restringir acceso, preservar auditoría y notificar al responsable.
- Rollback: promover el último deployment verificado desde Vercel.
