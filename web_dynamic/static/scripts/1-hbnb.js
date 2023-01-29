$('document').ready(() => {
    amenity_filters = {};
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
});
