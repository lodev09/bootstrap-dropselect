/* ===================================================
 * bootstrap-dropselect.js v1.1.2
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

(function ($) {

	"use strict"; // jshint ;_;

	// Class def

	var Dropselect = function(el, options) {
		var that = this;

		this.$element = $(el);
		this.options = $.extend(true, {}, $.fn.dropselect.defaults, options, this.$element.data(), this.$element.data('options'));
		this.items = [];
		this.selecteItem = {};
		this.selectedItems = [];
		this.selectedValue = '';
		this.selectedValues = [];
		this.$_items = undefined;
		this.$_listContainer = undefined;

		this.load();
	};

	Dropselect.prototype = {
		_setListener: function() {
			this.$element
				.on('ds.select', $.proxy(this.options.onselect, this))
				.on('ds.unselect', $.proxy(this.options.onunselect, this))
				.on('ds.toggle', $.proxy(this.options.ontoggle, this))
				.on('ds.change', $.proxy(this.options.onchange, this))
				.on('ds.load', $.proxy(this.options.onload, this))
				.on('ds.clear', $.proxy(this.options.onclear, this));

			return this;
		},

		_change: function(triggerEvent) {
			var that = this;
			this.selecteItem = {};
			this.selectedItems = [];
			this.selectedValue = '';
			this.selectedValues = [];

			$.each(this.items, function(index, item) {
				var $itemEl = item.$element;
				if ($itemEl.hasClass('dropselect-selected')) {
					that.selectedItems.push(item);
					that.selectedValues.push(item.value);
				}
			});

			this.selectedValue = that.selectedValues[0];
			this.selectedItem = that.selectedItems[0];

			if (typeof triggerEvent == 'undefined' || triggerEvent === true) {
				this.$element.trigger($.extend({type: 'ds.change'}, this));
			}

			return this;
		},

		showLoading: function() {
			this.$element.addClass('dropselect-loading');
			return this;
		},

		hideLoading: function() {
			this.$element.removeClass('dropselect-loading');
			return this;
		},

		load: function() {
			var that = this,
				$el = this.$element,
				options = this.options,
				$lis = $el.children('li:has(a), li.divider');

			this._setListener();

			if (typeof options != 'undefined') {
				if (typeof options.filter == 'boolean') options.filter = $.extend($.fn.dropselect.defaults.filter, {show: options.filter});
				if (typeof options.clear == 'boolean') options.clear = $.extend($.fn.dropselect.defaults.clear, {show: options.clear});
			}

			// get the items
			this.$_items = $lis.has('a:first');
			this.$_listContainer = $('<ul class="dropselect-list"></div>');

			// put all <li> to the list container
			$lis.appendTo(this.$_listContainer);

			// put the no-results label as the last child
			this.$_listContainer.append('<li class="dropselect-no-results">' + options.filter.noresult + '</li>');

			// finally append the list container to the dropdown element
			$el.append(this.$_listContainer);

			// configure dropdown as dropselect
			$el.addClass("dropselect").width(options.width);

			// configure loading overlay
			$el.prepend('<li class="dropselect-loading-overlay"><i class="glyphicon glyphicon-time dropselect-loading-icon"></i></li>');

			// initiliaze each dropselect items
			this.$_items.each(function(index, el) {
				var $itemEl = $(this),
					text = $.trim($itemEl.text()),
					value = typeof $itemEl.data('value') != 'undefined' ? $itemEl.data('value') : text;

				$itemEl.addClass('dropselect-item');
				if (options.icons) $itemEl.find('a:first').prepend(' <i class="glyphicon glyphicon-ok dropselect-item-icon"></i> ');

				// bind the click event of the item (anchor)
				$itemEl.on('click', function(e) {
					if ($(this).attr('href') == '#') {
						e.preventDefault();
						if (!options.autohide) e.stopPropagation();
						that.toggle(index);
					}
				});

				// push new item to items list
				that.items.push({
					value: value,
					text: text,
					$element: $itemEl
				});

				if ($itemEl.hasClass('dropselect-selected') ||
					typeof $itemEl.data('selected') != 'undefined' ||
					typeof $itemEl.attr('selected') != 'undefined') {

					// select it but don't trigger onselect event
					that.select(index, false);
				}
			});

			// configure searchbox
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
					that.$_items.removeClass('hidden');
					if (q !== "") {
						that.$_items.filter(function () {
							var value = $(this).find('a:first').text();
							if (!options.filter.casesensitive) {
								value = value.toLowerCase();
								q = q.toLowerCase();
							}

				            return value.indexOf(q) == -1;
				        }).addClass('hidden');
				    }

				    if (that.$_items.not('.hidden').length <= 0) that.$_listContainer.addClass('filter-empty');
					else that.$_listContainer.removeClass('filter-empty');
				});

				// insert at the top of the item list
				this.$_listContainer.before($fitler);
			}

			// configure clear button
			if (options.clear.show) {
				var $clear = $('\
					<li class="dropselect-clear">\
						<a href="#"><i class="glyphicon glyphicon-remove dropselect-item-icon"></i> ' + options.clear.text + ' </a>\
					</li>\
					<li class="divider"></li>');

				$clear.first('.dropselect-clear').on('click', function(e) {
					e.preventDefault();
					if (!options.autohide) e.stopPropagation();
					that.clear();
				});

				this.$_listContainer.before($clear);
			}

			this.$element.trigger($.extend({type: 'ds.load'}, this));

			return this;
		},

		hide: function() {
			this.hideLoading();
			this.$element.dropdown('toggle');
			return this;
		},

		clear: function(triggerEvent) {
			this.$_items.removeClass('dropselect-selected');
			this._change(triggerEvent);
			if (typeof triggerEvent == 'undefined' || triggerEvent === true) {
				this.$element.trigger($.extend({type: 'ds.clear'}, this));
			}

			return this;
		},

		toggle: function(index) {
			var item = this.item(index),
				$el = this.$element,
				options = this.options;

			if (typeof item == 'object') {
				var $itemEl = item.$element;
				if ($itemEl.hasClass('dropselect-selected')) {
					if (!options.toggle) return this;
					this.unselect(index);
				} else {
					this.select(index);
				}

				$el.trigger($.extend({type: 'ds.toggle'}, this), item);
			}

			return this;
		},

		unselect: function(index) {
			var item = this.item(index),
				$el = this.$element,
				options = this.options;

			if (typeof item == 'object') {
				var $itemEl = item.$element;
				if (options.multiselect) {
					$itemEl.removeClass('dropselect-selected');
				} else {
					this.$_items.removeClass('dropselect-selected');
				}

				this._change();
				$el.trigger($.extend({type: 'ds.unselect'}, this), item);
			}

			return this;
		},

		select: function(index, triggerEvent) {
			var item = this.item(index),
				$el = this.$element,
				options = this.options;

			if (typeof item == 'object') {
				var $itemEl = item.$element;

				if (!options.multiselect) {
					this.$_items.removeClass('dropselect-selected');
				}

				$itemEl.addClass('dropselect-selected');
				this._change(triggerEvent);

				if (typeof triggerEvent == 'undefined' || triggerEvent === true) {
					$el.trigger($.extend({type: 'ds.select'}, this), item);
				}
			}

			return this;
		},

		item: function(index) {
			var item = this.items[index],
				$el = this.$element;

			return item;
		}
	};

	var old = $.fn.dropselect;

	$.fn.dropselect = function(options, eventArgs) {
		return this.each(function() {
			var $this = $(this);

			var	data = $this.data('dropselect');

			if (typeof options == 'string') {
				// run a method if given a string
				if (!data) $this.data('dropselect', (data = new Dropselect(this)));
				if (typeof data[options] != 'undefined') data[options](eventArgs);
			} else {
				if (!data) $this.data('dropselect', (data = new Dropselect(this, typeof options == 'object' && options)));
			}
		});
	};

	$.fn.dropselect.defaults = {
		// event hooks
		// item specific event hooks
		onselect: function(e, item) {},
		onunselect: function(e, item) {},
		ontoggle: function(e, item) {},

		// global event hooks
		onchange: function(e) {},
		onclear: function(e) {},
		onload: function(e) {},

		multiselect: false,
		toggle: true,
		autohide: false,
		icons: true,
		width: 300,
		clear: {
			show: true,
			text: 'Clear selected'
		},
		filter: {
			show: true,
			placeholder: 'Search',
			casesensitive: false,
			noresult: 'No results found'
		}
	};

	$.fn.dropselect.Constructor = Dropselect;

	$.fn.dropselect.noConflict = function () {
		$.fn.dropselect = old;
		return this;
	}



}( jQuery ));