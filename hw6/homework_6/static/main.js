// function to disable/enable location input based on checkbox
function disable_location_input() {
    var input_checkbox = document.getElementById("input_checkbox");
    var input_location = document.getElementById("input_location");

    if (input_checkbox.checked) {
        input_location.value = "";
        input_location.disabled = true;
    } else {
        input_location.disabled = false;
    }
}

async function search_yelp(initial_form) {
    var form_keyword = initial_form.input_keyword.value;
    var form_distance = initial_form.input_distance.value;
    var form_category = initial_form.select_category.value;
    var form_location = initial_form.input_location.value;

    // form_location can either be a string in english which will be sent to google api to get the lat lng or it will be the ip address which is sent to ipinfo api to get the lat lng if the auto detect checbox is on. This info will be sent to the backend as a comma separated string with the first token with either 0 or 1. If it is 0 then we need to send the next token to google api else if it is 1 then we sent the next token to the ipinfo api.
    // if checkbox is checked, get lat lng using ipinfo
    var input_checkbox = document.getElementById("input_checkbox");
    if (input_checkbox.checked) {
        const t = fetch("https://api.ipify.org/").then((r) => r.text());
        const ip_add = await t;

        form_location = [1, ip_add];
    } else {
        form_location = [0, form_location];
    }

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
    var div_business_details_container = document.getElementById(
        "business_details_container"
    );

    // hide the business_details_container
    div_business_details_container.style.display = "none";

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
    var table = document.getElementById("table");

    // reset the table with just the header every time we build the table
    table.innerHTML =
        "<tr class='table_header'><th width='50px' scope='col'>No.</th><th width='109px' scope='col'>Image</th><th width='543px' onclick='sort_table(2)' class='pointer' scope='col'>Business Name</th><th width='149px' onclick='sort_table(3)' class='pointer' scope='col'>Rating</th><th width='149px' onclick='sort_table(4)' class='pointer' scope='col'>Distance (miles)</th></tr>";

    // build rows based on number of results
    num_results = Object.keys(data["data"]).length;
    for (var i = 0; i < num_results; i++) {
        var id = data["data"][i]["id"];
        var name = data["data"][i]["name"];
        var image_url = data["data"][i]["image_url"];
        var rating = data["data"][i]["rating"];
        var distance = data["data"][i]["distance"];
        var count = i + 1;

        // initialize the element
        var new_element = document.createElement("tr");
        // add data to the element
        new_element.innerHTML =
            "<td></td><td><img class='table_business_img' src='" +
            image_url +
            "'/></td>" +
            "<td><div id='result_id' value='" +
            name +
            "' title='" +
            id +
            "' class='result_id'>" +
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
    // BUILDING THE TABLE AND OUTPUTTING IT HAS ENDED

    // Clicking the name of the results will send the YELP id to the function get_business_details which will send the id back to flask using AJAX
    var click_results = document.querySelectorAll("#result_id");

    for (var i = 0; i < click_results.length; i++) {
        click_results[i].addEventListener("click", function (e) {
            return get_business_details(e.currentTarget.getAttribute("title"));
        });
    }
}

function get_business_details(id) {
    // AJAX
    var request = new XMLHttpRequest();

    // Send data to flask
    api_string = "/get_business_details?id=" + id;
    request.open("GET", api_string);
    request.send();

    // get data from flask as a JSON object
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            this.response = request.responseText;
            build_business_details(this.response);
        }
    };

    return true;
}

function build_business_details(response) {
    // get the api data and store it in vars
    var business_data = JSON.parse(response);

    var name = business_data["name"];
    var status = business_data["status"];
    var category = business_data["category"];
    var address = business_data["address"];
    var phone_number = business_data["phone_number"];
    var transactions_supported = business_data["transactions_supported"];
    var price = business_data["price"];
    var more_info = business_data["more_info"];
    var photo1 = business_data["photo1"];
    var photo2 = business_data["photo2"];
    var photo3 = business_data["photo3"];

    // get the html element to build -> business_details and reset it
    var div_business_details_container = document.getElementById(
        "business_details_container"
    );
    // display to block to show this div (this was done since it was set to none in search_yelp function)
    div_business_details_container.style.display = "block";
    div_business_details_container.innerHTML = "";

    // only showing the elements which exists. if any var above is null, then wont add it
    var business_details_title =
        "<p class='p_business_details_title'>" +
        name +
        "</p><hr class='hr_business_details_title_seperator_line' />";

    if (status == null) {
        var div_business_details_status =
            "<div class='div_business_details_status'></div>";
    } else {
        if (status == true) {
            var div_business_details_status =
                "<div class='div_business_details_status'><p class='p_business_details_status'>Status</p><div class='open_now_closed_box_OPEN'><p>Open Now</p></div></div>";
        } else {
            var div_business_details_status =
                "<div class='div_business_details_status'><p class='p_business_details_status'></p><div class='open_now_closed_box_CLOSED'><p>Closed</p></div></div>";
        }
    }

    if (category == null) {
        var div_business_details_category =
            "<div class='div_business_details_category'></div>";
    } else {
        var div_business_details_category =
            "<div class='div_business_details_category'><p class='p_business_details_category'>Category</p><p class='p_business_details_category_sub'>" +
            category +
            "</p></div>";
    }

    if (address == null) {
        var div_business_details_address =
            "<div class='div_business_details_address'></div>";
    } else {
        var div_business_details_address =
            "<div class='div_business_details_address'><p class='p_business_details_address'>Address</p><p class='p_business_details_address_sub'>" +
            address +
            "</p></div>";
    }

    if (phone_number == null) {
        var div_business_details_phone_number =
            "<div class='div_business_details_phone_number'></div>";
    } else {
        var div_business_details_phone_number =
            "<div class='div_business_details_phone_number'><p class='p_business_details_phone_number'>Phone Number</p><p class='p_business_details_phone_number_sub'>" +
            phone_number +
            "</p></div>";
    }

    if (transactions_supported == null) {
        var div_business_details_transactions_supported =
            "<div class='div_business_details_transactions_supported'></div>";
    } else {
        var div_business_details_transactions_supported =
            "<div class='div_business_details_transactions_supported'><p class='p_business_details_transactions_supported'>Transactions Supported</p><p class='p_business_details_transactions_supported_sub'>" +
            transactions_supported +
            "</p></div>";
    }

    if (price == null) {
        var div_business_details_price =
            "<div class='div_business_details_price'></div>";
    } else {
        var div_business_details_price =
            "<div class='div_business_details_price'><p class='p_business_details_price'>Price</p><p class='p_business_details_price_sub'>" +
            price +
            "</p></div>";
    }

    if (more_info == null) {
        var div_business_details_more_info =
            "<div class='div_business_details_more_info'></div>";
    } else {
        var div_business_details_more_info =
            "                <div class='div_business_details_more_info'><p class='p_business_details_more_info'>More info</p><a class='a_business_details_more_info_sub' href='" +
            more_info +
            "' target='_blank'>Yelp</a></div>";
    }

    if (photo1 == null) {
        var div_photo_1 = "<div class='div_photo_1'></div>";
    } else {
        var div_photo_1 =
            "<div class='div_photo_1'><img src='" +
            photo1 +
            "'/><p>Photo 1</p></div>";
    }

    if (photo2 == null) {
        var div_photo_2 = "<div class='div_photo_2'></div>";
    } else {
        var div_photo_2 =
            "<div class='div_photo_2'><img src='" +
            photo2 +
            "'/><p>Photo 2</p></div>";
    }

    if (photo3 == null) {
        var div_photo_3 = "<div class='div_photo_3'></div>";
    } else {
        var div_photo_3 =
            "<div class='div_photo_3'><img src='" +
            photo3 +
            "'/><p>Photo 3</p></div>";
    }

    // build it
    var new_element = document.createElement("div");
    new_element.setAttribute("class", "business_details");
    new_element.innerHTML =
        business_details_title +
        div_business_details_status +
        div_business_details_category +
        div_business_details_address +
        div_business_details_phone_number +
        div_business_details_transactions_supported +
        div_business_details_price +
        div_business_details_more_info +
        div_photo_1 +
        div_photo_2 +
        div_photo_3;

    div_business_details_container.append(new_element);
}

// to sort the table according to headers. Inspirationg from w3schools https://www.w3schools.com/howto/howto_js_sort_table.asp
function sort_table(n) {
    var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
    table = document.getElementById("table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the first, which contains table headers): */
        for (i = 1; i < rows.length - 1; i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare, one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place, based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// CLEAR BUTTON functionality
function implement_clear() {
    // reset the form
    document.getElementById("form").reset();
    // set display to none for no records found, table and business details card
    document.getElementById("no_result").style.display = "none";
    document.getElementById("div_table").style.display = "none";
    document.getElementById("business_details_container").style.display =
        "none";

    // call disable location input func which will check the status of the checkbox and since it is unchecked, set the input location as enabled
    disable_location_input();
}
