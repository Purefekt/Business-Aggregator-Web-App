from flask import Flask, request, jsonify
import requests
import collections

app = Flask(__name__)

GOOGLE_API_KEY = "AIzaSyCJn6gE_Bu1c1hZ1CF7PDtijhqhKVpx33c"
YELP_API_KEY = "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx"
headers = {'Authorization' : f'Bearer {YELP_API_KEY}'}

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('main.html')


@app.route('/search_yelp')
def search_yelp():
    data = request.args
    form_keyword = data.get('form_keyword')
    form_distance = int(float(data.get('form_distance')) * 1609.344) #miles to meters
    form_category = data.get('form_category')
    form_location = data.get('form_location')

    # get lat and lng using google api
    location_data = requests.get(f"https://maps.googleapis.com/maps/api/geocode/json?address={form_location}&key={GOOGLE_API_KEY}")
    location_data = location_data.json()

    # if location was invalid
    if location_data['status'] != 'OK':
        return jsonify({'no_result':1})

    lat = location_data['results'][0]['geometry']['location']['lat']
    lng = location_data['results'][0]['geometry']['location']['lng']

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
    
    print(table_data)

    return jsonify(table_data)
    
"""Func to format the location input"""
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

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
