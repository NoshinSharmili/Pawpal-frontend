"""Feature 1: Pet creation — add a pet from the create-pet form."""

from pages.create_pet_page import CreatePetPage


class TestCreatePet:
    def test_create_pet_form_is_displayed(self, driver, base_url):
        page = CreatePetPage(driver, base_url).open_create_pet()

        assert "Add a Pet" in page.text_of(page.TITLE)
        assert page.is_displayed(page.NAME_INPUT)
        assert page.is_displayed(page.CATEGORY_PICKER)
        assert page.is_displayed(page.BREED_INPUT)
        assert page.is_displayed(page.DOB_INPUT)
        assert page.is_displayed(page.HEALTH_INPUT)
        assert page.is_displayed(page.LOCATION_INPUT)
        assert page.is_displayed(page.SUBMIT_BUTTON)

    def test_pet_details_can_be_entered(self, driver, base_url):
        page = CreatePetPage(driver, base_url).open_create_pet()
        page.fill_pet_details(
            name="Mango",
            breed="Tabby",
            dob="2022-04-12",
            health="Healthy",
            location="Dhaka",
        )
        page.select_category("cats")

        assert page.find(page.NAME_INPUT).get_attribute("value") == "Mango"
        assert page.find(page.BREED_INPUT).get_attribute("value") == "Tabby"
        assert page.find(page.DOB_INPUT).get_attribute("value") == "2022-04-12"
        assert page.find(page.HEALTH_INPUT).get_attribute("value") == "Healthy"
        assert page.find(page.LOCATION_INPUT).get_attribute("value") == "Dhaka"
        assert page.find(page.CATEGORY_PICKER).get_attribute("value") == "cats"

    def test_submit_without_category_shows_validation_error(self, driver, base_url):
        page = CreatePetPage(driver, base_url).open_create_pet()
        page.type_text(page.NAME_INPUT, "Mango")
        page.submit()

        assert page.is_displayed(page.CATEGORY_ERROR)
        assert "Please select a pet category" in page.text_of(page.CATEGORY_ERROR)
