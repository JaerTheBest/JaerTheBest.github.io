$(document).scroll(function(){
	menuScroll();	
});

function menuScroll(){
	 if ($(this).scrollTop() >= 100) {
    	$('#t3-mainnav').addClass('fixed');
		$('.t3-wrapper').addClass('fixed-menu');
  	} else {
     $('#t3-mainnav').removeClass('fixed');
		$('.t3-wrapper').removeClass('fixed-menu');
  }
}

$(document).ready(function(){
	$('#navigation a').stop().animate({ 'marginLeft':'-200px'},1000);
		$('#navigation > li').hover(
			function () {$('a',$(this)).stop().animate({ 'marginLeft':'0'},200);},
            function () {$('a',$(this)).stop().animate({ 'marginLeft':'-200px'},200);}
        );
});

function price_full(){
	if ($('tr').is('.row_cost_full')){		
		var total = 0;
		$('.product-item').each(function( index ) {
			total = total + $(this).find('.old_pr span').text().replace(/\s+/g, '') * $(this).find('.quantity-input').val();
		})		
		$('.total_cost_full').text(total.toLocaleString());
	}
}


$(document).on('click','#byForm .options .product-field-display',function(e){
	var product;
	
	var options = '.' + $(this).data('options');
	$(this).find('.radio').each(function(index) {
		if ($(this).hasClass('check')){
			product = $(this).closest('form').find('input[name=id]').val();
			$('.category-view .ms2_product .ms2_form').each(function(index2){
				if ($(this).find('input[name=id]').val() == product){					
					$(this).find(options + ' .controls label').removeClass('check');
					$(this).find(options + ' .controls label:eq('+index+')').addClass('check');
					$(this).find(options + ' .controls label:eq('+index+')').trigger('click');
				}
			});
		}
	});
});

$('select[name="extfld_pickup"]').change(function() {
    $('#deliveries input[type="radio"][value="' + $('select[name="extfld_pickup"] option:selected').data('delivery') + '"]').trigger('click');
});

$(window).on("load", function(){
    
    if ($('#deliveries').length) $('#deliveries input[type="radio"][value="' + $('select[name="extfld_pickup"] option:selected').data('delivery') + '"]').trigger('click');
        
    SweetAlert2.initialize({
		position: 'top-end',
		toast: true,
		timer: 3000,
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
		/*
        footer: '<a href="" class="swal2-cart">Показать корзину</a><a href="" class="swal2-confirm">Продолжить покупки</a><a href="" class="swal2-error">ОК</a>',
		*/
        onBeforeOpen () {
			if ($('#byForm').hasClass('in')){//если модалка покупки в 1 клик
				$('#byForm button.close').trigger('click');
				$('.swal2-confirm').show();
				$('.swal2-cart, .swal2-error').hide();                    
			}
			/*
			if ($('#msCart').length > 0){//изменение товара в корзине			
				$('.swal2-confirm, .swal2-cart, .swal2-error').hide();
			} else{//если не корзина
				if ($('.swal2-modal').hasClass('swal2-icon-error')){//если модалка ошибки					
					$('.swal2-confirm, .swal2-cart').hide();                
					$('.swal2-error').show();
				} else{					
					if ($('#byForm').hasClass('in')){//если модалка покупки в 1 клик
						$('#byForm button.close').trigger('click');
						$('.swal2-confirm').show();
						$('.swal2-cart, .swal2-error').hide();                    
					}
				}            
			}*/
        },
    })

	/*
    $(document).on('click','.swal2-cart',function(e){
        e.preventDefault();
        window.location.href = document.location.origin+'/shop';
    });
    $(document).on('click','.swal2-confirm, .swal2-error',function(e){
        e.preventDefault();
        swal.close();
    });*/
    

    
});

/***************************/
$(document).ready(function(){

	$('.phone').inputmask({"mask": "+7(999)999-99-99"});
	
	$(".calc-r").click(function(e) {
		var h = $("#h_paint").val(),
			w = $("#w_paint").val(),
			o = $("#o_paint").val(),
			l = $("#l_paint").val();
			
		if (h && w && o && l)	{
			$("#c_paint").val(h * w / o * l);
			$("#errCalc").text("");
		}else $("#errCalc").text("Введите все данные для расчета");
	});
	$(".calc-c").click(function(e) {
		$(".calculate .calcInput").val("");
	});
	
	price_full();
	
	miniShop2.Callbacks.add('Cart.change.ajax.done', 'restrict_cart', function(e) {
		price_full();
	});
	miniShop2.Callbacks.add('Cart.remove.ajax.done', 'restrict_cart', function(e) {
		price_full();       
    });
	
	$('.modal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		var caption = button.data('caption');
		$(this).find('.modal-title').text(caption);		
	})
	
	$('#infoModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		var txt = button.data('text');
		$.post("/assets/ajaxmodal.php",{action:"getContent", txt:txt}, function(response) {
			response.success = response.success || false;
			if (response.success) {				
				$('#infoModal .modal-body').html(response.txt);				
			}
		}, 'json');
	})
	
	$('#byForm').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		var res = button.data('res');
		$.post("/assets/ajaxby.php",{action:"getContent",res:res}, function(response) {
			response.success = response.success || false;
			if (response.success) {
				$('#byForm #price').removeAttr('class');
				$('#byForm #price').addClass('msoptionsprice-cost msoptionsprice-'+res);				
				$('#byForm input[name=id]').val(res);
				$('#byForm .title').text(response.title);
				$('#byForm #price').text(response.price);
				$('#byForm .image img').attr("src", response.img);
				$('#byForm .options').html(response.options);
				//console.log(response.img);
			}
		}, 'json');		
	})	
	
	
	$(".left-category .menu > a .icon-list").click(function(e) {
		e.preventDefault();
		var item = $(this).parents('.menu').find('.sub-menu');		
		if (item.parents('.menu').hasClass('open')){
			item.slideUp();
			$(this).parents('.menu').removeClass('open');
		}else{
			item.slideDown();
			$(this).parents('.menu').addClass('open');
		}
	});
	
	$(".menu .level-box .toggler").click(function(e) {
		e.preventDefault();
		$(this).closest('li.parent').toggleClass('open', '');
	});
	

	

	//Фото юзера в личном кабинете
	/*
	$('#photo').change(function(e){   // Произошло изменение значения элемента с id = "photo"    
		if (!window.FileReader) { // Если браузер не поддерживает FileReader, то ничего не делаем
			console.log('Браузер не поддерживает File API');
			return;
		}
    
		var file = e.target.files[0]; // Получаем выбранный файл (изображение)
       
		if (!((file.type=='image/png') || (file.type=='image/jpeg'))) { // Выводим сообщение, что браузер не поддерживает указанный тип файла 
			$('#img-error').text('Загруженный файл не является изображением');
			return;
		}
    
		if (file.size>=524288) { // Выводим сообщение, что файл имеет большой размер
			$('#img-error').text('Размер файла больше чем 512Кбайт');
			return;      
		}
		$('#img-error').text('');
    
		var reader = new FileReader(); // Создаём экземпляр объекта FileReader, посредством которого будем читать файл
        $(reader).on('load', function(event){ // После успешного завершения операции чтения файла
			$('.photo-user').attr('src',event.target.result); // Указываем в качестве значения атрибута src изображения содержимое файла (картинки)
			*/
			/*
			if ($('.photo-user').width()>=$('#img-photo').height()) { // Изменяем ширину и высоту изображения
				$('.photo-user').css('height','100px');
				$('.photo-user').css('margin-left',-($('#img-photo').width()-100)/2);
			} 
			else {
				$('.photo-user').css('widht','100px');   
				$('.photo-user').css('margin-top',-($('#img-photo').height()-100)/2); 
			}*/
			/*
		});
    
		reader.readAsDataURL(file); // Запускает процесс чтения файла (изображения). После завершения чтения файла его содержимое будет доступно посредством атрибута result
	});
  
	$("#updateProfile").submit(function(e) { // Перед отправкой формы на сервер...
		if ($('#photo').val()=='') { // Проверяем значения поля photo. Если оно равно пустой строке, то данные отправляем
			return;
		}
    
		if ( (($('#img-error').text()).length>0)) { // Если элемент содержит некоторую строку (ошибки связанные с фото), то отменяем отправку формы
			e.preventDefault();
		}
	});*/
	/****************/
	
	
	$('.sliderMain').owlCarousel({
		items: 1,
        loop:true,
        nav:true,
		dots:true,
        autoplay:true,
        smartSpeed:1000,
        autoplayTimeout:20000,
		navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    });
	
	$('.sliderPopular').owlCarousel({
		items: 4,
		margin:30,
        loop:false,
        nav:true,
		dots:false,
        autoplay:true,
        smartSpeed:1000,
        autoplayTimeout:5000,
		responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:4
            }
        },
		navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
    });
	
	
});

$(document).on('click','.quantity-controls .quantity-plus',function(e){
	var input_el = $(this).parents('.addtocart-bar').find('.quantity-box input');
	var v = input_el.val() * 1 + 1;
	if (input_el.attr('data-max')) {
		if (v <= input_el.attr('data-max')) input_el.val(v)
	} else {
		input_el.val(v)
	}
	e.preventDefault();
});
$(document).on('click','.quantity-controls .quantity-minus',function(e){
	var input_el = $(this).parents('.addtocart-bar').find('.quantity-box input');
	var v = input_el.val() - 1;
	if (input_el.attr('data-min')) {
		if (v >= input_el.attr('data-min')) input_el.val(v)
	} else {
		input_el.val(v)
	}
	e.preventDefault();
});

$(document).on('click', '.cart-quantity .quantity-plus, .cart-quantity .quantity-minus', function (e) {
	var $container = $(this).closest('.ms2_form'), $count = $container.find('[name="count"]');
	$count.trigger('change');
});

$(document).on('click','.product-field-display .controls input',function(e){
	$(this).parents('.controls').find('label').removeClass('check');
	if ($(this).is(':checked')) {
		$(this).parent().addClass('check');
	}
	
	/*
	var el = $(this).closest('.product-options').find('.product-field-display');
	//console.log('e=' + el.attr('class'));
	el.each(function(index) {
		$(this).find('label').each(function(index) {			
			if ($(this).hasClass('check') && $(this).css('display') == 'none'){
				console.log('1');
			}
		});
	});
*/
	
});