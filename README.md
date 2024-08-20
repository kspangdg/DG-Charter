# Charter 1.0.0

Charter is a lightweight filtering plugin that works with Ajax Load More to filter posts by taxonomy terms.

## Installation

1. Upload the `charter` folder to the `/assets/js/vendor/` directory.
2. Include the `//@prepros-prepend vendor/charter/charter.min.js` in `app.js`.

## Usage

- Add `data-charter="filter_name"` attribute with a unique filter name to the inputs you want to use to filter posts. Excepted input types are `checkbox`, `radio`, `select`, and `text`.
- Add `data-taxonomy="taxonomy_name"` attribute with the taxonomy name you want to filter by.
- Add `value="term_name"` attribute with the term name you want to filter by.
- If you want to use a clear button, add a button with the class of your choice.
- If you want to use labels to display the selected terms, add a div with the class of your choice.

### Example

```php
<!-- Labels -->
<div class="filter_name_labels"></div>

<!-- search -->
<input type="text" data-charter="filter_name" placeholder="Search">

<!-- checkbox -->
<input type="checkbox" id="name" name="name" data-charter="filter_name" data-taxonomy="location" value="new-york">
<label for="name"> New York</label><br>

<!-- radio -->
<input type="radio" id="name2" name="name2" data-charter="filter_name" data-taxonomy="month" value="july">
<label for="name2">July</label><br>

<!-- select -->
<select data-charter="filter_name" data-taxonomy="filter-location">
    <option value="chicago">Chicago</option>
    <option value="new-york">New York</option>
    <option value="boston">Boston</option>
</select>

<!-- clear button -->
<button class="filter_name_clear">Clear</button>

<!-- If you are using Ajax Load More, add the following -->
<?php echo do_shortcode('[ajax_load_more id="filter_name" post_type="post"]'); ?>

```
Please note that `type="text"` is used for search input. Also the plugin supports inputs anywhere in the page, and duplicates are allowed.


- Initialize a new instance of Charter with the following:

### Example

```javascript
const filter_name = new Charter('filter_name', {
    filter_type: 'ALM',
});

window.almComplete = function (alm) {
    filter_name.alm_is_animating = false;
};
window.almEmpty = function (alm) {
    filter_name.alm_is_animating = false;
}
```

- You only need `filter_type` to get started, but there are additional options you can use to customize the plugin. See below.

## Options

```javascript
    options = {
      filter_type: '', // String - 'ALM' or 'JS'
      clear_button: {
        class: '', // String - Class name of the clear button
      },
      label_container: {
        class: '', // String - Class name of the label container
        clickable: false, // Boolean - If true, clicking the label will remove the term
        taxonomies: true, // Boolean - Labels will display when taxonomy is filtered
        keyword: false, // Boolean - Labels will display when keyword is searched
        order: false, // Boolean - Labels will display when order is set
      },
      submit_button: {
        class: '', // String - Class name of the submit button
        submit_only: false, // Boolean - Do not filter on change, only on submit
      },
      callback: null, // Function - Custom callback function after filtering
    };
```


##### Known Issues
- Does not work with select2
- Submit button support not finished
- Order seletor support not started

<hr>

Dependencies: [Ajax Load More](https://connekthq.com/plugins/ajax-load-more/)
License: Copyright 2024, Durkan Group. All rights reserved.
Author: Keith Spang, kspang@durkangroup.com

