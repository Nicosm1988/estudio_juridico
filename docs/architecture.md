# Arquitectura

Aplicación full-stack Next.js con App Router. El sitio público y panel se renderizan en servidor; el widget de chat es cliente y usa Route Handlers. El motor conversacional es una máquina de estados determinística. PostgreSQL conserva sesiones, mensajes y respuestas; los códigos públicos no exponen UUID internos.

Estados MVP: `CONSENT_REQUIRED → ASK_FULL_NAME → ASK_LOCATION → ASK_PRACTICE_AREA → ASK_OPPOSING_PARTIES → ASK_SUMMARY → ASK_URGENCY → ASK_EMAIL → REVIEW → COMPLETED`. En cualquier paso: cancelación, privacidad o derivación humana.
