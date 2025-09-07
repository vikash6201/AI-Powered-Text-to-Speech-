from fastapi import FastAPI
from routers import auth, tts
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Hello World"}

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(tts.router, prefix="/tts", tags=["Text-to-Speech"])