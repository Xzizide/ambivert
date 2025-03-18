from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import HTMLResponse

app = FastAPI()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.active_ids = []

    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.active_ids.append(client_id)
        for connection in self.active_connections:
            await connection.send_json(self.active_ids)

    def disconnect(self, websocket: WebSocket, client_id: int):
        self.active_connections.remove(websocket)
        self.active_ids.remove(client_id)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_bytes(message)


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_bytes()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
        await manager.broadcast(f"Client #{client_id} left the chat")
