from selenium.webdriver.common.by import By

from .base_page import BasePage


class HomepagePage(BasePage):
    SEARCH_INPUT = (By.CSS_SELECTOR, '[data-testid="homepage-search-input"], input[aria-label="Search for pets"]')
    CATEGORIES_TITLE = (By.CSS_SELECTOR, '[data-testid="homepage-categories-title"]')
    CATEGORY_ALL = (By.CSS_SELECTOR, '[data-testid="homepage-category-all"]')
    CATEGORY_CATS = (By.CSS_SELECTOR, '[data-testid="homepage-category-cats"]')
    CATEGORY_DOGS = (By.CSS_SELECTOR, '[data-testid="homepage-category-dogs"]')
    SEEK_HELP_BUTTON = (By.CSS_SELECTOR, '[data-testid="homepage-seek-help-button"]')
    SEE_FOSTERS_BUTTON = (By.CSS_SELECTOR, '[data-testid="homepage-see-fosters-button"]')
    NO_PETS = (By.CSS_SELECTOR, '[data-testid="homepage-no-pets"]')

    def open_homepage(self):
        self.open("/homepage")
        self.visible(self.SEARCH_INPUT)
        return self

    def search_for(self, query: str):
        self.type_text(self.SEARCH_INPUT, query)

    def select_cats_category(self):
        self.click(self.CATEGORY_CATS)

    def open_foster_finder(self):
        self.click(self.SEE_FOSTERS_BUTTON)
