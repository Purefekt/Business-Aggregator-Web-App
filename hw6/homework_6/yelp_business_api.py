import requests

# test data
# pasadena skydiving, no image
# id = "cy2ZD0b6bJKmbSuExnPN_A"

# bestia id, as in the pdf
# id = "fEY0zHaDMfIW3-N__joDKQ"

# detroit pizza depot. has more than one transactions and no price
# id = "TcbgGfKA5p1615ty_QYyFg"

#  pacific blue
# id = "NsyNqmhJyJM12T60UkhVCg"

# invalid name
# id = "LUFdqNSABD1A2a0gdWApAQ"

# invalid hours
id = "AbAvH27zl_uVOM1CPeIlkQ"

API_KEY = "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx"
headers = {'Authorization' : f'Bearer {API_KEY}'}

# get data
response = requests.get(f"https://api.yelp.com/v3/businesses/{id}", headers=headers)
data = response.json()

name, status, category, address, phone_number, transactions_supported, price, more_info, photos = None,None,None,None,None,None,None,None,None

name = data["name"]

if 'hours' in data:
    if len(data['hours']) > 0:
        if 'is_open_now' in data['hours'][0]:
            status = data['hours'][0]['is_open_now']

if 'categories' in data:
    category = ""
    for i in range(len(data['categories'])):
        category = category + data['categories'][i]['title'] + ' | '
    category = category[:-3]

if 'location' in data:
    if 'display_address' in data['location']:
        address = ""
        for s in data['location']['display_address']:
            address = address + s + ' '
        address = address[:-1]

if 'display_phone' in data:
    phone_number = data['display_phone']

if 'transactions' in data:
    transactions_supported = ""
    for s in data['transactions']:
        transactions_supported = transactions_supported + s.title() + ' | '
    transactions_supported = transactions_supported[:-3]

if 'price' in data:
    price = data['price']

if 'url' in data:
    more_info = data['url']

if 'photos' in data:
    photos = data['photos']

print(f"Name ===> {name}")
print(f"Status ===> {status}")
print(f"Category ===> {category}")
print(f"Address ===> {address}")
print(f"Phone Number ===> {phone_number}")
print(f"Transactions Supported ===> {transactions_supported}")
print(f"Price === {price}")
print(f"More info ===> {more_info}")
print(f"Photos ===> {photos}")
