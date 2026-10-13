"""Write the static GitHub Pages click-through into docs/."""

import os
import re
import shutil
from pathlib import Path

os.environ.setdefault("INNERA_PROVIDER", "fixed")

from starlette.testclient import TestClient

from innera.app import app
from innera.content import EXERCISES, METRICS

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
STATIC = Path(__file__).resolve().parent / "static"
ATTR = re.compile(r'(href|src|action)="(/[^"]*)"')


def routes() -> list[tuple[str, str]]:
    pages = [
        ("", "/"),
        ("gespraech", "/gespraech"),
        ("ziele", "/ziele"),
        ("einblicke", "/einblicke"),
        ("tagebuch", "/tagebuch"),
        ("profil", "/profil"),
        ("moment", "/moment"),
        ("woche", "/woche"),
        ("reflexion", "/reflexion"),
    ]
    pages.extend((f"einblicke/{metric.slug}", f"/einblicke/{metric.slug}") for metric in METRICS)
    pages.extend((f"moment/{item['slug']}", f"/moment/{item['slug']}") for item in EXERCISES)
    return pages


def _relative(url: str, prefix: str) -> str:
    path = url
    suffix = ""
    if "#" in path:
        path, fragment = path.split("#", 1)
        suffix = f"#{fragment}"
    if "?" in path:
        path, query = path.split("?", 1)
        suffix = f"?{query}{suffix}"
    if path == "/":
        return f"{prefix or './'}{suffix}"
    target = path.lstrip("/")
    if "." not in Path(target).name:
        target = f"{target}/"
    return f"{prefix}{target}{suffix}"


def render_page(html: str, folder: str) -> str:
    depth = 0 if not folder else folder.count("/") + 1
    prefix = "../" * depth
    html = html.replace(
        '<html lang="de">',
        f'<html lang="de" data-static="1" data-base="{prefix}">',
        1,
    )
    return ATTR.sub(lambda match: f'{match.group(1)}="{_relative(match.group(2), prefix)}"', html)


def export_pages(dest: Path | None = None) -> Path:
    target = dest or DOCS
    target.mkdir(parents=True, exist_ok=True)
    client = TestClient(app)
    for folder, url in routes():
        response = client.get(url)
        if response.status_code != 200:
            raise RuntimeError(f"{url} returned {response.status_code}")
        page = target / folder / "index.html" if folder else target / "index.html"
        page.parent.mkdir(parents=True, exist_ok=True)
        page.write_text(render_page(response.text, folder), encoding="utf-8")
    static_dest = target / "static"
    if static_dest.exists():
        shutil.rmtree(static_dest)
    shutil.copytree(STATIC, static_dest)
    (target / "manifest.webmanifest").write_text(
        (STATIC / "manifest.webmanifest")
        .read_text(encoding="utf-8")
        .replace('"/', '"./')
        .replace('"./static/', '"static/'),
        encoding="utf-8",
    )
    (target / ".nojekyll").write_text("", encoding="utf-8")
    return target


def main() -> None:
    print(export_pages())


if __name__ == "__main__":
    main()
