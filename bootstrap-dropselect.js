/* ===================================================
 * bootstrap-dropselect.js v1.0.0
 * http://github.com/lodev09/bootstrap-dropselect
 * ===================================================
 * Copyright 2014 Jovanni Lo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

(function ( $ ) {
	$.fn.dropselect = function(options) {
		var defaults = {
			onselect: function(item) {},
			onunselect: function(item) {},
			onclear: function() {},
			multiselect: false,
			clear: {
				show: true,
				label: 'Clear selected'
			},
			filter: {
				show: true,
				placeholder: 'Search',
				casesensitive: false
			}

		}, that = this, $items = that.children('li:has(a)');

		if (typeof options.filter == 'boolean') options.filter = {show: options.filter}
		if (typeof options.clear == 'boolean') options.clear = {show: options.clear}

		options = $.extend(true, defaults, options);

		// properties
		this.items = [];
		this.selectedItem = {};
		this.selectedItems = [];

		var _getEventObj = function(type) {
			var event = jQuery.Event(type);
			event.selectedItems = that.selectedItems;
			event.selectedItem = that.selectedItem;
			event.items = that.items;
			event.toggle = that.toggle;
			event.clear = that.clear;

			return event;
		}

		// methods
		this.clear = function() {
			$items.removeClass('dropselect-selected');
			this.trigger('clear');
			return this;
		};

		this.toggle = function(index) {
			var item = this.items[index], $itemel;

			if (typeof item == 'object') {
				$itemEl = item.element;
				if (options.multiselect) {
					if ($itemEl.hasClass('dropselect-selected')) {
						$itemEl.removeClass('dropselect-selected');
						this.selectedItems.splice(item, 1);
					} else {
						$itemEl.addClass('dropselect-selected');
						this.selectedItems.push(item);
						this.selectedItem = item;
					}

					this.trigger(_getEventObj('select'), item);

				} else {
					$items.removeClass('dropselect-selected');
					$itemEl.addClass('dropselect-selected');
					this.selectedItems = [item]
					this.selectedItem = item;
					this.trigger(_getEventObj('select'), item);
					this.trigger(_getEventObj('unselect'), item);
				}
			}
		
			return this;
		}

		this.addClass("dropselect")
			.on('select', function(e, item) {
				options.onselect.call(that, item);
			})
			.on('unselect', function(e, item) {
				options.onunselect.call(that, item);
			})
			.on('clear', function(e, item) {
				options.onclear.call(that);
			});

		// build each items
		$items.each(function(index, el) {
			var $itemEl = $(el), 
				text = $.trim($itemEl.text()),
				value = typeof $itemEl.data('value') != 'undefined' ? $itemEl.data('value') : text;

			$itemEl.addClass('dropselect-item')
				.find('a:first')
					.prepend(' <i class="glyphicon glyphicon-ok dropselect-item-icon"></i> ')
					.on('click', function(e) {
						if ($(this).attr('href') == '#') e.preventDefault();
						if (options.multiselect) e.stopPropagation();
						that.toggle.call(that, index)
					});

			that.items.push({
				value: value,
				text: text,
				element: $itemEl
			});
		});

		// configure filter text
		if (options.filter.show) {
			var $fitler = $('\
				<li class="dropselect-filter">\
					<input type="text" class="form-control dropselect-filter-input" placeholder="' + options.filter.placeholder + '">\
				</li>'),
				$searchText = $fitler.children('.dropselect-filter-input');

			$searchText.on('click', function(e) {
				e.stopPropagation();
			});
			$searchText.on('keyup', function(e) {
				var q = $(this).val();
				if (q === "") {
					$items.removeClass('hidden');
				} else {
					$items.addClass('hidden').filter(function () {
						var value = $(this).text();
						if (!options.filter.casesensitive) {
							value = value.toLowerCase();
							q = q.toLowerCase();
						}
						
			            return value.indexOf(q) != -1;
			        }).removeClass('hidden');
			    }
			});

			this.find('li:has(a):first').before($fitler);
		}

		// configure clear button
		if (options.clear.show) {
			var $clear = $('\
				<li class="dropselect-clear">\
					<a href="#"><i class="glyphicon glyphicon-remove dropselect-item-icon"></i> ' + options.clear.label + ' </a>\
				</li>\
				<li class="divider"></li>');

			$clear.first('.dropselect-clear').on('click', function(e) {
				e.preventDefault();
				that.clear.call(that);
			});

			this.find('li:has(a):first').before($clear);
		}

		return this;
	}

}( jQuery ));