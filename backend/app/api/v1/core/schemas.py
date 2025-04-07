from pydantic import BaseModel, Field, UUID4


class UserAddSchema(BaseModel):
    username: str
    email: str
    password: str
