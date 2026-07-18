# Google Sheets como almacenamiento

Archivo objetivo: `15UpM0lCgKJXwTHoyYjZpZ0OyVQuxYQ54Uhg7DyLfGwQ`.

1. Compartir el archivo con `taniuskaynicolai@gmail.com` como editor.
2. En el Sheet abrir **Extensiones → Apps Script** y pegar `integrations/google-apps-script/Code.gs`.
3. Ejecutar `setup()` una vez y autorizar el acceso solicitado.
4. En **Configuración del proyecto → Propiedades de secuencia de comandos**, crear `API_SECRET` con un secreto aleatorio de al menos 32 bytes.
5. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como propietario y permitir acceso a cualquiera. El secreto de aplicación evita escrituras no autorizadas.
6. Configurar en Vercel `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_WEBHOOK_SECRET` y `CHAT_STORAGE_PROVIDER=sheets`.
7. Probar creación, avance y confirmación antes de retirar Neon.

Apps Script usa `LockService` para serializar escrituras y neutraliza valores que podrían interpretarse como fórmulas.
