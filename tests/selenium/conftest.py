"""Shared Chrome WebDriver setup for Pawpal Selenium tests.

Prerequisites:
  1. Start the Expo web app:  npx expo start --web
  2. Install Python deps:     pip install -r tests/selenium/requirements.txt
  3. Run tests:               pytest

Optional environment variables:
  PAWPAL_URL   Base URL (default http://localhost:8081)
  HEADLESS     Set to 1 to run Chrome without a window
"""

import os
import socket
from urllib.parse import urlparse

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.getenv("PAWPAL_URL", "http://localhost:8081").rstrip("/")
DEFAULT_TIMEOUT = 40


def _app_is_reachable(url: str) -> bool:
    parsed = urlparse(url)
    host = parsed.hostname or "localhost"
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    try:
        with socket.create_connection((host, port), timeout=3):
            return True
    except OSError:
        return False


@pytest.fixture(scope="session")
def base_url():
    if not _app_is_reachable(BASE_URL):
        pytest.exit(
            f"Pawpal web app is not running at {BASE_URL}. "
            "Start it with: npx expo start --web",
            returncode=1,
        )
    return BASE_URL


@pytest.fixture
def driver():
    options = Options()
    options.add_argument("--window-size=1280,900")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-search-engine-choice-screen")
    if os.getenv("HEADLESS") == "1":
        options.add_argument("--headless=new")

    chrome = webdriver.Chrome(options=options)
    chrome.implicitly_wait(0)
    yield chrome
    chrome.quit()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, DEFAULT_TIMEOUT)
