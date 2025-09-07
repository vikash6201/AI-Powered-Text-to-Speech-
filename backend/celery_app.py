from celery import Celery

celery_app = Celery(
    "chatterbox",
    broker="redis://localhost:6379/0",   # Where jobs are queued
    backend="redis://localhost:6379/0"   # Where results are stored
)

celery_app.conf.task_routes = {
    "celery_tasks.generate_audio": {"queue": "audio_queue"},
}
