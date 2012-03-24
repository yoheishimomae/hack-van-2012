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
		showMainView();
	},
	
	renderView:function(uid, data, animation) {
		data = data | {};
		
		$('body').html( Mustache.to_html(app.template[uid], data) );
	},
	
	/* View specific */
	
	showMainView:function() {
		app.renderView('main');
		
		// add event listeners here
	},
	
	showPickerView:function() {
		
	},
	
	showCartView:function() {
		
	}
		
};