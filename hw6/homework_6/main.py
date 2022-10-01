from audioop import add
from flask import Flask, request, jsonify
import requests
import ipinfo

app = Flask(__name__)

GOOGLE_API_KEY = "AIzaSyCJn6gE_Bu1c1hZ1CF7PDtijhqhKVpx33c"
YELP_API_KEY = "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx"
headers = {'Authorization' : f'Bearer {YELP_API_KEY}'}
IPINFO_TOKEN = "9b48ddcd3c58b2"

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('main.html')


@app.route('/search_yelp')
def search_yelp():
    data = request.args
    form_keyword = data.get('form_keyword')
    # if the form data was removed and nothing was entered, let it be 10 miles or 16093 meters
    if data.get('form_distance') == '':
        form_distance = 16093
    else:
        form_distance = int(float(data.get('form_distance')) * 1609.344) #miles to meters
    form_category = data.get('form_category')
    form_location = data.get('form_location')

    # make a list of the comma separated form location
    form_location = form_location.split(',')
    # if the form_location[0] = '0', then send this form_location[1] to google api to get lat lng.
    # Else the second token is the ip address. then we can use the ipinfo api to get the lat lng.
    if form_location[0] == '0':
        # get lat and lng using google api
        location_data = requests.get(f"https://maps.googleapis.com/maps/api/geocode/json?address={form_location[1]}&key={GOOGLE_API_KEY}")
        location_data = location_data.json()

        # if location was invalid
        if location_data['status'] != 'OK':
            return jsonify({'no_result':1})

        lat = location_data['results'][0]['geometry']['location']['lat']
        lng = location_data['results'][0]['geometry']['location']['lng']
    
    else:
        # get lat lng from the api itself
        handler = ipinfo.getHandler(IPINFO_TOKEN)
        location_data = handler.getDetails(form_location[1])
        location_data = location_data.details

        lat = location_data['loc'].split(',')[0]
        lng = location_data['loc'].split(',')[1]

    # get yelp data for the table
    yelp_data_table = requests.get(f'https://api.yelp.com/v3/businesses/search?term={form_keyword}&latitude={lat}&longitude={lng}&categories={form_category}&radius={form_distance}', headers=headers)
    yelp_data_table = yelp_data_table.json()
    
    # if yelp returned no data
    if yelp_data_table['total'] < 1:
        return jsonify({'no_result':1})

    image_url = yelp_data_table['businesses'][0]['image_url'] # Image
    name = yelp_data_table['businesses'][0]['name'] # Business Name
    rating = yelp_data_table['businesses'][0]['rating'] # Rating
    distance = round(yelp_data_table['businesses'][0]['distance']/1609.344, 2) # Distance (miles)

    # put all required data from yelp api into a dict
    table_data = {"data":[]}
    for i in range(len(yelp_data_table['businesses'])):
        id = yelp_data_table['businesses'][i]['id']
        name = yelp_data_table['businesses'][i]['name']
        image_url = yelp_data_table['businesses'][i]['image_url']
        rating = yelp_data_table['businesses'][i]['rating'] 
        distance = round(yelp_data_table['businesses'][i]['distance']/1609.344, 2)

        table_data["data"].append({"id":id, "name":name,"image_url":image_url, "rating":rating, "distance":distance})
    
    # print(table_data)

    return jsonify(table_data)


@app.route('/get_business_details')
def get_business_details():
    data = request.args
    id = data.get('id')

    # get data from API
    response = requests.get(f"https://api.yelp.com/v3/businesses/{id}", headers=headers)
    data = response.json()

    status, category, address, phone_number, transactions_supported, price, more_info, photo1, photo2, photo3 = None,None,None,None,None,None,None,None,None,None
    
    name = data['name']

    if 'hours' in data:
        if len(data['hours']) > 0:
            if 'is_open_now' in data['hours'][0]:
                status = data['hours'][0]['is_open_now']

    if 'categories' in data:
        category = ""
        for i in range(len(data['categories'])):
            category = category + data['categories'][i]['title'] + ' | '
        category = category[:-3]
    if category == "":
        category = None

    if 'location' in data:
        if 'display_address' in data['location']:
            address = ""
            for s in data['location']['display_address']:
                address = address + s + ' '
            address = address[:-1]
    if address == "":
        address = None

    if 'display_phone' in data:
        phone_number = data['display_phone']

    if 'transactions' in data:
        transactions_supported = ""
        for s in data['transactions']:
            transactions_supported = transactions_supported + s.title() + ' | '
        transactions_supported = transactions_supported[:-3]
    if transactions_supported == "":
        transactions_supported = None

    if 'price' in data:
        price = data['price']

    if 'url' in data:
        more_info = data['url']

    if 'photos' in data:
        num_photos = len(data['photos'])
        if num_photos == 1:
            photo1 = data['photos'][0]
        elif num_photos == 2:
            photo1, photo2 = data['photos'][0], data['photos'][1]
        elif num_photos > 2:
            photo1, photo2, photo3 = data['photos'][0], data['photos'][1], data['photos'][2]
    
    
    business_details = {"name":name, "status":status, "category":category, "address":address, "phone_number":phone_number, "transactions_supported":transactions_supported, "price":price, "more_info":more_info, "photo1":photo1, "photo2":photo2, "photo3":photo3}

    # print(business_details)

    return jsonify(business_details)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
