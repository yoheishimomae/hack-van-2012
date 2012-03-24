(function($) {
    
    var Shopify = function() {
        this.cart = [];
        this.api = {
            key: '41f8a669781c44fa8c4e89c6a679b2ff',
            password: '3bde77b7df62d3b1ec3a74226ace9179',
            url: 'https://API_KEY:API_PASSWORD@hack-van-2012.myshopify.com'
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
    
    // list items in cart
    Shopify.prototype.listCart = function() {
        return this.cart.slice(0);
    };
    
    // get list of items in cart
    window.Shopify = Shopify;
})(jQuery);