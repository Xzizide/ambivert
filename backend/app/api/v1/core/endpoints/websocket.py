from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import ollama
from pydantic import BaseModel

router = APIRouter(tags=["ws"], prefix="/ws")


class Room(BaseModel):
    id: int
    name: str
    description: str


created_rooms = []


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


@router.websocket("/{client_id}/{personal_description}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    personal_description: str,
):
    room = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": """You are a room assigner. You will be given a description of a person and you will need to assign them to a room.
                            You make up the groupings yourself but the most important is the ID for the room.
                            Don't split the people up too much tho as we need more than one person in each room.""",
            },
            {
                "role": "system",
                "content": f"This is a list of rooms that have been created: {created_rooms}",
            },
            {
                "role": "user",
                "content": f"This is a description of me: {personal_description}",
            },
        ],
        format=Room.model_json_schema(),
    )
    print(room.message.content)
    room = Room.model_validate_json(room.message.content)
    print(type(room))
    created_rooms.append(room)
    await manager.connect(websocket, room.id, client_id)
    try:
        while True:
            data = await websocket.receive_bytes()
            await manager.send_roomwide(data, room.id, client_id)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, room.id, client_id)
