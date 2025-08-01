/* global everest_forms_admin, PerfectScrollbar */
( function( $, params ) {

	// Colorpicker.
	$( document ).on( 'click', '.everest-forms-field.everest-forms-field-rating', function() {
		$( '.everest-forms-field-option-row-icon_color input.evf-colorpicker' ).wpColorPicker({
			change: function( event ) {
				var $this     = $( this ),
					value     = $this.val(),
					id        = $this.closest( '.everest-forms-field-option-row' ).data( 'field-id' ),
					$icons    = $( '#everest-forms-field-'+id +' .rating-icon svg' );
				$icons.css( 'fill', value );
			}
		});
	});

	/**
	 * Handle to open he upgrade to pro link in a new tab.
	 *
	 * @since 3.0.9.4
	 */
	$('#toplevel_page_everest-forms .wp-submenu li').each(function() {
		var link = $(this).find('a');
		if (link.text().trim() === 'Upgrade to Pro') {
			link.attr('target', '_blank');
		}
	});

	// Function to handle changes in the reporting frequency while sending the entries stat report.
	$(document).ready(function () {
		function handleReportingFrequencyChange() {
			var everest_forms_entries_reporting_frequency = $('#everest_forms_entries_reporting_frequency').val();
				if ('Weekly' !== everest_forms_entries_reporting_frequency) {
				$('#everest_forms_entries_reporting_day').closest('.everest-forms-global-settings').hide();
			} else {
				$('#everest_forms_entries_reporting_day').closest('.everest-forms-global-settings').show();
			}
		}

		// Execute the function on page load
		handleReportingFrequencyChange();



		// Add an event listener for changes and on the click in the reporting frequency
		$(document).on('change click', '#everest_forms_entries_reporting_frequency', handleReportingFrequencyChange);


		$('#evf-form-listing__screen-options').on('click', function() {
			$("#show-settings-link").click();
		});
	});

	// Function to handle changes in the premium sidebar.
		$(document).ready(function () {
			function handlePremiumSidebar() {
				var isCheckboxChecked = $('#everest-forms-enable-premium-sidebar').is(':checked');
				localStorage.setItem('isPremiumSidebarEnabled', isCheckboxChecked);
				document.cookie = 'isPremiumSidebarEnabled=' + isCheckboxChecked + '; path=/;';
				if (isCheckboxChecked) {
					$('body').removeClass('evf-premium-sidebar-hidden').addClass('evf-premium-sidebar-show');
					$('.everest-forms-toggle-text').text('Hide Sidebar');
				} else {
					$('body').removeClass('evf-premium-sidebar-show').addClass('evf-premium-sidebar-hidden');
					$('.everest-forms-toggle-text').text('Show Sidebar');
				}
			}
			$(document).on('change', '#everest-forms-enable-premium-sidebar', handlePremiumSidebar);

		});


	// Enable Perfect Scrollbar.
	$( document ).on( 'init_perfect_scrollbar', function() {
		var nav_wrapper = $( 'nav.evf-nav-tab-wrapper' );

		if ( nav_wrapper.length >= 1 ) {
			window.evf_nav_ps = new PerfectScrollbar( 'nav.evf-nav-tab-wrapper', {
				suppressScrollY : true,
				useBothWheelAxes: true,
				wheelPropagation: true
			});
		}
	});

	// Update Perfect Scrollbar.
	window.addEventListener( 'resize orientationchange', function() {
		var resizeTimer,
			nav_wrapper = $( 'nav.evf-nav-tab-wrapper' );

		if ( nav_wrapper.length >= 1 ) {
			clearTimeout( resizeTimer );
			resizeTimer = setTimeout( function() {
				window.evf_nav_ps.update();
			}, 400 );
		}
	});

	// Trigger Perfect Scrollbar.
	$( document ).ready( function( $ ) {
		if ( 'undefined' !== typeof PerfectScrollbar ) {
			$( document ).trigger( 'init_perfect_scrollbar' );
		}
	});

	// Field validation error tips.
	$( document.body )

		.on( 'evf_add_error_tip', function( e, element, error_type, locale ) {
			var offset = element.position();

			if ( element.parent().find( '.evf_error_tip' ).length === 0 ) {
				element.after( '<div class="evf_error_tip ' + error_type + '">' + locale[error_type] + '</div>' );
				element.parent().find( '.evf_error_tip' )
					.css( 'left', offset.left + element.width() - ( element.width() / 2 ) - ( $( '.evf_error_tip' ).width() / 2 ) )
					.css( 'top', offset.top + element.height() )
					.fadeIn( '100' );
			}
		})

		.on( 'evf_remove_error_tip', function( e, element, error_type ) {
			element.parent().find( '.evf_error_tip.' + error_type ).fadeOut( '100', function() { $( this ).remove(); } );
		})

		.on( 'click', 'input:not([type=number])', function() {
			$( '.evf_error_tip' ).fadeOut( '100', function() { $( this ).remove(); } );
		})

		.on( 'blur', '.evf-input-meta-key[type=text], .evf-input-number[type=number]', function() {
			$( '.evf_error_tip' ).fadeOut( '100', function() { $( this ).remove(); } );
		})

		.on( 'change', '.evf-input-meta-key[type=text], .evf-input-number[type=number]', function() {
			var regex;

			if ( $( this ).is( '.evf-input-number' ) ) {
				regex = new RegExp( '[^-0-9]+', 'gi' );
			} else {
				regex = new RegExp( '[^a-z0-9_\-]+', 'gi' );
			}

			var value    = $( this ).val();
			var newvalue = value.replace( regex, '' );

			if ( value !== newvalue ) {
				$( this ).val( newvalue );
			}
		})

		.on( 'keyup', '.evf-input-meta-key[type=text]', function() {
			var regex, error;

			if ( $( this ).is( '.evf-input-meta-key' ) ) {
				regex = new RegExp( '[^a-z0-9_\-]+', 'gi' );
				error = 'i18n_field_meta_key_error';
			}

			var value    = $( this ).val();
			var newvalue = value.replace( regex, '' );

			if ( value !== newvalue ) {
				$( document.body ).triggerHandler( 'evf_add_error_tip', [ $( this ), error, params ] );
			} else {
				$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $( this ), error ] );
			}
		})

		.on( 'keyup focus', '.evf-input-number[type=number]', function() {
			var fieldId  = $( this ).parent().data( 'fieldId' ) ? $( this ).parent().data( 'fieldId' ) : $( this ).closest( '.everest-forms-field-option-row' ).data( 'field-id' );
			var maxField = $( "input#everest-forms-field-option-"+fieldId+"-max_value" );
			var minField = $( "input#everest-forms-field-option-"+fieldId+"-min_value" );
			var maxVal   = maxField.val();
			var minVal   = minField.val();

			if ( 0 !== minVal.length && 0 !== maxVal.length ) {
				if ( parseFloat( minVal ) > parseFloat( maxVal ) ) {
					if( $( this ).attr( 'id' ).indexOf( 'min_value' ) !== -1 ) {
						$( document.body ).triggerHandler( 'evf_add_error_tip', [ $( this ), 'i18n_field_min_value_greater', params ] );
					} else {
						$( document.body ).triggerHandler( 'evf_add_error_tip', [ $( this ), 'i18n_field_max_value_smaller', params ] );
					}
				} else {
					$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $( this ), 'i18n_field_max_value_smaller' ] );
					$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $( this ), 'i18n_field_min_value_greater' ] );
				}
			}
		})

		.on('keydown click','.evf-max-file-number[type=number]', function(e) {
			if( !( ( e.keyCode > 95 && e.keyCode < 106 )
			|| ( e.keyCode > 47 && e.keyCode < 58 )
			|| e.keyCode == 8 ) ) {
			  return false;
		  }
		})

		.on( 'focusout','.evf-input-number[type=number]', function(e) {
			var fieldId  = $( this ).parent().data( 'fieldId' ) ? $( this ).parent().data( 'fieldId' ) : $( this ).closest( '.everest-forms-field-option-row' ).data( 'field-id' );
			var maxField = $( "input#everest-forms-field-option-"+fieldId+"-max_value" );
			var minField = $( "input#everest-forms-field-option-"+fieldId+"-min_value" );
			var maxVal   = parseFloat( maxField.val() );
			var minVal   = parseFloat( minField.val() );

			if ( minVal > maxVal ||  ( '' === maxField.val() && '' !== minField.val() ) ) {
				maxField.val( minVal + 1 );
			}
		})

		.on('click','.everest-forms-field-number, .everest-forms-field-range-slider', function(e) {
			var $this = $(this);
			var id = $this.data('field-id');
			$(document).on('keydown click',"#everest-forms-field-option-"+ id +"-default_value",function(e){
				if( !( ( e.keyCode > 95 && e.keyCode < 106 )
				|| ( e.keyCode > 47 && e.keyCode < 58 )
				|| e.keyCode == 8 ) ) {
				  return false;
				}
			})

			$(document).on( 'keyup focus',"#everest-forms-field-option-"+ id +"-default_value",function( e ){
				var fieldId  = $( this ).parent().data( 'fieldId' ) ? $( this ).parent().data( 'fieldId' ) : $( this ).closest( '.everest-forms-field-option-row' ).data( 'field-id' );
				var maxField = $( "input#everest-forms-field-option-"+fieldId+"-max_value" );
				var minField = $( "input#everest-forms-field-option-"+fieldId+"-min_value" );
				var maxVal   = maxField.val();
				var minVal   = minField.val();
				var defVal   = e.target.value;
				var $this 	 = $( this );

				if ( 0 !== minVal.length  ) {

					if( 0 !== maxVal.length && parseFloat( defVal ) > parseFloat( maxVal ) ) {
						$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $this, 'i18n_field_def_value_smaller' ] );
						$( document.body ).triggerHandler( 'evf_add_error_tip', [ $this, 'i18n_field_def_value_greater', params ] );
					} else  {
						$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $this, 'i18n_field_def_value_greater' ] );
					}

					if( 0 !== defVal.length && parseFloat( defVal ) < parseFloat( minVal ) ) {
						$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $this, 'i18n_field_def_value_greater' ] );
						$( document.body ).triggerHandler( 'evf_add_error_tip', [ $this, 'i18n_field_def_value_smaller', params ] );
					} else {
						$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $this, 'i18n_field_def_value_smaller' ] );
					}
				}
			})

			.on( 'focusout', "#everest-forms-field-option-"+ id +"-default_value", function(e) {
				var fieldId  = $( this ).parent().data( 'fieldId' ) ? $( this ).parent().data( 'fieldId' ) : $( this ).closest( '.everest-forms-field-option-row' ).data( 'field-id' );
				var maxField = $( "input#everest-forms-field-option-"+fieldId+"-max_value" );
				var minField = $( "input#everest-forms-field-option-"+fieldId+"-min_value" );
				var maxVal   = parseFloat( maxField.val() );
				var minVal   = parseFloat( minField.val() );
				var defVal   = parseFloat( e.target.value );

				if ( minVal > defVal || maxVal < defVal  ) {
					e.target.value = '';
				}
			})
		})

		.on('click','.everest-forms-field-payment-quantity', function(e) {
			var $this = $(this);
			var id = $this.data('field-id');
			$(document).on('keydown click',"#everest-forms-field-option-"+ id +"-default_value",function(e){
				if( !( ( e.keyCode > 95 && e.keyCode < 106 )
				|| ( e.keyCode > 47 && e.keyCode < 58 )
				|| e.keyCode == 8 ) ) {
				  return false;
				}
			})
		})

		.on( 'init_tooltips', function() {
			$( '.tips, .help_tip, .everest-forms-help-tip, .everest-forms-help-tooltip, .everest-forms-icon' ).tooltipster( {
				maxWidth: 200,
				multiple: true,
				interactive: true,
				trigger:'custom',
				triggerOpen: {
				  mouseenter: true,
				  click: true,
				  tap: true
				},
				triggerClose: {
				  mouseleave: true,
				  click: true,
				  tap: true
				},
				position: 'bottom',
				contentAsHTML: true,
				updateAnimation: false,
				restoration: 'current',
				functionInit: function( instance, helper ) {
					var $origin = $( helper.origin ),
						dataTip = $origin.attr( 'data-tip' );

					if ( dataTip ) {
						instance.content( dataTip );
					}
				}
			} );
		});

	// Dynamic live binding on newly created elements.
	$( 'body' ).on( 'mouseenter', '.evf-content-email-settings-inner .everest-forms-help-tooltip:not(.tooltipstered)', function() {
		$( this ).tooltipster({
			maxWidth: 200,
			multiple: true,
			interactive: true,
			position: 'bottom',
			contentAsHTML: true,
			updateAnimation: false,
			trigger:'custom',
			triggerOpen: {
			  mouseenter: true,
			  click: true,
			  tap: true
			},
			triggerClose: {
			  mouseleave: true,
			  click: true,
			  tap: true
			},
			restoration: 'current',
			functionInit: function( instance, helper ) {
				var $origin = $( helper.origin ),
					dataTip = $origin.attr( 'data-tip' );
				if ( dataTip ) {
					instance.content( dataTip );
				}
			}
		});
		$( this ).tooltipster( 'open' );
	});

	$( document ).on( 'click', '.everest-forms-email-add', function() {
		$( '.evf-content-email-settings-inner .tooltipstered' ).tooltipster( 'destroy' );
	});

	$( document ).on( 'click', '.everest-forms-email-duplicate', function() {
		$( '.evf-content-email-settings-inner .tooltipstered' ).tooltipster( 'destroy' );
	});

	// Tooltips
	$( document.body ).trigger( 'init_tooltips' );

	// Check for new form entries using Heartbeat API.
	$( document ).on( 'heartbeat-send', function( event, data ) {
		var $entriesList  = $( '#everest-forms-entries-list' ),
			form_id       = $entriesList.find( '#entries-list' ).data( 'form-id' );
			last_entry_id = $entriesList.find( '#entries-list' ).data( 'last-entry-id' );

		// Work on entry list table page and check if last entry ID is found.
		if ( ! $entriesList.length || typeof last_entry_id === 'undefined' ) {
			return;
		}

		// Add custom entries data to Heartbeat data.
		data.evf_new_entries_form_id       = form_id;
		data.evf_new_entries_last_entry_id = last_entry_id;
	});

	// Display entries list notification if Heartbeat API new form entries check is successful.
	$( document ).on( 'heartbeat-tick', function ( event, data ) {
		var $entriesList = $( '#everest-forms-entries-list' ),
			columnsCount = $entriesList.find( '.wp-list-table thead tr:first-child > :visible' ).length;

		// Work on entry list table page and check for new entry notification.
		if ( ! $entriesList.length || ! data.evf_new_entries_notification ) {
			return;
		}

		if ( ! $entriesList.find( '.new-entries-notification' ).length ) {
			$entriesList.find( '.wp-list-table thead' ).append( '<tr class="new-entries-notification"><td colspan="' + columnsCount + '"><a href="#new" onClick="window.location.reload(true);"></a></td></tr>' );
		}

		$entriesList
			.find( '.new-entries-notification a' )
			.text( data.evf_new_entries_notification )
			.slideDown( {
				duration : 500,
				start    : function () {
					$( this ).css( {
						display: 'block'
					} );
				}
			} );
	});

	// To play welcome video.
	$( document ).on( 'click', '#everest-forms-welcome .welcome-video-play', function( event ) {
		var video = '<div class="welcome-video-container"><iframe width="760" height="429" src="https://www.youtube.com/embed/N_HbZccA-Ts?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe></div>';

		event.preventDefault();

		$(this).find('.everest-froms-welcome-thumb').remove();
		$(this).append(video);
	});

	// Change span with file name when user selects a file.
	$( '#everest-forms-import' ).on( 'change', function(e) {
		var file = $( '#everest-forms-import' ).prop( 'files' )[0];

		$( '#import-file-name' ).html( file.name );
	});

	$( '.everest-forms-export-form-action' ).on( 'click', function() {
		var form_id = $( this ).closest( '.everest-forms-export-form' ).find( '#everest-forms-form-export' ).val();

		$( this ).closest( '.everest-forms-export-form' ).find( '#message' ).remove();

		if ( ! form_id ) {
			$( this ).closest( '.everest-forms-export-form' ).find( 'h3' ).after( '<div id="message" class="error inline everest-froms-import_notice"><p><strong>' + everest_forms_admin.i18n_form_export_action_error + '</strong></p></div>' );
			return false;
		}
	});

	$( '.everest_forms_import_action' ).on( 'click', function() {
		var file_data = $( '#everest-forms-import' ).prop( 'files' )[0],
			form_data = new FormData();

		form_data.append( 'jsonfile', file_data );
		form_data.append( 'action', 'everest_forms_import_form_action' );
		form_data.append( 'security', everest_forms_admin.ajax_import_nonce );

		$.ajax({
			url: evf_email_params.ajax_url,
			dataType: 'json', // JSON type is expected back from the PHP script.
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: 'POST',
			beforeSend: function () {
				var spinner = '<i class="evf-loading evf-loading-active"></i>';
				$( '.everest_forms_import_action' ).closest( '.everest_forms_import_action' ).append( spinner );
				$( '.everest-froms-import_notice' ).remove();
			},
			complete: function( response ) {
				var message_string = '';

				$( '.everest_forms_import_action' ).closest( '.everest_forms_import_action' ).find( '.evf-loading' ).remove();
				$( '.everest-froms-import_notice' ).remove();

				if ( true === response.responseJSON.success ) {
					message_string = '<div id="message" class="updated inline everest-froms-import_notice"><p><strong>' + response.responseJSON.data.message + '</strong></p></div>';
				} else {
					message_string = '<div id="message" class="error inline everest-froms-import_notice"><p><strong>' + response.responseJSON.data.message + '</strong></p></div>';
				}

				$( '.everest-forms-import-form' ).find( 'h3' ).after( message_string );
				$( '#everest-forms-import' ).val( '' );
				$( '#import-file-name' ).html( 'No file selected' );
			}
		});
	});

	// Adding active class for button group
	$('.everest-forms-btn-group .everest-forms-btn').on('click', function() {
		$(this).siblings().removeClass('is-active')
		$(this).addClass('is-active');
	})

	$(document).find('.evf-form-locate').on('click', function(e) {
		e.preventDefault();
		var id = $(this).data('id');
		var data = {
			'action':'everest_forms_locate_form_action',
			'id':id,
			'security':everest_forms_admin_locate.ajax_locate_nonce
		}
		var tag = e.target;
		var target_tag = tag.closest(".row-actions");
		$.ajax({
			url : everest_forms_admin_locate.ajax_url,
			dataType: 'json', // JSON type is expected back from the PHP script.
			cache: false,
			data: data,
			type: 'POST',
			beforeSend: function () {
				var spinner = '<i class="evf-loading evf-loading-active"></i>';
				$(target_tag).append( spinner );
			},
			success: function(response) {
				var len = Object.keys(response.data).length;
				if(len>0) {
					var add_tag = '<div class = "locate-form"><span>'+everest_forms_admin_locate.form_found+'</span>';
					var i = 1;
					$.each(response.data, function(index, value) {
						if(i > 1) {
							add_tag +=", ";
						}
						let wordsArray = index.split(" ");
						if(wordsArray.length > 4 ) {
							let slicedArray = wordsArray.slice(0, 4);
							index = slicedArray.join(" ");
							index = index + "...";
						}
						add_tag+=' <a href="'+value+'" target="_blank">'+index+'</a>';
						i++;
					});
					add_tag +="</div>";
					if($(target_tag).find('.locate-form').length !=0) {
						$(target_tag).find('.locate-form').remove();
					}
					$(target_tag).find('span:first').prepend(add_tag);

				} else {
					if($(target_tag).find('.locate-form').length !=0) {
						$(target_tag).find('.locate-form').remove();
					}
					$(target_tag).find('span:first').prepend('<div class = "locate-form"><span>'+everest_forms_admin_locate.form_found_error+'</span></div>');
				}
				$(target_tag).find('.evf-loading').remove();
			}

		})
	});
	//Dismiss the form migrator notice.
	$('.evf-fm-dismiss-notice').on('click', function(e){
		e.preventDefault();
		var optionId = $(this).data('option-id');
		var data = {
			'action':'everest_forms_fm_dismiss_notice',
			'option_id':optionId,
			'security':everest_forms_admin_form_migrator.evf_fm_dismiss_notice_nonce,
		}

		$.ajax({
			url: everest_forms_admin_form_migrator.ajax_url,
			type:"POST",
			dataType:'JSON',
			data:data,
			success:function(res){
				if(res.success){
					$('.evf-fm-notice').hide();
				}
			}
		})
	});
	$( '.evf-smart-phone-field' ).each( function( i, el ) {
		var $el = $( el );
		var field_name     = $el.attr( 'name' );
		setTimeout(function() {
			$('input[name="' + field_name + '"]').val($el.val());
		}, 2000);
	});
	$('.everest-forms-system-info-setting-copy').tooltipster({
		content: 'Copied',
		trigger: 'click',
		theme: 'tooltipster-noir',
		interactive: true,
		functionBefore: function(instance, helper) {
			var table = $('.everest-forms-system-info-setting table')[0];
			var range = document.createRange();
			range.selectNode(table);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		}
	});



	// Search functionality in addon.
	$(document).ready(function(){
		$("#everest_forms_search_addons").on("keyup search", function() {
			var value = $(this).val().toLowerCase();
			var matchFound = false;

			$(".the-list .plugin-card").each(function() {
				var $card = $(this);
				var text = $card.text().toLowerCase();

				if (text.indexOf(value) > -1) {
					$card.show();
					matchFound = true;
				} else {
					$card.hide();
				}
			});

			if (!matchFound) {
				$(".refresh").hide();
				$("#evf_addon_no_result_found").remove();
				$(".refresh").after('<p id="evf_addon_no_result_found">No Result Found</p>');
			} else {
				$(".refresh").show();
				$("#evf_addon_no_result_found").hide();
			}
		});
	});
	//Rest api settings.
	if($('#everest_forms_enable_restapi').is(":checked")){
		$(document).find('.evf-restapi-key-wrapper').show();
	}else {
		$(document).find('.evf-restapi-key-wrapper').hide();
	}
	$('#everest_forms_enable_restapi').on('click', function(e){
		const {checked} = e.target;
		if(checked) {
			$(document).find('.evf-restapi-key-wrapper').show();
		}else {
			$(document).find('.evf-restapi-key-wrapper').hide();
		}
	});
	$('#everest_forms_restapi_keys').on('click', function(e){
		evfClearClipboard();
		evfSetClipboard( $( this ).val(), $( this ) );
		e.preventDefault();
	}).on('aftercopy', function() {
		$( this ).tooltipster( 'content', $( this ).attr( 'data-copied' ) ).trigger( 'mouseenter' ).on( 'mouseleave', function() {
			var $this = $( this );

			setTimeout( function() {
				$this.tooltipster( 'content', $this.attr( 'data-tip' ) );
			}, 5000 );
		} );
	});
	$('.everest-forms-generate-api-key, .everest-forms-regenerate-api-key').on('click', function(){
		let dataId = $(this).data('id');

		let data = {
			action: "everest_forms_generate_restapi_key",
			security: everest_forms_admin_generate_restapi_key.ajax_restapi_key_nonce,
		};
		$.ajax({
			url: everest_forms_admin_generate_restapi_key.ajax_url,
			type: "post",
			data:data,
			success:(res)=>{
				$(document).find('#' + dataId).val(res.data);
			}
		})
	});


	$( '.everest_forms_install_and_activate_smart_smtp' ).on( 'click', function() {
		var data = {
			action: 'everest_forms_install_and_activate_smart_smtp',
			security: everest_forms_admin.smart_smtp_install_and_activate_nonce
		};

		try {
			$.ajax({
				url: everest_forms_admin.ajax_url,
				method: 'POST',
				data: data,
				beforeSend: function () {
					var spinner = '<i class="evf-loading evf-loading-active"></i>';
					$( '.everest_forms_install_and_activate_smart_smtp' ).append( spinner );
				},
				success: function(response) {
					$( '.everest_forms_install_and_activate_smart_smtp' ).find( '.evf-loading' ).remove();


					var data = response.data;
					var message = data.message;
					var redirection_url = data.redirection_url;

					if ('' !== message && '' !== redirection_url) {
						$('.everest_forms_install_and_activate_smart_smtp')
						.closest('.everest-forms-smart-smtp-page-setup__inner-wrapper')
						.find('.everest_forms_install_and_activate_smart_smtp')
						.removeClass('everest_forms_install_and_activate_smart_smtp everest-forms-btn-primary')
						.addClass('everest_forms_install_and_activated_smart_smtp everest-forms-btn-secondary')
						.css('pointer-events', 'none').
						text('Installed and Activated SmartSMTP');
						window.location.replace(redirection_url);
					} else if ('' !== message && '' === redirection_url) {
						alert(message);
					}
				},
				error:function(response) {
					$( '.everest_forms_install_and_activate_smart_smtp' ).find( '.evf-loading' ).remove();
					var error_data = response.data;
					var message = error_data.message;
					alert(message);
					window.location.reload();
				}
			});
		} catch (error) {
			$( '.everest_forms_install_and_activate_smart_smtp' ).find( '.evf-loading' ).remove();
			alert(error);
			window.location.reload();

		}
	});

	/**
	 * Manage tags.
	 *
	 * @since 3.2.0
	 */
	$(document).on('click', '.evf-manage-tags', function(e){
		e.preventDefault();
		var tags = $('#filter-by-tags').val();

		if(!tags || tags.length ===0) {
			 return;
		}

		$.confirm( {
			title: 'Delete Tags',
			theme: 'modern',
			type: 'red',
			boxClass:'evf-delete-tags-popup',
			boxWidth: '25%',
			useBootstrap: false,
			backgroundDismiss: true,
			content: evf_admin_manage_tags.manage_tags_title +
			'<br>' +
			'<div style="color: #ff4d4f; padding-top: 20px; padding-bottom:20px">' +
				'<i class="fa fa-exclamation-triangle" aria-hidden="true" style="margin-right: 2px;"></i>' +
				 evf_admin_manage_tags.manage_tags_desc  +
			'</div>',
			buttons:{
				confirm:{
					text:'Delete',
					btnClass:'btn-red',
					action:function() {
						$.ajax({
							type: 'POST',
							url: evf_admin_manage_tags.ajax_url,
							data: {
								action: 'everest_forms_delete_form_tags',
								tags: tags,
								security : evf_admin_manage_tags.ajax_manage_tags_nonce
							},
							success: function(res) {
								//for log.
							}
						});

						window.location.reload();
					}

				},
				cancel:{
					text:'Cancel',
					btnClass:'btn-gray'
				}
			},
			type: 'blue',
			boxWidth: '565px',
			boxHeight:'200px'
		} );

	});

	var $tagsSelect = $('#filter-by-tags');
	var $manageTagsBtn = $('.evf-manage-tags');

	$manageTagsBtn.prop('disabled', !$tagsSelect.val() || $tagsSelect.val().length === 0);

	$tagsSelect.on('change', function() {
		$manageTagsBtn.prop('disabled', !$(this).val() || $(this).val().length === 0);
	});

	$('.form-tags-select2').each(function() {
		var $select = $(this);

		$select.select2({
			placeholder:$(this).data('placeholder'),
			tags: true,
			createTag: function(params) {
				if (params.term.trim() === '') {
					return null;
				}

				var exists = false;
				$select.find('option').each(function() {
					if ($(this).text() === params.term) {
						exists = true;
						return false;
					}
				});

				if (exists) {
					return null;
				}

				return {
					id: params.term,
					text: params.term,
					isNew: true
				};
			},
			templateResult: function(data) {
				var $result = $('<span></span>');
				$result.text(data.text);

				if (data.isNew) {
					$result.append(' <em>(new)</em>');
				}

				return $result;
			}
		}).on('select2:select', function(e) {
			if (!e.params) return;

			if (e.params.data.isNew) {
				var newValue = e.params.data.text;

				$select.find('option').filter(function() {
					return $(this).val() === newValue && !$(this).prop('selected');
				}).remove();

				$select.find('option').filter(function() {
					return $(this).val() === newValue && $(this).data('select2-tag');
				}).remove();

				// Create a proper selected option
				var newOption = new Option(newValue, newValue, true, true);
				$select.append(newOption).trigger('change');

				// Force Select2 to update
				$select.trigger('select2:select');
			}
		});
	});

	$('.evf-bulk-form-tags-select').trigger('evf-enhanced-tags-select-init');

	$(document).on('click', '.evf-update-bulk-tags', function(){
		var container = $(this).closest('.evf-bulk-edit-forms-tags-container'),
		 forms = $(container).find('#bulk_tag_forms').val(),
		 tags = $(container).find('#bulk_tags').val();

		if(!forms || 0 === forms.length) {
			return
		}

		$.ajax({
			type: 'POST',
			url: evf_admin_manage_tags.ajax_url,
			data: {
				action: 'everest_forms_update_tags_in_bulk',
				tags: tags,
				forms:forms,
				security : evf_admin_manage_tags.ajax_manage_tags_nonce
			},
			success: function(res) {
				window.location.reload();
			}
		});

	})

})( jQuery, everest_forms_admin );
