i$('document').ready(() => {
    amenity_filters = {};
    places = $('.places');
    $('.popover :checkbox').change(function () {
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

    $.get('http://0.0.0.0:5001/api/v1/status/', (data, status) => {
        if (data['status'] === 'OK') $('#api_status').addClass('available');
        else $('#api_status').removeClass('available');
    });

    fetch_places(places, [], [], []);

    $('button').click(() => {
        fetch_places(places, [], [], Object.keys(amenity_filters));
    });
});

function fetch_places(places, states, cities, amenities) {
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
