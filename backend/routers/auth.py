from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, validator
from utils.email import send_otp_email
from utils import users
import random

router = APIRouter()
otp_store = {}

# ---------- Models ----------

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    is_above_eighteen: bool

    @validator("email")
    def validate_gmail(cls, email):
        if not email.endswith("@gmail.com"):
            raise ValueError("Only Gmail addresses are allowed")
        return email

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class LoginRequest(BaseModel):
    username: str
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class ResetPasswordInput(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# ---------- Routes ----------

@router.post("/register")
def register_user(data: RegisterRequest):
    if not data.is_above_eighteen:
        raise HTTPException(status_code=400, detail="Must be above 18 to register")

    if users.get_user_by_username(data.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    if users.get_user_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = str(random.randint(100000, 999999))
    otp_store[data.email] = {
        "otp": otp,
        "data": data,
        "type": "register"
    }

    send_otp_email(data.email, otp)
    return {"message": "OTP sent to Gmail. Please verify to complete registration."}


@router.post("/verify")
def verify_otp(data: OTPVerifyRequest):
    entry = otp_store.get(data.email)
    if not entry:
        raise HTTPException(status_code=400, detail="No OTP found for this email")

    if entry["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if entry["type"] == "register":
        reg = entry["data"]
        users.add_user(reg.username, reg.email, reg.password, reg.is_above_eighteen)
        del otp_store[data.email]
        return {"message": "Registration successful. Free trial started for 7 days."}

    raise HTTPException(status_code=400, detail="Invalid OTP purpose")


from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils import users
from utils.jwt_handler import create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    user = users.get_user_by_username(data.username)
    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({
        "username": data.username,
        "password": data.password
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "message": f"Welcome, {user['username']}"
    }


@router.post("/forgot-password")
def forgot_password(data: PasswordResetRequest):
    user = users.get_user_by_email(data.email)
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = str(random.randint(100000, 999999))
    otp_store[data.email] = {
        "otp": otp,
        "username": user["username"],
        "type": "reset"
    }

    send_otp_email(data.email, otp)
    return {"message": "OTP sent for password reset."}


@router.post("/reset-password")
def reset_password(data: ResetPasswordInput):
    entry = otp_store.get(data.email)
    if not entry or entry["type"] != "reset":
        raise HTTPException(status_code=400, detail="No password reset OTP found")

    if entry["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    success = users.update_password(entry["username"], data.new_password)
    del otp_store[data.email]

    if success:
        return {"message": "Password updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update password")
