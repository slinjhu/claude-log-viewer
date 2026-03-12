"""Page routes for serving the frontend."""

import os

from flask import Blueprint, current_app, send_from_directory

bp = Blueprint("pages", __name__)


@bp.get("/")
def index():  # type: ignore[no-untyped-def]
    """Serve the main page."""
    static_folder = current_app.static_folder
    if static_folder and os.path.exists(os.path.join(static_folder, "index.html")):
        return send_from_directory(static_folder, "index.html")
    return (
        """
    <html>
    <head><title>Claude SDK Log Viewer</title></head>
    <body>
        <h1>Claude SDK Log Viewer</h1>
        <p>Frontend not built yet. Run <code>make build</code> from the root directory.</p>
        <p>API available at <a href="/api/health">/api/health</a></p>
    </body>
    </html>
    """,
        200,
        {"Content-Type": "text/html"},
    )


@bp.get("/<path:path>")
def catch_all(path: str):  # type: ignore[no-untyped-def]
    """Serve static files or fall back to index.html for SPA routing."""
    static_folder = current_app.static_folder
    if not static_folder:
        return "Not found", 404

    # Try to serve the exact file
    file_path = os.path.join(static_folder, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(static_folder, path)

    # Try with .html extension (Next.js static export)
    html_path = f"{path}.html"
    if os.path.exists(os.path.join(static_folder, html_path)):
        return send_from_directory(static_folder, html_path)

    # Fall back to index.html for client-side routing
    if os.path.exists(os.path.join(static_folder, "index.html")):
        return send_from_directory(static_folder, "index.html")

    return "Not found", 404
