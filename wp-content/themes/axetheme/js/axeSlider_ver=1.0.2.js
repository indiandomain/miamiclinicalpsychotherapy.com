/*
 *
 * axeSlider.js created by axe.. free to use and distribute.. no pun intended.. no warranty as well :D ..
 *
 */
 ;
 (function($)
 {
 	$.fn.axeSlider = function(options)
 	{
 		var opts = $.extend({ }, $.fn.axeSlider.defaults, options);
 		opts['id'] = $(this).attr('id');

 		this.css({ 'width' : opts['w'] , 'height' : opts['h'] });

 		var t = $('#' + opts['id']);
 		var l = $('.axeSlides', t);

 		setupaxeSlider(t, l, opts);

 		if (parseInt(opts['auto']) === 1)
 		{
 			$(this).hover(function()
 			{
 				clearTimeout(opts['tvar']);
 			}, function()
 			{
 				opts['tvar'] = setTimeout(function()
 				{
 					nextaxeSlide(t, l, opts);
 				}, opts['t']);
 			});
 		}

 		$('#nextaxeslidearrow',t).click(function(e){
 			e.preventDefault();
 			opts['isnext'] = 1;
 			clearTimeout(opts['tvar']);
 			switch (opts['m'])
 			{

 				case 'ltr':
 				opts['m'] = 'rtl';
 				break;
 				case 'ltl':
 				opts['m'] = 'rtr';
 				break;
 			}

 			nextaxeSlide(t, l, opts);
 		});

 		$('#prevaxeslidearrow',t).click(function(e){
 			e.preventDefault();
 			opts['isnext'] = 0;
 			clearTimeout(opts['tvar']);
 			switch (opts['m'])
 			{
 				case 'rtl':
 				opts['m'] = 'ltr';
 				break;
 				case 'rtr':
 				opts['m'] = 'ltl';
 				break;
 			}
 			nextaxeSlide(t, l, opts);
 		});
 		$('#axeslidearrow',t).hover(function(){
 			clearTimeout(opts['tvar']);
 		},function(){

 		});

 		return this;
 	};

 	$.fn.axeSlider.defaults =
 	{ 
 		id : 'Slider1' , 
 		cslide : 0 , 
 		nslide : 1 , 
 		pslide : -1 ,
 		tslides : 0 , 
 		isnext:1,
 		lock:0,
 		tvar : '' ,
 		w : 600 ,/* Main div and images width */
 		h : 350 ,/* Main div and images height */
 		m : 'fade' ,/* Animation mode.. it can be ltr,rtl,ttb,btt,fade */
 		i : 1000 ,/* Animation in time */
 		o : 1500 ,/* Animation out time */
 		t : 5000 ,/* Slide duration */
 		shp : 0 ,/* Show(1) Hide(0) Play/Pause icons */
 		pl : 'images/play.png' ,/* Playing Icon source */
 		pa : 'images/pause.png' ,/* Pause Icon source */
 		pag : 1 ,/* Show(1)/Hide(0) Pagination */
 		pagstyle : 'axeDefaultNav' , 
 		ac : 1 ,/* Allow(1), Disallow(0) navigation click action */
 		app : 0 ,/* Allow(1) Disallow(0) on mouse over and out play and pause */
 		ezing : 'linear' ,/* Easing effect */
 		auto : 1 /* Allow auto play */

 	};

 	function setupaxeSlider(t, l, opts)
 	{
 		opts['tslides'] = l.length;
 		opts['pslide'] = opts['tslides'] - 1;
 		/* opts['tvar'] = 't' + opts['id']; */
 		firstSlide(t, l, opts);
 		var di = axelayersDelay($(l[0]),opts);
 		if (parseInt(opts['pag']))
 		{
 			setupaxeSlidesNav(t, l, opts);
 			setaxeCurrentNav(t, 0);
 		}
 		if (parseInt(opts['auto']) === 1)
 		{
 			opts['tvar'] = setTimeout(function()
 			{
 				nextaxeSlide(t, l, opts);
 			}, di + opts['t']);
 		}
 	}

	/*
	 * function handles layer animation and returns a delay time for the
	 * main slider
	 */
	 function axeGalleryLayerAnimation(ds,opts)
	 {
	 	var di = 0;
	 	/* each layer function that handles its animation */
	 	ds.each(function()
	 	{
			/*
			 * fetch the data attribute of the layer. Animation duration =>
			 * dd[0] Initial state of layer => dd[1] Final state of layer =>
			 * dd[2]
			 */
			 var dd = $(this).attr('data').split('|');

			 /* get initial state of layer */
			 var cssProperties = getAxeCss(dd[1]);

			 /* set initial state of layer */
			 $(this).removeAttr('style').css(cssProperties);

			 /* get animation properties */
			 var animationProperties = getAxeCss(dd[2]);

			 /* animation duration and delay calculation */
			 var durdelay = dd[0].split(':');
			 var dur = parseInt(durdelay[0]);
			 var del = 0;

			 /* easing */
			 var ezing = dd[3];

			 /* return animation properties */
			 var returnanimationProperties = getAxeCss(dd[4]);


			 if (durdelay.length == 1)
			 {
			 	del = dur;
			 }
			 else
			 {
			 	del = parseInt(durdelay[1]);
			 }

			 /* return animation duration and delay calculation */
			 var rdurdelay = dd[5].split(':');
			 var rdur = parseInt(rdurdelay[0]);
			 var rdel = 0;
			 if (rdurdelay.length == 1)
			 {
			 	rdel = rdur;
			 }
			 else
			 {
			 	rdel = parseInt(rdurdelay[1]);
			 }

			 /* layers animation */
			 $(this).delay(del).show()
			 .animate(animationProperties, dur,ezing,function(){
			 	/* Wapsi Animation Here */
			 	$(this).delay(rdel).animate(returnanimationProperties, rdur,ezing,function(){
			 		$(this).hide();
			 	});
			 });				

			 di = di > del + dur ? di : del + dur;
			});
return di;
}

	/*
	 * creates an array for css() and animate() functions
	 */
	 function getAxeCss(dd)
	 {
	 	var properties = { }
	 	var anprops = dd.split(',');
	 	for (var api = 0; api < anprops.length; api++)
	 	{
	 		var anp = anprops[api].split(':');
	 		properties[anp[0]] = anp[1];
	 	}
	 	return properties;
	 }
	/*
	 * Hide Current Slide Layers On Out 
	 * ltc is the layer container
	 */
	 function axelayerHide(ltc){
	 	$('div.axelayerSlideCaps div', ltc).removeAttr('style').hide().css('left',
	 		'-100%');
	 }

	 /*
	  * Get all layers and calculate the delay
	  */
	  function axelayersDelay(ltc,opts){
	  	var di = 0;
	  	/* get all layers */
	  	var ds = $('div.axelayerSlideCaps div', ltc);
	  	if(ds.length){
	  		/*ds.css({'left':'-100%','top':'0','position':'absolute'});*/
	  		/* Call Layer animations */
	  		di = axeGalleryLayerAnimation(ds,opts);	

	  	}
	  	return di;
	  }

	  function firstSlide(t, l, opts)
	  {
	  	var lft = '100%';

	  	switch (opts['m'])
	  	{

	  		case 'ltr':
	  		case 'ltl':
	  		$(l[0]).css({ 'left' : '-100%' , 'opacity' : 1 })
	  		.animate({ 'left' : '0px' }, opts['i'],
	  			opts['ezing']).addClass('axecurrentslide');
	  		break;
	  		case 'rtl':
	  		case 'rtr':
	  		$(l[0]).css({ 'left' : '100%' , 'opacity' : 1 })
	  		.animate({ 'left' : '0px' }, opts['i'],
	  			opts['ezing']).addClass('axecurrentslide');
	  		break;
	  		case 'fade':
	  		default:
	  		$(l[0]).addClass('axecurrentslide');
	  		break;
	  	}
	  }

	  function nextaxeSlide(t, l, opts)
	  {
	  	switch (opts['m'])
	  	{

	  		case 'ltr':
	  		case 'ltl':
	  		ltrAnimation(t, l, opts);
	  		break;
	  		case 'rtl':
	  		case 'rtr':
	  		rtlAnimation(t, l, opts);
	  		break;
	  		case 'fade':
	  		default:
	  		fadeAnimation(t, l, opts);
	  		break;
	  	}
	  }

	  function fadeAnimation(t, l, opts)
	  {
	  	if(opts['lock'] == 0){
	  		opts['lock'] = 1;
	  		$(l[opts['cslide']]).stop(true,true).fadeTo(opts['o'], 0, opts['ezing'],function(){
	  			axelayerHide(this);
	  		}).removeClass('axecurrentslide');
	  		if(opts['isnext'] == 0){
	  			opts = calcPrevaxeSlide(opts);
	  			opts['isnext'] = 1;
	  		}
	  		setaxeCurrentNav(t, opts['nslide']);
	  		$(l[opts['nslide']]).stop().css({ 'left' : '0px' }).fadeTo(
	  			opts['i'], 1, opts['ezing'], function()
	  			{
	  				var di = axelayersDelay(this,opts);
	  				if(opts['isnext'] == 1){
	  					opts = calcNextaxeSlide(opts);	
	  				}else{
	  					opts = calcPrevaxeSlide(opts);
	  				}
	  				opts['lock'] = 0;

	  				if (parseInt(opts['auto']) === 1)
	  				{
	  					opts['tvar'] = setTimeout(function()
	  					{
	  						nextaxeSlide(t, l, opts);
	  					}, di + opts['t']);
	  				}
	  			}).addClass('axecurrentslide');
	  	}
	  }

	  function ltrAnimation(t, l, opts)
	  {
	  	if(opts['lock']==0){
	  		opts['lock'] = 1;
	  		var lft = '100%';
	  		if(opts['m'] == 'ltl'){
	  			lft = '-' + lft;
	  		}
	  		$(l[opts['cslide']]).stop(true,true).animate({ 'left' : lft },
	  			opts['o'], opts['ezing'],function(){
	  				axelayerHide(this);
	  			}).removeClass('axecurrentslide');
	  		if(opts['isnext'] == 0){
	  			opts = calcPrevaxeSlide(opts);
	  			opts['isnext'] = 1;
	  		}
	  		setaxeCurrentNav(t, opts['nslide']);
	  		$(l[opts['nslide']]).stop().css(
	  			{ 'left' : '-100%' , 'opacity' : 1 }).animate(
	  			{ 'left' : '0px' }, opts['i'], opts['ezing'], function()
	  			{
	  				var di = axelayersDelay(this,opts);
	  				if(opts['isnext'] == 1){
	  					opts = calcNextaxeSlide(opts);	
	  				}else{
	  					opts = calcPrevaxeSlide(opts);
	  				}
	  				opts['lock'] = 0;
	  				if (parseInt(opts['auto']) === 1)
	  				{
	  					opts['tvar'] = setTimeout(function()
	  					{
	  						nextaxeSlide(t, l, opts);
	  					}, di + opts['t']);
	  				}
	  			}).addClass('axecurrentslide');
	  		}
	  	}

	  	function rtlAnimation(t, l, opts)
	  	{
	  		if(opts['lock'] == 0){
	  			opts['lock'] = 1;
	  			var lft = '100%';
	  			if(opts['m'] == 'rtr'){
	  				lft = '-' + lft;
	  			}
	  			$(l[opts['cslide']]).stop(true,true).animate({ 'left' : '-100%' },
	  				opts['o'], opts['ezing'],function(){
	  					axelayerHide(this);
	  				}).removeClass('axecurrentslide');
	  			if(opts['isnext'] == 0){
	  				opts = calcPrevaxeSlide(opts);
	  				opts['isnext'] = 1;
	  			}
	  			setaxeCurrentNav(t, opts['nslide']);
	  			$(l[opts['nslide']]).stop().css(
	  				{ 'left' : lft , 'opacity' : 1 }).animate(
	  				{ 'left' : '0px' }, opts['i'], opts['ezing'], function()
	  				{
	  					var di = axelayersDelay(this,opts);

	  					if(opts['isnext'] == 1){
	  						opts = calcNextaxeSlide(opts);	
	  					}else{
	  						opts = calcPrevaxeSlide(opts);
	  					}
	  					opts['lock'] = 0;
	  					if (parseInt(opts['auto']) === 1)
	  					{
	  						opts['tvar'] = setTimeout(function()
	  						{
	  							nextaxeSlide(t, l, opts);
	  						}, di+opts['t']);

	  					}
	  				}).addClass('axecurrentslide');
	  			}
	  		}

	  		function calcNextaxeSlide(opts)
	  		{
	  			opts['cslide'] = opts['cslide'] + 1;
	  			opts['pslide'] = opts['pslide'] + 1;
	  			opts['nslide'] = opts['nslide'] + 1;
	  			if (opts['cslide'] >= opts['tslides'])
	  			{
	  				opts['cslide'] = 0;
	  			}
	  			if (opts['pslide'] >= opts['tslides'])
	  			{
	  				opts['pslide'] = 0;
	  			}
	  			if (opts['nslide'] >= opts['tslides'])
	  			{
	  				opts['nslide'] = 0;
	  			}
	  			return opts;
	  		}
	  		function calcPrevaxeSlide(opts)
	  		{
	  			opts['nslide'] = opts['cslide'] > 0 ? opts['cslide'] - 1 : opts['tslides'] - 1;
	  			opts['cslide'] = opts['nslide'] - 1 >= 0 ? opts['nslide'] - 1 : opts['tslides'] - 1;
	  			opts['pslide'] = opts['nslide'] +1 >= opts['tslides'] ? 0 : opts['nslide'] +1 ;
	  			
	  			return opts;     
	  		}

	  		function setupaxeSlidesNav(t, l, opts)
	  		{
	  			var nd = document.createElement('div');
	  			$(nd).attr("id", "nav" + opts['id']);
	  			$(nd).addClass('dNav');
	  			for (var count = 0; count < l.length; count++)
	  			{
	  				var anc = document.createElement('a');
	  				$(anc).attr("href", "#");
	  				$(anc)
	  				.addClass(
	  					'dNavAnc axetransition ' + opts['pagstyle']);
	  				switch (opts['pagstyle'])
	  				{
	  					case 'axeImagedNav':
	  					var mdiv = document.createElement("div");
	  					mdiv.style.backgroundImage =
	  					$(l[count]).css('background-image');
	  					mdiv.className = 'axetransition';
	  					$(anc).append(mdiv);
	  					break;
	  					default:
	  					$(anc).html(count + 1);
	  					break;
	  				}

	  				$(anc).appendTo($(nd));

	  			}
	  			if (!$('#nav' + opts['id'], t).length)
	  			{
	  				$(nd).appendTo(t);
	  			}

	  			$('.dNavAnc', t).click(
	  				function(e)
	  				{
	  					e.preventDefault();
	  					if(opts['lock'] == 0){
	  						opts['lock'] = 1;
	  						clearTimeout(opts['tvar']);
	  						var i = $('.dNavAnc', t).index($(this));
	  						setaxeCurrentNav(t, i);
	  						$(l[opts['cslide']]).stop().fadeTo(opts['o'], 0,function(){
	  							axelayerHide(this);
	  						}).removeClass('axecurrentslide').css(
	  						{ 'left' : '-100%' });
	  						opts['cslide'] = i;
	  						opts['pslide'] =
	  						i - 1 >= 0 ? i - 1 : opts['tslides'] - 1;
	  						opts['nslide'] = i + 1 >= opts['tslides'] ? 0 : i + 1;
	  						var di = axelayersDelay($(l[opts['cslide']]),opts);
	  						$(l[opts['cslide']]).stop().css(
	  							{ 'left' : '0' , 'opacity' : 0 }).fadeTo(opts['i'],
	  							1,function(){
	  								opts['lock'] = 0;
	  							}).addClass('axecurrentslide');
	  						}
	  					});
	  			$('.dNavAnc', t).hover(function()
	  			{
	  				clearTimeout(opts['tvar']);
	  			}, function()
	  			{
	  			});
	  		}

	  		function setaxeCurrentNav(t, i)
	  		{
	  			$('.dNavAnc', t).removeClass('activeNav');
	  			$($('.dNavAnc', t)[i]).addClass('activeNav');
	  		}

	  		/* AXe Blinds Gallery */
	  		$.fn.axeBlinds = function(options)
	  		{
	  			var opts = $.extend({ }, $.fn.axeBlinds.defaults, options);
	  			opts['id'] = $(this).attr('id');

	  			this.css({ 'width' : opts['w'] , 'height' : opts['h'] });

	  			var t = $('#' + opts['id']);
	  			var l = $('.axeblindsli', t);
	  			setupaxeBlinds(t, l, opts);

	  			$(this).hover(function()
	  			{
	  				clearTimeout(opts['tvar']);
	  			}, function()
	  			{

	  			});

	  			l.hover(function()
	  			{
	  				if (parseInt(opts['app']) == 0)
	  				{

	  					var xt = 0;
	  					clearTimeout(opts['tvar']);
	  					if (!$(this).hasClass('axeblindsactive'))
	  					{
	  						opts['app'] = 0;

	  						var i = l.index($(this));
	  						/* opts['pslide'] = opts['cslide']; */
	  						opts['nslide'] = i;
	  						/* xt = opts['auto'] */;
	  						/* opts['auto'] = 0; */
	  						nextaxeBlinds(t, l, opts);
	  						/* opts['nslide'] = i; */
	  						/* opts = calcNextaxeSlide(opts); */
	  						/* opts['auto'] = xt; */
	  					}
	  				}
	  				clearTimeout(opts['tvar']);

	  			}, function()
	  			{
	  				if (parseInt(opts['auto']) == 1)
	  				{
	  					opts['tvar'] = setTimeout(function()
	  					{
	  						nextaxeBlinds(t, l, opts);
	  					}, opts['t']);
	  				}
	  			});

	  			return this;
	  		};

	  		function setupaxeBlinds(t, l, opts)
	  		{
	  			opts['tslides'] = l.length;
	  			opts['pslide'] = opts['tslides'] - 1;
	  			/* opts['tvar'] = 't' + opts['id']; */

	  			if (parseInt(opts['auto']) == 1)
	  			{
	  				opts['tvar'] = setTimeout(function()
	  				{
	  					nextaxeBlinds(t, l, opts);
	  				}, opts['t']);
	  			}
	  		}

	  		function nextaxeBlinds(t, l, opts)
	  		{
	  			clearTimeout(opts['tvar']);
	  			/* hiding current slide */
	  			$(l).stop().animate({ 'width' : opts['inactw'] + '%' },
	  				opts['o'], opts['ezing'], function()
	  				{

	  				}).removeClass('axeblindsactive');
	  			l.removeClass('axeblindsactive');
	  			/* displaying next slide */
	  			$(l[opts['nslide']]).stop().animate(
	  				{ 'width' : opts['actw'] + '%' }, opts['i'], opts['ezing'],
	  				function()
	  				{
	  					if (parseInt(opts['auto']) == 1)
	  					{
	  						opts = calcNextaxeSlide(opts);
	  						opts['tvar'] = setTimeout(function()
	  						{
	  							nextaxeBlinds(t, l, opts);
	  						}, opts['t']);

	  					}
	  					opts['app'] = 0;
	  				}).addClass('axeblindsactive');
	  		}

	  		function axeBlindsHover(t, l, opts)
	  		{

	  		}

	  		$.fn.axeBlinds.defaults =
	  		{ 
	  			id : 'axeBlinds1' , 
	  			cslide : 0 , 
	  			nslide : 1 , 
	  			pslide : -1 ,
	  			tslides : 0 , 
	  			tvar : '' , 
	  			w : 600 ,/* Main div and images width */
	  			h : 350 ,/* Main div and images height */
	  			m : 'fade' ,/* Animation mode.. it can be ltr,rtl,ttb,btt,fade */
	  			i : 1000 ,/* Animation in time */
	  			o : 1500 ,/* Animation out time */
	  			t : 5000 ,/* Slide duration */
	  			shp : 0 ,/* Show(1) Hide(0) Play/Pause icons */
	  			pl : 'images/play.png' ,/* Playing Icon source */
	  			pa : 'images/pause.png' ,/* Pause Icon source */
	  			pag : 1 ,/* Show(1)/Hide(0) Pagination */
	  			pagstyle : 'axeDefaultNav' , 
	  			ac : 1 ,/* Allow(1),Disallow(0) navigation click action */
	  			app : 0 ,/* Allow(1) Disallow(0) on mouse over and out play and pause */
	  			ezing : 'linear' ,/* Easing effect */
	  			inactw : 6 , /* Inactive width */
	  			actw : 80 , /* Active width */
	  			auto : 1 /* Allow auto play */

	  		};

	  	})(jQuery);

/**
 * AXe Carousel.js by AXe
 */
 ;
 (function($)
 {
 	$.fn.axeCarousel = function(options)
 	{
 		var opts = $.extend({ }, $.fn.axeCarousel.defaults, options);
 		var t = $(this);
 		opts['id'] = t.attr('id');
 		opts['h'] = t.height();
 		opts['w'] = t.width();
 		this.css({
 			/* 'height' : opts['h'], */
 		/*'overflow' : 'hidden' ,*/ /*'position' : 'relative'*/ });
 		/*$('.')*/
 		
 		var l = $('.' + opts['childclass'], t);

 		setupaxeCarousel(t, l, opts);

 		t.hover(function()
 		{
 			clearTimeout(opts['tvar']);
 		}, function()
 		{
 			/*if(opts['autoplay']){
 				opts['tvar'] = setTimeout(function()
 				{
 					nextaxeCarousel(t, l, opts);
 				}, opts['t']);
 			}*/
 		});

 		$('.axecarouselarrows',t).hover(function(){
 			clearTimeout(opts['tvar']);
 		},function(){
 			
 		});
 		$('.axecarouselnext',t).click(function(e){
 			e.preventDefault();
 			opts['dir'] = 'rev';
 			clearTimeout(opts['tvar']);
 			nextaxeCarousel(t, l, opts);
 		});

 		$('.axecarouselback',t).click(function(e){
 			e.preventDefault();
 			opts['dir'] = 'norm';
 			clearTimeout(opts['tvar']);
 			nextaxeCarousel(t, l, opts);
 		});

 		return this;
 	};

 	$.fn.axeCarousel.defaults =
 	{ 
 		id : 'axeCarousel1' , 
 		tvar : '' , 
 		h : 500 ,/*  Main div height  */
 		lock:0,
 		i : 800 , /* Animation in time */
 		o : 800 , /* Animation out time */
 		t : 1000 , /* Slide duration */
 		mode : 'vertical' ,/* mode: vertical / horizontal */
 		app : 0 , /*  Allow(1) Disallow(0) on mouse over and out play and pause */
 		childcontainer : 'axecarouselitemcontainer' ,
 		childclass : 'axecarouselitem' ,
 		targetid:'bigimgtarget', /* Target element id where to show big image */
 		bigimgclass:'featuredimg', /* Class of the element from where to pick source */
 		showbigimg:0, /* Toggle the show big image property */
 		bigimgsrc:'rel', /* Source attribute, Ideally img's src attribute but anyother can also be used like data and rel etc */
 		bislide:0, /* Big img slide index */
 		tslides : 1 , 
 		cslide : 0 ,
 		dir: 'norm',
 		autoplay:1,
 		ezing : 'linear'/* Easing effect */

 	};

 	function setupaxeCarousel(t, l, opts)
 	{
 		l.css({ 'position' : 'relative' });
 		var ch = 0;
 		var cdh = 0;
 		var df = 0;
 		var len = l.length;
 		if (len)
 		{
 			
 			switch (opts['mode'])
 			{
 				case 'vertical':
 				ch = t.height();
 				cdh = $(l[0]).outerHeight(true);
 				df = Math.ceil(cdh / ch);
 				opts['tslides'] = df;
 				$('.' + opts['childcontainer'], t).css(
 					{ 'height' : (cdh * len) + 'px' ,
 					'width' : t.width() + 'px' ,
 					'position' : 'relative' });
 				break;
 				case 'horizontal':
 				default:
 				ch = t.width();
 				cdh = $(l[0]).outerWidth(true);
 				/*console.log(ch + ' ' + cdh);*/
 				df = Math.ceil(ch / cdh);
 				$('.' + opts['childcontainer'], t).css(
 					{ 'width' : (cdh * len) + 'px' ,
 					'height' : t.height() + 'px' ,
 					'position' : 'relative' });

 				break;

 			}
 			opts['tslides'] = len;
 			showCarouselBigImage(t,l,opts,0);
 		}

 	}

 	function nextaxeCarousel(t, l, opts)
 	{
 		
 		switch (opts['mode'])
 		{
 			case 'vertical':
 			switch(opts['dir']){
 				case 'rev':
 				axeRevVerticalCarousel(t, l, opts);
 				break;
 				case 'norm':
 				default:
 				axeVerticalCarousel(t, l, opts);	
 				break;
 			} 		 			
 			break;
 			case 'horizontal':
 			default:
 			switch(opts['dir']){
 				case 'rev':
 				axeRevHorizontalCarousel(t, l, opts);
 				break;
 				case 'norm':
 				default:
 				axeHorizontalCarousel(t, l, opts);	
 				break;
 			} 			
 			break;
 		}
 	}

 	function axeVerticalCarousel(t, l, opts)
 	{

 		if (parseInt(opts['tslides']) > 1)
 		{
 			if(opts['lock'] == 0){
 				opts['lock'] = 1;
 				var ti = 0;
 				var td = opts['i'];
 				if (parseInt(opts['cslide']) >= parseInt(opts['tslides']))
 				{
 					opts['cslide'] = 0;
 					ti = (-1 * (parseInt($(l[opts['cslide']]).outerHeight(true))));
 				}
 				else
 				{
 					ti = (-1 * (parseInt($(l[opts['cslide']]).outerHeight(true))));
 					opts['cslide'] = opts['cslide'] + 1;
 				}

 				$('.' + opts['childcontainer'], t).stop(true,true).animate(
 					{ 'top' : ti + 'px' }, td, opts['ezing'], function()
 					{

 						var str = opts['cslide'] - 1;
 						if (str < 0)
 						{
 							str = opts['tslides'] - 1;
 						}

 						if (parseInt(opts['cslide']) >= parseInt(opts['tslides']))
 						{
 							opts['cslide'] = 0; 
 						}
 						
 						/* Append the first slide to last */
 						$(this).append($(l[str]));
 						/* Adjust Left */
 						$(this).css({ 'top' : '0px' });
 						
 						/*opts['lock'] = 0;*/

 						showCarouselBigImage(t,l,opts,0);
 						
 					});
 			}
 		}
 	}

 	function axeRevVerticalCarousel(t, l, opts)
 	{
 		if (parseInt(opts['tslides']) > 1)
 		{
 			if(opts['lock'] == 0){
 				opts['lock'] = 1;

 				var ti = parseInt($(l[opts['cslide']]).outerHeight(true));
 				var td = opts['i'];
 				var ct = $('.' + opts['childcontainer'], t);
 				/*console.log(opts['cslide'] + ' <-- c t--> ' + opts['tslides']);*/

 				opts['cslide'] = opts['cslide'] - 1;




 				var str = opts['cslide'];
 				if (str < 0)
 				{
 					opts['cslide'] =  opts['tslides'] - 1;
 					str = opts['cslide'];
 				}else{
 					/*opts['cslide'] =  opts['cslide'] - 1;*/
 				}

 				ct.prepend($(l[opts['cslide']])).css({ 'top' : '-' + ti + 'px' }).stop(true,true).animate(
 					{ 'top' : 0 + 'px' }, td, opts['ezing'], function()
 					{
 						/* Adjust Left */
 						
 						/*opts['lock'] = 0;*/
 						showCarouselBigImage(t,l,opts,0);
 					});
 			}
 		}
 	}

 	function axeHorizontalCarousel(t, l, opts)
 	{
 		if (parseInt(opts['tslides']) > 1)
 		{
 			if(opts['lock'] == 0){
 				opts['lock'] = 1;
 				var ti = 0;
 				var td = opts['i'];
 				if (parseInt(opts['cslide']) >= parseInt(opts['tslides']))
 				{
 					opts['cslide'] = 0;
 					ti = (-1 * (parseInt($(l[opts['cslide']]).outerWidth(true))));
 				}
 				else
 				{
 					ti = (-1 * (parseInt($(l[opts['cslide']]).outerWidth(true))));
 					opts['cslide'] = opts['cslide'] + 1;
 				}
 				
 				$('.' + opts['childcontainer'], t).stop(true,true).animate(
 					{ 'left' : ti + 'px' }, td, opts['ezing'], function()
 					{

 						var str = opts['cslide'] - 1;
 						if (str < 0)
 						{
 							str = opts['tslides'] - 1;
 						}

 						if (parseInt(opts['cslide']) >= parseInt(opts['tslides']))
 						{
 							opts['cslide'] = 0; 
 						}
 						
 						
 						/* Append the first slide to last */
 						$(this).append($(l[str]));
 						/* Adjust Left */
 						$(this).css({ 'left' : '0px' });

 						/*opts['lock'] = 0;*/
 						showCarouselBigImage(t,l,opts,0);
 					});
 			}
 		}
 	}

 	function axeRevHorizontalCarousel(t, l, opts)
 	{
 		if (parseInt(opts['tslides']) > 1)
 		{
 			if(opts['lock'] == 0){
 				opts['lock'] = 1;

 				var ti = parseInt($(l[opts['cslide']]).outerWidth(true));
 				var td = opts['i'];
 				var ct = $('.' + opts['childcontainer'], t);
 				/*console.log(opts['cslide'] + ' <-- c t--> ' + opts['tslides']);*/

 				opts['cslide'] = opts['cslide'] - 1;




 				var str = opts['cslide'];
 				if (str < 0)
 				{
 					opts['cslide'] =  opts['tslides'] - 1;
 					str = opts['cslide'];
 				}else{
 					/*opts['cslide'] =  opts['cslide'] - 1;*/
 				}

 				
 				ct.prepend($(l[opts['cslide']])).css({ 'left' : '-' + ti + 'px' }).stop(true,true).animate(
 					{ 'left' : 0 + 'px' }, td, opts['ezing'], function()
 					{
 						/* Adjust Left */
 						
 						/*opts['lock'] = 0;*/
 						showCarouselBigImage(t,l,opts,0);
 					});
 			}
 		}
 	}

 	function showCarouselBigImage(t,l,opts,d){
 		//targetid:'bigimgtarget', /* Target element id where to show big image */
 		//bigimgclass:'featuredimg', /* Class of the element from where to pick source */
 		//showbigimg:1, /* Toggle the show big image property */
 		//bigimgsrc:'rel', /* Source attribute, Ideally img's src attribute but anyother can also be used like data and rel etc */
 		//bislide:0 /* Big img Slide Index */
 		if(parseInt(opts['showbigimg'])){
 			var i = $($('.' + opts['bigimgclass'], t)[d]);
 			var da = i.attr(opts['bigimgsrc']);
 			$('#'+opts['targetid']).animate({
 				'background-position-x': '-1000px'
 			},opts['o'],'linear',function(){
 				$('#'+opts['targetid']).css({'background-image':'url('+da+')'}).animate({
 					'background-position-x': '0px'
 				},opts['i'],'linear');
 				opts['lock'] = 0;
 				if(opts['autoplay']){
 					opts['tvar'] = setTimeout(function()
 					{
 						nextaxeCarousel(t, l, opts);
 					}, opts['t']);
 				}

 			});
 			
 		}else{
 			opts['lock'] = 0;
 			if(opts['autoplay']){
 				opts['tvar'] = setTimeout(function()
 				{

 					nextaxeCarousel(t, l, opts);
 				}, opts['t']);
 			}
 		}
 	}

 })(jQuery);
 ;

/**
 * AXe Full Width.js by AXe
 */
 ;
 (function($)
 {
 	$.fn.axeFullWidth = function(options)
 	{
 		var opts = $.extend({ }, $.fn.axeFullWidth.defaults, options);
 		var t = $(this);
 		opts['id'] = t.attr('id');
 		opts['h'] = '100%';
 		opts['w'] = '100%';
 		this.css({
 			'height' : opts['h'], 'width': opts['w'],'overflow' : 'hidden' , 'position' : 'fixed','z-index':-1,'top':'0px','left':'0px' });

 		var l = $('.axefwgli', t);

 		setupaxeFullWidth(t, l, opts);


 		return this;
 	};




 	$.fn.axeFullWidth.defaults =
 	{ 
 		id : 'axeFullWidth1' , 
 		cslide : 0 , 
 		nslide : 1 , 
 		pslide : -1 ,
 		tslides : 0 , 
 		tvar : '' ,
 		i : 1000 , /* Animation in time */
 		o : 1200 , /* Animation out time */
 		t : 6000 , /* Slide duration */
 		auto:1,
 		app : 0 , /* Allow(1) Disallow(0) on mouse over and out play and pause */
 		lock:0,
 		ezing : 'linear'/* Easing effect */

 	};

 	function setupaxeFullWidth(t, l, opts)
 	{

 		opts['tslides'] = l.length;
 		opts['pslide'] = opts['tslides'] - 1;
 		/* opts['tvar'] = 't' + opts['id']; */

 		if (parseInt(opts['auto']) == 1)
 		{
 			opts['tvar'] = setTimeout(function()
 			{
 				nextaxeFullWidth(t, l, opts);
 			}, opts['t']);
 		}

 		$('#fullwidthnext').click(function(e){
 			e.preventDefault();
 			nextaxeFullWidth(t, l, opts);
 		});

 		$('#fullwidthprev').click(function(e){
 			e.preventDefault();
 			prevaxeFullWidth(t, l, opts);
 		});

 	}

 	function nextaxeFullWidth(t, l, opts)
 	{	
 		if(!parseInt(opts['lock'])){
 			opts['lock'] = 1;	
 			clearTimeout(opts['tvar']);
 			$(l[opts['cslide']]).stop().fadeTo(opts['o'], 0, opts['ezing'])
 			.removeClass('axecurrentfullslide');
 			/*setaxeCurrentNav(t, opts['nslide']);*/
 			$(l[opts['nslide']]).stop().css({ 'left' : '0px' }).fadeTo(
 				opts['i'], 1, opts['ezing'], function()
 				{
 					opts = calcNextaxeSlide(opts);
 					if (parseInt(opts['auto']) === 1)
 					{
 						opts['tvar'] = setTimeout(function()
 						{
 							nextaxeFullWidth(t, l, opts);
 						}, opts['t']);
 					}
 					opts['lock'] = 0;
 					/*console.log(opts)*/;
 				}).addClass('axecurrentfullslide');

 		}
 	}

 	function prevaxeFullWidth(t, l, opts)
 	{
 		if(!parseInt(opts['lock'])){
 			opts['lock'] = 1;
 			clearTimeout(opts['tvar']);
 			$(l[opts['cslide']]).stop().fadeTo(opts['o'], 0, opts['ezing'])
 			.removeClass('axecurrentfullslide');
 			/*setaxeCurrentNav(t, opts['nslide']);*/
 			$(l[opts['pslide']]).stop().css({ 'left' : '0px' }).fadeTo(
 				opts['i'], 1, opts['ezing'], function()
 				{
 					opts = calcPrevaxeSlide(opts);
 					if (parseInt(opts['auto']) === 1)
 					{
 						opts['tvar'] = setTimeout(function()
 						{
 							prevaxeFullWidth(t, l, opts);
 						}, opts['t']);
 					}
 					opts['lock'] = 0;
 					/*console.log(opts);*/
 				}).addClass('axecurrentfullslide');
 		}
 	}

 	function calcNextaxeSlide(opts)
 	{
 		opts['cslide'] = opts['cslide'] + 1;
 		opts['pslide'] = opts['pslide'] + 1;
 		opts['nslide'] = opts['nslide'] + 1;
 		if (opts['cslide'] >= opts['tslides'])
 		{
 			opts['cslide'] = 0;
 		}
 		if (opts['pslide'] >= opts['tslides'])
 		{
 			opts['pslide'] = 0;
 		}
 		if (opts['nslide'] >= opts['tslides'])
 		{
 			opts['nslide'] = 0;
 		}
 		return opts;
 	}

 	function calcPrevaxeSlide(opts)
 	{
 		opts['cslide'] = opts['cslide'] - 1;
 		if (opts['cslide'] < 0)
 		{
 			opts['cslide'] = opts['tslides'] - 1;
 		}
 		opts['pslide'] = opts['cslide'] > 0 ? opts['cslide'] - 1 : opts['tslides'] - 1;
 		opts['nslide'] = opts['cslide'] + 1;

 		if (opts['nslide'] >= opts['tslides'] )
 		{             
 			opts['nslide'] = 0;         
 		}
 		return opts;     
 	}



 })(jQuery);
 ;