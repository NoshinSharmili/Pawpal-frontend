"""Feature 2: Homepage — search, filter, and open foster finder."""

from pages.foster_finder_page import FosterFinderPage
from pages.homepage_page import HomepagePage


class TestHomepage:
    def test_search_and_categories_are_visible(self, driver, base_url):
        page = HomepagePage(driver, base_url).open_homepage()

        assert page.is_displayed(page.SEARCH_INPUT)
        assert page.is_displayed(page.CATEGORIES_TITLE)
        assert "Categories" in page.text_of(page.CATEGORIES_TITLE)
        assert page.is_displayed(page.CATEGORY_ALL)
        assert page.is_displayed(page.CATEGORY_CATS)
        assert page.is_displayed(page.CATEGORY_DOGS)
        assert page.is_displayed(page.SEE_FOSTERS_BUTTON)

    def test_search_accepts_a_query(self, driver, base_url):
        page = HomepagePage(driver, base_url).open_homepage()
        page.search_for("Mango")

        assert page.find(page.SEARCH_INPUT).get_attribute("value") == "Mango"

    def test_see_fosters_opens_foster_finder(self, driver, base_url):
        page = HomepagePage(driver, base_url).open_homepage()
        page.open_foster_finder()

        finder = FosterFinderPage(driver, base_url)
        finder.visible(finder.TITLE)
        assert finder.url_contains("FosterFinder")
        assert "Find a Foster" in finder.text_of(finder.TITLE)
