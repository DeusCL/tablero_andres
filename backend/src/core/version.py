import tomllib

from typing import Any
from pathlib import Path



def get_version() -> str:
    """Reads the current project version from pyproject.toml"""

    try:
        path: Path = Path(__file__).parent.parent.parent / "pyproject.toml"
        with open(path, "rb") as f:
            data: dict[str, Any] = tomllib.load(f)
            return str(data["project"]["version"])
    except Exception:
        return "0.0.0-dev"


VERSION: str = get_version()

