# Agent instructions

Rules in this file apply to all work in this repository.

## Tooling

- Use [uv](https://docs.astral.sh/uv/) for Python: environments, dependencies, scripts, and running commands (`uv add`, `uv run`, `uv sync`).
- Do not use `pip`, `poetry`, or `pipenv` for this project.

## Testing

- Every feature ships with a test suite. Add or extend tests in the same change as the feature.
- Run the suite with uv before considering the work done (`uv run pytest`).

## Version control

- Use the local git repository only. Commit on the local branch when asked.
- Do not add a remote, push, or open a pull request unless explicitly asked.
