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
    div_no_result.style.display = "none";

    var response = JSON.parse(data);

    // if no data, show no records found
    if ("no_result" in response) {
        div_no_result.style.display = "block";
    } else {
        // TEMPORARY
        div_no_result.style.display = "none";
    }
}
