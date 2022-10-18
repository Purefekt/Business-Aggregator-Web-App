// as mentioned by yelp-fusion api package
"use strict";

const { response } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios").default;
const yelp = require("yelp-fusion");

// Yelp API
const YELP_API_KEY =
    "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx";
const client = yelp.client(`${YELP_API_KEY}`);
// Google geocoding API
const GOOGLE_API_KEY = "AIzaSyCJn6gE_Bu1c1hZ1CF7PDtijhqhKVpx33c";

app.get("/", (req, res) => {
    res.send("Veer's express server");
});

// http://127.0.0.1:3000/search?form_keyword=Pizza&form_distance=16093&form_category=food&form_location=USC
// http://127.0.0.1:3000/search?form_keyword=Skydiving&form_distance=16093&form_category=hotelstravel&form_location=USC
app.get("/search", async (req, res) => {
    console.log("/search running");

    const form_keyword = req.query.form_keyword;
    const form_distance = req.query.form_distance;
    const form_category = req.query.form_category;
    const form_location = req.query.form_location;
    console.log(form_keyword);
    console.log(form_distance);
    console.log(form_category);
    console.log(form_location);

    // get lat and lng from google geocoding API
    var google_data = await axios
        .get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${form_location}&key=${GOOGLE_API_KEY}`
        )
        .then((response) => response.data);
    const lat = google_data["results"][0]["geometry"]["location"]["lat"];
    const lng = google_data["results"][0]["geometry"]["location"]["lng"];
    console.log(lat, lng);

    // get data from yelp API
    var yelp_data_table = await client
        .search({
            term: form_keyword,
            radius: form_distance,
            categories: form_category,
            latitude: lat,
            longitude: lng,
        })
        .then((response) => {
            return response.jsonBody.businesses;
        })
        .catch((e) => {
            console.log(e);
            res.send("Error");
        });

    // need upto 10 results
    const max_results = Math.min(10, Object.keys(yelp_data_table).length);

    // create the JSON object
    const data_table = [];
    for (let i = 0; i < max_results; i++) {
        var data_table_entry = new Object();
        data_table_entry.index = i + 1;
        data_table_entry.image_url = yelp_data_table[i]["image_url"];
        data_table_entry.name = yelp_data_table[i]["name"];
        data_table_entry.rating = yelp_data_table[i]["rating"];
        data_table_entry.distance = Math.round(
            yelp_data_table[i]["distance"] / 1609.344
        );

        data_table.push(data_table_entry);
    }

    // This will send the final json data to the server response
    res.send(JSON.stringify(data_table));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
