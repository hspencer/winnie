// js layer para prototipos WOM
// version nunjucks!
// dependencias: muchas, checar gulpfile
//

$(document).ready(function(){

	// viewport width
	var vw = window.matchMedia( "(min-width: 900px)" );

	// home womers - carrusel fill height + easter egg
	if (vw.matches) {
		vwheight = $(window).height();
 		console.log(vwheight);
 		$('#carousel-home-welcome').css('height', vwheight);
	}

	// super-mega-simple client-side form validator and form next step enabler
	function validateForm() {
		var $fields = $(".form-control:visible");
		var $thisStep = $('.formPaso-stepper:visible');
		var $nextStep = $thisStep.attr('data-nextStep');
		var $filledFields = $fields.find('input[value!=""]');
		var $emptyFields = $fields.filter(function() {
	    	return $.trim(this.value) === "";
	    });
    	function continueForm() {
	    	// apaga stepper
	    	// $('#stepper_portabilidad li').removeClass('active');
	    	// prende stepper correcto
	    	$('#stepper_portabilidad li.stepperLED-' + $nextStep).addClass('active');
	    	// deshabilita este boton
	    	$($thisStep).find('.nextStep').addClass('disabled');
	    	// oculta este paso
	    	$($thisStep).slideUp('1200');
	    	// muestra el paso siguiente
	    	$('#portateForm-' + $nextStep).slideDown('1200');
	    	// habilita el boton a paso siguiente
	    	$('#portateForm-' + $nextStep).find('.nextStep').removeClass('disabled');
	    	// anima el DOM hasta el stepper
	    	$('html, body').animate({scrollTop: $("#stepper_portabilidad").offset().top - 30}, 500);
		    // cancela form button
	    	return false;
	    }
		if (!$emptyFields.length) {
			// if form is ok...
			$('#camposvacios').slideUp();
			continueForm();
		} else {
		    console.log($emptyFields);
		    $emptyFields.parents('.form-group').addClass('invalidInput').removeClass('input-effect');
		    $filledFields.addClass('totallyValidInput');
		    console.log($filledFields);
		    $('#camposvacios').slideToggle();
		    $('html, body').animate({scrollTop: $("#camposvacios").offset().top}, 200);
		}
	}

	// run form validator on click
	$("#portateForm .nextStep").on('click', function () {
	  console.log('valida!');
	  validateForm();
	  return false;
	});

	// minilabels toggle on input focus
	$(".form-group input").focus(function () {
		$(this).siblings('.miniLabel').addClass('visible');
		$(this).parents('.form-group').addClass('active');
		$(this).removeAttr('placeholder');
	});
	$(".form-group input").blur(function () {
		$(this).parents('.form-group').toggleClass('active');
	});

	// boton de ver portabilidad tiene clase on form click
	$('.modulo-morado input').focus(function() {
		$('.btn.btn-disabled').removeClass('btn-disabled').addClass('btn-success');
	});

	// progressbars animadas (primero a 100, luego a aria-value)
	// DEPENDSON inview.js - migrar a wow quiza?
	$('.consumoBars').one('inview', function(event, isInView) {
	   	$(this).find('.progress.progress-animated').each(function() {
		  bar = $(this).children('.progress-bar');
		  value = bar.attr('aria-valuenow');
		  // hay que ponerle 5 pixeles mas porque el skew hace que se vea más cortito
		  valueOffset = '5';
		  valueWidth = (+value) + (+valueOffset);
		  bar.animate({width: "100%"}, 750).delay('200').animate({width: valueWidth + "%"}, 1600);
		});
	});

	// interacciones para el wizard de planes

		// captcha enabler
		$('#captcha .captchaLink').click(function () {
			$(this).siblings('.captchaLink').removeClass('selected');
			$(this).addClass('selected');
			return false;
		});

		// goto Next Step
		function wizardGo () {
			$currentStep = $('#wizardPlanes .wizardPlanes-pasos').filter(':visible');
  			nextStep = $currentStep.last().attr('data-nextStep');
  			$('#wizardPlanes-' + nextStep).slideDown();
  			// anima el DOM hasta el paso que viene
	    	$('html, body').animate({scrollTop: $('#wizardPlanes-' + nextStep).offset().top}, 500);
		}

		// wizard appendix - interaccion estándar
		$('#wizardPlanes .graphButton').click(function() {
			$(this).parents('.gigaMeasures').find('.graphButton').removeClass('selected');
			$(this).toggleClass('selected');
			return false;
		});

		// wizard appendix - interaccion estándar (ahora en wizard telefono que me sacaron del sombrero lol)
		$('.wizardPlanes-pasos .option').click(function() {
			$(this).parents('.wizard-appendix').find('.option').removeClass('selected');
			$(this).toggleClass('selected');
			return false;
		});

		// validacion falsa para wizardtelefonos
		$('.wizard-telefono-cuantamemoria a.option').click(function () {
			$('.wizardTelefonos-ending button').removeClass('disabled').addClass('btn-primary');
		});

		// fin wizard parte planes
		function endWizardPlanes () {
			$('.wizardPlanes-pasos:not(.pasoFinal)').slideUp();
			$('.wizardPlanes-pasos.wizard-pasoFinal').slideDown();
			$('header h3.ta-center').html('El plan más conveniente para ti es');
			$('header h4').remove();
			$('html, body').animate({scrollTop: $('header h3').offset().top}, 500);
		}

		// evt handlers
		$('#wizardPlanes a:not(.graphButton,.finWizard,.option)').click(function() {
			wizardGo();
		});
		$('#wizardPlanes a.finWizard').click(function() {
			endWizardPlanes();
		});
			// wizard appendix - validando y terminando desde el event handler (muy malo)
			$('#wizardPlanes-paso2 .wizard-appendix').last().find('.graphButton').click(function () {
				if ($('#wizardPlanes .graphButton.selected').length == 4) {
					$('#wizardPlanes-paso2').find('a.btn-default').removeClass('disabled btn-default').addClass('btn-primary morado-chicle-bg');
					$('#wizardPlanes-paso2').find('.stepStatus').html('OK, continuemos:').addClass('morado-chicle');
				}
			});

		// animando graph bars en wizard-appendix modules
		// DEPENDSON inview.js - migrar a wow quiza?
			$('.wizardPlanes-pasos .wizard-appendix .gigas-bar').one('inview', function(event, isInView) {
				$(this).addClass('visible');
			});

		// roaming bolsa selector (no pude hacerlo inline)
		$('#selectBolsa').click(function() {
			$('.roamingSelect').addClass('fadeOutLeft');
			$('.roamingSelectBolsa').addClass('show');
			return false;
		});

		// pac/pat
		$('.nav-suscribir-pac a').click(function () {
			var what = $(this).html();
			$('.suscribir-pago').hide();
			$('.suscribir-pago-' + what).show();
			return false;
		});

	// nav pills no tienen la cosa de active
	$('.pac-modal .nav-pills a').click(function (){
		$('.pac-modal .nav-pills li').removeClass('active');
		$(this).parents('li').addClass('active');
	});

	// cerrar nav si clicas afuera [desactivado – choca con el resto del js porque los selectores son super genericos]
	// $('body > *').not('nav').click(function() {
	// 	if(!$('button.navbar-toggle').hasClass('collapsed')) {
	// 		$('.navbar-toggle:visible').click();
	// 	}
	// });

	var $helpCenterFalse = $('#helpCenterFalse')
	,	$helpCenterTrue = $('#helpCenterTrue')
	,	$helpCenterFeedback = $('#helpCenterFeedback')
	,	$helpCenterFeedbackTrue = $('#helpCenterFeedbackTrue')
	,	$helpCenterFeedbackTrueDescription = $('#helpCenterFeedbackTrueDescription');


		$helpCenterFalse.on( 'click', function() {

			$helpCenterTrue.removeClass('active');
			$(this).addClass('active');
			$helpCenterFeedback.add($helpCenterFeedbackTrueDescription).removeClass('hide').addClass('show');
			$helpCenterFeedbackTrue.removeClass('show').addClass('hide');
		});

		$helpCenterTrue.on( 'click', function() {

			$helpCenterFalse.removeClass('active');
			$(this).addClass('active');
			$helpCenterFeedback.add($helpCenterFeedbackTrueDescription).removeClass('show').addClass('hide');
			$helpCenterFeedbackTrue.removeClass('hide').addClass('show');
		});


});