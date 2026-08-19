from selenium.webdriver.common.by import By

from .base_page import BasePage


class RegisterFosterPage(BasePage):
    TITLE = (By.CSS_SELECTOR, '[data-testid="foster-register-title"]')
    NAME_INPUT = (By.CSS_SELECTOR, '[data-testid="foster-name-input"], input[aria-label="Full Name"]')
    EMAIL_INPUT = (By.CSS_SELECTOR, '[data-testid="foster-email-input"], input[aria-label="Email Address"]')
    PHONE_INPUT = (By.CSS_SELECTOR, '[data-testid="foster-phone-input"], input[aria-label="Phone Number"]')
    ADDRESS_INPUT = (By.CSS_SELECTOR, '[data-testid="foster-address-input"], input[aria-label="Street Address"]')
    CAPACITY_INPUT = (By.CSS_SELECTOR, '[data-testid="foster-capacity-input"], input[aria-label="Capacity"]')
    PET_TYPE_DOGS = (By.CSS_SELECTOR, '[data-testid="foster-pet-type-dogs"]')
    SUBMIT_BUTTON = (By.CSS_SELECTOR, '[data-testid="foster-submit-button"]')
    FORM_ERROR = (By.CSS_SELECTOR, '[data-testid="foster-form-error"]')

    def open_register_foster(self):
        self.open("/RegisterFoster")
        self.visible(self.TITLE)
        return self

    def fill_required_fields(self, name: str, email: str, phone: str, address: str, capacity: str):
        self.type_text(self.NAME_INPUT, name)
        self.type_text(self.EMAIL_INPUT, email)
        self.type_text(self.PHONE_INPUT, phone)
        self.type_text(self.ADDRESS_INPUT, address)
        self.type_text(self.CAPACITY_INPUT, capacity)

    def choose_dogs(self):
        self.click(self.PET_TYPE_DOGS)

    def submit(self):
        self.click(self.SUBMIT_BUTTON)
