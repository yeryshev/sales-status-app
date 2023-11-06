def create_teammates(rows):
    users = []
    for row in rows:
        user, status, comment = row
        user_dict = {**user.__dict__}
        del user_dict['status_id']
        del user_dict['comment_id']
        user_dict['status'] = status.title if status else None
        user_dict['comment'] = comment.description if comment else None
        users.append(user_dict)

    return users
