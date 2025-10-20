from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_config import auth_backend, get_jwt_strategy
from app.schemas import SsoLoginRequest
from app.core.db import get_async_session
from app.crud import UserRepository
from app.api.auth_manager import get_user_manager
from fastapi_users import BaseUserManager

router = APIRouter()


@router.post("/sso-login")
async def sso_login(
    request: SsoLoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    user_manager: BaseUserManager = Depends(get_user_manager),
):
    """
    Авторизация через SSO (Keycloak).
    Ищет пользователя по email независимо от домена (.com, .ru и т.д.)
    """
    try:
        print(f"SSO login attempt for email: {request.email}")

        # Ищем пользователя по email
        user = await UserRepository.get_user_by_email(request.email, session)

        if not user:
            print(f"User not found for email: {request.email}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь с таким email не найден в системе"
            )

        print(f"User found: {user.email} (ID: {user.id})")

        if not user.is_active:
            print(f"User {user.email} is not active")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Пользователь деактивирован"
            )

        # Создаем JWT токен и устанавливаем cookie для авторизации
        try:
            jwt_strategy = get_jwt_strategy()
            access_token = await jwt_strategy.write_token(user)
            print(f"Access token created for user {user.email}")

            # Устанавливаем cookie как в обычной авторизации
            auth_backend.transport._set_login_cookie(response, access_token)
            print(f"Login cookie set for user {user.email}")

        except Exception as token_error:
            print(f"Token creation error: {str(token_error)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка создания токена авторизации"
            )

        # Возвращаем успешный ответ с данными пользователя
        return {
            "message": "SSO авторизация успешна",
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "second_name": user.second_name,
                "is_active": user.is_active,
                "is_superuser": user.is_superuser,
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"SSO login error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при авторизации через SSO"
        )
