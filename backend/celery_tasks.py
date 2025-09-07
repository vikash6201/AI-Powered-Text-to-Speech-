from .celery_app import celery_app
from chatterbox import ChatterboxTTS
import torch
import torchaudio
import tempfile

# Shared model loaded once per worker
device = "cuda" if torch.cuda.is_available() else "cpu"
model = ChatterboxTTS.from_pretrained(device=device)

@celery_app.task
def generate_audio(text, cfg_weight=0.5, exaggeration=0.5, audio_prompt_path=None):
    wav = model.generate(text, cfg_weight, exaggeration, audio_prompt_path)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
        torchaudio.save(f.name, wav, model.sr, format="wav")
        return f.name  # Return path to the audio file
