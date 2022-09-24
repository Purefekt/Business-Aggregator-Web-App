from audioop import add
import requests

# test data
# pasadena skydiving, no image
# id = "cy2ZD0b6bJKmbSuExnPN_A"

# bestia id, as in the pdf
id = "fEY0zHaDMfIW3-N__joDKQ"

# detroit pizza depot. has more than one transactions
# id = "TcbgGfKA5p1615ty_QYyFg"

#  pacific blue veer
# id = "NsyNqmhJyJM12T60UkhVCg"

API_KEY = "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx"
headers = {'Authorization' : f'Bearer {API_KEY}'}

# get data
response = requests.get(f"https://api.yelp.com/v3/businesses/{id}", headers=headers)
data = response.json()

# check status
if data['is_closed'] == False:
    status = True
else:
    status = False

category = ""
for i in range(len(data['categories'])):
    category = category + data['categories'][i]['title'] + ' | '
category = category[:-3]

address = ""
for s in data['location']['display_address']:
    address = address + s + ' '
address = address[:-1]

phone_number = data['display_phone']

transactions_supported = ""
for s in data['transactions']:
    transactions_supported = transactions_supported + s + ' | '
transactions_supported = transactions_supported[:-3]

price = data['price']

more_info = data['url']

photos = data['photos']

print(f"Status ===> {status}")
print(f"Category ===> {category}")
print(f"Address ===> {address}")
print(f"Phone Number ===> {phone_number}")
print(f"Transactions Supported ===> {transactions_supported}")
print(f"Price === {price}")
print(f"More info ===> {more_info}")
print(f"Photos ===> {photos}")
