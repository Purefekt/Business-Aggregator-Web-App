import requests
import collections

API_KEY = "AIzaSyCJn6gE_Bu1c1hZ1CF7PDtijhqhKVpx33c"

# test data
# location = 'University of Southern California CA'
location = 'usc'

# get data
response = requests.get(f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={API_KEY}")
# print(response.status_code)
data = response.json()

lat = data['results'][0]['geometry']['location']['lat']
lng = data['results'][0]['geometry']['location']['lng']

print(lat)
print(lng)

# format input data

