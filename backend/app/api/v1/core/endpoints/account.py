from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from typing import Annotated
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from app.db_setup import get_db
from app.api.v1.core.schemas import (
    CreateUserSchema,
    UserResponseSchema,
    ModifyUserSchema,
    TokenSchema,
)
from app.api.v1.core.models import User, Token
from passlib.context import CryptContext
import base64
from random import SystemRandom


router = APIRouter(tags=["account"], prefix="/account")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/account/token/create")


def get_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
) -> User:
    db_token = (
        db.execute(select(Token).where(Token.token == token)).scalars().first()
    )
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    return db_token.user


def get_token(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
) -> Token:
    db_token = (
        db.execute(select(Token).where(Token.token == token)).scalars().first()
    )
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    return db_token


@router.post("/user/create", status_code=status.HTTP_201_CREATED)
def create_user(
    user: CreateUserSchema, db: Session = Depends(get_db)
) -> UserResponseSchema:
    hashed_password = pwd_context.hash(user.password)

    created_user = User(
        **user.model_dump(exclude={"password"}),
        hashed_password=hashed_password,
    )
    db.add(created_user)
    db.commit()
    return created_user


@router.get("/user", response_model=UserResponseSchema)
def get_current_user(current_user: User = Depends(get_user)):
    return current_user


@router.put("/user/modify", status_code=status.HTTP_200_OK)
def modify_user(
    username: ModifyUserSchema,
    current_user: User = Depends(get_user),
    db: Session = Depends(get_db),
) -> UserResponseSchema:
    new_username = username.model_dump().get("username")
    if new_username:
        taken = db.scalars(
            select(User).where(User.username == new_username)
        ).first()
        if taken:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username is already registered",
            )
    current_user.username = new_username
    db.commit()
    return current_user


@router.post("/token/create", status_code=status.HTTP_201_CREATED)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
) -> TokenSchema:
    user = (
        db.execute(select(User).where(User.email == form_data.username))
        .scalars()
        .first()
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    if not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    rnd_token = (
        base64.urlsafe_b64encode(SystemRandom().randbytes(32))
        .rstrip(b"=")
        .decode("ascii")
    )
    token = Token(token=rnd_token, user_id=user.id)
    db.add(token)
    db.commit()
    return token


@router.delete("/token/delete", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    current_token: Token = Depends(get_token),
    db: Session = Depends(get_db),
):
    db.execute(delete(Token).where(Token.token == current_token.token))
    db.commit()
