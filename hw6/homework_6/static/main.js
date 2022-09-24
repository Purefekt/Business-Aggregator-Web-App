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

async function getIpClient() {
    try {
        const response = await axios.get("https://ipinfo.io/json");
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

function search_yelp(initial_form) {
    var form_keyword = initial_form.input_keyword.value;
    var form_distance = initial_form.input_distance.value;
    var form_category = initial_form.select_category.value;
    var form_location = initial_form.input_location.value;

    // form_location can either be a string in english which will be sent to google api to get the lat lng or it will be the ip address which is sent to ipinfo api to get the lat lng if the auto detect checbox is on. This info will be sent to the backend as a comma separated string with the first token with either 0 or 1. If it is 0 then we need to send the next token to google api else if it is 1 then we sent the next token to the ipinfo api.

    // if checkbox is checked, get lat lng using ipinfo
    var input_checkbox = document.getElementById("input_checkbox");
    if (input_checkbox.checked) {
        // var ip_add = getIpClient();
        getIpClient();

        // $.getJSON("https://api.ipify.org?format=json", function (data) {
        //     ip_add = data["ip"];
        // });
        // console.log(ip_add);

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
