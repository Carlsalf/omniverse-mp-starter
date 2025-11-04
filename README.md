# Omniverse Multiplayer Starter (Lobby + Matchmaking + WS)

Minimal, production‑friendly starter to demonstrate **networked multiplayer concepts** for a UE5 role:
- **Lobby & Matchmaking** (REST)
- **Realtime transport** (WebSocket)
- **Room broadcast with basic state** (in‑memory for demo)
- Clean, documented code you can extend to **Epic Online Services** or a dedicated server

> Objetivo: mostrar tu entendimiento de arquitectura cliente‑servidor lista para conectar desde **Unreal Engine 5** (BP o C++), sin depender todavía de EOS.

## Arquitectura

```
UE5 Client <—— WebSocket ——> Realtime Gateway (ws://host/ws)
      |                                 |
      +—— REST (HTTP) ——> Lobby/Matchmaking (create/join/leave)
```

- **/health**: liveness probe
- **POST /create-room**: crea sala (returns roomId)
- **POST /join-room**: une jugador a la sala (returns wsUrl + token mock)
- **WS /ws?roomId=…&playerId=…**: envío/recepción de mensajes JSON

## Ejecutar

```bash
cp .env.example .env
npm i
npm run dev
# API: http://127.0.0.1:3001
```

## Prueba rápida (sin UE)

1) En el navegador abre **test-client.html** (doble click).  
2) Pulsa **Create Room** y luego **Join** desde dos pestañas.  
3) Envía mensajes y verás el **broadcast** dentro de la misma sala.

## Conectar desde UE5 (Blueprint/C++)

- **Blueprints**: usa un plugin de WebSocket (por ejemplo, VaRest para REST + cualquier WS plugin) para:
  1. `POST /create-room` → guarda `roomId`
  2. `POST /join-room` → recibe `playerId` y `wsUrl`
  3. Conecta a `wsUrl` y envía JSON con `{type, payload}`
- **C++**: utilizar `libwebsockets` o un plugin WS. El formato de mensajes ya está definido en `protocol.md`.

> En producción, sustituye WS por EOS P2P o **EOS Sessions**; el **lobby service** de este starter sirve de orquestador/apellidos de sesión.

## Escalabilidad (ruta rápida)

- Cambiar **in‑memory** por Redis para **rooms** y **pub/sub**.
- Añadir **JWT** y **rate‑limit** al REST/WS.
- Ejecutar varias instancias detrás de **Nginx** o **Cloud Load Balancer**.
- Persistir métricas con Prometheus + Grafana.

## Endpoints

- `GET /health` → `{ ok: true }`
- `POST /create-room` → `{ roomId }`
- `POST /join-room` (body: `{ roomId, nickname }`) → `{ playerId, wsUrl }`

## Licencia
MIT – hecho para tu candidatura a **Omniverse Studios (Alicante)**.
