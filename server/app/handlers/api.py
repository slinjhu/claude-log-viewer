"""API endpoints."""

import json
from pathlib import Path

from flask import Blueprint, current_app, jsonify, request

bp = Blueprint("api", __name__)


@bp.get("/api/health")
def health():  # type: ignore[no-untyped-def]
    """Health check endpoint."""
    return jsonify({"status": "ok"})


@bp.post("/api/echo")
def echo():  # type: ignore[no-untyped-def]
    """Echo back the request body."""
    data = request.get_json()
    return jsonify({"echo": data})


@bp.get("/api/log")
def get_log():  # type: ignore[no-untyped-def]
    """Return parsed log entries from the configured log file, or from a path query param."""
    # Accept ?file= query param, fall back to CLI-configured path
    file_param = request.args.get("file")
    if file_param:
        filepath: Path | None = Path(file_param)
    else:
        filepath = current_app.config.get("LOG_PATH")

    if not filepath or not filepath.exists():
        return jsonify({"error": "Log file not found"}), 404

    if filepath.suffix != ".jsonl":
        return jsonify({"error": "File must be a .jsonl file"}), 400

    entries = []
    for line in filepath.read_text().splitlines():
        line = line.strip()
        if not line:
            continue
        entries.append(json.loads(line))

    return jsonify(
        {
            "path": str(filepath),
            "filename": filepath.name,
            "entries": entries,
        }
    )
