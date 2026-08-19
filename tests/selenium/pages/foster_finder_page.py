from selenium.webdriver.common.by import By

from .base_page import BasePage


class FosterFinderPage(BasePage):
    TITLE = (By.CSS_SELECTOR, '[data-testid="foster-finder-title"]')
    BACK_BUTTON = (By.CSS_SELECTOR, '[data-testid="foster-finder-back-button"]')
    EMPTY_STATE = (By.CSS_SELECTOR, '[data-testid="foster-finder-empty"]')
    CARDS = (By.CSS_SELECTOR, '[data-testid^="foster-card-"]')

    def open_foster_finder(self):
        self.open("/FosterFinderScreen")
        self.visible(self.TITLE)
        return self

    def wait_until_loaded(self):
        self.visible(self.TITLE)
        self.wait.until(
            lambda driver: self.is_present(self.EMPTY_STATE) or self.is_present(self.CARDS)
        )
        return self

    def go_back(self):
        self.click(self.BACK_BUTTON)
