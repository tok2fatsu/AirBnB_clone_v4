$('document').ready(() => {
    amenity_filters = {};
    state_filters = {};
    city_filters = {};

    places = $('.places');
    $('.amenities :checkbox').change(function () {
        amenity_id = this.getAttribute('data-id');
        amenity_name = this.getAttribute('data-name');
        if (this.checked) {
            amenity_filters[amenity_id] = amenity_name;
        } else {
            delete amenity_filters[amenity_id];
        }
        text = Object.values(amenity_filters).join(', ');
        $('.amenities h4').text(text);
    });

    $("input[data-type='state']").click(function () {
        s_id = this.getAttribute('data-id');
        s_name = this.getAttribute('data-name');
        if (this.checked) {
            state_filters[s_id] = s_name;
        } else {
            delete state_filters[s_id];
        }
        updateLocationFilterText(state_filters, city_filters);
    });

    $("input[data-type='city']").click(function () {
        c_id = this.getAttribute('data-id');
        c_name = this.getAttribute('data-name');
        if (this.checked) {
            city_filters[c_id] = c_name;
        } else {
            delete city_filters[c_id];
        }
        updateLocationFilterText(state_filters, city_filters);
    });

    $.get('http://0.0.0.0:5001/api/v1/status/', (data, status) => {
        if (data['status'] === 'OK') $('#api_status').addClass('available');
        else $('#api_status').removeClass('available');
    });

    fetchPlaces(places, [], [], []);

    $('button').click(() => {
        fetchPlaces(
            places,
            Object.keys(state_filters),
            Object.keys(city_filters),
            Object.keys(amenity_filters)
        );
    });
});

function fetchPlaces(places, states, cities, amenities) {
    places.empty();
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        data: JSON.stringify({
            states: states,
            cities: cities,
            amenities: amenities,
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: (data) => {
            data.map((place) => {
                places.append(`
                    <article>   
                        <div class="place_header">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">
                                $${place['price_by_night']}
                            </div>
                        </div>
                        <div class="information">
                            <div class="max_guest">
                                ${place['max_guest']} Guests
                            </div>
                            <div class="number_rooms">
                                ${place['number_rooms']} Bedroom
                            </div>
                            <div class="number_bathrooms">
                                ${place['number_bathrooms']} Bathroom
                            </div>
                        </div>
                        <div id="owner_${place['id']}" class="user">  
                        </div>
                        <div class="description">${place['description']}</div>
                    </article>
                `);
                $.get(
                    `http://0.0.0.0:5001/api/v1/users/${place['user_id']}`,
                    (user) => {
                        $(`#owner_${place['id']}`).append(`
                            <strong>Owner</strong>: ${user['first_name']}
                            ${user['last_name']}
                        `);
                    }
                );
            });
        },
    });
}

function updateLocationFilterText(state_filters, city_filters) {
    locations = Object.values(state_filters).concat(
        Object.values(city_filters)
    );
    text = Object.values(locations).join(', ');
    $('.locations h4').text(text);
}
