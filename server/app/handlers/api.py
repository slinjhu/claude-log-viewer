"""API endpoints."""

from flask import Blueprint, jsonify, request

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
