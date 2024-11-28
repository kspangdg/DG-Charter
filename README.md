# Charter 1.0.2

Charter is a lightweight filtering plugin that works with Ajax Load More to filter posts by taxonomy terms.

## Installation

1. Include the `charter.min.js` file in your theme.
2. Include the `charter.min.css` file in your theme.

## Usage

- Add `data-charter="filter_name"` attribute with a unique filter name to the Input container. Please note you can have mutliple filters with the same name. If for example you need a separate filter for mobile, or you want to break up the filter into multiple sections, you can use the same name. They will all sync together. Changes to one filter will be reflected in all filters with the same name.
- Add `data-input="{type}"` attribute to all inputs you want to use for filtering (text, checkbox, radio). If multiple text inputs are used, the last one modified will be used for filtering.
- Add `data-tax="taxonomy_name"` attribute to all inputs
- Add `data-term="term_slug"` attribute to all inputs

### Example

```php
<!-- Input container -->
<fieldset data-charter="filter_name">
    <legend>Filter</legend>

    <!-- search -->
    <input type="text" data-input="text">

    <!-- checkbox -->
    <div data-input="checkbox" data-tax="location" data-term="new-york">New York</div>
    <div data-input="checkbox" data-tax="filter-location" data-term="boston">Boston</div>

    <!-- radio -->
    <div data-input="radio" data-tax="filter-month" data-term="july">July</div>
    <div data-input="radio" data-tax="filter-month" data-term="june">June</div>

</fieldset>

<!-- submit button -->
<button class="filter_name_submit">Submit</button>

<!-- labels -->
<div class="filter_name_labels"></div>

<!-- clear button -->
<button class="filter_name_clear">Clear</button>

<!-- Ajax Load More result text container -->
<div class="alm-results-text">Loading...</div>


<!-- If you are using Ajax Load More, add the following -->
<?php echo do_shortcode('[ajax_load_more id="filter_name" post_type="post"]'); ?>

```
Please note that `type="text"` is used for search input.


- Initialize a new instance of Charter with the following:

### Example

```javascript
const filter_name = new Charter('filter_name', {
    filter_type: 'ALM', // 'ALM' or 'JS' (JS not supported yet)
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
        submit_only: true, // Do not filter on change, only on submit (setting to true is more ADA compliant)
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
- Add support for tom-select dropdowns
- Find cleaner way to set alm_is_animating to false (window.almComplete, window.almEmpty not working inside class)

##### Changelog
- 1.0.2 - Added base styes for inputs, added radio support, made ADA improvements, plus minor bug fixes
- 1.0.1 - Added support for multiple filters with the same name and added submit button support
- 1.0.0 - Initial release

<hr>

Dependencies: [Ajax Load More](https://connekthq.com/plugins/ajax-load-more/)<br>
License: Copyright 2024, Durkan Group. All rights reserved.<br>
Author: Keith Spang, kspang@durkangroup.com<br>

