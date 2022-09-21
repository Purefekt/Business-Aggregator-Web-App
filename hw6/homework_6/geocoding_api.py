import requests
import collections

API_KEY = "AIzaSyCJn6gE_Bu1c1hZ1CF7PDtijhqhKVpx33c"


def format_loc(location: str):
    location = location.split(' ')

    # remove extra spaces
    location_counter = collections.Counter(location)
    space_count = None
    if '' in location_counter:
        space_count = location_counter['']
    if space_count:
        for i in range(space_count):
            location.remove('')

    # format location with + between tokens
    formatted_loc = location[0]
    if len(location) < 2:
        return formatted_loc

    for i in range(1, len(location)):
        formatted_loc = formatted_loc + '+' + location[i]
    return formatted_loc


# test data
location = 'University of Southern California CA'
location = format_loc(location)

# get data
response = requests.get(f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={API_KEY}")
# print(response.status_code)
data = response.json()

lat = data['results'][0]['geometry']['location']['lat']
lng = data['results'][0]['geometry']['location']['lng']

print(lat)
print(lng)

# format input data

