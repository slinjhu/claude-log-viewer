"""CLI entry point."""

import socket
import webbrowser
from pathlib import Path
from threading import Timer
from urllib.parse import quote

import click

from app import create_app


def find_free_port(host: str = "127.0.0.1") -> int:
    """Find an available port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((host, 0))
        port: int = s.getsockname()[1]
        return port


@click.command()
@click.argument("logfile", type=click.Path(exists=True, dir_okay=False))
@click.option("--host", default="127.0.0.1", help="Host to bind to.")
@click.option("--port", default=0, help="Port to bind to (0 = auto-find).")
@click.option("--no-browser", is_flag=True, help="Don't open browser automatically.")
def main(logfile: str, host: str, port: int, no_browser: bool) -> None:
    """Claude SDK Log Viewer — view a JSONL log file.

    LOGFILE is the path to a .jsonl log file.
    """
    log_path = Path(logfile).resolve()
    if port == 0:
        port = find_free_port(host)

    app = create_app(log_path=log_path)

    if not no_browser:
        encoded = quote(str(log_path), safe="")
        url = f"http://{host}:{port}/?file={encoded}"
        Timer(1.0, lambda: webbrowser.open(url)).start()
        click.echo(f"Serving {log_path}")
        click.echo(f"Opening {url}")

    app.run(host=host, port=port)


if __name__ == "__main__":
    main()
