from config import CITY_MAP

def normalize_location(city):

    city = city.strip().lower()

    return CITY_MAP.get(city, city.title())