import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()
logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(
            f"WebSocket connected. Total connections: {len(self.active_connections)}"
        )

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(
            f"WebSocket disconnected. Total connections: {len(self.active_connections)}"
        )

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: str):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")
                disconnected.append(connection)

        # Удаляем отключенные соединения
        for connection in disconnected:
            self.disconnect(connection)

    async def handle_ping(self, websocket: WebSocket):
        """Обработка ping сообщения - отправляем pong в ответ"""
        try:
            pong_message = json.dumps({"type": "pong"})
            await websocket.send_text(pong_message)
        except Exception as e:
            logger.error(f"Error sending pong: {e}")
            self.disconnect(websocket)


manager = ConnectionManager()


@router.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()

            # Проверяем, является ли сообщение ping
            try:
                message = json.loads(data)
                if isinstance(message, dict) and message.get("type") == "ping":
                    await manager.handle_ping(websocket)
                    continue
            except json.JSONDecodeError:
                # Если не JSON, обрабатываем как обычное сообщение
                pass

            # Обычная трансляция сообщения
            await manager.broadcast(data)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
