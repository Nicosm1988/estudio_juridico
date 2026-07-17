# Seguridad y privacidad

Se solicita consentimiento antes de recopilar datos. El bot pide el mínimo necesario, advierte que no se envíe documentación sensible y no brinda asesoramiento. Las entradas se validan con Zod; PostgreSQL usa consultas parametrizadas. No se registra PII en logs. El acceso administrativo requiere autenticación antes de manejar casos reales. Solicitudes de acceso, rectificación o eliminación requieren revisión humana.

Retención inicial propuesta, sujeta a validación legal: sesiones incompletas 90 días; consultas 12 meses; logs técnicos 30 días.
