import pytest

from app import create_app


@pytest.fixture()
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health(client):  # type: ignore[no-untyped-def]
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}


def test_echo(client):  # type: ignore[no-untyped-def]
    resp = client.post("/api/echo", json={"msg": "hello"})
    assert resp.status_code == 200
    assert resp.get_json() == {"echo": {"msg": "hello"}}
