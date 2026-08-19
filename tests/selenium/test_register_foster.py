"""Feature 3: Foster registration — apply to become a foster home."""

from pages.register_foster_page import RegisterFosterPage


class TestRegisterFoster:
    def test_foster_form_is_displayed(self, driver, base_url):
        page = RegisterFosterPage(driver, base_url).open_register_foster()

        assert "Register as Foster" in page.text_of(page.TITLE)
        assert page.is_displayed(page.NAME_INPUT)
        assert page.is_displayed(page.EMAIL_INPUT)
        assert page.is_displayed(page.PHONE_INPUT)
        assert page.is_displayed(page.ADDRESS_INPUT)
        assert page.is_displayed(page.CAPACITY_INPUT)
        assert page.is_displayed(page.PET_TYPE_DOGS)
        assert page.is_displayed(page.SUBMIT_BUTTON)

    def test_foster_details_can_be_entered(self, driver, base_url):
        page = RegisterFosterPage(driver, base_url).open_register_foster()
        page.fill_required_fields(
            name="Amina Rahman",
            email="amina@pawpal.com",
            phone="01700000000",
            address="Gulshan, Dhaka",
            capacity="2",
        )
        page.choose_dogs()

        assert page.find(page.NAME_INPUT).get_attribute("value") == "Amina Rahman"
        assert page.find(page.EMAIL_INPUT).get_attribute("value") == "amina@pawpal.com"
        assert page.find(page.PHONE_INPUT).get_attribute("value") == "01700000000"
        assert page.find(page.ADDRESS_INPUT).get_attribute("value") == "Gulshan, Dhaka"
        assert page.find(page.CAPACITY_INPUT).get_attribute("value") == "2"

    def test_empty_submit_shows_validation_error(self, driver, base_url):
        page = RegisterFosterPage(driver, base_url).open_register_foster()
        page.submit()

        assert page.is_displayed(page.FORM_ERROR)
        assert "Please fill in" in page.text_of(page.FORM_ERROR)
        assert page.url_contains("RegisterFoster")
