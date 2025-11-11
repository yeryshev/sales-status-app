import json

import httpx

from app.api.routes.websockets import manager
from app.core.config import settings
from app.models import User

mango_statuses = {"online": 1, "dont_disturb": 2, "break": 3, "offline": 4}
app_statuses = {
    "work": [1],
    "busy/meeting": [2, 7],
    "lunch/away": [5, 6],
    "offline": [3],
}


def get_new_mango_status_id(new_status_id: int) -> int:
    if new_status_id in app_statuses["work"]:
        return mango_statuses["online"]
    elif new_status_id in app_statuses["lunch/away"]:
        return mango_statuses["dont_disturb"]
    elif new_status_id in app_statuses["busy/meeting"]:
        return mango_statuses["dont_disturb"]
    elif new_status_id in app_statuses["offline"]:
        return mango_statuses["offline"]
    else:
        return mango_statuses["online"]


async def send_ws_after_user_update(updated_user: User) -> None:
    user_to_send = {
        "id": updated_user.id,
        "statusId": updated_user.status_id,
        "status": updated_user.status.to_dict() if updated_user.status else None,
        "busyTime": (
            updated_user.busy_time.to_dict() if updated_user.busy_time else None
        ),
        "isWorkingRemotely": updated_user.is_working_remotely,
        "updatedAt": updated_user.updated_at.isoformat(),
    }

    await manager.broadcast(json.dumps({"user": user_to_send}))


async def send_ws_with_all_users(users: list[User]) -> None:
    users_to_send = []
    for user in users:
        users_to_send.append(
            {
                "id": user.id,
                "statusId": user.status_id,
                "status": user.status.to_dict() if user.status else None,
                "busyTime": (user.busy_time.to_dict() if user.busy_time else None),
                "isWorkingRemotely": user.is_working_remotely,
                "updatedAt": user.updated_at.isoformat(),
            }
        )

    await manager.broadcast(json.dumps({"users": users_to_send}))


async def change_mango_status(user: User, status_id: int) -> httpx.Response | None:
    if user.mango_user_id is not None:
        api_url = settings.MANGO_SET_STATUS
        payload = {"abonent_id": user.mango_user_id, "status": status_id}
        headers = {"Content-Type": "application/json"}

        timeout = httpx.Timeout(20.0, connect=10.0)

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(api_url, json=payload, headers=headers)
            return response
        except httpx.ReadTimeout:
            print("Request timed out")
            return None


async def send_password_reset_notification(user: User, token: str) -> None:
    url = str(settings.N8N_STATUS_ADMIN_BOT_WEBHOOK)
    data = {
        "type": "password_reset",
        "body": {
            "user_id": user.id,
            "email": user.email,
            "reset_token": token,
        },
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data)
            response.raise_for_status()
            print("Notification sent successfully:", response.json())
        except httpx.HTTPStatusError as e:
            print(
                f"Error sending notification: {e.response.status_code} {e.response.text}"
            )
        except Exception as e:
            print(f"Unexpected error: {str(e)}")


async def send_password_has_changed_notification(user: User) -> None:
    url = str(settings.N8N_STATUS_ADMIN_BOT_WEBHOOK)
    data = {
        "type": "password_has_changed",
        "body": {
            "user_id": user.id,
            "email": user.email,
        },
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data)
            response.raise_for_status()
            print("Notification sent successfully:", response.json())
        except httpx.HTTPStatusError as e:
            print(
                f"Error sending notification: {e.response.status_code} {e.response.text}"
            )
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
