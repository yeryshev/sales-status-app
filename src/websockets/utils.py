import json

from src.models import User
from src.websockets.router import manager


async def send_ws_after_user_update(updated_user: User):
    await manager.broadcast(json.dumps({
        "userId": updated_user.id,
        "statusId": updated_user.status_id,
        "status": updated_user.status.to_dict(),
        "comment": updated_user.comment.to_dict() if updated_user.comment else None,
        "busyTime": updated_user.busy_time.to_dict() if updated_user.busy_time else None,
        "commentId": updated_user.comment_id if updated_user.comment else None,
        "isWorkingRemotely": updated_user.is_working_remotely,
        "updatedAt": updated_user.updated_at.isoformat(),
    }))
