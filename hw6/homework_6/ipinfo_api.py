import requests
import ipinfo

API_TOKEN = "9b48ddcd3c58b2"


# test data, get current ip
response = requests.get('https://api64.ipify.org?format=json').json()
ip_address = response['ip']

# get data
handler = ipinfo.getHandler(API_TOKEN)
data = handler.getDetails(ip_address)
data = data.details

lat = data['loc'].split(',')[0]
lng = data['loc'].split(',')[1]

print(lat)
print(lng)

