import src.config

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
telegram_secret_key = src.config.TELEGRAM_BOT_SECRET
