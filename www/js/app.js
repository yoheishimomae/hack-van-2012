var app = {
	
	preInit:function() {
		console.log('pre-initializing');
		setTimeout(function() {
			if (navigator.userAgent.search('Mac OS X') > 0 && navigator.userAgent.search(/iphone|ipad/i) == -1)
				app.init();
			else
				document.addEventListener("deviceready", app.init, false);
		}, 250);
	},
	
	init:function() {
		console.log('initializing');
		app.loadQueue = [
			{uid:'cart', url:'tmpl-cart.html'},
			{uid:'main', url:'tmpl-main.html'},
			{uid:'picker', url:'tmpl-picker.html'}
		];
		app.template = {};
		
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
		app.showPickerView();
	},
	
	renderView:function(uid, data, animation) {
		data = data || {};
		
		$('body').html( Mustache.to_html(app.template[uid], data) );
	},
	
	/* View specific */
	
	showMainView:function() {
		console.log('displaying main view');
		
		app.renderView('main');
		
		$('.polaroid').click( function(){
			app.showPickerView();
		} );
	},
	
	showPickerView:function() {
		console.log('displaying picker view');
		var fakeData = {products:[1,2,3,4,5]};
		app.renderView('picker', fakeData);
		
		$('.back').click( app.showMainView );
		
		$('.polaroid').click( function(){
			// store image
			app.showMainView();
		} );
	},
	
	showCartView:function() {
		console.log('displaying cart view');
		
	}
		
};