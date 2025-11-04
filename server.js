import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

// --- In-memory demo state ---
const rooms = new Map() // roomId -> { players: Map<playerId, ws>, meta: {...} }

function ensureRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { players: new Map(), meta: { createdAt: Date.now() } })
  }
  return rooms.get(roomId)
}

app.get('/health', (_, res) => res.json({ ok: true }))

app.post('/create-room', (req, res) => {
  const roomId = uuidv4()
  ensureRoom(roomId)
  return res.json({ roomId })
})

app.post('/join-room', (req, res) => {
  const { roomId, nickname } = req.body || {}
  if (!roomId) return res.status(400).json({ error: 'roomId required' })
  if (!rooms.has(roomId)) return res.status(404).json({ error: 'room not found' })

  const playerId = uuidv4()
  // token mock (en prod: JWT)
  const token = uuidv4()
  // ws URL con querystring simple (en prod: usa JWT)
  const wsUrl = `ws://127.0.0.1:${PORT}/ws?roomId=${roomId}&playerId=${playerId}&nickname=${encodeURIComponent(nickname||'player')}&token=${token}`
  return res.json({ playerId, wsUrl })
})

const server = app.listen(PORT, () => {
  console.log(`API listening on http://127.0.0.1:${PORT}`)
})

// --- WebSocket Gateway ---
const wss = new WebSocketServer({ server, path: '/ws' })

function broadcast(roomId, message, exceptPlayerId = null) {
  const room = rooms.get(roomId)
  if (!room) return
  const data = typeof message === 'string' ? message : JSON.stringify(message)
  for (const [pid, ws] of room.players.entries()) {
    if (ws.readyState === 1 && pid !== exceptPlayerId) {
      ws.send(data)
    }
  }
}

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://localhost`)
  const roomId = url.searchParams.get('roomId')
  const playerId = url.searchParams.get('playerId')
  const nickname = url.searchParams.get('nickname') || 'player'

  if (!roomId || !playerId || !rooms.has(roomId)) {
    ws.close(1008, 'Invalid room or player')
    return
  }
  const room = ensureRoom(roomId)
  room.players.set(playerId, ws)

  // welcome
  ws.send(JSON.stringify({ type: 'WELCOME', payload: { playerId, roomId } }))
  broadcast(roomId, { type: 'PLAYER_JOINED', payload: { playerId, nickname } }, playerId)

  ws.on('message', (raw) => {
    let msg
    try { msg = JSON.parse(raw.toString()) } catch { return }
    switch (msg.type) {
      case 'PING':
        ws.send(JSON.stringify({ type: 'PONG', payload: { ts: Date.now() } }))
        break
      case 'CHAT':
      case 'STATE':
      default:
        broadcast(roomId, { type: 'BROADCAST', payload: { from: playerId, data: msg } }, null)
        break
    }
  })

  ws.on('close', () => {
    const room = rooms.get(roomId)
    if (!room) return
    room.players.delete(playerId)
    broadcast(roomId, { type: 'PLAYER_LEFT', payload: { playerId } }, null)
    if (room.players.size === 0) {
      rooms.delete(roomId)
    }
  })
})
