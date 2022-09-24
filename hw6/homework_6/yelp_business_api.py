from audioop import add
import requests

# test data
# pasadena skydiving, no image
# id = "cy2ZD0b6bJKmbSuExnPN_A"

# bestia id, as in the pdf
# id = "fEY0zHaDMfIW3-N__joDKQ"

# detroit pizza depot. has more than one transactions and no price
id = "TcbgGfKA5p1615ty_QYyFg"

#  pacific blue veer
# id = "NsyNqmhJyJM12T60UkhVCg"

API_KEY = "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx"
headers = {'Authorization' : f'Bearer {API_KEY}'}

# get data
response = requests.get(f"https://api.yelp.com/v3/businesses/{id}", headers=headers)
data = response.json()

status, category, address, phone_number, transactions_supported, price, more_info, photos = None,None,None,None,None,None,None,None
# check status
if 'is_closed' in data:
    if data['is_closed'] == False:
        status = True
    else:
        status = False

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

print(f"Status ===> {status}")
print(f"Category ===> {category}")
print(f"Address ===> {address}")
print(f"Phone Number ===> {phone_number}")
print(f"Transactions Supported ===> {transactions_supported}")
print(f"Price === {price}")
print(f"More info ===> {more_info}")
print(f"Photos ===> {photos}")


# Status ===> True
# Category ===> Italian | Cocktail Bars | Pizza
# Address ===> 2121 E 7th Pl Los Angeles, CA 90021
# Phone Number ===> (213) 514-5724
# Transactions Supported ===> delivery
# Price === $$$
# More info ===> https://www.yelp.com/biz/bestia-los-angeles?adjust_creative=uXRGEQz38hkVivWYuP-pvQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=uXRGEQz38hkVivWYuP-pvQ
# Photos ===> ['https://s3-media1.fl.yelpcdn.com/bphoto/QWniJCG7Jk0GXf9u8lNI4g/o.jpg', 'https://s3-media2.fl.yelpcdn.com/bphoto/OiK29eJfT4PyMjCRYlkU8A/o.jpg', 'https://s3-media1.fl.yelpcdn.com/bphoto/HYhd80kUtmc5BS-FeW-ilw/o.jpg']