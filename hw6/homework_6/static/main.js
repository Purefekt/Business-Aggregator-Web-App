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

        build_table(response);
    }
}

function build_table(data) {
    // get number of returned results
    num_results = Object.keys(data).length;
    for (var i = 0; i < num_results; i++) {}
}
