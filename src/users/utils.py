def get_new_mago_status_id(new_status_id: int) -> int:
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
