from pydantic import BaseModel



class LoginDTO(BaseModel):
    username: str
    password: str


class LoginResponseDTO(BaseModel):
    id_user: int
    username: str


class UserSessionSchema(BaseModel):
    id_user: int
    username: str

