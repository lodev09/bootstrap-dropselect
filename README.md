## Setup
Setup `dropselect` in 2 steps

### Step 1
Just code your standard bootstrap `dropdown`. http://getbootstrap.com/components/#dropdowns 
```html
<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
    Dropdown
    <span class="caret"></span>
  </button>
  <ul id="dropselect-demo1" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
    <li role="presentation" class="divider"></li>
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>
  </ul>
</div>
```

### Step 2
Now get the `ul` DOM and run `dropselect` 
```javascript
$(function() {
  $('#dropselect-demo1').dropselect();
})
```

## API
### Options
Upon initilizing `dropselect`, you can pass these available options

| Option      | Type     | Default                                                       | Description                                                                |
| ---         | ---      | ---                                                           | ---                                                                        |
| multiselect | boolean  | false                                                         | set to `true` if you want enable multi select menu.                        |
| clear       | mixed    | `{ show: true, label: 'Clear selected' }`                     | option to enable the clear item. Pass a boolean `true` for minimal use.    |
| filter      | mixed    | `{ show: true, placeholder: 'Search', casesensitive: false }` | option to enable the filter textbox. Pass a boolean `true` for minimal use |
| onclear     | callback | _empty callback_                                              | callback function when `clear` event was triggered                         |
| onselect    | callback | _empty callback_                                              | callback function when `select` event was triggered                        |
| onunselect  | callback | _empty callback_                                              | callback function when `unselect` event was triggered                      | 


### Events

| Event    | Params Passed | Description                                |
| ---      | ---           | ---                                        |
| select   | `object` item | triggered after you selected an item       |
| unselect | `object` item | triggered after you unselected an item     |
| clear    | _none_        | triggered after you cleared selected items |

### Properties

| Property      | type   | Description                                                                                  |
| ---           | ---    | ---                                                                                          |
| selectedItem  | string | current selected item                                                                        |
| selectedItems | array  | current selected items (array of pushed item for every selected items in `multiselect` mode) |
| items         | array  | list of items from your markup                                                               |

### Methods

| Method        | Params                                 | Description                           |
| ---           | ---                                    | ---                                   |
| toggle(index) | index - _zero based index of the item_ | toggles the selected state of an item |
| clear         | _none_                                 | clear all selected items              |


#### Sample Call
```javascript
$(function() {
  var mydropselect = $('#my-dropselect').dropselect({
    filter: {
      show: true,
      placeholder: 'Search for an item'
    },
    multiselect: true
  });

  mydropselect.on('select', function(e, item) {
    console.log(item);
    console.log(e.selectedItem);
    // use e.selectedItems to get an array of selected items (useful for multiselect)
  });

  $('#clear-button').on('click', function() {
    mydropselect.clear();
  })
})
```

## FAQ

1. What if I don't want to use this plugin as a select menu and just open the URL from an item?
    _You can just specify the `href` attribute of an item with the URL and it will automatically open that url. `#` will specify that the item will act as a select menu item_
    
    ```html
      <ul class="dropdown-menue">
        ...
          <li><a href="http://myowsomeurl.com">Open the URL</a></li>
          <li><a href="#">As a Select Menu</a></li>
        ...
      </ul>
    ```