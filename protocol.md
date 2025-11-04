# Protocolo WS (JSON)

Todos los mensajes viajan como JSON.

### Cliente → Servidor
{ "type": "CHAT", "payload": { "text": "hola" } }
{ "type": "PING", "payload": {} }
{ "type": "STATE", "payload": { "x": 10, "y": 2, "z": 5 } }  // ejemplo de replicación

### Servidor → Cliente
{ "type": "WELCOME", "payload": { "playerId": "uuid", "roomId": "uuid" } }
{ "type": "PLAYER_JOINED", "payload": { "playerId": "uuid", "nickname": "Carlos" } }
{ "type": "BROADCAST", "payload": { "from": "uuid", "data": { ... } } }
{ "type": "PONG", "payload": { "ts": 1730726400 } }
