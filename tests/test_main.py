from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_home():
    response = client.get(
        "/", headers={"content-type": "text/html; charset=utf-8"})
    assert response.status_code == 200
    assert b"Welcome to FastAPI Starter" in response.content
    response = client.get("/static/css/style3.css")
    assert response.status_code == 200