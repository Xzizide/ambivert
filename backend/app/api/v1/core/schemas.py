from pydantic import BaseModel


class CreateUserSchema(BaseModel):
    username: str
    email: str
    password: str


class UserResponseSchema(BaseModel):
    id: int
    username: str
    email: str


class TokenSchema(BaseModel):
    token: str
