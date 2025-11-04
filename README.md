# Omniverse Multiplayer Starter  
**Author:** Carlos Alfredo Callagua Llaque  
**GitHub:** [Carlsalf](https://github.com/Carlsalf)  
**Location:** Alicante, Spain  

---

## Overview  
This project is a lightweight **multiplayer networking starter** built with **Node.js + WebSocket**, designed to demonstrate a real-time client-server architecture suitable for **Unreal Engine 5** and **Epic Online Services (EOS)** integration.  

It was developed as part of my portfolio for **Omniverse Studios (Alicante)** to showcase practical skills in backend systems, lobby management, and real-time communication.  

---

##  Features  
 REST API for **Lobby & Matchmaking** (`/create-room`, `/join-room`)  
 WebSocket gateway for **real-time communication** (`/ws?roomId=...&playerId=...`)  
 **Broadcast system** for chat and gameplay replication  
 **In-memory room management** (can be upgraded to Redis)  
 HTML test client for simulating multiple players  

---

##  Architecture  
UE5 Client <----> REST API (Create/Join Room)
| |
+------ WebSocket -------> Realtime Gateway

