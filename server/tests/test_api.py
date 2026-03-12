import json
import tempfile
from pathlib import Path

import pytest

from app import create_app


@pytest.fixture()
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


@pytest.fixture()
def sample_log():
    """Create a temporary JSONL log file."""
    entries = [
        {
            "subtype": "init",
            "data": {
                "type": "system",
                "subtype": "init",
                "cwd": "/tmp",
                "session_id": "test-123",
                "tools": ["Bash"],
                "model": "claude-sonnet-4-6",
                "claude_code_version": "1.0.0",
                "permissionMode": "default",
            },
        },
        {
            "content": [{"text": "Hello!"}],
            "model": "claude-sonnet-4-6",
            "parent_tool_use_id": None,
            "error": None,
        },
        {
            "subtype": "success",
            "duration_ms": 1000,
            "duration_api_ms": 900,
            "is_error": False,
            "num_turns": 1,
            "session_id": "test-123",
            "total_cost_usd": 0.01,
            "usage": {
                "input_tokens": 10,
                "cache_creation_input_tokens": 0,
                "cache_read_input_tokens": 0,
                "output_tokens": 5,
            },
            "result": "Hello!",
        },
    ]
    with tempfile.NamedTemporaryFile(mode="w", suffix=".jsonl", delete=False) as f:
        for entry in entries:
            f.write(json.dumps(entry) + "\n")
        return Path(f.name)


def test_health(client):  # type: ignore[no-untyped-def]
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}


def test_echo(client):  # type: ignore[no-untyped-def]
    resp = client.post("/api/echo", json={"msg": "hello"})
    assert resp.status_code == 200
    assert resp.get_json() == {"echo": {"msg": "hello"}}


def test_get_log_with_file_param(client, sample_log):  # type: ignore[no-untyped-def]
    resp = client.get(f"/api/log?file={sample_log}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["filename"] == sample_log.name
    assert len(data["entries"]) == 3
    assert data["entries"][0]["subtype"] == "init"
    assert data["entries"][2]["subtype"] == "success"


def test_get_log_missing_file(client):  # type: ignore[no-untyped-def]
    resp = client.get("/api/log?file=/nonexistent/file.jsonl")
    assert resp.status_code == 404


def test_get_log_no_param(client):  # type: ignore[no-untyped-def]
    resp = client.get("/api/log")
    assert resp.status_code == 404
