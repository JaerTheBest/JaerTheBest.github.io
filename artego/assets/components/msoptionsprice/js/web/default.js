/* 2.4.6 */
(function (window, document, $, msOptionsPriceConfig) {
    var msOptionsPrice = msOptionsPrice || {};


    msOptionsPrice.options = {
        errorClass: "error",
        errorElement: "span",
        showSpinner: true,
    };


    msOptionsPrice.setup = function () {
        msOptionsPrice.$doc = $(document);
        msOptionsPrice.$body = $('body');
        msOptionsPrice.$spinner = null;

        msOptionsPrice.Product.parent = '#msProduct';
        msOptionsPrice.Product.form = '.ms2_form.msoptionsprice-product';
        msOptionsPrice.Product.modification = '.ms2_form.msoptionsprice-modification';
        msOptionsPrice.Product.cost = '.msoptionsprice-cost';
        msOptionsPrice.Product.old_cost = '.msoptionsprice-old-cost';
        msOptionsPrice.Product.price = '.msoptionsprice-old-price';
        msOptionsPrice.Product.mass = '.msoptionsprice-mass';
        msOptionsPrice.Product.article = '.msoptionsprice-article';
        msOptionsPrice.Product.weight = '.msoptionsprice-weight';
        msOptionsPrice.Product.count = '.msoptionsprice-count';
        msOptionsPrice.Product.name = '.msoptionsprice-name';
        msOptionsPrice.Product.msbonus = '.msoptionsprice-msbonus';

        msOptionsPrice.Product.gallery = '.msoptionsprice-gallery';
        msOptionsPrice.Product.fotorama = '.fotorama';
        msOptionsPrice.Product.image = '.msoptionsprice-image';
        msOptionsPrice.Product.prefix = '.msoptionsprice-';

        msOptionsPrice.exclude = {};

        msOptionsPrice.exclude.fieldNames = ['count'];
        msOptionsPrice.exclude.fieldClasess = ['msal_input'];

        msOptionsPrice.Product.msal_price = '#msal_price_original';

        msOptionsPrice.Product.inputParent = '.input-parent';
        msOptionsPrice.timeout = 300;
    };


    msOptionsPrice.initialize = function () {
        msOptionsPrice.setup();
        msOptionsPrice.miniShop2.initialize();

        /* get modification on change options */
        msOptionsPrice.$doc.on('change', msOptionsPrice.Product.form, function (e) {

            if (msOptionsPrice.Tools.inArray(e.target.name, msOptionsPrice.exclude.fieldNames)) {
                console.info('[msOptionsPrice] Exclude field "' + e.target.name + '"');

                return false;
            }

            for (i in msOptionsPrice.exclude.fieldClasess) {
                if (!msOptionsPrice.exclude.fieldClasess.hasOwnProperty(i)) {
                    continue;
                }

                var cls = msOptionsPrice.exclude.fieldClasess[i];
                if ($(e.target).hasClass(cls)) {

                    console.info('[msOptionsPrice] Exclude field "' + e.target.name + '"');
                    return false;
                }
            }

            msOptionsPrice.Product.processOptions(this);

            setTimeout((function () {
                msOptionsPrice.Product.action('modification/get', this);
            }.bind(this)), msOptionsPrice.timeout);

            e.preventDefault();
            return false;
        });

        /* get modification on document ready */
        msOptionsPrice.$doc.ready(function () {
            msOptionsPrice.mSearch2.setOptionsByFilter();
            $(msOptionsPrice.Product.form).each(function () {
                $(this).trigger('change');
                /*
                 msOptionsPrice.Product.action('modification/get', this);
                 */
            });
        });

        /* get modification on change image */
        msOptionsPrice.$doc.on('fotorama:show', msOptionsPrice.Product.gallery + ' ' + msOptionsPrice.Product.fotorama, function (e, fotorama, extra) {
            var item, form;

            item = fotorama.activeFrame;
            if (extra.user && item.rid && item.iid) {

               // form = $(e.target).closest(msOptionsPrice.Product.parent).find(msOptionsPrice.Product.form);

                form = $(e.target).closest(msOptionsPrice.Product.form);
                if (!form.length) {
                    form = $(msOptionsPrice.Product.cost + msOptionsPrice.Product.prefix + item.rid)
                        .closest(msOptionsPrice.Product.form);
                }
                if (form.length) {
                    msOptionsPrice.Product.action('modification/get', form, {id: item.rid, iid: item.iid});
                }
            }
        });

        /* set rid, iid image */
        msOptionsPrice.$doc.on('fotorama:load', msOptionsPrice.Product.gallery + ' ' + msOptionsPrice.Product.fotorama, function (e, fotorama, extra) {

            fotorama.data.filter(function (item, r) {
                if (item.rid && item.iid && item.thumb) {
                    var thumb = $(this).find('img[src$="' + item.thumb + '"]');

                    if (thumb) {
                        thumb
                            .data('i', item.i)
                            .attr('data-i', item.i)
                            .data('rid', item.rid)
                            .attr('data-rid', item.rid)
                            .data('iid', item.rid)
                            .attr('data-iid', item.iid);
                    }

                    if (fotorama.activeFrame.i == item.i) {
                        //var form = $(e.target).closest(msOptionsPrice.Product.parent).find(msOptionsPrice.Product.form);

                        form = $(e.target).closest(msOptionsPrice.Product.form);
                        if (!form.length) {
                            form = $(msOptionsPrice.Product.cost + msOptionsPrice.Product.prefix + item.rid)
                                .closest(msOptionsPrice.Product.form);
                        }
                        if (form.length) {
                            msOptionsPrice.Product.action('modification/get', form, {id: item.rid, iid: item.iid});
                        }
                    }
                }

            }, this);
        });

        /* set options and get modification on "mse2_load" */
        msOptionsPrice.$doc.on('mse2_load', function (e, response) {
            msOptionsPrice.mSearch2.setOptionsByFilter();
            $(msOptionsPrice.Product.form).each(function () {
                $(this).trigger('change');
                /*
                 msOptionsPrice.Product.action('modification/get', this);
                 */
            });
        });

        /* get modification on "pdopage_load" */
        msOptionsPrice.$doc.on('pdopage_load', function (e, response) {
            $(msOptionsPrice.Product.form).each(function () {
                $(this).trigger('change');
            });
        });

        /* set options and get modification on "modification" click */
        msOptionsPrice.$doc.on('click touchend', msOptionsPrice.Product.modification, function (e) {
            if (!$(e.target).is(":submit")) {
                msOptionsPrice.Product.action('modification/set', this);
            }
        });

    };


    msOptionsPrice.mSearch2 = {

        setOptionsByFilter: function () {
            /* if mse2Config set options */
            if (typeof(mse2Config) != 'undefined' && mSearch2.initialized) {
                var filterDelimeter = mse2Config.filter_delimeter || '|';
                var valuesDelimeter = mse2Config.values_delimeter || ',';
                var aliases = mse2Config.aliases || {};
                var filters = mSearch2.getFilters();

                for (i in filters) {
                    if (!filters.hasOwnProperty(i)) {
                        continue;
                    }

                    var filterName = String(i);
                    var filterValue = String(filters[i]).split(valuesDelimeter);

                    if (typeof(aliases[filterName]) != 'undefined') {
                        filterName = aliases[filterName];
                    }

                    filterName = String(filterName).split(filterDelimeter);

                    switch (filterName[0]) {

                        case 'msoption':
                            msOptionsPrice.Tools.setOptionValue(filterName[1], filterValue);
                            break;

                    }
                }
            }
        },

    };


    msOptionsPrice.miniShop2 = {
        initialize: function () {
            if (typeof(miniShop2) == 'undefined') {
                console.log('[msOptionsPrice:Error] Initialization Error. msOptionsPrice required');
                return false;
            }

            if (msOptionsPriceConfig.allow_remains) {
                miniShop2.Callbacks.add('Cart.change.response.error', 'msoptionsprice', function (response) {
                    var count = miniShop2.sendData.$form.find(miniShop2.Cart.countInput);
                    count.val(count.attr('value'));
                });

                miniShop2.Callbacks.add('Cart.change.response.success', 'msoptionsprice', function (response) {
                    var count = miniShop2.sendData.$form.find(miniShop2.Cart.countInput);
                    count.removeClass(msOptionsPrice.options.errorClass);
                });

                miniShop2.Callbacks.add('Order.submit.before', 'msoptionsprice', function () {
                    var result = msOptionsPrice.Order.action('order/check', miniShop2.sendData.$form);
                    if (!result) {
                        $(':button, a', miniShop2.Order.order).attr('disabled', false).prop('disabled', false);
                    }
                    return result;
                });
            }

        },

    };


    msOptionsPrice.Order = {
        action: function (action, form, data) {
            var formData = new FormData($(form)[0]);

            if (!msOptionsPrice.Tools.empty(data)) {
                for (key in data) {
                    if (!data.hasOwnProperty(key)) {
                        continue;
                    }
                    formData.append(key, data[key]);
                }
            }

            formData.append('action', action);
            formData.append('ctx', msOptionsPriceConfig.ctx);

            var request = $.ajax({
                type: 'POST',
                url: msOptionsPriceConfig.actionUrl,
                dataType: 'json',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    msOptionsPrice.Spinner.show();

                    return true;
                },
                success: function (response) {
                    msOptionsPrice.Spinner.hide();

                    msOptionsPrice.$doc.trigger('msoptionsprice_order_action', [action, form, response]);

                    var data = response.data;
                    var errors = [];

                    if (!msOptionsPrice.Tools.empty(data.errors)) {
                        errors.push(data.errors);
                    }

                    if (!response.success) {
                        if (!msOptionsPrice.Tools.empty(response.message)) {
                            miniShop2.Message.error(response.message);
                        }

                        if (!msOptionsPrice.Tools.empty(data.required)) {
                            for (var key in data.required) {
                                if (!data.required.hasOwnProperty(key)) {
                                    continue;
                                }
                                var pls = data.required[key];
                                var item = $('#' + key);
                                var count = item.find(miniShop2.Cart.countInput);

                                count.addClass(msOptionsPrice.options.errorClass);

                                var f = count.closest('form');
                                var err = item.find(msOptionsPrice.options.errorElement + '.' + msOptionsPrice.options.errorClass);
                                if (err.length < 1) {
                                    err = $("<" + msOptionsPrice.options.errorElement + "/>").appendTo(f.parent())
                                        .addClass(msOptionsPrice.options.errorClass);
                                }

                                err.text(pls['message']).show();

                            }
                        }
                    }
                    else {
                        if (!msOptionsPrice.Tools.empty(data.cart)) {
                            for (var key in data.cart) {
                                if (!data.cart.hasOwnProperty(key)) {
                                    continue;
                                }

                                var pls = data.cart[key];
                                var item = $('#' + key);
                                if (item.length < 1) {
                                    continue;
                                }

                                var count = item.find(miniShop2.Cart.countInput);

                                count.removeClass(msOptionsPrice.options.errorClass);

                                var err = item.find(msOptionsPrice.options.errorElement + '.' + msOptionsPrice.options.errorClass);
                                err.text('').hide();
                            }
                        }
                    }

                    if (!msOptionsPrice.Tools.empty(errors)) {
                        console.log(errors.join('<br>'));
                    }

                }
            }).done(function (response) {

            }).fail(function (jqXHR, textStatus, errorThrown) {

            });

            if (!!request.responseJSON) {
                msOptionsPrice.Spinner.hide();

                return request.responseJSON.success || false;
            }

            return true;
        }
    };


    msOptionsPrice.Product = {

        action: function (action, form, data) {

            var formData = new FormData($(form)[0]);

            if (!msOptionsPrice.Tools.empty(data)) {
                for (key in data) {
                    if (!data.hasOwnProperty(key)) {
                        continue;
                    }
                    formData.append(key, data[key]);
                }
            }

            formData.append('action', action);
            formData.append('ctx', msOptionsPriceConfig.ctx);

            $.ajax({
                type: 'POST',
                url: msOptionsPriceConfig.actionUrl,
                dataType: 'json',
                data: formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    msOptionsPrice.Spinner.show();
                    msOptionsPrice.Product.submitDisabled($(form)[0]);

                    return true;
                },
                success: function (response) {
                    msOptionsPrice.Spinner.hide();
                    msOptionsPrice.Product.submitEnabled($(form)[0]);

                    msOptionsPrice.$doc.trigger('msoptionsprice_product_action', [action, form, response]);

                    if (response.success && response.data) {

                        var data = response.data;
                        var errors = [];
                        var html;

                        if (!msOptionsPrice.Tools.empty(data.errors)) {
                            errors.push(data.errors);
                        }

                        if (!msOptionsPrice.Tools.empty(data.modification)) {
                            ['name', 'article', 'count', 'weight', 'cost', 'old_cost', 'price', 'mass', 'msbonus'].filter(function (key) {
                                if (msOptionsPrice.Product[key]) {
                                    var value = data.modification[key];

                                    switch (key) {
                                        case 'old_cost':
                                            if (data.modification[key] == data.modification['cost']) {
                                                value = 0;
                                            }
                                            break;
                                        default:
                                            break;
                                    }

                                    if (msOptionsPrice.Tools.empty(value) && !msOptionsPriceConfig['allow_zero_' + key]) {
                                        return true;
                                    }

                                    msOptionsPrice.Tools.setValue(null, value, key, data.rid);
                                }
                            });


                            key = 'description';
                            html = $(msOptionsPrice.Product.prefix + data.rid + msOptionsPrice.Product.prefix + key);
                            if (html.length > 0) {
                                html.html(data.modification[key] || "");
                            }

                        }

                        /* set modification/set */
                        var msoptionsprice_mid = $(msOptionsPrice.Product.prefix + data.rid).closest(msOptionsPrice.Product.form).find('input[name="mid"]');
                        if (msoptionsprice_mid.length) {
                            if (action == 'modification/set') {
                                msoptionsprice_mid.val(data.modification.id);
                            }
                            if (action == 'modification/get') {
                                msoptionsprice_mid.val(data.modification.id);
                            }
                        }

                        /* set image  */
                        if (miniShop2.Gallery && !msOptionsPrice.Tools.empty(data.modification.images) && msOptionsPrice.Tools.empty(data.set.options)) {
                            $('.fotorama').on('fotorama:load', function (e, fotorama, extra) {
                                if (extra && extra.frame && extra.frame.iid == data.modification.images[0]) {
                                    msOptionsPrice.Tools.setGalleryImage(extra.frame.rid, extra.frame.iid);
                                }
                            });
                            msOptionsPrice.Tools.setGalleryImage(data.rid, data.modification.images[0]);
                        } else if (miniShop2.Gallery && !msOptionsPrice.Tools.empty(data.modification.images) && !msOptionsPrice.Tools.empty(data.set.image)) {
                            msOptionsPrice.Tools.setGalleryImage(data.rid, data.modification.images[0]);
                        }

                        /* set options */
                        var set = !msOptionsPrice.Tools.empty(data.set.options);

                        /* set msal */
                        var msal = data.options['msal'];
                        if (!set && !msOptionsPrice.Tools.empty(msal)) {
                            data.options = {
                                'msal': msal
                            };
                            set = true;
                        }

                        if (set) {
                            for (var key in data.options) {
                                if (!data.options.hasOwnProperty(key)) {
                                    continue;
                                }
                                var value = data.options[key];
                                if (typeof value === "object") {
                                    for (idx in value) {
                                        var _key = [key, idx];
                                        var _value = value[idx];

                                        _value = msOptionsPrice.Tools.formatOptionValue(key, _value);
                                        msOptionsPrice.Tools.setOptionValue(_key, _value, data.rid);
                                    }
                                }
                                else {
                                    value = msOptionsPrice.Tools.formatOptionValue(key, value);
                                    msOptionsPrice.Tools.setOptionValue(key, value, data.rid);
                                }
                            }
                        }

                        // html
                        for (var key in data.options) {
                            if (!data.options.hasOwnProperty(key)) {
                                continue;
                            }

                            html = $(msOptionsPrice.Product.prefix + data.rid + msOptionsPrice.Product.prefix + key);
                            if (html.length > 0) {
                                html.html(data.options[key]);
                            }
                        }


                        if (!msOptionsPrice.Tools.empty(errors)) {
                            console.log(errors.join('<br>'));
                        }
                    }
                    else if (!response.success) {

                    }
                }
            }).done(function (response) {

            }).fail(function (jqXHR, textStatus, errorThrown) {
                msOptionsPrice.Spinner.hide();
                msOptionsPrice.Product.submitEnabled($(form)[0]);

            });
        },


        processOptions: function (form) {
            var $form = $(form),
                $constraints,
                $related,
                $enabled = [],
                $disabled = [],
                constraints,
                options = {},
                selector = 'input, option';

            $constraints = $form.find("[data-constraints]");
            $related = $form.find("[data-constraints]").find(selector);

            constraints = $constraints.map(function () {
                return $(this).data('constraints');
            });

            constraints = $.grep(constraints, function (v, k) {
                return $.inArray(v, constraints) === k;
            });
            constraints.sort();

            constraints.filter(function (key) {
                var value = msOptionsPrice.Tools.getOptionValue(key, form);
                if (typeof (value) != 'undefined') {
                    options[key] = value;
                }
                return true;
            });

            if (options.length < 1) {
                return;
            }

            $related.filter(function () {
                var $curr = $(this);

                switch (this.tagName) {
                    case 'OPTION':
                        $curr = $curr.parent('select');
                        break;

                }

                var opts = [];
                var currConstraints = $curr.data('constraints') || $curr.closest('[data-constraints]').data('constraints') || [];

                currConstraints.filter(function (key) {
                    if (options.hasOwnProperty(key)) {
                        opts.push('' + key + '=' + msOptionsPrice.Tools.escapedValue(options[key]) + '');
                        //opts.push('' + key + '=' + options[key] + '');
                        //opts.push('"'+key+'='+options[key]+'"');
                    }
                });

                opts.sort();
               /* opts = opts.join('(.*?)');
                opts = msOptionsPrice.Tools.escapedValue(opts);
                opts = new RegExp(opts);*/
                opts = opts.join('([^\"]+)');
                opts = new RegExp(opts+'([\&\"])');

                if (this.dataset.relations && msOptionsPrice.Tools.escapedValue(this.dataset.relations).match(opts)) {
                    $enabled.push(this);
                }
                else {
                    $disabled.push(this);
                }
                return true;
            });

            $enabled = $($enabled).map(function (i, self) {
                return self;
            });
            $disabled = $($disabled).map(function (i, self) {
                return self;
            });

            $enabled.attr('disabled', false).prop('disabled', false);
            $disabled.attr('disabled', true).prop('disabled', true);

            $enabled.closest(msOptionsPrice.Product.inputParent).show();
            $disabled.closest(msOptionsPrice.Product.inputParent).hide();

            $constraints.map(function () {
                var $fields = $(this).find(selector);
                if ($fields.length < 1) {
                    return true;

                }
                switch ($fields[0].tagName) {
                    case 'INPUT':
                        if ($fields.filter(':not(:disabled):checked').length < 1) {
                            $fields.filter(':not(:disabled):first').prop('checked', true);
                        }
                        break;

                    case 'OPTION':
                        if ($fields.filter(':not(:disabled):checked:selected').length < 1) {
                            $fields.filter(':not(:disabled):first').prop('checked', true).prop('selected', true);
                        }
                        break;
                }
            });
        },

        submitDisabled: function (form) {
            $(form).find(':button[value="cart/add"], a[value="cart/add"]').attr('disabled', true).prop('disabled', true);
        },

        submitEnabled: function (form) {
            $(form).find(':button[value="cart/add"], a[value="cart/add"]').attr('disabled', false).prop('disabled', false);
        },

    };


    msOptionsPrice.Tools = {
        escapedValue: function (value) {
            return value
                .replace(new RegExp("\\^", "g"), '{v}')
                .replace(new RegExp("\\$", "g"), '{s}')
                .replace(new RegExp('\\*', "g"), '{z}')
                .replace(new RegExp('\\+', "g"), '{p}');
        },

        arrayIntersect: function (array1, array2) {
            var result = array1.filter(function (n) {
                return array2.indexOf(n) !== -1;
            });

            return result;
        },

        inArray: function (needle, haystack) {
            for (key in haystack) {
                if (haystack[key] == needle) return true;
            }

            return false;
        },

        empty: function (value) {
            return (typeof(value) == 'undefined' || value == 0 || value === null || value === false || (typeof(value) == 'string' && value.replace(/\s+/g, '') == '') || (typeof(value) == 'object' && value.length == 0));
        },

        setValue: function (self, value, key, rid) {
            var $this = null;
            if (self) {
                $this = $(self);
            }
            else if (key && rid) {
                $this = $(msOptionsPrice.Product[key] + msOptionsPrice.Product.prefix + rid);
            }

            if (!$this.length && !rid) {
                $this = $(msOptionsPrice.Product[key]);
            }

            if (!$this.length) {
                return;
            }

            var tagName = $this[0].tagName;
            var tagType = $this[0].type;

            switch (true) {
                case tagName == 'INPUT' && (key instanceof Array) && msOptionsPrice.Tools.inArray('msal', key):
                    $this.val(value).trigger('change');
                    break;
                case tagName == 'INPUT' && tagType == 'checkbox':
                    if (!(value instanceof Array)) {
                        value = [value];
                    }

                    if (msOptionsPrice.Tools.inArray($this.val(), value)) {
                        $this.prop('checked', true);
                    }
                    else {
                        $this.prop('checked', false);
                    }
                    break;
                case tagName == 'INPUT' && tagType != 'radio':
                    $this.val(value);
                    break;
                case tagName == 'INPUT' && tagType == 'radio':
                    if (!(value instanceof Array)) {
                        value = [value];
                    }
                    value.filter(function (item, r) {
                        if ($this.val() == item) {
                            $this.prop('checked', true);
                        }
                        else {
                            $this.prop('checked', false);
                        }
                    }, this);
                    break;
                case tagName == 'SELECT':
                    if (!(value instanceof Array)) {
                        value = [value];
                    }
                    value.filter(function (item, r) {
                        if ($this.find('option[value="' + item + '"]').length) {
                            $this.val([item]);
                        }
                    }, this);
                    break;

                default:
                    switch (true) {
                        case key == 'cost':
                            /* refresh msal price */
                            msOptionsPrice.Tools.setValue(null, value, 'msal_price', rid);
                            break;
                        case  key == 'old_cost' && msOptionsPrice.Tools.empty(value):
                            /* hide empty old_cost */
                            $this.parent().hide();
                            break;
                        case  key == 'old_cost' && !msOptionsPrice.Tools.empty(value):
                            /* show not empty old_cost */
                            $this.parent().show();
                            break;
                    }

                    value = msOptionsPrice.Tools.formatOptionValue(key, value);
                    $this.html(value);

                    break;
            }

            return;
        },

        getOptionName: function (key) {
            var name = 'options';
            if (!(key instanceof Array)) {
                key = [key];
            }

            key.filter(function (i) {
                name += '[' + i + ']';
            });

            return name.toString();
        },

        getOptionValue: function (key, form) {
            var value;
            var name = msOptionsPrice.Tools.getOptionName(key);
            var $field = $(form).find('[name="' + name + '"]');

            if ($field.length > 0) {
                switch ($field[0].tagName) {
                    case 'INPUT':
                        value = $field.filter(':checked').val();
                        break;
                    case 'SELECT':
                        value = $field.val();
                        break;
                }
            }
            return value;
        },

        setOptionValue: function (key, value, rid) {
            var inputs;
            var name = msOptionsPrice.Tools.getOptionName(key);

            if (rid) {
                inputs = $(msOptionsPrice.Product.cost + msOptionsPrice.Product.prefix + rid)
                    .closest(msOptionsPrice.Product.form)
                    .find('[name="' + name + '"]');
            }
            else {
                inputs = $(msOptionsPrice.Product.cost)
                    .closest(msOptionsPrice.Product.form)
                    .find('[name="' + name + '"]');
            }

            if (inputs) {
                inputs.each(function () {
                    msOptionsPrice.Tools.setValue(this, value, key);
                });
            }

            return;
        },

        setGalleryImage: function (rid, iid) {
            var fotorama = $('.fotorama__img[data-rid="' + rid + '"]').closest(msOptionsPrice.Product.gallery).find('.fotorama').data('fotorama');

            if (!!fotorama) {
                if (fotorama.activeFrame['iid'] == iid) {
                    return;
                }
                fotorama.data.filter(function (item, r) {
                    if (item['iid'] == iid) {
                        fotorama.show(item['i'] - 1);
                    }
                }, this);
            }
        },

        formatOptionValue: function (key, value) {

            switch (key) {
                case 'cost':
                case 'old_cost':
                case 'price':
                case 'old_price':
                    if (miniShop2 && miniShop2.Utils.formatPrice) {
                        value = miniShop2.Utils.formatPrice(value);
                    }
                    break;
                case 'mass':
                case 'weight':
                    if (miniShop2 && miniShop2.Utils.formatWeight) {
                        value = miniShop2.Utils.formatWeight(value);
                    }
                    break;
                default:
                    break;
            }

            return value;
        },

        /* TODO remove */
        setInputValue: function (key, value, rid) {
            var inputs;

            if (rid) {
                inputs = $(msOptionsPrice.Product.cost + msOptionsPrice.Product.prefix + rid)
                    .closest(msOptionsPrice.Product.form)
                    .find('[name="options[' + key + ']"]');
            }
            else {
                inputs = $(msOptionsPrice.Product.cost)
                    .closest(msOptionsPrice.Product.form)
                    .find('[name="options[' + key + ']"]');
            }

            if (!inputs) {
                return false;
            }

            inputs.each(function () {
                msOptionsPrice.Tools.setValue(this, value);
            });
        },

    };


    msOptionsPrice.Spinner = {
        create: function () {
            return $('<div class="msoptionsprice-spinner"></div>');
        },
        show: function () {
            if (!msOptionsPrice.options.showSpinner) {
                return;
            }
            msOptionsPrice.$spinner = msOptionsPrice.$spinner || this.create();
            msOptionsPrice.$body.append(msOptionsPrice.$spinner);

            return msOptionsPrice.$spinner.show();
        },

        hide: function () {
            if (msOptionsPrice.$spinner) {
                return msOptionsPrice.$spinner.remove();
            }
        },
    };


    $(document).ready(function ($) {

    });


    msOptionsPrice.initialize();
    window.msOptionsPrice = msOptionsPrice;

})(window, document, jQuery, msOptionsPriceConfig);


/* event example */
/*$(document).on('msoptionsprice_product_action', function (e, action, form, response) {

    //console.log(action, form, response);
});*/

/*
reload gallery
$(document).on('msoptionsprice_product_action', function (e, action, form, r) {
    if (action == 'modification/get' && r.success && r.data) {
        var m = r.data.modification || {};

        var thumbs = m.thumbs || {main:['default.png']};
        var fotorama = $(form).closest('#msProduct').find('.fotorama').data('fotorama');
        if (fotorama) {
            var images = [];
            (thumbs.main || []).filter(function (href) {
                images.push({img: href, caption: ''})
            });
        }
    }
});*/
