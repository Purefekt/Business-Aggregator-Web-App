// as mentioned by yelp-fusion api package
"use strict";

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

// For CORS issue
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/", (req, res) => {
    res.send("Veer's express server");
});

// http://127.0.0.1:3000/search?form_keyword=pizza&form_distance=10&form_category=all&form_location=USC
// http://127.0.0.1:3000/search?form_keyword=Skydiving&form_distance=16093&form_category=hotelstravel&form_location=USC
app.get("/search", async (req, res) => {
    console.log("/search running");

    const form_keyword = req.query.form_keyword;
    var form_distance = req.query.form_distance;
    const form_category = req.query.form_category;
    var form_location_with_flag = req.query.form_location;
    var form_location;
    var lat;
    var lng;

    // convert miles distance into INT meters and if no distance was entered, set it to 10 miles (16093m)
    if (form_distance == "") {
        form_distance = 16093;
    } else {
        form_distance = parseInt(form_distance * 1609.344);
    }

    // get ip flag from form_location_with_flag. If it is 0, then use google geocoding API to get lat lng. If it is 1 then get the lat lng from ipinfo API
    const flag = form_location_with_flag.substring(0, 1);
    if (flag == "0") {
        form_location = form_location_with_flag.substring(1);

        // RUN GOOGLE GEOCODING API
        var google_data = await axios
            .get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${form_location}&key=${GOOGLE_API_KEY}`
            )
            .then((response) => response.data);
        // handle error when geocoding API returns no results. Return empty json
        if (google_data.status == "ZERO_RESULTS") {
            res.send(JSON.stringify([]));
            return;
        }
        var lat = google_data["results"][0]["geometry"]["location"]["lat"];
        var lng = google_data["results"][0]["geometry"]["location"]["lng"];
    } else if (flag == "1") {
    }

    console.log(`Keyword => ${form_keyword}`);
    console.log(`Distance in meters =>${form_distance}`);
    console.log(`Category => ${form_category}`);
    console.log(`Location with Flag => ${form_location_with_flag}`);
    console.log(`Latitude => ${lat}`);
    console.log(`Longitude => ${lng}`);

    // RUN YELP FUSION API
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

    // Send final JSON as output
    res.send(JSON.stringify(data_table));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
