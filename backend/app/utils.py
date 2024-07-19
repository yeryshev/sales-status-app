import json

from backend.app.api.routes.websockets import manager
from backend.app.models import User

mango_statuses = {
    'online': 1,
    'dont_disturb': 2,
    'break': 3,
    'offline': 4
}
app_statuses = {
    'work': [1],
    'busy/meeting': [2, 7],
    'lunch/away': [5, 6],
    'offline': [3]
}


def get_new_mago_status_id(new_status_id: int) -> int:
    if new_status_id in app_statuses['work']:
        return mango_statuses['online']
    elif new_status_id in app_statuses['lunch/away']:
        return mango_statuses['dont_disturb']
    elif new_status_id in app_statuses['busy/meeting']:
        return mango_statuses['dont_disturb']
    elif new_status_id in app_statuses['offline']:
        return mango_statuses['offline']
    else:
        return mango_statuses['online']


async def send_ws_after_user_update(updated_user: User):
    await manager.broadcast(json.dumps({
        "userId": updated_user.id,
        "statusId": updated_user.status_id,
        "status": updated_user.status.to_dict(),
        "busyTime": updated_user.busy_time.to_dict() if updated_user.busy_time else None,
        "isWorkingRemotely": updated_user.is_working_remotely,
        "updatedAt": updated_user.updated_at.isoformat(),
    }))
