# Charter 1.0.1

Charter is a lightweight filtering plugin that works with Ajax Load More to filter posts by taxonomy terms.

## Installation

1. Upload the `charter` folder to the `/assets/js/vendor/` directory.
2. Include the `//@prepros-prepend vendor/charter/charter.min.js` in `app.js`.

## Usage

- Add `data-charter="filter_name"` attribute with a unique filter name to the filter container. Please note you can mutliple filters with the same name. If for example you need a separate filter for mobile, or you want to break up the filter into multiple sections, you can use the same name. They will all sync together. Changes to one filter will be reflected in all filters with the same name.
- Add `data-input` attribute to all inputs you want to use for filtering.
- Add `data-tax="taxonomy_name"` attribute to all inputs you want to use for filtering by taxonomy. Please note at the term slug will be taken from the value attribute, and the term name will be taken from the label text. They must be present, and the id, name, and for attributes must match.

### Example

```php
<!-- filter container -->
<div data-charter="filter_name">
    <!-- labels -->
    <div class="filter_name_labels"></div>

    <!-- search -->
    <input type="text" data-input placeholder="Search">

    <!-- checkbox -->
    <input type="checkbox" id="name" name="name" data-input data-tax="location" value="new-york">
    <label for="name"> New York</label><br>

    <!-- radio -->
    <input type="radio" id="name2" name="name2" data-input data-tax="month" value="july">
    <label for="name2">July</label><br>

    <!-- select -->
    <select data-input data-tax="filter-location">
        <option value="chicago">Chicago</option>
        <option value="new-york">New York</option>
        <option value="boston">Boston</option>
    </select>

    <!-- clear button -->
    <button class="filter_name_clear">Clear</button>

    <!-- submit button -->
    <button class="filter_name_submit">Submit</button>
</div>

<!-- If you are using Ajax Load More, add the following -->
<?php echo do_shortcode('[ajax_load_more id="filter_name" post_type="post"]'); ?>

```
Please note that `type="text"` is used for search input. Also the plugin supports inputs anywhere in the page, and duplicates are allowed.


- Initialize a new instance of Charter with the following:

### Example

```javascript
const filter_name = new Charter('filter_name', {
    filter_type: 'ALM', // 'ALM' or 'JS'
    clear_button: {
        class: '.filter_name_clear', // Class name of the clear button
    },
    label_container: {
        class: '.filter_name_labels', // Class name of the label container
        clickable: true, // If true, clicking the label will remove the term
        taxonomies: true, // Labels will display when taxonomy is filtered
        keyword: false, // Labels will display when keyword is searched
        order: false, // Labels will display when order is set
    },
    submit_button: {
        class: '.filter_name_submit', // Class name of the submit button
        submit_only: true, // Do not filter on change, only on submit
    },
    callback: function () {
        // Add your custom callback here
    }
});

window.almComplete = function (alm) {
    filter_name.alm_is_animating = false;
};
window.almEmpty = function (alm) {
    filter_name.alm_is_animating = false;
}
```


##### Known Issues / Future Improvements
- Order seletor support not added yet (ASC, DESC. etc)
- Add filter_type: 'JS' to use with JS filtering only (not ALM)
- Add support for select2
- Find cleaner way to set alm_is_animating to false (window.almComplete, window.almEmpty not working inside class)

##### Changelog
- 1.0.1 - Added support for multiple filters with the same name and added submit button support
- 1.0.0 - Initial release

<hr>

Dependencies: [Ajax Load More](https://connekthq.com/plugins/ajax-load-more/)<br>
License: Copyright 2024, Durkan Group. All rights reserved.<br>
Author: Keith Spang, kspang@durkangroup.com<br>

