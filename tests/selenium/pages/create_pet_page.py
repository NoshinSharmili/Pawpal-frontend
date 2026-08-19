from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from .base_page import BasePage


class CreatePetPage(BasePage):
    TITLE = (By.CSS_SELECTOR, '[data-testid="create-pet-title"]')
    NAME_INPUT = (By.CSS_SELECTOR, '[data-testid="create-pet-name-input"], input[aria-label="Pet Name"]')
    CATEGORY_PICKER = (By.CSS_SELECTOR, '[data-testid="create-pet-category-picker"], select')
    CATEGORY_ERROR = (By.CSS_SELECTOR, '[data-testid="create-pet-category-error"]')
    BREED_INPUT = (By.CSS_SELECTOR, '[data-testid="create-pet-breed-input"], input[aria-label="Breed"]')
    DOB_INPUT = (By.CSS_SELECTOR, '[data-testid="create-pet-dob-input"], input[aria-label="Date of Birth"]')
    HEALTH_INPUT = (By.CSS_SELECTOR, '[data-testid="create-pet-health-input"], input[aria-label="Health Status"]')
    LOCATION_INPUT = (By.CSS_SELECTOR, '[data-testid="create-pet-location-input"], input[aria-label="Location"]')
    SUBMIT_BUTTON = (By.CSS_SELECTOR, '[data-testid="create-pet-submit-button"]')
    BACK_BUTTON = (By.CSS_SELECTOR, '[data-testid="create-pet-back-button"]')
    IMAGE_PICKER = (By.CSS_SELECTOR, '[data-testid="create-pet-image-picker"]')

    def open_create_pet(self):
        self.open("/createpet")
        self.visible(self.TITLE)
        return self

    def fill_pet_details(self, name: str, breed: str, dob: str, health: str, location: str):
        self.type_text(self.NAME_INPUT, name)
        self.type_text(self.BREED_INPUT, breed)
        self.type_text(self.DOB_INPUT, dob)
        self.type_text(self.HEALTH_INPUT, health)
        self.type_text(self.LOCATION_INPUT, location)

    def select_category(self, value: str):
        picker = self.visible(self.CATEGORY_PICKER)
        target = picker
        if picker.tag_name.lower() != "select":
            inner = picker.find_elements(By.TAG_NAME, "select")
            if inner:
                target = inner[0]
        Select(target).select_by_value(value)

    def submit(self):
        self.click(self.SUBMIT_BUTTON)
