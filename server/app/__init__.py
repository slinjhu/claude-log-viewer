"""Flask application factory."""

import os

from flask import Flask


def create_app() -> Flask:
    """Create and configure the Flask application."""
    static_folder = os.path.join(os.path.dirname(__file__), "statics")

    app = Flask(
        __name__,
        static_folder=static_folder if os.path.exists(static_folder) else None,
        static_url_path="",
    )

    from app.handlers.api import bp as api_bp
    from app.handlers.pages import bp as pages_bp

    app.register_blueprint(api_bp)
    app.register_blueprint(pages_bp)

    return app
