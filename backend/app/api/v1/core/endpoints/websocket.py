from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["ws"], prefix="/ws")


# Manages the room functionality for the websocket so that people can join, leave and send messages to eachother in different groups
class ChatRoomManager:
    def __init__(self):
        self.active_connections: dict[WebSocket] = {}
        self.active_ids = {}

    async def connect(
        self, websocket: WebSocket, room_id: int, client_id: int
    ):
        await websocket.accept()

        if room_id not in self.active_connections:
            self.active_connections[room_id] = [websocket]
            self.active_ids[room_id] = [client_id]
        else:
            self.active_connections[room_id].append(websocket)
            self.active_ids[room_id].append(client_id)

        for connection in self.active_connections[room_id]:
            await connection.send_json(self.active_ids[room_id])

    async def disconnect(
        self, websocket: WebSocket, room_id: int, client_id: int
    ):
        self.active_connections[room_id].remove(websocket)
        self.active_ids[room_id].remove(client_id)
        for connection in self.active_connections[room_id]:
            await connection.send_json(["disconnect", client_id])

    async def send_roomwide(self, message: str, room_id: int, client_id):
        for connection in self.active_connections[room_id]:
            await connection.send_bytes(
                str(client_id).encode(encoding="utf-8")
                + "n4m3s3p4r4tor".encode(encoding="utf-8")
                + message
            )


manager = ChatRoomManager()


@router.websocket("/{room_id}/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket, room_id: str, client_id: str
):
    await manager.connect(websocket, room_id, client_id)
    try:
        while True:
            data = await websocket.receive_bytes()
            await manager.send_roomwide(data, room_id, client_id)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, room_id, client_id)
