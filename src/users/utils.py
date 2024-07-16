from src.users.consts import mango_statuses, app_statuses


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
