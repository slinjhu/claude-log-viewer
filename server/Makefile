.PHONY: setup dev build clean lint typecheck test

setup:
	uv sync

dev:
	uv run python -m app.dev

build:
	uv build

lint:
	uv run ruff check --fix .
	uv run ruff format .

typecheck:
	uv run mypy app/

unittest:
	uv run pytest

# Run all checks (lint + typecheck + test)
test: lint typecheck unittest

clean:
	rm -rf dist build *.egg-info .venv __pycache__ .pytest_cache .mypy_cache
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
