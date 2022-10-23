// as mentioned by yelp-fusion api package
"use strict";

const { response } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios").default;
const yelp = require("yelp-fusion");

// API KEYS
const YELP_API_KEY =
    "H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx";
const client = yelp.client(`${YELP_API_KEY}`);
const headers = { Authorization: `Bearer ${YELP_API_KEY}` };
const GOOGLE_API_KEY = "AIzaSyCJn6gE_Bu1c1hZ1CF7PDtijhqhKVpx33c";
const IPINFO_TOKEN = "9b48ddcd3c58b2";

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

// http://127.0.0.1:3000/search?form_keyword=pizza&form_distance=10&form_category=all&form_location=0USC
app.get("/search", async (req, res) => {
    console.log("/search running");

    const form_keyword = req.query.form_keyword;
    var form_distance = req.query.form_distance;
    const form_category = req.query.form_category;
    var form_location_with_flag = req.query.form_location;
    var form_location;
    var lat;
    var lng;
    var ip_add;

    // convert miles distance into INT meters and if no distance was entered, set it to 10 miles (16093m)
    if (form_distance == "") {
        form_distance = 16093;
    } else {
        form_distance = parseInt(form_distance * 1609.344);
    }

    // get ip flag from form_location_with_flag. If it is 0, then use google geocoding API to get lat lng. If it is 1 then get the lat lng from ipinfo API
    const flag = form_location_with_flag.substring(0, 1);
    if (flag == "0") {
        // get lat lng from google geocoding api
        form_location = form_location_with_flag.substring(1);
        try {
            var google_data = await axios
                .get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${form_location}&key=${GOOGLE_API_KEY}`
                )
                .then((response) => response.data);
            lat = google_data["results"][0]["geometry"]["location"]["lat"];
            lng = google_data["results"][0]["geometry"]["location"]["lng"];
        } catch (error) {
            res.send(JSON.stringify([]));
            return;
        }
    } else if (flag == "1") {
        // get lat lng from ipinfo api
        ip_add = form_location_with_flag.substring(1);
        try {
            var ipinfo_data = await axios
                .get(`http://ipinfo.io/${ip_add}?token=${IPINFO_TOKEN}`)
                .then((response) => response.data);
            var lat_and_lng = ipinfo_data.loc;
            console.log(lat_and_lng);
            lat = lat_and_lng.split(",")[0];
            lng = lat_and_lng.split(",")[1];
        } catch (error) {
            res.send(JSON.stringify([]));
            return;
        }
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
        data_table_entry.id = yelp_data_table[i]["id"];
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

// http://127.0.0.1:3000/autocomplete?initial_text=del
app.get("/autocomplete", async (req, res) => {
    console.log("/autocomplete running");

    const initial_text = req.query.initial_text;
    var autocomplete_data_formatted = [];
    try {
        var autocomplete_data = await axios
            .get("https://api.yelp.com/v3/autocomplete?text=" + initial_text, {
                headers: {
                    Authorization: `Bearer ${YELP_API_KEY}`,
                },
            })
            .then((response) => response.data);
        // format the data and send to frontend
        if (
            autocomplete_data["terms"].length == 0 &&
            autocomplete_data["categories"].length == 0
        ) {
            autocomplete_data_formatted = [];
        } else {
            if (autocomplete_data["categories"].length > 0) {
                for (
                    let i = 0;
                    i < autocomplete_data["categories"].length;
                    i++
                ) {
                    autocomplete_data_formatted.push({
                        text: autocomplete_data["categories"][i]["title"],
                    });
                }
            }
            if (autocomplete_data["terms"].length > 0) {
                for (let i = 0; i < autocomplete_data["terms"].length; i++) {
                    autocomplete_data_formatted.push(
                        autocomplete_data["terms"][i]
                    );
                }
            }
        }
        res.send(JSON.stringify(autocomplete_data_formatted));
    } catch (error) {
        res.send(JSON.stringify([]));
        return;
    }
});

// http://127.0.0.1:3000/get_business_details?id=T1RfgUMYKW3HD55SEJILbQ
app.get("/get_business_details", async (req, res) => {
    console.log("/get_business_details");

    const id = req.query.id;
    var categories = null;
    var lat = null;
    var lng = null;
    var phone = null;
    var status = null;
    var location = null;
    var name = null;
    var photo1 = null;
    var photo2 = null;
    var photo3 = null;
    var price = null;
    var url = null;

    // RUN YELP API
    try {
        var business_details = await axios
            .get(`https://api.yelp.com/v3/businesses/${id}`, {
                headers: headers,
            })
            .then((response) => response.data);

        // error check for all fields
        if ("categories" in business_details) {
            categories = "";
            for (let i = 0; i < business_details["categories"].length; i++) {
                categories =
                    categories +
                    business_details["categories"][i]["title"] +
                    " | ";
            }
            categories = categories.substring(0, categories.length - 3);
        }
        if (categories == "") categories = null;

        if ("coordinates" in business_details) {
            if ("latitude" in business_details["coordinates"]) {
                lat = business_details["coordinates"]["latitude"];
                if (lat == "") lat = null;
            }
            if ("longitude" in business_details["coordinates"]) {
                lng = business_details["coordinates"]["longitude"];
                if (lng == "") lng = null;
            }
        }

        if ("display_phone" in business_details) {
            phone = business_details["display_phone"];
            if (phone == "") phone = null;
        }

        if ("hours" in business_details) {
            if (business_details["hours"].length > 0) {
                if ("is_open_now" in business_details["hours"][0]) {
                    status = business_details["hours"][0]["is_open_now"];
                }
            }
        }

        if ("location" in business_details) {
            if ("display_address" in business_details["location"]) {
                location = "";
                for (
                    let i = 0;
                    i < business_details["location"]["display_address"].length;
                    i++
                ) {
                    location =
                        location +
                        business_details["location"]["display_address"][i] +
                        " ";
                }
                location = location.substring(0, location.length - 1);
                if (location == "") location = null;
            }
        }

        name = business_details["name"];

        if ("photos" in business_details) {
            const num_photos = business_details["photos"].length;
            if (num_photos == 1) photo1 = business_details["photos"][0];
            else if (num_photos == 2) {
                photo1 = business_details["photos"][0];
                photo2 = business_details["photos"][1];
            } else if (num_photos == 3) {
                photo1 = business_details["photos"][0];
                photo2 = business_details["photos"][1];
                photo3 = business_details["photos"][2];
            }
        }

        if ("price" in business_details) price = business_details["price"];

        if ("url" in business_details) url = business_details["url"];

        console.log(categories);
        console.log(lat);
        console.log(lng);
        console.log(phone);
        console.log(status);
        console.log(location);
        console.log(name);
        console.log(photo1);
        console.log(photo2);
        console.log(photo3);
        console.log(price);
        console.log(url);

        // add data to the final object
        var business_details_formatted = {};
        business_details_formatted.categories = categories;
        business_details_formatted.lat = lat;
        business_details_formatted.lng = lng;
        business_details_formatted.phone = phone;
        business_details_formatted.status = status;
        business_details_formatted.location = location;
        business_details_formatted.name = name;
        business_details_formatted.photo1 = photo1;
        business_details_formatted.photo2 = photo2;
        business_details_formatted.photo3 = photo3;
        business_details_formatted.price = price;
        business_details_formatted.url = url;

        res.send(JSON.stringify(business_details_formatted));
    } catch (error) {
        res.send(JSON.stringify([]));
        return;
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
