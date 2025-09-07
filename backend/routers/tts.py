from fastapi import APIRouter, UploadFile, Form, Depends, File, HTTPException
from fastapi.responses import StreamingResponse
from utils.dependencies import get_current_user
from io import BytesIO
from chatterbox.tts import ChatterboxTTS
import torchaudio
import torch
import tempfile
import threading

router = APIRouter()

# Automatically select device
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Load shared model once
model = ChatterboxTTS.from_pretrained(device=device)

# Thread-safe lock for shared model access
model_lock = threading.Lock()

@router.post("/synthesize")
async def synthesize(
    text: str = Form(...),
    cfg_weight: float = Form(0.5),
    exaggeration: float = Form(0.5),
    audio_prompt: UploadFile = File(None),
    current_user: dict = Depends(get_current_user)
):
    # ✅ Limit to 20 words
    if len(text.split()) > 10000:
        raise HTTPException(status_code=400, detail="Text input exceeds 20-word limit.")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text input is empty.")

    try:
        audio_prompt_path = None
        if audio_prompt:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
                tmp_file.write(await audio_prompt.read())
                audio_prompt_path = tmp_file.name

        # ✅ Thread-safe model access
        with model_lock:
            wav = model.generate(
                text,
                cfg_weight=cfg_weight,
                exaggeration=exaggeration,
                audio_prompt_path=audio_prompt_path
            )

        # Save to in-memory buffer
        buffer = BytesIO()
        torchaudio.save(buffer, wav, model.sr, format="wav")
        buffer.seek(0)

        return StreamingResponse(buffer, media_type="audio/wav")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")
