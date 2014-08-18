bootstrap-dropselect
============================
A simple jQuery plugin that extends bootstrap's dropdown menu into something like github's [select menu](https://github.com/styleguide/css/13.0).

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
http://lodev09.github.io/bootstrap-dropselect/#api

## Credits
All bugs, feature requests, pull requests, feedback, etc., are welcome!

Copyright 2014, Jovanni Lo / [@lodev09](http://twitter.com/lodev09) / [www.lodev09.com](http://www.lodev09.com "www.lodev09.com") / [lodev09@gmail.com](mailto:lodev09@gmail.com)

[Bootstrap Components](http://getbootstrap.com/components/)
[Github's Select Menu](https://github.com/styleguide/css/13.0)

## License
Released under the [Apache License, Version 2.0](http://opensource.org/licenses/Apache-2.0).
See [LICENSE](LICENSE) file.
