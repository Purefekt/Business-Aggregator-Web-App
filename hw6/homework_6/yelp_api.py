import requests


API_KEY = "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx"
headers = {'Authorization' : f'Bearer {API_KEY}'}

# test data
KEYWORD = 'Pizza'
lat = 34.0224
lng = -118.2851
CATEGORY = 'Food'
RAD = 16093 #meters

# get data
response = requests.get(f'https://api.yelp.com/v3/businesses/search?term={KEYWORD}&latitude={lat}&longitude={lng}&categories={CATEGORY}&radius={RAD}', headers=headers)
# print(response.status_code)
data = response.json()

# print(f"JSON data keys ==> {data.keys()}")
# print(f"Number of default results ==> {len(data['businesses'])}") # we get a list of 20 dicts or less
# print(f"Total results ==> {data['total']}")
# print(f"Region coords ==> {data['region']}")
# print the first result
# for k,v in data['businesses'][0].items():
#     print(k,v)

"""
Fields needed for table.
"""
image_url = data['businesses'][0]['image_url'] # Image
name = data['businesses'][0]['name'] # Business Name
rating = data['businesses'][0]['rating'] # Rating
distance = round(data['businesses'][0]['distance']/1609.344, 2) # Distance (miles)


print(f"Image ==> {image_url}")
print(f"Business Name ==> {name}")
print(f"Rating ==> {rating}")
print(f"Distance (miles) ==> {distance}")
print("========TO CHECK========")
print(f"Distance (meters) ==> {data['businesses'][0]['distance']}")
print(f"Yelp URL ==> {data['businesses'][0]['url']}")
