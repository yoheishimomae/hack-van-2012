(function($) {
    
    var Shopify = function() {
        this.cart = [];
        this.api = {
            key: 'c7df20c29370c557a328ec6ed412f625',
            password: 'f0c82bb184ef682daf612e893da78278',
            url: 'https://API_KEY:API_PASSWORD@jacobs-emard7025.myshopify.com'
        };
    };
    
    // generate api url
    Shopify.prototype.url = function(path) {
        if (!path) path = '';
        return this.api.url.replace('API_KEY', this.api.key).replace('API_PASSWORD', this.api.password).concat(path);
    };
    
    // get products
    Shopify.prototype.products = function(options, callback) {
        var e = null;
        if (!options) options = {};
        if (!callback) callback = function(e) {};
        
        var url = this.url('/admin/products.json');
        var params = [];
        
        // generate the url params
        for(var key in options) {
            params.push( key + '=' + options[key] );
        }
        
        // add params to url
        if (params.length > 0) {
            url = url + '?' + params.join('&');
        }
        
        $.ajax(url, {
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                callback(e, data.products);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                e = errorThrown;
                callback(e, []);
            }
        });
    };
    
    // add item to cart
    Shopify.prototype.addToCart = function(product) {
        this.cart.push(product);
    };
    
    // remove item from cart
    Shopify.prototype.removeFromCart = function(index) {
        if (!this.cart[index]) return;
        this.cart.splice(index, 1);
    }
    
    // remove all items from cart
    Shopify.prototype.clearCart = function() {
        this.cart = [];
    }
    
    // list items in cart
    Shopify.prototype.listCart = function() {
        return this.cart.slice(0);
    };
    
    // generate checkout permalink
    Shopify.prototype.checkout = function(callback) {
        var items = [];
        
        for (var i = 0, l = this.cart.length; i < l; i++) {
            var product = this.cart[i];
            items.push( product.variants[0].id + ':1' );
        }
        
        var url = 'http://jacobs-emard7025.myshopify.com' + '/cart/' + items.join(',');
        callback(url);
    };
    
    // get total price
    Shopify.prototype.total = function() {
        var total = 0;
        for (var i = 0, l = this.cart.length; i < l; i++) {
            var product = this.cart[i];
            var value = parseFloat(product.variants[0].price);
            total += value;
        }
        
        return total.toFixed(2);
    };
    
    // get list of items in cart
    window.Shopify = Shopify;
    
})(jQuery);