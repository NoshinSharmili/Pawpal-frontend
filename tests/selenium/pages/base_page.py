import time

from selenium.common.exceptions import (
    ElementClickInterceptedException,
    NoSuchElementException,
    StaleElementReferenceException,
)
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

DEFAULT_TIMEOUT = 40


class BasePage:
    def __init__(self, driver: WebDriver, base_url: str, timeout: int = DEFAULT_TIMEOUT):
        self.driver = driver
        self.base_url = base_url.rstrip("/")
        self.wait = WebDriverWait(driver, timeout)
        self.timeout = timeout

    def open(self, path: str = "/"):
        self.driver.get(f"{self.base_url}{path}")

    def find(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def visible(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def clickable(self, locator):
        return self.wait.until(EC.element_to_be_clickable(locator))

    def click(self, locator):
        last_error = None
        deadline = time.time() + self.timeout
        while time.time() < deadline:
            try:
                element = self.driver.find_element(*locator)
                self.driver.execute_script(
                    "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
                    element,
                )
                try:
                    element.click()
                except (ElementClickInterceptedException, StaleElementReferenceException):
                    self.driver.execute_script("arguments[0].click();", element)
                return
            except (StaleElementReferenceException, NoSuchElementException, ElementClickInterceptedException) as error:
                last_error = error
                time.sleep(0.3)
        raise last_error or TimeoutError(f"Could not click {locator}")

    def type_text(self, locator, value: str):
        field = self.visible(locator)
        field.click()
        field.send_keys(Keys.CONTROL, "a")
        field.send_keys(Keys.DELETE)
        field.send_keys(value)
        return field

    def text_of(self, locator) -> str:
        return self.visible(locator).text

    def is_displayed(self, locator) -> bool:
        return self.visible(locator).is_displayed()

    def url_contains(self, fragment: str):
        self.wait.until(EC.url_contains(fragment))
        return fragment in self.driver.current_url

    def wait_for_alert(self, timeout: int | None = None):
        waiter = WebDriverWait(self.driver, timeout or self.timeout)
        return waiter.until(EC.alert_is_present())

    def is_present(self, locator) -> bool:
        try:
            self.driver.find_element(*locator)
            return True
        except NoSuchElementException:
            return False
