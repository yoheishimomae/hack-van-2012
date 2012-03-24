$(document).ready(function() {
    
    var shopify = new Shopify;
    
    // get all 'shirt' or 'pants'
    shopify.products({ product_type: 'shirt' }, function(e, products) {
        if (e) throw e;
        
        for(var i = 0, l = products.length; i < l; i++) {
            var product = products[i];
            $('body').append( $('<img src="' + product.images[0].src + '" />') );
        }
    });
    
});
