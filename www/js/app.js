var shopify = new Shopify;

var app = {
	
	currentWear:{
		shirt:{},
		pants:{}
	},
	
	preInit:function() {
		console.log('pre-initializing');
		if (navigator.userAgent.search('Mac OS X') > 0 && navigator.userAgent.search(/iphone|ipad/i) == -1)
			app.init();
		else {
			document.addEventListener("deviceready", app.init, false);
		}
	},
	
	init:function() {
		console.log('initializing');
		app.loadQueue = [
			{uid:'cart', url:'tmpl-cart.html'},
			{uid:'main', url:'tmpl-main.html'},
			{uid:'picker', url:'tmpl-picker.html'}
		];
		app.template = {};
		// window.plugins.childBrowser.onClose = function (){ViewScroller.isOpen = false};
		
		app.loadTemplate();
	},
	
	loadTemplate:function(r) {
		if (r) {
			app.template[app.currentQueue.uid] = r.responseText;
		}
		if (app.loadQueue.length > 0) {
			console.log('loading template...' + app.loadQueue.length + ' left');
			app.currentQueue = app.loadQueue.splice(0, 1)[0];
			jQuery.ajax({url: app.currentQueue.url, complete:app.loadTemplate});
		}  
		else {
			app.onLoadTemplateComplete();
		}
	},
	
	onLoadTemplateComplete:function() {
		console.log('all templates loaded');
		// app.showMainView();
		// app.showPickerView();
		app.loadShopifyData();
	},
	
	loadShopifyData:function() {
		app.queueCount = 2;
		app.products = {};
		
		shopify.products({ product_type: 'shirt' }, function(e, products) {
			if (e) throw e;
			app.products.shirt = products;
			app.onloadShopifyData(); 
		} );
		shopify.products({ product_type: 'pants' }, function(e, products) {
			if (e) throw e;
			app.products.pants = products;
			app.onloadShopifyData();
		} );
	},
	
	onloadShopifyData:function() {
		console.log('loading products...' + app.queueCount + ' left');

		app.queueCount--;		
		if (app.queueCount <= 0) {
			console.log('all product data loaded');
			app.showMainView();
		}
	},
	
	renderView:function(uid, data, animation) {
		data = data || {};
		
		$('body').html( Mustache.to_html(app.template[uid], data) );
	},
	
	/* Helper */
	
	findById:function(uid) {
		for (var key in app.products) {
			var category = app.products[key];
			for (var i = 0; i < category.length; i++) {
				if (category[i].id == uid) {
					return {product:category[i], type:key};
				}
			}
		}
		
		return null;
	},
	
	
	addToCart:function() {
		console.log('adding to cart');
		
		for (var key in app.currentWear) {
			var item = app.currentWear[key];
			if (item && item != null && item.id) {
				shopify.addToCart(item);
			}
			
			app.currentWear[key] = {};
		}
		
		$('.polaroid').addClass('animate');
		
		setTimeout(function() {
			$('.polaroid').addClass('move-to-cart');
		
			setTimeout(function() {
				app.showMainView();
			}, 500);
		}, 10);
	},
	
	
	/* View specific */
	
	showMainView:function() {
		console.log('displaying main view');
		
		var isAddEnabled = false;
		for (var key in app.currentWear) {
			var item = app.currentWear[key];
			if (item && item.id) {
				isAddEnabled = true;
				break;
			}
		}
		
		var isCartEnabled = shopify.listCart().length > 0;
		
		app.renderView('main', {isAddEnabled:isAddEnabled, isCartEnabled:isCartEnabled, wear:app.currentWear});
		
		$('.polaroid.shirt').click( function(){ app.showPickerView('shirt');} );
		$('.polaroid.pants').click( function(){ app.showPickerView('pants');} );
		
		if (isAddEnabled)
			$('.add-cart').click( app.addToCart );
		
		if (isCartEnabled)
			$('.show-cart').click( app.showCartView );
		
	},
	
	showPickerView:function(type) {
		console.log('displaying picker view');

		type = type || 'shirt';		
		var data = {products: app.products[type]};
		app.renderView('picker', data );
		
		$('.back').click( app.showMainView );
		$('.polaroid').click( function(e){
			var uid = $(this).attr('data-id');
			var item = app.findById(uid);
			app.currentWear[item.type] = item.product;
			app.showMainView();
		} );
	},
	
	showCartView:function() {
		console.log('displaying cart view');
		
		var total = shopify.total();
		var products = shopify.listCart();
		// console.log(products, products.length)
		for (var i = 0; i < products.length; i++) {
			products[i].index = i;
			// console.log(i)
		}
		// console.log(products)
		
		
		var data = {products:products, item_count:products.length, total:total};
		app.renderView('cart', data);
		
		$('.back').click( app.showMainView );
		$('.checkout').click( function(e){
			console.log('checking out');
			// shopify.checkout();
			
			window.plugins.childBrowser.showWebPage('http://apple.com');
		} );
		$('.cart-item button').click( function(e) {
			var uid = $(this).attr('data-id');
			console.log(uid)
			shopify.removeFromCart(uid);
			app.showCartView();
		});
	}
};