function search_yelp(initial_form) {
    var form_keyword = initial_form.input_keyword.value;
    var form_distance = initial_form.input_distance.value;
    var form_category = initial_form.select_category.value;
    var form_location = initial_form.input_location.value;

    // console.log(form_keyword);
    // console.log(form_distance);
    // console.log(form_category);
    // console.log(form_location);

    // AJAX
    var request = new XMLHttpRequest();

    // Send data to flask
    api_string =
        "/search_yelp?form_keyword=" +
        form_keyword +
        "&form_distance=" +
        form_distance +
        "&form_category=" +
        form_category +
        "&form_location=" +
        form_location;
    request.open("GET", api_string);
    request.send();

    // get data from flask as a JSON object
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            response = request.responseText;
            search_box_input(response);
        }
    };

    return true;
}

function search_box_input(data) {
    var div_no_result = document.getElementById("no_result");
    var div_table = document.getElementById("div_table");

    var response = JSON.parse(data);

    // if no data, show no records found message and hide the table
    if ("no_result" in response) {
        div_no_result.style.display = "block";
        div_table.style.display = "none";
    } else {
        // else hide no records found message and show and build the table
        div_no_result.style.display = "none";
        div_table.style.display = "block";
        // console.log(response);
        build_table(response);
    }
}

function build_table(data) {
    var table = document.getElementById("table");

    // build rows based on number of results
    num_results = Object.keys(data["data"]).length;
    // console.log(num_results);
    for (var i = 0; i < num_results; i++) {
        var id = data["data"][i]["id"];
        var name = data["data"][i]["name"];
        var image_url = data["data"][i]["image_url"];
        var rating = data["data"][i]["rating"];
        var distance = data["data"][i]["distance"];
        var count = i + 1;

        console.log(image_url);

        // initialize the element
        var new_element = document.createElement("tr");
        // add data to the element
        new_element.innerHTML =
            "<td>" +
            count +
            "</td>" +
            "<td><img class='table_business_img' src='" +
            image_url +
            "'/></td>" +
            "<td><div id='result_id' value='" +
            id +
            "'>" +
            name +
            "</div></td>" +
            "<td>" +
            rating +
            "</td>" +
            "<td>" +
            distance +
            "</td>";
        // add this data as the next child of the parent element, which is the table here
        table.appendChild(new_element);
    }
}
