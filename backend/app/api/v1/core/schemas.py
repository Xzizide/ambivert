from pydantic import BaseModel


class CreateUserSchema(BaseModel):
    username: str
    email: str
    password: str


class ModifyUserSchema(BaseModel):
    username: str


class UserResponseSchema(BaseModel):
    username: str
    email: str


class TokenSchema(BaseModel):
    token: str
