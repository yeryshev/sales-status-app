from fastapi_users import FastAPIUsers
from fastapi_users.authentication import CookieTransport, AuthenticationBackend
from fastapi_users.authentication import JWTStrategy

from src.config import AUTH_SECRET
from src.auth.manager import get_user_manager
from src.models import User

cookie_transport = CookieTransport(
    cookie_name='auth',
    cookie_max_age=360000,
    cookie_secure=False,
    cookie_samesite="lax",
    cookie_httponly=True,
)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=AUTH_SECRET, lifetime_seconds=360000)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_user = fastapi_users.current_user()
current_superuser = fastapi_users.current_user(active=True, superuser=True)
