/*
 * Charter 1.0.1
 * A lightweight filtering plugin.
 *
 * @dependency: Ajax Load More - https://connekthq.com/plugins/ajax-load-more/
 * @license Copyright 2024, Durkan Group. All rights reserved.
 * @author: Keith Spang, kspang@durkangroup.com
*/

class Charter {
  constructor(_slug, args) {
    this.slug = _slug;
    this.active_filters = {
      taxonomies: [],
      keyword: '',
      order: 'ASC',
    }
    let defaults = {
      filter_type: '',
      inputs: [],
      clear_button: {
        class: '',
      },
      label_container: {
        class: '',
        clickable: false,
        taxonomies: true,
        keyword: false,
        order: false,
      },
      submit_button: {
        class: '',
        submit_only: false,
      },
      callback: null,
    };
    this.settings = Object.assign({}, defaults, args);
    this.filter_active = false;
    this.alm_is_animating = false;
    this.charter_init();
  }

  /*
  * Ajax Load More
  * Send data to Ajax Load More to filter posts.
  * 
  * @since 1.0.0
  * @param object args {taxonomies: string, terms: string, operator: string, keyword: string, order: string}
  * @return void
  */
  charter_ajaxloadmore(args) {
    if (this.alm_is_animating) return false; // Exit if filtering is still active 
    this.alm_is_animating = true;
    let data = {};


    data['taxonomy'] = args.taxonomies;
    data['taxonomy-terms'] = args.terms;
    data['taxonomy-operator'] = args.operator;
    data['s'] = args.keyword;
    data['posts_per_page'] = '20';
    data['order'] = args.order_by;
    data['orderby'] = 'title';
    ajaxloadmore.filter('fade', '300', data); // Send data to Ajax Load More
	};

  /*
  * Clear Active Filters Taxonomies
  * Clear all terms a taxonomiea in the active_filters object, keyword and order.
  * 
  * @since 1.0.0
  * @param void
  * @return void
  */

  charter_clear_active_filters() {
    // clear active_filters object
    let taxonomies = this.active_filters.taxonomies;
    for (let i = 0; i < taxonomies.length; i++) {
      taxonomies[i].terms = [];
    }
    this.active_filters.keyword = '';
    this.active_filters.order = 'ASC';

    // hide clear button if set
    if (this.settings.clear_button.class !== '') {
      let clear_button = document.querySelector(this.settings.clear_button.class);
      clear_button.classList.remove('active');
    }
  }
  
  /*
  * Update Active Filters Taxonomies
  * Update the active_filters object with the current taxonomy and term.
  * 
  * @since 1.0.0
  * @param string _taxonomy
  * @param string term_slug
  * @param string term_name
  * @param boolean replace (if true, replace all terms in taxonomy with new term, if false, add or remove term)
  * @return void
  */

  charter_update_active_filters(_taxonomy, term_slug, term_name, replace = false) {
    let taxonomy = this.active_filters.taxonomies.find(x => x.taxonomy === _taxonomy);
    let term_index = taxonomy.terms.findIndex(x => x.term_slug === term_slug);
    let term = {
      term_slug: term_slug,
      term_name: term_name,
    };

    if (replace) {
      taxonomy.terms = [term];
    } else {
      if (term_index === -1) {
        taxonomy.terms.push(term);
      } else {
        taxonomy.terms.splice(term_index, 1);
      }
    }
    
  }

  /*
  * Format Active Filters
  * Format the active_filters object for use in ALM.
  * 
  * @since 1.0.0
  * @param void
  * @return object {taxonomies: string, terms: string, operator: string}
  */

  charter_get_active_filters_formatted() {
    let taxonomies_array = [], terms_array = [], operator_array = [];
    let taxonomies_string = '', terms_string = '', operator_string = '';
    let active_filters_taxonomies = this.active_filters.taxonomies;

    for (let i = 0; i < active_filters_taxonomies.length; i++) {
      let taxonomy = active_filters_taxonomies[i];

      if (taxonomy.terms.length > 0) {
        taxonomies_array.push(taxonomy.taxonomy);
        let term_slugs = taxonomy.terms.map(x => x.term_slug).join(',');
        terms_array.push(term_slugs);
        operator_array.push('IN');
      }

    }

    taxonomies_string = taxonomies_array.join(':');
    terms_string = terms_array.join(':');
    operator_string = operator_array.join(':');

    return {taxonomies: taxonomies_string, terms: terms_string, operator: operator_string};
  }

  /*
  * Update Labels
  * Add or remove labels based on active_filters object.
  * 
  * @since 1.0.0
  * @param HTMLElement container
  * @return void
  */

  charter_update_labels(container) {
    let taxonomies = this.active_filters.taxonomies;
    let keyword = this.active_filters.keyword;
    let order = this.active_filters.order;
    let labels = [];
    // Add labels to container
    if (container !== null) {
      if (taxonomies.length > 0 && this.settings.label_container.taxonomies) {
        // Loop through all taxonomies
        for (let i = 0; i < taxonomies.length; i++) {
          let taxonomy = taxonomies[i];
          let terms = taxonomy.terms;
    
          // Loop through all terms in taxonomy
          for (let j = 0; j < terms.length; j++) {
            let term = terms[j];
            labels.push({slug: term.term_slug, name: term.term_name});
          }
        }
      }

      // Add keyword to labels
      if (keyword !== '' && this.settings.label_container.keyword) {
        labels.push({slug: keyword, name: keyword});
      }

      // Add order to labels
      if (order !== 'ASC' && this.settings.label_container.order) {
        labels.push({slug: order, name: order});
      }
      container.innerHTML = '';
      for (let i = 0; i < labels.length; i++) {
        let label = document.createElement('span');
        label.classList.add('label');
        label.classList.add('charter-label');
        label.setAttribute('data-term', labels[i].slug);
        label.innerHTML = labels[i].name;
        // if clickable is set to true, add a click event to remove label
        if (this.settings.label_container.clickable) {
          label.style.cursor = 'pointer';
          label.setAttribute('tabindex', '0');
          label.addEventListener('click', (e) => {
            let term_slug = e.target.getAttribute('data-term');
            let taxonomy = this.active_filters.taxonomies.find(x => x.terms.findIndex(x => x.term_slug === term_slug) !== -1);
            let term = taxonomy.terms.find(x => x.term_slug === term_slug);
            this.charter_update_active_filters(taxonomy.taxonomy, term.term_slug, term.term_name, false);
            this.charter_filter();
          });
        }
        container.appendChild(label);
      }
    }
  }

  /*
  * Update UI
  * Update Inputs, Clear Button, and Submit Button based on active_filters object.
  * 
  * @since 1.0.1
  * @param void
  * @return void
  */

  charter_update_ui() {
    let inputs = this.settings.inputs;
    let taxonomies = this.active_filters.taxonomies;
    let keyword = this.active_filters.keyword;
    let order = this.active_filters.order;

    // Loop through all inputs
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      let input_type = Object.keys(input)[0];

      if (input_type === 'checkbox' || input_type === 'radio') {
        let taxonomy = input[input_type].taxonomy;
        let term_slug = input[input_type].input.value;
        let label = document.querySelector('label[for="' + input[input_type].input.id + '"]');
        let term_name = label.innerText;
        let term_index = taxonomies.findIndex(x => x.taxonomy === taxonomy);
        let term = taxonomies[term_index].terms.find(x => x.term_slug === term_slug);

        if (term !== undefined) {
          input[input_type].input.classList.add('active');
          input[input_type].input.checked = true;
        } else {
          input[input_type].input.checked = false;
        }
      } else if (input_type === 'text') {
        input[input_type].input.value = keyword;
      } else if (input_type === 'select') {
        let taxonomy = input[input_type].taxonomy;
        let term_slug = input[input_type].input.value;
        let term_index = taxonomies.findIndex(x => x.taxonomy === taxonomy);
        let term = taxonomies[term_index].terms.find(x => x.term_slug === term_slug);

        if (term !== undefined) {
          input[input_type].input.selectedIndex = term_index;
        } else {
          input[input_type].input.selectedIndex = 0;
        }
      }
    }

    // Update clear button
    if (this.settings.clear_button.class !== '') {
      let clear_button = document.querySelector(this.settings.clear_button.class);
      if (this.filter_active) {
        clear_button.classList.add('active');
      } else {
        clear_button.classList.remove('active');
      }
    }

    //label container
    if (this.settings.label_container.class !== '') {
      let label_container = document.querySelector(this.settings.label_container.class);
      this.charter_update_labels(label_container);
    }

    // Update submit button
    if (this.settings.submit_button.class !== '') {
      let submit_button = document.querySelector(this.settings.submit_button.class);
      if (this.filter_active) {
        submit_button.classList.add('active');
      } else {
        submit_button.classList.remove('active');
      }
    }
  }

  /*
  * Filter Items
  * References the active_filters object and filters items. Using ALM or JS.
  * 
  * @since 1.0.0
  * @param void
  * @return void
  */

  charter_filter() {
    if (this.settings.filter_type === 'ALM') {
      let Active_Filters = this.charter_get_active_filters_formatted();
      let args = {
        taxonomies: (Active_Filters.taxonomies !== null) ? Active_Filters.taxonomies : '',
        terms: (Active_Filters.terms !== null) ? Active_Filters.terms : '',
        operator: (Active_Filters.operator !== null) ? Active_Filters.operator : '',
        keyword: this.active_filters.keyword,
        order: this.active_filters.order,
      };
      this.charter_ajaxloadmore(args);

      if (args.taxonomies !== '' || args.keyword !== '' || args.order !== 'ASC') {
        this.filter_active = true;
      } else if (args.taxonomies === '' && args.keyword === '' && args.order === 'ASC') {
        this.filter_active = false;
      }

      this.charter_update_ui();

      // if callback is set, run callback
      if (this.settings.callback !== null) {
        this.settings.callback();
      }
    } else if (this.settings.filter_type === 'JS') {
      // TODO: Add JS filtering
    } else {
      console.error('DG Charter Error: No valid filter_type found. Please use ALM or JS.');
    }
  }

  /*
  * Set Inputs
  * Find all inputs with data-charter attribute and set them as inputs in the settings object.
  *
  * @since 1.0.1
  * @param void
  * @return boolean (true if inputs are found, false if no inputs are found)
  */

  charter_inputs() {
    let _return = true;
    let inputs = this.settings.inputs;
    const filter_containers = document.querySelectorAll('[data-charter="' + this.slug + '"]');

    // Check if filter containers are found
    if (filter_containers === null || filter_containers.length === 0) {
      console.error('DG Charter Error: No filter containers found with data-charter attribute.');
      return false;
    }

    // Loop through all filter containers
    for (let i = 0; i < filter_containers.length; i++) {
      let data_inputs = filter_containers[i].querySelectorAll('[data-input]');

      // Check if inputs are found
      if (data_inputs !== null && data_inputs.length > 0) {

        // Loop through all inputs with data-charter attribute
        for (let i = 0; i < data_inputs.length; i++) {
          let input = data_inputs[i]

          // Check if input is input or select
          if (input.tagName === 'INPUT') {
            let input_type = input.getAttribute('type');
            let value = input.value;
            let key = input_type;

            // Check if input type is checkbox or radio or text
            if (input_type === 'checkbox' || input_type === 'radio') {
              let taxonomy = input.getAttribute('data-tax');

              // Check if data-taxonomy attribute exists
              if (taxonomy === null) {
                console.error('DG Charter Error: No data-tax attribute found on ' + input_type + ' input.');
                _return = false;
              } else {

                // Add class to input
                input.classList.add('charter-input');

                //if taxonomy doesn't exist in active_filters.taxonomies, add it
                if (this.active_filters.taxonomies.findIndex(x => x.taxonomy === taxonomy) === -1) {
                  this.active_filters.taxonomies.push({taxonomy: taxonomy, terms: []});
                }

                // Add input to inputs array
                inputs.push({
                  [key]: {
                    input: input,
                    taxonomy: taxonomy,
                  }
                });

              }
            } else if (input_type === 'text') {

              // Add class to input
              input.classList.add('charter-input');

              // Add input to inputs array
              inputs.push({
                [key]: {
                  input: input,
                  keyword: value,
                }
              });

            }
          } else if (input.tagName === 'SELECT') {
            let value = input.value;
            let key = input.tagName.toLowerCase();
            let taxonomy = input.getAttribute('data-tax');

            // Check if data-taxonomy attribute exists
            if (taxonomy === null) {
              console.error('DG Charter Error: No data-tax attribute found on ' + input.tagName + ' input.');
              _return = false;
            } else {

              // Add class to input
              input.classList.add('charter-input');

              // if taxonomy doesn't exist in active_filters.taxonomies, add it
              if (this.active_filters.taxonomies.findIndex(x => x.taxonomy === taxonomy) === -1) {
                this.active_filters.taxonomies.push({taxonomy: taxonomy, terms: []});
              }

              // Add input to inputs array
              inputs.push({
                [key]: {
                  input: input,
                  taxonomy: taxonomy,
                }
              });

            }
          } else {
            console.error('DG Charter Error: ' + input.tagName + ' is not a valid input type. Please use input, select, checkbox, or radio.');
            _return = false;
          }
        }
      } else {
        console.error('DG Charter Error: No inputs found. Please add [data-input] attribute to your inputs.');
        _return = false;
      }
    }

    // Check if clear button exists
    if (this.settings.clear_button.class !== '') {
      let clear_button = document.querySelector(this.settings.clear_button.class);

      // Check if clear button exists
      if (clear_button === null) {
        console.error('DG Charter Error: No clear button found with class ' + this.settings.clear_button.class + '. Make sure to include a "." before the class name.');
        _return = false;
      } else {
        // Add class to clear button
        clear_button.classList.add('charter-clear-button');
        inputs.push({
          clear_button: {
            input: clear_button,
          }
        });
      }
    }

    //check is submit button exists
    if (this.settings.submit_button.class !== '') {
      let submit_button = document.querySelector(this.settings.submit_button.class);

      // Check if submit button exists
      if (submit_button === null) {
        console.error('DG Charter Error: No submit button found with class ' + this.settings.submit_button.class + '. Make sure to include a "." before the class name.');
        _return = false;
      } else {
        // Add class to submit button
        inputs.push({
          submit_button: {
            input: submit_button,
          }
        });
      }
    }
    
    return _return;
  }

  /*
  * Set Events
  * Set events for all inputs in the settings object.
  *
  * @since 1.0.1
  * @param void
  * @return void
  */

  charter_events() {
    let inputs = this.settings.inputs;
    let submit_only = this.settings.submit_button.submit_only;

      if (inputs !== null && inputs.length > 0) {
        for (let i = 0; i < inputs.length; i++) {
          let input = inputs[i];
          let input_type = Object.keys(input)[0];

          if (input_type === 'checkbox' || input_type === 'radio') {
            input[input_type].input.addEventListener('change', (e) => {
              let taxonomy = input[input_type].taxonomy;
              let term_slug = input[input_type].input.value;
              let label = document.querySelector('label[for="' + input[input_type].input.id + '"]');
              let term_name = label.innerText;
              this.charter_update_active_filters(taxonomy, term_slug, term_name, false);
              if (!submit_only) this.charter_filter();

            });
          } else if (input_type === 'text') {
            input[input_type].input.addEventListener('keyup', (e) => {
              if (e.key === 'Enter') {
                this.active_filters.keyword = input[input_type].input.value;
                if (!submit_only) this.charter_filter();
              }
            });
          } else if (input_type === 'select') {
            input[input_type].input.addEventListener('change', (e) => {
              let taxonomy = input[input_type].taxonomy;
              let term_slug = input[input_type].input.value;
              let term_name = input[input_type].input.options[input[input_type].input.selectedIndex].text;
              this.charter_update_active_filters(taxonomy, term_slug, term_name, true);
              if (!submit_only) this.charter_filter();
            });
          } else if (input_type === 'clear_button') {
            input.clear_button.input.addEventListener('click', (e) => {
              this.charter_clear_active_filters()
              this.charter_filter();
            });
          } else if (input_type === 'submit_button') {
            input.submit_button.input.addEventListener('click', (e) => {
              this.charter_filter();
            });
          }
        }
      }
  }

  /*
  * Initialize Charter
  *
  * @since 1.0.0
  * @param void
  * @return void
  */

  charter_init() {
    if (this.settings.filter_type === '') {
      console.error('DG Charter Error: No filter_type found. Please add filter_type to settings object (ALM or JS).'); 
      return;
    }
    if (!this.charter_inputs()) return; // If no inputs are found, return.
    this.charter_events();
  }
}

