"""Development server entry point with auto-reload."""

from pathlib import Path

from app import create_app

if __name__ == "__main__":
    # Default to example file for dev
    example = Path(__file__).resolve().parent.parent.parent / "data" / "bug-fix-example.jsonl"
    log_path = example if example.exists() else None
    app = create_app(log_path=log_path)
    app.run(host="127.0.0.1", port=8000, debug=True)
