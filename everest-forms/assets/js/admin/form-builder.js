/* global evf_data, jconfirm, PerfectScrollbar, evfSetClipboard, evfClearClipboard */
(function ( $, evf_data ) {
	var $builder;

	var EVFPanelBuilder = {

		/**
		 * Start the panel builder.
		 */
		init: function () {
		 	$( document ).ready( function( $ ) {
		 		if ( ! $( 'evf-panel-integrations-button a' ).hasClass('active') ) {
		 			$( '#everest-forms-panel-integrations' ).find( '.everest-forms-panel-sidebar a' ).first().addClass( 'active' );
		 			if ( $('#everest-forms-panel-integrations' ).find( '.everest-forms-panel-sidebar a').hasClass( 'active' ) ) {
		 				$('#everest-forms-panel-integrations' ).find( '.everest-forms-panel-sidebar a' ).next( '.everest-forms-active-connections' ).first().addClass( 'active' );
		 			}
		 			$( '.everest-forms-panel-content' ).find( '.evf-panel-content-section' ).first().addClass( 'active' );
		 		}

				//To remove script tag.
				$(document).on('input change','.everest-forms-field-option-row-choices input[name$="[label]"]',function (e) {
					var $value =  $(this).val();
					$(this).val($value.replace(/<\s*script/gi, '').replace(/\s+on\w+\s*=/gi, ' '));
				});

				$(document).on('input change', 'input[name$="[required-field-message]"]', function (e) {
					var $value = $(this).val();

					const htmlTagPattern = /<[^>]*>/;
					const htmlEntityPattern = /&[a-zA-Z0-9#]+;/;

					if (htmlTagPattern.test($value) || htmlEntityPattern.test($value)) {
						$(this).val('');
					} else {
						$(this).val($value.replace(/<\s*script/gi, '').replace(/\s+on\w+\s*=/gi, ' '));
					}

				});

				/**
				 * Disable row when form is disabled.
				 *
				 * @since 3.2.0
				 */
				$('.wp-list-table .everest-forms-toggle-form input').each(function () {
					if (!$(this).prop('checked')) {
						$(this).closest('tr').find('td').not('.has-row-actions').addClass('evf-disable-row');
					} else {
						$(this).closest('tr').find('td').not('.has-row-actions').removeClass('evf-disable-row');
					}
				});

		 	});

			$( document ).ready( function( $ ) {
				if( '1' === $( '.everest-forms-min-max-date-format input' ).val() ) {
					$('.everest-forms-min-date').addClass('flatpickr-field').flatpickr({
						disableMobile : true,
						onChange      : function(selectedDates, dateStr, instance) {
							$('.everest-forms-min-date').val(dateStr);
						},
						onOpen: function(selectedDates, dateStr, instance) {
							instance.set('maxDate', $('.everest-forms-max-date').val());
						},
					});

					$('.everest-forms-max-date').addClass('flatpickr-field').flatpickr({
						disableMobile : true,
						onChange      : function(selectedDates, dateStr, instance) {
							$('.everest-forms-max-date').val(dateStr);
						},
						onOpen: function(selectedDates, dateStr, instance) {
							instance.set('minDate', $('.everest-forms-min-date').val());
						},
					});
				}

				$( '.everest-forms-min-max-date-format' ).each( function () {
					if( $( this ).find( 'input[type="checkbox"]' ).is( ':checked' ) ) {
						$( this ).next( '.everest-forms-min-max-date-range-format' ).removeClass( 'everest-forms-hidden' );
						$( this ).next().next( '.everest-forms-min-max-date-option' ).removeClass( 'everest-forms-hidden' );
						if( $( this ).next( '.everest-forms-min-max-date-range-format' ).find( 'input[type="checkbox"]' ).is( ':checked' ) ) {
							$( this ).next().next().next( '.everest-forms-min-max-date-range-option' ).removeClass( 'everest-forms-hidden' );
							$( this ).next().next( '.everest-forms-min-max-date-option' ).addClass( 'everest-forms-hidden' );
						}
					} else {
						$( this ).next().next().next( '.everest-forms-min-max-date-range-option' ).addClass( 'everest-forms-hidden' );
						$( this ).next( '.everest-forms-min-max-date-range-format' ).addClass( 'everest-forms-hidden' );
						$( this ).next().next( '.everest-forms-min-max-date-option' ).addClass( 'everest-forms-hidden' );
					}
				} );

				$( '.everest-forms-row-option select.evf-field-show-hide' ).each( function() {
					$(this).find( '[selected="selected"]').prop( 'selected', true );
				});
			});



				if ( $( '#everest-forms-builder' ).find('.everest-forms-field-file-upload').length > 0 ) {
					if(!(evf_data.is_pro)){
						$('#everest-forms-add-fields-file-upload').addClass('evf-one-time-draggable-field');
					}
				}



			if ( ! $( 'evf-panel-payments-button a' ).hasClass( 'active' ) ) {
				$( '#everest-forms-panel-payments' ).find( '.everest-forms-panel-sidebar a' ).first().addClass( 'active' );
				$( '.everest-forms-panel-content' ).find( '.evf-payment-setting-content' ).first().addClass( 'active' );
			}


			// Copy shortcode from the builder.
		 	$( document.body ).find('#copy-shortcode' )
				.on( 'click', this.copyShortcode )
				.on( 'aftercopy', this.copySuccess )
				.on( 'aftercopyfailure', this.copyFail );

			// Copy shortcode from form list table.
			$( document.body ).find('.evf-copy-shortcode').each( function() {
				$( this )
					.on( 'click', EVFPanelBuilder.copyShortcode )
					.on( 'aftercopy', EVFPanelBuilder.copySuccess )
					.on( 'aftercopyfailure', EVFPanelBuilder.copyFail );
			});

			// Document ready.
			$( document ).ready( EVFPanelBuilder.ready );

			// Page load.
			$( window ).on( 'load', EVFPanelBuilder.load );

			// Initialize builder UI fields.
			$( document.body ).on( 'evf-init-builder-fields', function() {
				EVFPanelBuilder.bindFields();
			} ).trigger( 'evf-init-builder-fields' );

			// Adjust builder width.
			$( document.body ).on( 'adjust_builder_width', function() {
				var adminMenuWidth = $( '#adminmenuwrap' ).width();

				$( '#everest-forms-builder-form' ).css({ 'width': 'calc(100% - ' + adminMenuWidth + 'px)' });
			} ).trigger( 'adjust_builder_width' );

			$( document.body ).on( 'click', '#collapse-button', function() {
				$( '#everest-forms-builder-form' ).width( '' );
				$( document.body ).trigger( 'adjust_builder_width' );
			});

			$( window ).on( 'resize orientationchange', function() {
				var resizeTimer;

				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( function() {
					$( '#everest-forms-builder' ).width( '' );
					$( document.body ).trigger( 'adjust_builder_width' );
				}, 250 );
			}).trigger( 'resize' );

			EVFPanelBuilder.bindPrivacyPolicyActions();
			$( document.body ).on( 'evf_field_drop_complete', function( e, field_type, dragged_field_id ) {

				EVFPanelBuilder.bindEditMetaKey( dragged_field_id );

				// Set defaults in privacy policy field.
				if ( 'privacy-policy' === field_type ) {
					var consent_message = evf_data.i18n_privacy_policy_consent_message;
					$( '#everest-forms-field-' + dragged_field_id ).find( '.evf-privacy-policy-consent-message' ).html( consent_message );
					$( '#everest-forms-field-option-' + dragged_field_id ).find( '.evf-privacy-policy-consent-message' ).val( consent_message );
					$( '.everest-forms-field-options #everest-forms-field-option-row-' + dragged_field_id + '-required' ).find( 'input' ).click();
				}

				if ( 'country' === field_type ) {
					$('#everest-forms-field-option-row-'+ dragged_field_id +'-default').find('select.evf-select2-multiple > option').prop('selected', true);
				}
			});

			// Rating point validation error tips.
			$( document.body )

				.on( 'blur', '.evf-number-of-stars[type=number]', function() {
					$( '.evf_error_tip' ).fadeOut( '100', function() { $( this ).remove(); } );
				})

				.on( 'change click', '.evf-number-of-stars[type=number]', function(e) {
					var number_of_stars = parseInt( $( this ).val(), 10 );

					if ( number_of_stars > 100 ) {
						$( this ).val('100');
						EVFPanelBuilder.livePreviewNumberOfRating( $( this) );
					}
				})

				.on( 'keyup click', '.evf-number-of-stars[type=number]', function() {
					var number_of_stars = parseInt( $( this ).val(), 10 );

					if ( number_of_stars > 100 ) {
						$( document.body ).triggerHandler( 'evf_add_error_tip', [ $( this ), 'i18n_field_rating_greater_than_max_value_error', evf_data ] );
					} else {
						$( document.body ).triggerHandler( 'evf_remove_error_tip', [ $( this ), 'i18n_field_rating_greater_than_max_value_error' ] );
					}
				});

			// Live effect for Rating field Number of Stars option.
			$( document ).on( 'keyup mouseup', '.everest-forms-field-option-row-number_of_stars input', function() {
				EVFPanelBuilder.livePreviewNumberOfRating( this );
			});

			// Live effect for Rating field icon option.
			$( document ).on( 'change', '.everest-forms-field-option-row-rating-icon input[type=radio]', function() {

				var $this      = $( this ),
					value      = $this.val(),
					id         = $this.parent().data( 'field-id' ),
					icon_color = $( '#everest-forms-field-'+id +' .rating-icon' ).find('svg').first().css('fill');
					$icons     = $( '#everest-forms-field-'+id +' .rating-icon' ),
					iconClass  = '<svg width="32" height="32" viewBox="0 0 32 32" style="fill:' + icon_color + '"><path d="M20.33 11.45L16 2.69l-4.33 8.76L2 12.86l7 6.82-1.65 9.64L16 24.77l8.65 4.55L23 19.68l7-6.82-9.67-1.41z"/></svg>';
					if ( 'heart' === value ) {
						iconClass = '<svg width="32" height="32" viewBox="0 0 32 32" style="fill:' + icon_color + '"><path d="M27.66 16.94L16 28 4.34 16.94a7.31 7.31 0 0 1 0-10.72A8.21 8.21 0 0 1 10 4a6.5 6.5 0 0 1 5 2l1 1s.88-.89 1-1a6.5 6.5 0 0 1 5-2 8.21 8.21 0 0 1 5.66 2.22 7.31 7.31 0 0 1 0 10.72z"/></svg>';
					} else if ( 'thumb' === value ) {
						iconClass = '<svg width="32" height="32" viewBox="0 0 32 32" style="fill:' + icon_color + '"><path d="M30 14.88a3.42 3.42 0 0 0-3.36-3.36h-4.85l.14-.42a2.42 2.42 0 0 1 .2-.39c.08-.14.14-.24.17-.31.21-.4.37-.72.48-1a7.39 7.39 0 0 0 .33-1.05A5.71 5.71 0 0 0 23 4a3.48 3.48 0 0 0-3-2 1.61 1.61 0 0 0-1.43.89C18.34 3.13 17 7 17 7a5.44 5.44 0 0 1-1 2c-.57.75-2.6 3-3.2 3.71s-1.05 1-1.33 1C10 13.74 10 15.71 10 16v9c0 .3 0 2.2 1.52 2.2a12.7 12.7 0 0 1 2.76.77A15.6 15.6 0 0 0 21 30a8.9 8.9 0 0 0 5.74-1.92C30 25 30 15.88 30 14.88zM5 14a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0v-7a3 3 0 0 0-3-3zm0 11a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"/></svg>';
					} else if ( 'smiley' === value ) {
						iconClass = '<svg width="32" height="32" viewBox="0 0 32 32" style="fill:' + icon_color + '"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm4 8a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm-8 0a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm4 14a9.23 9.23 0 0 1-8.16-4.89l1.32-.71a7.76 7.76 0 0 0 13.68 0l1.32.71A9.23 9.23 0 0 1 16 24z"/></svg>';
					} else if ( 'bulb' === value ) {
						iconClass = '<svg width="32" height="32" viewBox="0 0 32 32" style="fill:' + icon_color + '"><path d="M16 2.25A9.76 9.76 0 0 0 6.25 12c0 3.21 2 5.68 3.52 7.48A6.28 6.28 0 0 1 11.25 23a.76.76 0 0 0 .75.75h8a.74.74 0 0 0 .74-.64 10 10 0 0 1 1.53-3.69c.24-.35.49-.7.75-1.06 1.28-1.77 2.73-3.79 2.73-6.36A9.76 9.76 0 0 0 16 2.25zM20 25.25h-8a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zM19 28.25h-6a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5z"/></svg>';
					}

				$icons.html( iconClass );
			});

			// Live effect for Rating field icon color option.
			$( document ).ready( function( $ ) {
				$( '.everest-forms-field-option-row-icon_color input.colorpicker' ).wpColorPicker({
					change: function( event ) {
						var $this     = $( this ),
							value     = $this.val(),
							id        = $this.closest( '.everest-forms-field-option-row' ).data( 'field-id' ),
							$icons    = $( '#everest-forms-field-'+id +' .rating-icon svg' );

						$icons.css( 'fill', value );
					}
				});
		});

		$( document ).on( 'click', '.evf-edit-meta-key-icon', function() {
			var $wrapper = $(this).closest('.evf-meta-key-input-wrapper'),
				$input = $wrapper.find('.evf-input-meta-key'),
				$original_value = $( this ).data('meta_key');

			$input.prop('readonly', false).focus();

			$( document ).find( '.evf-meta-key-copy-btn' ).hide();
			$(this).hide();

			if ($wrapper.find('.evf-meta-key-actions').length === 0) {
				$wrapper.append(`
					<span class="evf-meta-key-actions">
						<span class="evf-save-meta-key-icon" style="cursor: pointer;">
							<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="1.20078" y="0.600195" width="22.8" height="22.8" rx="1.2" fill="white"/>
							<rect x="1.20078" y="0.600195" width="22.8" height="22.8" rx="1.2" stroke="#E1E1E1" stroke-width="0.8"/>
							<path d="M17.2689 8.5L10.8522 14.9167L7.93555 12" stroke="#383838" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</span>
						<span class="evf-cancel-meta-key-icon" style="cursor: pointer;" data-original_value="${$original_value}">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="0.800391" y="0.600195" width="22.8" height="22.8" rx="1.2" fill="white"/>
							<rect x="0.800391" y="0.600195" width="22.8" height="22.8" rx="1.2" stroke="#E1E1E1" stroke-width="0.8"/>
							<path d="M12.2026 12.8161L9.34427 15.6745C9.23733 15.7814 9.10122 15.8349 8.93594 15.8349C8.77066 15.8349 8.63455 15.7814 8.5276 15.6745C8.42066 15.5675 8.36719 15.4314 8.36719 15.2661C8.36719 15.1009 8.42066 14.9648 8.5276 14.8578L11.3859 11.9995L8.5276 9.14115C8.42066 9.0342 8.36719 8.89809 8.36719 8.73281C8.36719 8.56753 8.42066 8.43142 8.5276 8.32448C8.63455 8.21753 8.77066 8.16406 8.93594 8.16406C9.10122 8.16406 9.23733 8.21753 9.34427 8.32448L12.2026 11.1828L15.0609 8.32448C15.1679 8.21753 15.304 8.16406 15.4693 8.16406C15.6345 8.16406 15.7707 8.21753 15.8776 8.32448C15.9845 8.43142 16.038 8.56753 16.038 8.73281C16.038 8.89809 15.9845 9.0342 15.8776 9.14115L13.0193 11.9995L15.8776 14.8578C15.9845 14.9648 16.038 15.1009 16.038 15.2661C16.038 15.4314 15.9845 15.5675 15.8776 15.6745C15.7707 15.7814 15.6345 15.8349 15.4693 15.8349C15.304 15.8349 15.1679 15.7814 15.0609 15.6745L12.2026 12.8161Z" fill="#383838"/>
							</svg>
						</span>
					</span>
				`);
			}

			if ($wrapper.find('.evf-meta-key-warning').length === 0) {
				$wrapper.after(`
					<div class="evf-meta-key-warning" >
						<div class="everest-forms-meta-key-warning-icon">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M7.99935 1.99984C4.68564 1.99984 1.99935 4.68613 1.99935 7.99984C1.99935 11.3135 4.68564 13.9998 7.99935 13.9998C11.3131 13.9998 13.9993 11.3135 13.9993 7.99984C13.9993 4.68613 11.3131 1.99984 7.99935 1.99984ZM0.666016 7.99984C0.666016 3.94975 3.94926 0.666504 7.99935 0.666504C12.0494 0.666504 15.3327 3.94975 15.3327 7.99984C15.3327 12.0499 12.0494 15.3332 7.99935 15.3332C3.94926 15.3332 0.666016 12.0499 0.666016 7.99984ZM7.99935 7.33317C8.36754 7.33317 8.66602 7.63165 8.66602 7.99984V10.6665C8.66602 11.0347 8.36754 11.3332 7.99935 11.3332C7.63116 11.3332 7.33268 11.0347 7.33268 10.6665V7.99984C7.33268 7.63165 7.63116 7.33317 7.99935 7.33317ZM7.99935 4.6665C7.63116 4.6665 7.33268 4.96498 7.33268 5.33317C7.33268 5.70136 7.63116 5.99984 7.99935 5.99984H8.00602C8.37421 5.99984 8.67268 5.70136 8.67268 5.33317C8.67268 4.96498 8.37421 4.6665 8.00602 4.6665H7.99935Z" fill="#EE9936"/>
							</svg>
						</div>
						<div>
							<strong>Caution:</strong> We don't recommend changing this unless necessary, as it affects data retrieval.
						</div>
					</div>
				`);
			}


			$(document).on('click', '.evf-cancel-meta-key-icon', function () {
				var $wrapper = $(this).closest('.evf-meta-key-input-wrapper'),
					$input = $wrapper.find('.evf-input-meta-key'),
					originalValue = $(this).data('original_value');
				$( document ).find( '.evf-meta-key-copy-btn' ).show();
				$input.val(originalValue);

				$input.prop('readonly', true);

				$wrapper.find('.evf-meta-key-actions').remove();
				$wrapper.find('.evf-edit-meta-key-icon').show();
				$wrapper.next('.evf-meta-key-warning').remove();
			});

			$(document).on('click', '.evf-save-meta-key-icon', function () {
				var $wrapper = $(this).closest('.evf-meta-key-input-wrapper'),
					$input = $wrapper.find('.evf-input-meta-key');
				$( document ).find( '.evf-meta-key-copy-btn' ).show();
				$input.prop('readonly', true);

				$wrapper.find('.evf-meta-key-actions').remove();
				$wrapper.find('.evf-edit-meta-key-icon').show();
				$wrapper.next('.evf-meta-key-warning').remove();
			});

		});
		},

		/**
		 * Copy shortcode.
		 *
		 * @param {Object} evt Copy event.
		 */
		copyShortcode: function( evt ) {
			evfClearClipboard();
			evfSetClipboard( $( this ).closest( '.evf-shortcode-field' ).find( 'input' ).val(), $( this ) );
			evt.preventDefault();
		},

		/**
		 * Display a "Copied!" tip when success copying.
		 */
		copySuccess: function() {
			$( this ).tooltipster( 'content', $( this ).attr( 'data-copied' ) ).trigger( 'mouseenter' ).on( 'mouseleave', function() {
				var $this = $( this );

				setTimeout( function() {
					$this.tooltipster( 'content', $this.attr( 'data-tip' ) );
				}, 1000 );
			} );
		},

		/**
		 * Displays the copy error message when failure copying.
		 */
		copyFail: function() {
			$( this ).closest( '.evf-shortcode-field' ).find( 'input' ).focus().select();
		},

		/**
		 * Page load.
		 *
		 * @since 1.0.0
		 */
		load: function () {
			$( '.everest-forms-overlay' ).fadeOut();
		},

		/**
		 * Document ready.
		 *
		 * @since 1.0.0
		 */
		ready: function() {
			// Cache builder element.
			$builder = $( '#everest-forms-builder' );

			// Bind all actions.
			EVFPanelBuilder.bindUIActions();

			// Bind edit form actions.
			EVFPanelBuilder.bindEditActions();

			// jquery-confirm defaults.
			jconfirm.defaults = {
				closeIcon: true,
				backgroundDismiss: true,
				escapeKey: true,
				animationBounce: 1,
				useBootstrap: false,
				theme: 'modern',
				boxWidth: '400px',
				columnClass: 'evf-responsive-class'
			};

			// Enable Perfect Scrollbar.
			if ( 'undefined' !== typeof PerfectScrollbar ) {
				var tab_content   = $( '.everest-forms-tab-content' ),
					evf_panel = $( '.everest-forms-panel' );

				if ( tab_content.length >= 1 ) {
					window.evf_tab_scroller = new PerfectScrollbar( '.everest-forms-tab-content', {
						suppressScrollX: true,
					});
				}

				evf_panel.each( function(){
					var section_panel = $(this);
					var panel_id = section_panel.attr( 'id' );

					if ( section_panel.find( '.everest-forms-panel-sidebar' ).length >= 1 ) {
						window.evf_setting_scroller = new PerfectScrollbar( '#' + panel_id + ' .everest-forms-panel-sidebar' );
					}
				});
			}

			// Enable Limit length.
			$builder.on( 'change', '.everest-forms-field-option-row-limit_enabled input', function( event ) {
				EVFPanelBuilder.updateTextFieldsLimitControls( $( event.target ).parents( '.everest-forms-field-option-row-limit_enabled' ).data().fieldId, event.target.checked );
			} );

			$builder.on( 'change', '.everest-forms-field-option-row-min_length_enabled input', function( event ) {
				EVFPanelBuilder.updateTextFieldsMinLengthControls( $( event.target ).parents( '.everest-forms-field-option-row-min_length_enabled' ).data().fieldId, event.target.checked );
			} );

			// Enable enhanced select.
			$builder.on( 'change', '.everest-forms-field-option-select .everest-forms-field-option-row-enhanced_select input', function( event ) {
				EVFPanelBuilder.enhancedSelectFieldStyle( $( event.target ).parents( '.everest-forms-field-option-row-enhanced_select' ).data().fieldId, event.target.checked );
			} );

			// Enable Multiple options.
			$builder.on( 'click', '.everest-forms-field-option-row-choices .everest-forms-btn-group span', function( event ) {
				if ( $( this).hasClass( 'upgrade-modal' ) && 'checkbox' === $(this).data('type') ) {
					$( this ).parent().find( 'span' ).addClass( 'is-active' );
					$( this ).removeClass( 'is-active' );
					EVFPanelBuilder.updateEnhandedSelectField( $( event.target ).parents( '.everest-forms-field-option-row-choices' ).data().fieldId, false );
				} else {
					$( this ).parent().find( 'span' ).removeClass( 'is-active' );
					$( this ).addClass( 'is-active' );
					EVFPanelBuilder.updateEnhandedSelectField( $( event.target ).parents( '.everest-forms-field-option-row-choices' ).data().fieldId, 'multiple' === $( this ).data( 'selection' ) );
				}

				// Show 'Select All' Checkbox for Dropdown field only if multiple selection is active
				if( 'multiple' === $(this).data('selection') && 'checkbox' === $(this).data('type') && $( this).hasClass( 'is-active' ) ) {
					var $field_id = $(this).parent().parent().data('field-id');
					$('#everest-forms-field-option-row-'+$field_id+'-select_all').show();
				} else {
					var $field_id = $(this).parent().parent().data('field-id');
					$('#everest-forms-field-option-row-'+$field_id+'-select_all').hide();
				}
			} );

			// By default hide the 'Select All' checkbox for Dropdown field
			$(document.body).on('click', '.everest-forms-field, .everest-forms-field-select[data-field-type="select"]', function () {
				$builder.find('.everest-forms-field-option-row-choices .everest-forms-btn-group span').each(function () {
					var $field_id = $(this).parent().parent().data('field-id');

					if( 'multiple' === $(this).data('selection') && 'checkbox' === $(this).data('type') && $( this).hasClass( 'is-active' ) ) {
						$('#everest-forms-field-option-'+$field_id+'-select_all').parent().parent().parent().show();
					} else {
						$('#everest-forms-field-option-'+$field_id+'-select_all').parent().parent().parent().hide();
					}
				});
			});

			// Search fields input.
			$builder.on( 'keyup', '.everest-forms-search-fields', function() {
				var searchTerm = $( this ).val().toLowerCase();

				// Show/hide fields.
				$( '.evf-registered-item' ).each( function() {
					var $this       = $( this );
						field_type  = $this.data( 'field-type' ),
						field_label = $this.text().toLowerCase();

					if (
						field_type.search( searchTerm ) > -1
						|| field_label.search( searchTerm ) > -1
					) {
						$this.addClass( 'evf-searched-item' );
						$this.show();
					} else {
						$this.removeClass( 'evf-searched-item' );
						$this.hide();
					}
				});

				// Show/hide field group.
				$( '.everest-forms-add-fields-group' ).each( function() {
					var count = $( this ).find( '.evf-registered-item.evf-searched-item' ).length;

					if ( 0 >= count ) {
						$( this ).hide();
					} else {
						$( this ).show();
					}
				});

				// Show/hide fields not found indicator.
				if ( $( '.evf-registered-item.evf-searched-item' ).length ) {
					$( '.everest-forms-fields-not-found' ).addClass( 'hidden' );
				} else {
					$( '.everest-forms-fields-not-found' ).removeClass( 'hidden' );
				}
			});

			// Collapse the form builder
			$builder.on('click','#evf-collapse',function (event) {
				event.preventDefault();
				var $this  = $(this);

				if ( $this.hasClass('open' ) ) {
					$this.removeClass("open").addClass("close");
					$this.closest(".everest-forms-panel-sidebar-content").removeClass('collapsed');
				} else {
					$this.removeClass("close").addClass("open");
					$this.closest(".everest-forms-panel-sidebar-content").addClass('collapsed');
				}
			});

			// Action available for each binding.
			$( document ).trigger( 'everest_forms_ready' );
		},

		/**
		 * Update text fields limit controls.
		 *
		 * @since 1.5.10
		 *
		 * @param {number} fieldId Field ID.
		 * @param {bool} checked Whether an option is checked or not.
		 */
		updateTextFieldsLimitControls: function( fieldId, checked ) {
			if ( ! checked ) {
				$( '#everest-forms-field-option-row-' + fieldId + '-limit_controls' ).addClass( 'everest-forms-hidden' );
			} else {
				$( '#everest-forms-field-option-row-' + fieldId + '-limit_controls' ).removeClass( 'everest-forms-hidden' );
			}
		},

		/**
		 * Update text fields min length controls.
		 *
		 * @since 1.5.10
		 *
		 * @param {number} fieldId Field ID.
		 * @param {bool} checked Whether an option is checked or not.
		 */
		 updateTextFieldsMinLengthControls: function( fieldId, checked ) {
			if ( ! checked ) {
				$( '#everest-forms-field-option-row-' + fieldId + '-min_length_controls' ).addClass( 'everest-forms-hidden' );
			} else {
				$( '#everest-forms-field-option-row-' + fieldId + '-min_length_controls' ).removeClass( 'everest-forms-hidden' );
			}
		},

		/**
		 * Enhanced select fields style.
		 *
		 * @since 1.7.1
		 *
		 * @param {number} fieldId Field ID.
		 * @param {bool} checked Whether an option is checked or not.
		 */
		enhancedSelectFieldStyle: function( fieldId, checked ) {
			var $primary   = $( '#everest-forms-field-' + fieldId + ' .primary-input' ),
				isEnhanced = $( '#everest-forms-field-option-' + fieldId + '-enhanced_select' ).is(':checked');

			if ( checked && isEnhanced && $primary.prop( 'multiple' ) ) {
				$primary.addClass( 'evf-enhanced-select' );
				$( document.body ).trigger( 'evf-enhanced-select-init' );
			} else {
				$primary.removeClass( 'evf-enhanced-select enhanced' );
				$primary.filter( '.select2-hidden-accessible' ).selectWoo( 'destroy' );
			}
		},

		/**
		 * Update enhanced select field component.
		 *
		 * @since 1.7.1
		 *
		 * @param {number} fieldId Field ID.
		 * @param {bool} isMultiple Whether an option is multiple or not.
		 */
		updateEnhandedSelectField: function( fieldId, isMultiple ) {
			var $primary            = $( '#everest-forms-field-' + fieldId + ' .primary-input' ),
				$placeholder        = $primary.find( '.placeholder' ),
				$hiddenField        = $( '#everest-forms-field-option-' + fieldId + '-multiple_choices' ),
				$optionChoicesItems = $( '#everest-forms-field-option-row-' + fieldId + '-choices input.default' ),
				selectedChoices     = $optionChoicesItems.filter( ':checked' );

			// Update hidden field value.
			$hiddenField.val( isMultiple ? 1 : 0 );

			// Add/remove a `multiple` attribute.
			$primary.prop( 'multiple', isMultiple );

			// Change a `Choices` fields type:
			//    radio - needed for single selection
			//    checkbox - needed for multiple selection
			$optionChoicesItems.prop( 'type', isMultiple ? 'checkbox' : 'radio' );

			// For single selection we can choose only one.
			if ( ! isMultiple && selectedChoices.length ) {
				$optionChoicesItems.prop( 'checked', false );
				$( selectedChoices.get( 0 ) ).prop( 'checked', true );
			}

			// Toggle selection for a placeholder.
			if ( $placeholder.length && isMultiple ) {
				$placeholder.prop( 'selected', ! isMultiple );
			}

			// Update a primary field.
			EVFPanelBuilder.enhancedSelectFieldStyle( fieldId, isMultiple );
		},

		/**
		 * Element bindings.
		 *
		 * @since 1.0.0
		 */
		bindUIActions: function() {
			EVFPanelBuilder.bindDefaultTabs();
			EVFPanelBuilder.checkEmptyGrid();
			EVFPanelBuilder.bindFields();
			EVFPanelBuilder.bindFormPreview();
			EVFPanelBuilder.bindFormPreviewWithKeyEvent();
			EVFPanelBuilder.bindFormEntriesWithKeyEvent();
			EVFPanelBuilder.bindGridSwitcher();
			EVFPanelBuilder.bindFieldSettings();
			EVFPanelBuilder.bindFieldDelete();
			EVFPanelBuilder.bindFieldDeleteWithKeyEvent();
			EVFPanelBuilder.bindCloneField();
			EVFPanelBuilder.bindSaveOption();
			EVFPanelBuilder.bindEmbedOption();
			EVFPanelBuilder.bindSaveOptionWithKeyEvent();
			EVFPanelBuilder.bindOpenShortcutKeysModalWithKeyEvent();
			EVFPanelBuilder.bindAddNewRow();
			EVFPanelBuilder.bindRemoveRow();
			EVFPanelBuilder.bindFormSettings();
			EVFPanelBuilder.bindFormEmail();
			EVFPanelBuilder.bindFormSmsNotifications();
			EVFPanelBuilder.bindFormConversational();
			EVFPanelBuilder.bindFormIntegrations();
			EVFPanelBuilder.bindFormPayment();
			EVFPanelBuilder.choicesInit();
			EVFPanelBuilder.bindToggleHandleActions();
			EVFPanelBuilder.bindLabelEditInputActions();
			EVFPanelBuilder.bindSyncedInputActions();
			EVFPanelBuilder.init_datepickers();
			EVFPanelBuilder.init_payment_subscription_plan_field();
			EVFPanelBuilder.bindBulkOptionActions();
			EVFPanelBuilder.bindAkismetInit();
			EVFPanelBuilder.bindFormSubmissionMinWaitingTime();
			EVFPanelBuilder.bindEditMetaKey();

			// Fields Panel.
			EVFPanelBuilder.bindUIActionsFields();

			if ( evf_data.tab === 'field-options' ) {
				$( '.evf-panel-field-options-button' ).trigger( 'click' );
			}

			$(document.body).on('everest-forms-field-drop','.evf-registered-buttons .evf-registered-item', function() {
				EVFPanelBuilder.fieldDrop($(this).clone());
			} )
		},
		/**
		 * Bind user action handlers for the Add Bulk Options feature.
		 */
		bindBulkOptionActions: function() {
			// Toggle `Bulk Add` option.
			$( document.body ).on( 'click', '.evf-toggle-bulk-options', function( e ) {
				$( this ).closest( '.everest-forms-field-option' ).find( '.everest-forms-field-option-row-add_bulk_options' ).slideToggle();
			});
			// Toggle presets list.
			$( document.body ).on( 'click', '.evf-toggle-presets-list', function( e ) {
				$( this ).closest( '.everest-forms-field-option' ).find( '.everest-forms-field-option-row .evf-options-presets' ).slideToggle();
			});
			// Add custom list of options.
			$( document.body ).on( 'click', '.evf-add-bulk-options', function( e ) {
				var $option_row = $( this ).closest( '.everest-forms-field-option-row' );
				var field_id = $option_row.data( 'field-id' );

				if ( $option_row.length ) {
					var $choices = $option_row.closest( '.everest-forms-field-option' ).find( '.everest-forms-field-option-row-choices .evf-choices-list' );
					var $bulk_options_container = $option_row.find( 'textarea#everest-forms-field-option-' + field_id + '-add_bulk_options' );
					var options_texts = $bulk_options_container.val().replace(/<\s*script/gi, '').replace(/\s+on\w+\s*=/gi, ' ').split( '\n' );

					EVFPanelBuilder.addBulkOptions( options_texts, $choices );
					$bulk_options_container.val('');
				}
			});
			// Add presets of options.
			$( document.body ).on( 'click', '.evf-options-preset-label', function( e ) {
				var $option_row = $( this ).closest( '.everest-forms-field-option-row' );
				var field_id = $option_row.data( 'field-id' );

				if ( $option_row.length ) {
					var options_texts = $( this ).closest( '.evf-options-preset' ).find( '.evf-options-preset-value' ).val();

					$option_row.find( 'textarea#everest-forms-field-option-' + field_id + '-add_bulk_options' ).val( options_texts );
					$( this ).closest( '.evf-options-presets' ).slideUp();
				}
			});
			//Add toggle option for password validation and strength meter.
			$(document.body).on( 'click', '.everest-forms-field-option-row-password_strength', function(){
				if( $(this).find('[type="checkbox"]:first').prop( 'checked' ) ) {
					$(this).next().find('[type="checkbox"]:first').prop('checked', false);
					// $(this).prev().find('.everest-forms-inner-options').hide();
				}
			});
			$(document.body).on( 'click', '.everest-forms-field-option-row-password_validation', function(){
				if( $(this).find('[type="checkbox"]:first').prop( 'checked' ) ) {
					$(this).prev().find('[type="checkbox"]:first').prop('checked', false);
					$(this).prev().find('.everest-forms-inner-options').addClass('everest-forms-hidden');
				}
			});
		},

		/**
		 * Add a list of options at once.
		 *
		 * @param {Array<string>} options_texts List of options to add.
		 * @param {object} $choices_container Options container where the options should be added.
		 */
		addBulkOptions: function( options_texts, $choices_container ) {
			options_texts.forEach( function( option_text ) {
				if ( '' !== option_text ) {
					var $add_button = $choices_container.find( 'li' ).last().find( 'a.add' );
					EVFPanelBuilder.choiceAdd( null, $add_button, option_text.trim() );
				}
			});
		},

		/**
		 * Initialize date pickers like min/max date, disable dates etc.
		 *
		 * @since 1.6.6
		 */
		init_datepickers: function() {
			var date_format    = $( '.everest-forms-disable-dates' ).data( 'date-format' ),
				selection_mode = 'multiple';

			// Initialize "Disable dates" option's date pickers that hasn't been initialized.
			$( '.everest-forms-disable-dates' ).each( function() {
				if ( ! $( this ).get(0)._flatpickr ) {
					$( this ).flatpickr({
						dateFormat: date_format,
						mode: selection_mode,
					});
				}
			})

			// Reformat the selected dates input value for `Disable dates` option when the date format changes.
			$( document.body ).on( 'change', '.evf-date-format', function( e ) {
				var $disable_dates = $( '.everest-forms-field-option:visible .everest-forms-disable-dates' ),
					flatpicker = $disable_dates.get(0)._flatpickr,
					selectedDates = flatpicker.selectedDates,
					date_format = $( this ).val(),
					formatedDates = [];

				selectedDates.forEach( function( date ) {
					formatedDates.push( flatpickr.formatDate( date, date_format ) );
				})
				flatpicker.set( 'dateFormat', date_format );
				$disable_dates.val( formatedDates.join( ', ' ) );
			});

			// Clear disabled dates.
			$( document.body ).on( 'click', '.evf-clear-disabled-dates', function() {
				$( '.everest-forms-field-option:visible .everest-forms-disable-dates' ).get(0)._flatpickr.clear();
			});

			// Triggring Setting Toggler.
			$( '.everest-forms-field-date-time' ).each( function() {
				var id = $( this ).attr( 'data-field-id' );
				EVFPanelBuilder.dateSettingToggler( id, $('#everest-forms-field-option-' + id + '-datetime_style' ).val() );
			} );

			if($('.everest-forms-slot-booking input').is(":checked")) {
				//checked and hide past dates.
				disable_past_date = $(document).find('.everest-forms-past-date-disable-format input');
				required = $(document).find('.everest-forms-field-option-row-required input');
				disable_past_date.attr("checked", true);
				required.prop("checked", true);
				disable_past_date.parent().parent().parent().hide();
			}
		},
		/**
		 * For the subscription plan field.
		 *
		 * @since 3.0.9
		 */
		init_payment_subscription_plan_field:function(){
			// Initialize option's date pickers on the expiry date input.
			$( '.evf-radio-subscription-expiry-input' ).each( function() {
				if ( ! $( this ).get(0)._flatpickr ) {
					$( this ).flatpickr();
				}
			})

			var enableTrialPeriods = $('.evf-enable-trial-period');
			var enableExpiryDates = $('.evf-enable-expiry-date');

			$.each(enableTrialPeriods, function(index,enableTrailPeriod){
				if($(enableTrailPeriod).is(':checked')) {
					var trialPeriod = enableTrailPeriod.closest('li');
					$(trialPeriod).find('.evf-subscription-trail-period-option').show();
				}else{
					var trialPeriod = enableTrailPeriod.closest('li');

					$(trialPeriod).find('.evf-subscription-trail-period-option').hide();
				}

				$(enableTrailPeriod).on('click', function(e){
					var expriyDate = $(this).closest('li');
					if($(this).is(':checked')) {
						$(expriyDate).find('.evf-subscription-trail-period-option').show();
					}else{
						$(expriyDate).find('.evf-subscription-trail-period-option').hide();
					}
				} )
			});

			$.each(enableExpiryDates, function(index,enableExpiryDate){
				if($(enableExpiryDate).is(':checked')) {
					var expriyDate = enableExpiryDate.closest('li');
					$(expriyDate).find('.evf-subscription-expiry-date').show();
				}else {
					var expriyDate = enableExpiryDate.closest('li');
					$(expriyDate).find('.evf-subscription-expiry-date').hide();
				}

				$(enableExpiryDate).on('click', function(e){
					var expriyDate = $(this).closest('li');
					if($(this).is(':checked')) {
						$(expriyDate).find('.evf-subscription-expiry-date').show();
					}else{
						$(expriyDate).find('.evf-subscription-expiry-date').hide();
					}
				} )
			});

			$( document.body ).on( 'evf_after_field_append',function(e, element_id){
				var $field = $("#" + element_id);
				var field_type = $field.attr("data-field-type");

				if('payment-subscription-plan' === field_type ) {
					var isRecurringEnable = $('#everest-forms-panel-field-paypal-recurring');
					$("#everest-forms-panel-field-paypal-interval_count-wrap").hide();
					$("#everest-forms-panel-field-paypal-period-wrap").hide();

					$("#everest-forms-panel-field-stripe-plan_name-wrap").hide();
					$("#everest-forms-panel-field-stripe-interval_count-wrap").hide();
					$("#everest-forms-panel-field-stripe-period-wrap").hide();
				}
			});

			$( document.body ).on( 'evf_before_field_deleted',function(e, element_id){
				var $field = $("#everest-forms-field-" + element_id);
				var field_type = $field.attr("data-field-type");

				if('payment-subscription-plan' === field_type ) {
					$("#everest-forms-panel-field-paypal-interval_count-wrap").show();
					$("#everest-forms-panel-field-paypal-period-wrap").show();

					$("#everest-forms-panel-field-stripe-plan_name-wrap").hide();
					$("#everest-forms-panel-field-stripe-interval_count-wrap").hide();
					$("#everest-forms-panel-field-stripe-period-wrap").hide();
				}
			});

			var isRecurringEnable = $('#everest-forms-panel-field-paypal-recurring');

			var wrapper = $('.everest-forms-field-wrap');

			if($(wrapper).find('.everest-forms-field-payment-subscription-plan').length > 0) {
				if($(isRecurringEnable).is(':checked')) {
					$("#everest-forms-panel-field-paypal-interval_count-wrap").hide();
					$("#everest-forms-panel-field-paypal-period-wrap").hide();

					$("#everest-forms-panel-field-stripe-plan_name-wrap").hide();
					$("#everest-forms-panel-field-stripe-interval_count-wrap").hide();
					$("#everest-forms-panel-field-stripe-period-wrap").hide();
				}

				$(isRecurringEnable).on('click', function(e){

					$("#everest-forms-panel-field-paypal-interval_count-wrap").hide();
					$("#everest-forms-panel-field-paypal-period-wrap").hide();

					$("#everest-forms-panel-field-stripe-plan_name-wrap").hide();
					$("#everest-forms-panel-field-stripe-interval_count-wrap").hide();
					$("#everest-forms-panel-field-stripe-period-wrap").hide();
				});
			}

			var isStripeRecurringEnable = $('#everest-forms-panel-field-stripe-recurring');

			var wrapper = $('.everest-forms-field-wrap');

			if($(wrapper).find('.everest-forms-field-payment-subscription-plan').length > 0) {

				if($(isStripeRecurringEnable).is(':checked')) {
					$("#everest-forms-panel-field-stripe-plan_name-wrap").hide();
					$("#everest-forms-panel-field-stripe-interval_count-wrap").hide();
					$("#everest-forms-panel-field-stripe-period-wrap").hide();

				}


			}
			$(isStripeRecurringEnable).on('click', function(e){
				if($(this).is(':checked') && $(wrapper).find('.everest-forms-field-payment-subscription-plan').length > 0) {
					$("#everest-forms-panel-field-stripe-plan_name-wrap").hide();
					$("#everest-forms-panel-field-stripe-interval_count-wrap").hide();
					$("#everest-forms-panel-field-stripe-period-wrap").hide();

				}
			});

		},

		/**
		 * Form edit title actions.
		 *
		 * @since 1.6.0
		 */
		bindEditActions: function() {
			// Delegates event to toggleEditTitle() on clicking.
			$( '#edit-form-name' ).on( 'click', function( e ) {
				e.stopPropagation();

				if ( '' !== $( '#evf-edit-form-name' ).val().trim() ) {
					EVFPanelBuilder.toggleEditTitle( e );
				}
			});

			// Apply the title change to form name field.
			$( '#evf-edit-form-name' )
				.on( 'change keypress', function( e ) {
					var $this = $( this );

					e.stopPropagation();

					if ( 13 === e.which && '' !== $( this ).val().trim() ) {
						EVFPanelBuilder.toggleEditTitle( e );
					}

					if ( '' !== $this.val().trim() ) {
						$( '#everest-forms-panel-field-settings-form_title' ).val( $this.val().trim() );
					}
				})
				.on( 'click', function( e ) {
					e.stopPropagation();
				});

			// In case the user goes out of focus from title edit state.
			$( document ).not( $( '.everest-forms-title-desc' ) ).on( 'click', function( e ) {
				var field = $( '#evf-edit-form-name' );

				e.stopPropagation();

				// Only allow flipping state if currently editing.
				if ( ! field.prop( 'disabled' ) && field.val() && '' !== field.val().trim() ) {
					EVFPanelBuilder.toggleEditTitle( e );
				}
			});
		},

		// Toggles edit state.
		toggleEditTitle: function( event ) {
			var $el          = $( '#edit-form-name' ),
				$input_title = $el.siblings( '#evf-edit-form-name' );

			event.preventDefault();

			// Toggle disabled property.
			$input_title.prop ( 'disabled' , function( _ , val ) {
				return ! val;
			});

			if ( ! $input_title.hasClass( 'everst-forms-name-editing' ) ) {
				$input_title.focus();
			}

			$input_title.toggleClass( 'everst-forms-name-editing' );
		},

		//--------------------------------------------------------------------//
		// Fields Panel
		//--------------------------------------------------------------------//

		/**
		 * Creates a object from form elements.
		 *
		 * @since 1.6.0
		 */
		formObject: function( el ) {
			var form       = jQuery( el ),
				fields     = form.find( '[name]' ),
				json       = {},
				arraynames = {};

			for ( var v = 0; v < fields.length; v++ ){

				var field     = jQuery( fields[v] ),
					name      = field.prop( 'name' ).replace( /\]/gi,'' ).split( '[' ),
					value     = field.val(),
					lineconf  = {};

				if ( ( field.is( ':radio' ) || field.is( ':checkbox' ) ) && ! field.is( ':checked' ) ) {
					continue;
				}
				for ( var i = name.length-1; i >= 0; i-- ) {
					var nestname = name[i];
					if ( typeof nestname === 'undefined' ) {
						nestname = '';
					}
					if ( nestname.length === 0 ){
						lineconf = [];
						if ( typeof arraynames[name[i-1]] === 'undefined' )  {
							arraynames[name[i-1]] = 0;
						} else {
							arraynames[name[i-1]] += 1;
						}
						nestname = arraynames[name[i-1]];
					}
					if ( i === name.length-1 ){
						if ( value ) {
							if ( value === 'true' ) {
								value = true;
							} else if ( value === 'false' ) {
								value = false;
							}else if ( ! isNaN( parseFloat( value ) ) && parseFloat( value ).toString() === value ) {
								value = parseFloat( value );
							} else if ( typeof value === 'string' && ( value.substr( 0,1 ) === '{' || value.substr( 0,1 ) === '[' ) ) {
								try {
									value = JSON.parse( value );
								} catch (e) {}
							} else if ( typeof value === 'object' && value.length && field.is( 'select' ) ){
								var new_val = {};
								for ( var i = 0; i < value.length; i++ ) {
									new_val[ 'n' + i ] = value[ i ];
								}
								value = new_val;
							}
						}
						lineconf[nestname] = value;
					} else {
						var newobj = lineconf;
						lineconf = {};
						lineconf[nestname] = newobj;
					}
				}
				$.extend( true, json, lineconf );
			}

			return json;
		},

		/**
		 * Element bindings for Fields panel.
		 *
		 * @since 1.2.0
		 */
		bindUIActionsFields: function() {
			// Add new field choice.
			$builder.on( 'click', '.everest-forms-field-option-row-choices .add', function( event ) {
				EVFPanelBuilder.choiceAdd( event, $(this) );
			});

			// Delete field choice.
			$builder.on( 'click', '.everest-forms-field-option-row-choices .remove', function( event ) {
				EVFPanelBuilder.choiceDelete( event, $(this) );
			});

			// Field choices defaults - (before change).
			$builder.on( 'mousedown', '.everest-forms-field-option-row-choices input[type=radio]', function()  {
				var $this = $(this);

				if ( $this.is( ':checked' ) ) {
					$this.attr( 'data-checked', '1' );
				} else {
					$this.attr( 'data-checked', '0' );
				}
			});

			// Field choices defaults.
			$builder.on( 'click', '.everest-forms-field-option-row-choices input[type=radio]', function() {
				var $this = $(this),
					list  = $this.parent().parent();

				$this.parent().parent().find( 'input[type=radio]' ).not( this ).prop( 'checked', false );

				if ( $this.attr( 'data-checked' ) === '1' ) {
					$this.prop( 'checked', false );
					$this.attr( 'data-checked', '0' );
				}

				EVFPanelBuilder.choiceUpdate( list.data( 'field-type' ), list.data( 'field-id' ) );
			});

			// Field choices update preview area.
			$builder.on( 'change', '.everest-forms-field-option-row-choices input[type=checkbox]', function(e) {
				var list = $(this).parent().parent();
				EVFPanelBuilder.choiceUpdate( list.data( 'field-type' ), list.data( 'field-id' ) );
			});

			// Updates field choices text in almost real time.
			$builder.on( 'keyup paste focusout', '.everest-forms-field-option-row-choices input.label, .everest-forms-field-option-row-choices input.value', function(e) {
				var list = $(this).parent().parent().parent();
				EVFPanelBuilder.choiceUpdate( list.data( 'field-type' ), list.data( 'field-id' ) );
			});

			// Field choices display value toggle.
			$builder.on( 'change', '.everest-forms-field-option-row-show_values input', function(e) {
				$(this).closest( '.everest-forms-field-option' ).find( '.everest-forms-field-option-row-choices ul' ).toggleClass( 'show-values' );
			});

			// Field image choices toggle.
			$builder.on( 'change', '.everest-forms-field-option-row-choices_images input', function() {
				var $this          = $( this ),
					field_id       = $this.parent().parent().parent().data( 'field-id' ),
					$fieldOptions  = $( '#everest-forms-field-option-' + field_id ),
					$columnOptions = $( '#everest-forms-field-option-' + field_id + '-input_columns' ),
					type           = $( '#everest-forms-field-option-' + field_id ).find( '.everest-forms-field-option-hidden-type' ).val();

				$this.parent().find( '.notice' ).toggleClass( 'hidden' );
				$fieldOptions.find( '.everest-forms-field-option-row-choices ul' ).toggleClass( 'show-images' );

				// Trigger columns changes.
				if ( $this.is( ':checked' ) ) {
					$columnOptions.val( 'inline' ).trigger( 'change' );
				} else {
					$columnOptions.val( '' ).trigger( 'change' );
				}

				EVFPanelBuilder.choiceUpdate( type, field_id );
			} );

			// Upload or add an image.
			$builder.on( 'click', '.everest-forms-attachment-media-view .upload-button', function( event ) {
				var $el = $( this ), $wrapper, file_frame;

				event.preventDefault();

				// If the media frame already exists, reopen it.
				if ( file_frame ) {
					file_frame.open();
					return;
				}

				// Create the media frame.
				file_frame = wp.media.frames.everestforms_media_frame = wp.media({
					title:      evf_data.i18n_upload_image_title,
					className: 'media-frame everest-forms-media-frame',
					frame:     'select',
					multiple:   false,
					library: {
						type: 'image'
					},
					button: {
						text: evf_data.i18n_upload_image_button
					}
				});

				// When an image is selected, run a callback.
				file_frame.on( 'select', function() {
					var attachment = file_frame.state().get( 'selection' ).first().toJSON();

					if ( $el.hasClass( 'button-add-media' ) ) {
						$el.hide();
						$wrapper = $el.parent();
					} else {
						$wrapper = $el.parent().parent().parent();
					}

					$wrapper.find( '.source' ).val( attachment.url );
					$wrapper.find( '.attachment-thumb' ).remove();
					$wrapper.find( '.thumbnail-image'  ).prepend( '<img class="attachment-thumb" src="' + attachment.url + '">' );
					$wrapper.find( '.actions' ).show();

					$builder.trigger( 'everestFormsImageUploadAdd', [ $el, $wrapper ] );
				});

				// Finally, open the modal.
				file_frame.open();
			} );

			// Remove and uploaded image.
			$builder.on( 'click', '.everest-forms-attachment-media-view .remove-button', function( event ) {
				event.preventDefault();

				var $container = $( this ).parent().parent();

				$container.find( '.attachment-thumb' ).remove();
				$container.parent().find( '.source' ).val( '' );
				$container.parent().find( '.button-add-media' ).show();

				$builder.trigger( 'everestFormsImageUploadRemove', [ $( this ), $container ] );
			});

			// Field choices image upload add/remove image.
			$builder.on( 'everestFormsImageUploadAdd everestFormsImageUploadRemove', function( event, $this, $container ) {
				var $el      = $container.closest( '.evf-choices-list' ),
					type     = $el.data( 'field-type' ),
					field_id = $el.data( 'field-id' );

				EVFPanelBuilder.choiceUpdate( type, field_id );
			});

			// Toggle Layout advanced field option.
			$builder.on( 'change', '.everest-forms-field-option-row-input_columns select', function() {
				var $this     = $( this ),
					value     = $this.val(),
					field_id  = $this.parent().data( 'field-id' ),
					css_class = '';

				if ( 'inline' === value ) {
					css_class = 'everest-forms-list-inline';
				} else if ( '' !== value ) {
					css_class = 'everest-forms-list-' + value + '-columns';
				}

				$( '#everest-forms-field-' + field_id ).removeClass( 'everest-forms-list-inline everest-forms-list-2-columns everest-forms-list-3-columns' ).addClass( css_class );
			});

			// Field sidebar tab toggle.
			$builder.on( 'click', '.everest-forms-fields-tab a', function(e) {
				e.preventDefault();
				EVFPanelBuilder.fieldTabChoice( $(this).attr( 'id' ) );
			});


			// Dragged field and hover over tab buttons - multipart.
			$(document).on( 'mouseenter', '.everest-forms-tabs li[class*="part_"]', function() {
				if ( false === $( this ).hasClass( 'active' ) && ( $( document ).find( '.everest-forms-field' ).hasClass( 'ui-sortable-helper' ) || $( document ).find( '.evf-registered-buttons button.evf-registered-item' ).hasClass( 'field-dragged' ) ) ) {
					$( this ).find( 'a' ).trigger( 'click' );
				}
			} );

			// Display toggle for "Address" field hidden option.
			$builder.on( 'change', '.everest-forms-field-option-address input.hide', function() {
				var $this = $(this),
				id        = $this.parent().parent().data( 'field-id' ),
				subfield  = $this.parent().parent().data( 'subfield' );
				$( '#everest-forms-field-' + id ).find( '.everest-forms-' + subfield ).toggleClass( 'hidden' );
			});

			// Real-time updates for "Show Label" field option.
			$builder.on( 'input', '.everest-forms-field-option-row-label input', function() {
				var $this  = $(this),
					value = $this.val().replace(/<\s*script/gi, '').replace(/\s+on\w+\s*=/gi, ' '),
					id     = $this.parent().data( 'field-id' ),
					$label = $( '#everest-forms-field-' + id ).find( '.label-title .text' );
					if ( $label.hasClass('nl2br') ) {
						$label.html( value.replace(/\n/g, '<br>') );
					} else if ( 'private-note' === $label.prevObject.data('field-type') ) {
						value = value + ' (Admin Only)';
						$label.html( value );
					} else {
						$label.html( value );
					}
			});

			$builder.on( 'change', '.everest-forms-field-option-row-enable_prepopulate input', function( event ) {
				var id = $( this ).parent().parent().parent().data( 'field-id' );

				$( '#everest-forms-field-' + id ).toggleClass( 'parameter_name' );

				// Toggle "Parameter Name" option.
				if ( $( event.target ).is( ':checked' ) ) {
					$( '#everest-forms-field-option-row-' + id + '-parameter_name' ).show();
				} else {
					$( '#everest-forms-field-option-row-' + id + '-parameter_name' ).hide();
				}
			});

			$builder.on( 'change', '.everest-forms-field-option-row-enable_regex_validation input', function( event ) {
				var id = $( this ).parent().parent().parent().data( 'field-id' );

				$( '#everest-forms-field-' + id ).toggleClass( 'regex_value' );

				// Toggle "Parameter Name" option.
				if ( $( event.target ).is( ':checked' ) ) {
					$( '#everest-forms-field-option-row-' + id + '-regex_value' ).show();
					$( '#everest-forms-field-option-row-' + id + '-regex_message' ).show();
				} else {
					$( '#everest-forms-field-option-row-' + id + '-regex_value' ).hide();
					$( '#everest-forms-field-option-row-' + id + '-regex_message' ).hide();
				}
			});


			// Real-time updates for "Description" field option.
			$builder.on('input', '.everest-forms-field-option-row-description textarea', function () {
				var $this = $(this);
				var id = $this.parent().data('field-id');
				var $desc = $('#everest-forms-field-' + id).find('.description');
				var value = $this.val();

				// Sanitize the user input to prevent script injection, iframe injection, and remove event handlers
				value = value.replace(/<\s*script/gi, '').replace(/<\s*iframe/gi, '').replace(/\s+on\w+\s*=/gi, ' ');

				if ($desc.hasClass('nl2br')) {
					$desc.html(value.replace(/\n/g, '<br>'));
				} else {
					$desc.html(value);
				}
			});

			// Real-time updates for "Required" field option.
				$builder.on( 'change', '.everest-forms-field-option-row-required input', function( event ) {
					var id = $( this ).parent().parent().parent().data( 'field-id' );

					$( '#everest-forms-field-' + id ).toggleClass( 'required' );

					// Toggle "Required Field Message Setting" option.
					if ( $( event.target ).is( ':checked' ) ) {
						$( '#everest-forms-field-option-row-' + id + '-required_field_message_setting' ).show();
						if($('#everest-forms-field-option-' + id + '-required_field_message_setting-individual').is(':checked')) {
							$( '#everest-forms-field-option-row-' + id + '-required-field-message' ).show();
						}
					} else {
						$( '#everest-forms-field-option-row-' + id + '-required_field_message_setting' ).hide();
						$( '#everest-forms-field-option-row-' + id + '-required-field-message' ).hide();

						//unchecked the slot booking if date is not required.
						slot_booking = $(document).find('.everest-forms-slot-booking input');
						slot_booking.prop('checked', false);
						//show pass date input if hidden.
						$(document).find('.everest-forms-past-date-disable-format input').parent().parent().parent().show();
					}
			});

			$builder.on( 'change', '.everest-forms-field-option-row-required_field_message_setting input', function( event ) {
				var id = $( this ).parent().parent().parent().parent().data( 'field-id' );

				$( '#everest-forms-field-' + id ).toggleClass( 'required_field_message_setting' );

				// Toggle "Required Field Message" option.
				if ( 'individual' === $(this).val()  ) {
					$( '#everest-forms-field-option-row-' + id + '-required-field-message' ).show();
				} else {
					$( '#everest-forms-field-option-row-' + id + '-required-field-message' ).hide();
				}
			});

			// Real-time updates for "Confirmation" field option.
			$builder.on( 'change', '.everest-forms-field-option-row-confirmation input', function( event ) {
				var id = $( this ).parent().parent().parent().data( 'field-id' );

				// Toggle "Confirmation" field option.
				if ( $( event.target ).is( ':checked' ) ) {
					$( '#everest-forms-field-' + id ).find( '.everest-forms-confirm' ).removeClass( 'everest-forms-confirm-disabled' ).addClass( 'everest-forms-confirm-enabled' );
					$( '#everest-forms-field-option-' + id ).removeClass( 'everest-forms-confirm-disabled' ).addClass( 'everest-forms-confirm-enabled' );
				} else {
					$( '#everest-forms-field-' + id ).find( '.everest-forms-confirm' ).removeClass( 'everest-forms-confirm-enabled' ).addClass( 'everest-forms-confirm-disabled' );
					$( '#everest-forms-field-option-' + id ).removeClass( 'everest-forms-confirm-enabled' ).addClass( 'everest-forms-confirm-disabled' );
				}
			});
			// Real-time updates for slot booking
			$builder.on('change', '.everest-forms-slot-booking input', function(event) {
				if($(this).is(":checked")) {
					disable_past_date = $(document).find('.everest-forms-past-date-disable-format input');
					required = $(document).find('.everest-forms-field-option-row-required input');

					//checked the required if it is not checked.
					if(required.is(":not(:checked)")) {
						required.prop("checked", true);
					}

					if(disable_past_date.is(":not(:checked)")) {
						disable_past_date.prop("checked", true);
					}
					disable_past_date.parent().parent().parent().hide();
				} else {
					disable_past_date.parent().parent().parent().show();
				}
			});

			// Real-time updates for "Placeholder" field option.
			$builder.on( 'input', '.everest-forms-field-option-row-placeholder input', function(e) {
				var $this    = $( this ),
					value    = $this.val(),
					id       = $this.parent().data( 'field-id' ),
					$primary = $( '#everest-forms-field-' + id ).find( '.widefat:not(.secondary-input)' );

				if ( $primary.is( 'select' ) ) {
					if ( ! value.length ) {
						$primary.find( '.placeholder' ).remove();
					} else {
						if ( $primary.find( '.placeholder' ).length ) {
							$primary.find( '.placeholder' ).text( value );
						} else {
							$primary.prepend( '<option class="placeholder" selected>' + value + '</option>' );
						}

						$primary.data( 'placeholder', value );

						if ( $primary.hasClass( 'enhanced' ) ) {
							$primary.parent().find( '.select2-search__field' ).prop( 'placeholder', value );
						}
					}
				} else {
					$primary.attr( 'placeholder', value );
				}
			});

			// Real-time updates for "Address Placeholder" field options.
			$builder.on( 'input', '.everest-forms-field-option-address input.placeholder', function(e) {
				var $this    = $(this),
					value    = $this.val(),
					id       = $this.parent().parent().data( 'field-id' ),
					subfield = $this.parent().parent().data( 'subfield' );
				$( '#everest-forms-field-' + id ).find( '.everest-forms-' + subfield + ' input' ).attr( 'placeholder', value );
			});

			// Real-time updates for "Confirmation Placeholder" field option.
			$builder.on( 'input', '.everest-forms-field-option-row-confirmation_placeholder input', function() {
				var $this   = $( this ),
					value   = $this.val(),
					id      = $this.parent().data( 'field-id' );
				$( '#everest-forms-field-' + id ).find( '.secondary-input' ).attr( 'placeholder', value );
			});

			// Real-time updates for "Authorize.Net Card Number Placeholder" field option.
			$builder.on( 'input', '.everest-forms-field-option-row-card_number_placeholder input', function() {
				var $this   = $( this ),
					value   = $this.val(),
					id      = $this.parent().data( 'field-id' );
				$( '#everest-forms-field-' + id ).find( '.everest-forms-authorize-net-card-number input' ).attr( 'placeholder', value );
			});

			// Real-time updates for "Authorize.Net CVC Placeholder" field option.
			$builder.on( 'input', '.everest-forms-field-option-row-cvc_placeholder  input', function() {
				var $this   = $( this ),
					value   = $this.val(),
					id      = $this.parent().data( 'field-id' );
				$( '#everest-forms-field-' + id ).find( '.everest-forms-authorize-net-cvc input' ).attr( 'placeholder', value );
			});

			// Real-time updates for "Hide Label" field option.
			$builder.on( 'change', '.everest-forms-field-option-row-label_hide input', function() {
				var id = $(this).parent().parent().parent().data( 'field-id' );
				$( '#everest-forms-field-' + id ).toggleClass( 'label_hide' );
			});

			// Real-time updates for Sub Label visbility field option.
			$builder.on( 'change', '.everest-forms-field-option-row-sublabel_hide input', function() {
				var id = $( this ).parent().parent().parent().data( 'field-id' );
				$( '#everest-forms-field-' + id ).toggleClass( 'sublabel_hide' );
			});

			// Real-time updates for Date/Time and Name "Format" option.
			$builder.on( 'change', '.everest-forms-field-option-row-datetime_format select, .everest-forms-field-option-row-phone_format select, .everest-forms-field-option-row-item_price select, .everest-forms-field-option-row-format select', function(e) {
				var $this = $(this),
					value = $this.val(),
					id    = $this.parent().data( 'field-id' );
				$( '#everest-forms-field-' + id ).find( '.format-selected' ).removeClass().addClass( 'format-selected format-selected-' + value );
				$( '#everest-forms-field-option-' + id ).find( '.format-selected' ).removeClass().addClass( 'format-selected format-selected-'+ value );
			});

			// Setting options toggler.
			$builder.on( 'change', '.everest-forms-field-option-row-datetime_style select', function() {
				EVFPanelBuilder.dateSettingToggler( $( this ).parent().attr( 'data-field-id' ), $( this ).val() );
			} );

			// Enable Min Max Toggler.
			$( '.everest-forms-field-option-row-time_interval_format [id*=enable_min_max_time]' ).each ( function() {
				if( $( this ).prop('checked') ) {
					$( this ).parent().parent().find( '.input-group-col-2').has(' [id*=min_time_hour]' ).show();
					$( this ).parent().parent().find( '.input-group-col-2').has(' [id*=max_time_hour]').show();
					$( this ).parent().parent().find( '.input-group-col-2').has(' [for*=select_min_time]' ).show();
					$( this ).parent().parent().find( '.input-group-col-2').has( '[for*=select_max_time]' ).show();
				} else {
					$( this ).parent().parent().find( '.input-group-col-2').has( '[id*=min_time_hour]' ).hide();
					$( this ).parent().parent().find( '.input-group-col-2').has( '[id*=max_time_hour]' ).hide();
					$( this ).parent().parent().find( '[for*=select_min_time]' ).hide();
					$( this ).parent().parent().find( '[for*=select_max_time]' ).hide();
				}
			} );

			$builder.on( 'click', '.everest-forms-field-option-row-time_interval_format [id*=enable_min_max_time]', function() {
				if( $( this ).prop('checked') ) {
					$( this ).parent().parent().find( '.input-group-col-2').has(' [id*=min_time_hour]' ).show();
					$( this ).parent().parent().find( '.input-group-col-2').has(' [id*=max_time_hour]').show();
					$( this ).parent().parent().find( '[for*=select_min_time]' ).show();
					$( this ).parent().parent().find( '[for*=select_max_time]' ).show();
				} else {
					$( this ).parent().parent().find( '.input-group-col-2').has( '[id*=min_time_hour]' ).hide();
					$( this ).parent().parent().find( '.input-group-col-2').has( '[id*=max_time_hour]' ).hide();
					$( this ).parent().parent().find( '[for*=select_min_time]' ).hide();
					$( this ).parent().parent().find( '[for*=select_max_time]' ).hide();
				}
			} );

			// Time interval changes.
			$builder.on( 'change', '.everest-forms-field-option-row-time_interval_format select[id*=time_format]', function() {
				min_hour = $( this ).parent().siblings( '.input-group-col-2' ).find( '[id*=min_time_hour]' );
				max_hour = $( this ).parent().siblings( '.input-group-col-2' ).find( '[id*=max_time_hour]' );
				var selected_min = min_hour.find( 'option:selected' ).val();
				var selected_max = max_hour.find( 'option:selected' ).val();
				var options = '', a, h;
				for( i = 0; i<= 23; i++ ) {
					if( $( this ).val() === 'H:i' ) {
						options += '<option value = "' + i + '">' + ( ( i < 10 ) ? ( '0' + i ) : i )+ '</option>';
					} else {
						a = ' PM';
						if( i < 12 ) {
							a = ' AM';
							h = i;
						} else {
							h = i - 12;
						}
						if( h == 0 ) {
							h = 12;
						}
						options += '<option value = "' + i + '">' + h + a + '</option>';
					}
				}
				min_hour.html(options);
				max_hour.html(options);
				min_hour.find( 'option[value=' + selected_min + ']' ).prop( 'selected', true );
				max_hour.find( 'option[value=' + selected_max + ']' ).prop( 'selected', true );
			} );
		},

		/**
		 * Setting options for Date Picker and Dropdown Toggler.
		 */
		dateSettingToggler: function( id, type ) {
			if( type == 'picker' ) {
				// Picker Date Setting Control
				$( '#everest-forms-field-option-row-' + id + '-placeholder' ).show();
				$( '#everest-forms-field-option-' + id + '-disable_dates' ).show();
				$( 'label[for=everest-forms-field-option-' + id + '-disable_dates]' ).show();
				$( '#everest-forms-field-option-' + id + '-date_mode-range' ).parents().find( 'everest-forms-checklist' ).show();
				$( '.everest-forms-field-option-row-date_format .time_interval' ).show();
				$( '#everest-forms-field-option-' + id + '-date_localization' ).show();
				$( 'label[for=everest-forms-field-option-' + id + '-date_localization]' ).show();
				$( '#everest-forms-field-option-' + id + '-date_default' ).parent().parent().parent().show();
				$('#everest-forms-field-option-' + id + '-past_date_disable' ).parent().parent().parent().show();
				$( '#everest-forms-field-option-' + id + '-enable_min_max' ).parent().parent().parent().show();
				//Check if min max date enabled.
				if( $('#everest-forms-field-option-' + id + '-enable_min_max' ).prop( 'checked' ) ) {
					$('#everest-forms-field-option-' + id + '-set_date_range' ).parent().show();
					if ( $('#everest-forms-field-option-' + id + '-set_date_range' ).prop( 'checked' ) ) {
						$('#everest-forms-field-option-row-' + id + '-date_format .everest-forms-min-max-date-range-option').removeClass('everest-forms-hidden');
					} else  {
						$('#everest-forms-field-option-row-' + id + '-date_format .everest-forms-min-max-date-option').removeClass('everest-forms-hidden');
					}
				}
				$('#everest-forms-field-option-' + id + '-time_interval' ).show();
				$('#everest-forms-field-option-' + id + '-enable_min_max_time').parent().parent().parent().hide();
				$('label[for=everest-forms-field-option-' + id + '-enable_min_max_time]').hide();
				$('label[for=everest-forms-field-option-' + id + '-select_min_time]').hide();
				$('label[for=everest-forms-field-option-' + id + '-select_max_time]').hide();
				$('#everest-forms-field-option-' + id + '-min_time_hour').parent().hide();
				$('#everest-forms-field-option-' + id + '-max_time_hour').parent().hide();

			} else {
				// Dropdown Date Setting Control
				$('#everest-forms-field-option-' + id + '-date_mode-range').parents().find('everest-forms-checklist').hide();
				$('#everest-forms-field-option-' + id + '-date_default' ).parent().parent().parent().hide();
				$('#everest-forms-field-option-' + id + '-past_date_disable' ).parent().parent().parent().hide();
				$('#everest-forms-field-option-row-' + id + '-placeholder').hide();
				$('#everest-forms-field-option-' + id + '-enable_min_max').parent().parent().parent().hide();
				$('#everest-forms-field-option-row-' + id + '-date_format .everest-forms-min-max-date-option').addClass( 'everest-forms-hidden' );
				$('#everest-forms-field-option-' + id + '-set_date_range').parent().parent().parent().hide();
				$('#everest-forms-field-option-row-' + id + '-date_format .everest-forms-min-max-date-range-option').addClass( 'everest-forms-hidden' );
				$('#everest-forms-field-option-' + id + '-disable_dates' ).hide();
				$('label[for=everest-forms-field-option-' + id + '-disable_dates]').hide();
				$('.everest-forms-field-option-row-date_format .everest-forms-checklist' ).hide();
				$('.everest-forms-field-option-row-date_format .time_interval' ).hide();
				$('#everest-forms-field-option-' + id + '-date_localization' ).hide();
				$('label[for=everest-forms-field-option-' + id + '-date_localization]' ).hide();
				$('#everest-forms-field-option-' + id + '-time_interval' ).hide();
				$('#everest-forms-field-option-' + id + '-enable_min_max_time').parent().parent().parent().show();
				$('label[for=everest-forms-field-option-' + id + '-enable_min_max_time]').show();
				//Check if min max time enabled.
				if( $('#everest-forms-field-option-' + id + '-enable_min_max_time').prop('checked') ) {
					$('label[for=everest-forms-field-option-' + id + '-select_min_time]').show();
					$('label[for=everest-forms-field-option-' + id + '-select_max_time]').show();
					$('#everest-forms-field-option-' + id + '-min_time_hour').parent().show();
					$('#everest-forms-field-option-' + id + '-max_time_hour').parent().show();
				}
			}
		},


		/**
		 * Make field choices sortable.
		 *
		 * @since 1.0.0
		 *
		 * @param {string} selector Selector.
		 */
		choicesInit: function( selector ) {
			selector = selector || '.everest-forms-field-option-row-choices ul';

			$( selector ).sortable({
				items: 'li',
				axis: 'y',
				handle: '.sort',
				scrollSensitivity: 40,
				stop: function ( event ) {
					var field_id = $( event.target ).attr( 'data-field-id' ),
						type     = $( '#everest-forms-field-option-' + field_id ).find( '.everest-forms-field-option-hidden-type' ).val();

					EVFPanelBuilder.choiceUpdate( type, field_id );
				}
			} );
		},

		/**
		 * Add new field choice.
		 *
		 * @since 1.6.0
		 */
		choiceAdd: function( event, el, value ) {
			if ( event && event.preventDefault ) {
				event.preventDefault();
			}

			var $this   = $( el ),
				$parent = $this.parent(),
				checked = $parent.find( 'input.default' ).is( ':checked' ),
				fieldID = $this.closest( '.everest-forms-field-option-row-choices' ).data( 'field-id' ),
				nextID  = $parent.parent().attr( 'data-next-id' ),
				type    = $parent.parent().data( 'field-type' ),
				$choice = $parent.clone().insertAfter( $parent );

			$choice.attr( 'data-key', nextID );
			$choice.find( 'input.label' ).val( value ).attr( 'name', 'form_fields[' + fieldID + '][choices][' + nextID + '][label]' );
			$choice.find( 'input.value' ).val( value ).attr( 'name', 'form_fields[' + fieldID + '][choices][' + nextID + '][value]' );
			$choice.find( 'input.source' ).val( '' ).attr( 'name', 'form_fields[' + fieldID + '][choices][' + nextID + '][image]' );
			$choice.find( 'input.default').attr( 'name', 'form_fields[' + fieldID + '][choices][' + nextID + '][default]' ).prop( 'checked', false );
			$choice.find( '.attachment-thumb' ).remove();
			$choice.find( '.button-add-media' ).show();

			if ( checked === true ) {
				$parent.find( 'input.default' ).prop( 'checked', true );
			}

			nextID++;
			$parent.parent().attr( 'data-next-id', nextID );
			$builder.trigger( 'everestFormsChoiceAdd' );
			EVFPanelBuilder.choiceUpdate( type, fieldID );
		},

		/**
		 * Delete field choice.
		 *
		 * @since 1.6.0
		 */
		choiceDelete: function( event, el ) {
			event.preventDefault();

			var $this = $( el ),
				$list = $this.parent().parent(),
				total = $list.find( 'li' ).length;

			if ( total < 2 ) {
				$.alert({
					title: false,
					content: evf_data.i18n_field_error_choice,
					icon: 'dashicons dashicons-info',
					type: 'blue',
					buttons: {
						ok: {
							text: evf_data.i18n_ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ]
						}
					}
				});
			} else {
				$this.parent().remove();
				EVFPanelBuilder.choiceUpdate( $list.data( 'field-type' ), $list.data( 'field-id' ) );
				$builder.trigger( 'everestFormsChoiceDelete' );
			}
		},

		/**
		 * Update field choices in preview area, for the Fields panel.
		 *
		 * @since 1.6.0
		 */
		choiceUpdate: function( type, id ) {
			var $fieldOptions = $( '#everest-forms-field-option-' + id );
				$primary      = $( '#everest-forms-field-' + id + ' .primary-input' );

			// Radio and Checkbox use _ template.
			if ( 'radio' === type || 'checkbox' === type || 'payment-multiple' === type || 'payment-checkbox' === type ) {
				var choices  = [],
					formData = EVFPanelBuilder.formObject( $fieldOptions ),
					settings = formData.form_fields[ id ];

				// Order of choices for a specific field.
				$( '#everest-forms-field-option-' + id ).find( '.evf-choices-list li' ).each( function() {
					choices.push( $( this ).data( 'key' ) );
				} );

				var tmpl = wp.template( 'everest-forms-field-preview-choices' ),
					type = 'checkbox' === type || 'payment-checkbox' === type ? 'checkbox' : 'radio';
					data = {
						type:     type,
						order:    choices,
						settings: settings,
						amountFilter: EVFPanelBuilder.amountFilter,
					};

				$( '#everest-forms-field-' + id ).find( 'ul.primary-input' ).replaceWith( tmpl( data ) );

				return;
			}

			var new_choice;

			if ( 'select' === type ) {
				new_choice = '<option>{label}</option>';
				$primary.find( 'option' ).not( '.placeholder' ).remove();
			}

			$( '#everest-forms-field-option-row-' + id + '-choices .evf-choices-list li' ).each( function( index ) {
				var $this    = $( this ),
					label    = $this.find( 'input.label' ).val().replace(/<\s*script/gi, '').replace(/\s+on\w+\s*=/gi, ' '),
					selected = $this.find( 'input.default' ).is( ':checked' ),
					choice 	 = $( new_choice.replace( '{label}', label ) );

				$( '#everest-forms-field-' + id + ' .primary-input' ).append( choice );

				if ( ! label ) {
					return;
				}

				if ( true === selected ) {
					switch ( type ) {
						case 'select':
							choice.prop( 'selected', true );
							break;
						case 'radio':
						case 'checkbox':
							choice.find( 'input' ).prop( 'checked', true );
							break;
					}
				}
			} );
		},

		amountFilter: function(data, amount){
			if ( 'right' === data.currency_symbol_pos ) {
				return amount + ' ' + data.currency_symbol;
			} else {
				return data.currency_symbol + ' ' + amount;
			}
		},

		bindFormSettings: function () {
			$( 'body' ).on( 'click', '.evf-setting-panel', function( e ) {
				if ($(this).hasClass('upgrade-addons-settings')) {
					return;
				}

				var data_setting_section = $(this).attr('data-section');
				$('.evf-setting-panel').removeClass('active');
				$('.everest-forms-active-email').removeClass('active');
				$('.everest-forms-active-sms-notifications').removeClass('active');
				$('.everest-forms-active-conversational-forms').removeClass('active');
				$('.evf-content-section').removeClass('active');
				$(this).addClass('active');
				$('.evf-content-' + data_setting_section + '-settings').addClass('active');
				e.preventDefault();
			});

			$('.evf-setting-panel').eq(0).trigger('click');
		},
		bindFormEmail: function () {
			$('body').on('click', '.everest-forms-panel-sidebar-section-email', function ( e ) {
				$(this).siblings('.everest-forms-active-email').removeClass('active');
				 $(this).next('.everest-forms-active-email').addClass('active');
				var container = $( this ).siblings('.everest-forms-active-email.active').find('.everest-forms-active-email-connections-list li');

				if( container.length ){
					container.children('.user-nickname').first().trigger('click');
				}
				e.preventDefault();
			});
		},
		bindFormSmsNotifications: function () {
			$('body').on('click', '.everest-forms-panel-sidebar-section-sms-notifications', function ( e ) {
				$(this).siblings('.everest-forms-active-sms-notifications').removeClass('active');
				$(this).next('.everest-forms-active-sms-notifications').addClass('active');
				var container = $( this ).siblings('.everest-forms-active-sms-notifications.active').find('.everest-forms-active-sms-notifications-connections-list li');

				if( container.length ){
					container.children('.user-nickname').first().trigger('click');
				}
				e.preventDefault();
			});
		},
		bindFormConversational: function () {
			$("body").on("click",".everest-forms-panel-sidebar-section-conversational-forms ", function (e) {
				  var $this = $(this);
				  $(this).siblings(".everest-forms-active-conversational-forms").removeClass("active");
				  $(this).next(".everest-forms-active-conversational-forms").addClass("active");
					var container = $( this ).siblings('.everest-forms-active-conversational-forms.active');

						if( container.length ){
							container.children('.evf-content-tab ').trigger('click');
						}
					e.preventDefault();
				});
		},
		bindFormIntegrations: function () {
			$('body').on('click', '.evf-integrations-panel', function ( e ) {
				var data_setting_section = $(this).attr('data-section');
				$('.evf-integrations-panel').removeClass('active');
				$('#everest-forms-panel-integrations').find('.evf-panel-content-section').removeClass('active');
				$(this).addClass('active');
				$(this).parent().find('.everest-forms-active-connections').removeClass('active');
				$(this).next('.everest-forms-active-connections').addClass('active');
				var container = $( this ).siblings('.everest-forms-active-connections.active').find('.everest-forms-active-connections-list li');

				if( container.length ){
					container.children('.user-nickname').first().trigger('click');
				}
				$('.evf-panel-content-section-' + data_setting_section ).addClass('active');
				e.preventDefault();
			});

			$('.evf-setting-panel').eq(0).trigger('click');
		},
		bindFormPayment: function () {
			$('body').on('click', '.evf-payments-panel', function ( e ) {
				var data_setting_section = $(this).attr('data-section');
				$('.evf-payments-panel').removeClass('active');
				$(this).siblings().removeClass('icon active');
				$(this).addClass('active');
				$(this).parents('#everest-forms-panel-payments').find('.evf-payment-setting-content').removeClass('active').hide();
				$('.evf-content-' + data_setting_section + '-settings' ).addClass('active').show();
				e.preventDefault();
			});

			$('.evf-setting-panel').eq(0).trigger('click');
		},
		removeRow: function ( row ) {
			$.each( row.find( '.everest-forms-field' ), function() {
				var field_id      = $( this ).attr( 'data-field-id' ),
					field_options = $( '#everest-forms-field-option-' + field_id );

				// Remove form field.
				$( this ).remove();

				// Remove field options.
				field_options.remove();
			});

			// Remove row.
			row.remove();
		},
		bindRemoveRow: function () {
			$( 'body' ).on( 'click', '.evf-delete-row', function() {
				var $this            = $( this ),
					total_rows       = $( '.evf-admin-row' ).length,
					current_row      = $this.closest( '.evf-admin-row' ),
					row_id           = current_row.attr('data-row-id'),
					current_part     = $this.parents( '.evf-admin-field-container' ).attr( 'data-current-part' ),
					multipart_active = $( '#everest-forms-builder' ).hasClass( 'multi-part-activated' );

				if ( current_part && multipart_active ) {
					total_rows = $( '#part_' + current_part ).find( '.evf-admin-row' ).length;
				}

				if ( total_rows < 2 ) {
					$.alert({
						title: evf_data.i18n_row_locked,
						content: evf_data.i18n_single_row_locked_msg,
						icon: 'dashicons dashicons-info',
						type: 'blue',
						buttons : {
							confirm : {
								text: evf_data.i18n_close,
								btnClass: 'btn-confirm',
								keys: ['enter']
							}
						}
					});
				} else {
					$.confirm({
						title: false,
						content: evf_data.i18n_delete_row_confirm,
						type: 'red',
						closeIcon: false,
						backgroundDismiss: false,
						icon: 'dashicons dashicons-warning',
						buttons: {
							confirm: {
								text: evf_data.i18n_ok,
								btnClass: 'btn-confirm',
								keys: ['enter'],
								action: function () {
									EVFPanelBuilder.removeRow( current_row );
									$( '.everest-forms-fields-tab' ).find( 'a' ).removeClass( 'active' );
									$( '.everest-forms-fields-tab' ).find( 'a' ).first().addClass( 'active' );
									$( '.everest-forms-add-fields' ).show();
									$( '#everest-forms-row-option-row_' + row_id ).remove();
								}
							},
							cancel: {
								text: evf_data.i18n_cancel
							}
						}
					} );
				}
			});
		},
		bindAddNewRow: function() {
			$( 'body' ).on( 'click', '.evf-add-row span', function() {
				$( '#add-fields').trigger( 'click' );
				var $this        = $( this ),
					wrapper      = $( '.evf-admin-field-wrapper' ),
					row_ids      = $( '.evf-admin-row' ).map( function() {
						return $( this ).data( 'row-id' );
					} ).get(),
					max_row_id   = Math.max.apply( Math, row_ids ),
					row_clone    = $( '.evf-admin-row' ).eq(0).clone(),
					total_rows   = $this.parent().attr( 'data-total-rows' ),
					current_part = $this.parents( '.evf-admin-field-container' ).attr( 'data-current-part' );

				max_row_id++;
				total_rows++;

				if ( current_part ) {
					wrapper = $( '.evf-admin-field-wrapper' ).find( '#part_' + current_part );
				}

				// Row clone.
				row_clone.find( '.evf-admin-grid' ).html( '' );
				row_clone.attr( 'data-row-id', max_row_id );

				// Row infos.
				$this.parent().attr( 'data-total-rows', total_rows );
				$this.parent().attr( 'data-next-row-id', max_row_id );

				if( 0 < $( '.everest-forms-row-options' ).length && false === $this.closest( '.evf-add-row' ).hasClass('repeater-row') ) {

					row_clone.find( 'div' ).hide();

					row_clone.css({
						'padding': '40px'
					}).append( '<i class="spinner is-active" style="margin:0px auto;"></i>' );

					// Row append.
					wrapper.append( row_clone );


					// Initialize fields UI.
					EVFPanelBuilder.bindFields();
					EVFPanelBuilder.checkEmptyGrid();

					var row_id = row_clone.attr('data-row-id'),
					evf_data =  window.evf_data;
					$.ajax({
						url: evf_data.ajax_url,
						type: 'POST',
						data: {
							action: 'everest_forms_new_row',
							security: evf_data.evf_add_row_nonce,
							form_id: evf_data.form_id,
							row_id: row_id
						},
						success: function( xhr ) {
							if( true === xhr.success ) {
								if( 'undefined' !== typeof xhr.data.html ) {
									$( document ).find( '.everest-forms-row-option-group' ).append( xhr.data.html );
									EVFPanelBuilder.conditionalLogicAppendRow( row_id );
									// Disable conditional logic by default.
									$( '#everest-forms-panel-field-form_rows-connection_row_' + row_id + '-conditional_logic_status' ).prop( 'checked', false );
								}
							}
						}
					}).always( function() {
						row_clone.css( {'padding':0 } );

						row_clone.find( 'div' ).show();

						row_clone.find( '.evf-toggle-row-content' ).css( 'display', 'none' );

						row_clone.find( 'i' ).remove();

						// Trigger event after row add.
						$this.trigger('everest-forms-after-add-row', row_clone);
					} );
				} else {
					// Row append.
					wrapper.append( row_clone );
					// Initialize fields UI.
					EVFPanelBuilder.bindFields();
					EVFPanelBuilder.checkEmptyGrid();
					// Trigger event after row add.
					$this.trigger('everest-forms-after-add-row', row_clone);
				}
			});

		},
		bindCloneField: function () {
			$( 'body' ).on( 'click', '.everest-forms-preview .everest-forms-field .everest-forms-field-duplicate', function() {
				var $field = $( this ).closest( '.everest-forms-field' );

				if ( $field.hasClass( 'no-duplicate' ) ) {
					$.alert({
						title: evf_data.i18n_field_locked,
						content: evf_data.i18n_field_locked_msg,
						icon: 'dashicons dashicons-info',
						type: 'blue',
						buttons : {
							confirm : {
								text: evf_data.i18n_close,
								btnClass: 'btn-confirm',
								keys: ['enter']
							}
						}
					});
				} else {
					$.confirm({
						title: false,
						content: evf_data.i18n_duplicate_field_confirm,
						type: 'orange',
						closeIcon: false,
						backgroundDismiss: false,
						icon: 'dashicons dashicons-warning',
						buttons: {
							confirm: {
								text: evf_data.i18n_ok,
								btnClass: 'btn-confirm',
								keys: ['enter'],
								action: function () {
									EVFPanelBuilder.cloneFieldAction( $field );
								}
							},
							cancel: {
								text: evf_data.i18n_cancel
							}
						}
					} );
				}
			} );

			$( 'body' ).on( 'click', '.evf-admin-row .evf-duplicate-row', function() {
				var $row 		= $( this ).closest( '.evf-admin-row' );
				if( $row.find( '.everest-forms-field' ).hasClass( 'no-duplicate' ) ) {
					$.alert({
						title: evf_data.i18n_field_locked,
						content: evf_data.i18n_row_locked_msg,
						icon: 'dashicons dashicons-info',
						type: 'blue',
						buttons : {
							confirm : {
								text: evf_data.i18n_close,
								btnClass: 'btn-confirm',
								keys: ['enter']
							}
						}
					});
				} else {
					$.confirm({
						title: false,
						content: evf_data.i18n_duplicate_row_confirm,
						type: 'orange',
						closeIcon: false,
						backgroundDismiss: false,
						icon: 'dashicons dashicons-warning',
						buttons: {
							confirm: {
								text: evf_data.i18n_ok,
								btnClass: 'btn-confirm',
								keys: ['enter'],
								action: function () {
									EVFPanelBuilder.cloneRowAction( $row );
								}
							},
							cancel: {
								text: evf_data.i18n_cancel
							}
						}
					} );
				}
			} );
		},
		cloneRowAction: function ( row ) {
			row_ids     = $( '.evf-admin-row' ).map( function() {
				return $( this ).data( 'row-id' );
			} ).get(),
			max_row_id  = Math.max.apply( Math, row_ids ),
			row_clone   = row.clone(),
			total_rows  = $( '.evf-add-row' ).attr( 'data-total-rows' );
			max_row_id++;
			total_rows++;

			// New row ID.
			row_clone.attr( 'data-row-id', max_row_id );
			// Initialize fields UI.
			$( '.evf-add-row' ).attr( 'data-total-rows', total_rows );
			$( '.evf-add-row' ).attr( 'data-next-row-id', max_row_id );

			var data = {
				action	: 'everest_forms_get_next_id',
				security: evf_data.evf_get_next_id,
				form_id	: evf_data.form_id,
				fields	:  row_clone.find( '.everest-forms-field' ).length
			};

			$.ajax({
				url: evf_data.ajax_url,
				data: data,
				type: 'POST',
				beforeSend: function() {
					$( document.body ).trigger( 'init_field_options_toggle' );
				},
				success: function ( response ) {
					if ( typeof response.success === 'boolean' && response.success === true ) {
						// Row append.
						row.after( row_clone );
						// Duplicating Fields
						$.each( response.data, function( index, data ) {
							var field_id = data.field_id;
							var field_key = data.field_key;
							$('#everest-forms-field-id').val(field_id);
							field = row_clone.find( '.everest-forms-field' ).eq( index );
							var element_field_id = field.attr('data-field-id');
							EVFPanelBuilder.render_node( field, element_field_id, field_key );
							field.remove();
							$( document.body ).trigger( 'init_field_options_toggle' );
						});
						// Binding fields.
						EVFPanelBuilder.bindFields();
					}
				}
			});
		},
		cloneFieldAction: function ( field ) {
			var element_field_id = field.attr('data-field-id');
			var form_id = evf_data.form_id;
			var data = {
				action: 'everest_forms_get_next_id',
				security: evf_data.evf_get_next_id,
				form_id: form_id
			};
			$.ajax({
				url: evf_data.ajax_url,
				data: data,
				type: 'POST',
				beforeSend: function() {
					$( document.body ).trigger( 'init_field_options_toggle' );
				},
				success: function ( response ) {
					if ( typeof response.success === 'boolean' && response.success === true ) {
						var field_id = response.data.field_id;
						var field_key = response.data.field_key;
						$('#everest-forms-field-id').val(field_id);
						EVFPanelBuilder.render_node(field, element_field_id, field_key);
						$( document.body ).trigger( 'init_field_options_toggle' );
					}
				}
			});
		},
		render_node: function ( field, old_key, new_key ) {
			var option = $('.everest-forms-field-options #everest-forms-field-option-' + old_key );
			var old_field_label = $('#everest-forms-field-option-' + old_key + '-label' ).val();
			var old_field_meta_key = $( '#everest-forms-field-option-' + old_key + '-meta-key' ).length ? $( '#everest-forms-field-option-' + old_key + '-meta-key' ).val() : '';
			var field_type = field.attr('data-field-type'),
			newOptionHtml = option.html(),
			new_field_label = old_field_label + ' ' + evf_data.i18n_copy,
			new_meta_key =  'html' !== field_type ? old_field_meta_key.replace( /\(|\)/g, '' ).toLowerCase().substring( 0, old_field_meta_key.lastIndexOf( '_' ) ) + '_' + Math.floor( 1000 + Math.random() * 9000 ) : '',
			newFieldCloned = field.clone();
			var regex = new RegExp(old_key, 'g');
			newOptionHtml = newOptionHtml.replace(regex, new_key);
			var newOption = $('<div class="everest-forms-field-option everest-forms-field-option-' + field_type + '" id="everest-forms-field-option-' + new_key + '" data-field-id="' + new_key + '" />');
			newOption.append(newOptionHtml);
			$.each(option.find(':input'), function () {
				var type = $(this).attr('type');
				var name = $( this ).attr( 'name' ) ? $( this ).attr( 'name' ) : '';
				var new_name = name.replace(regex, new_key);
				var value = '';
				if ( type === 'text' || type === 'hidden' ) {
					value = $(this).val();
					newOption.find('input[name="' + new_name + '"]').val(value);
					newOption.find('input[value="' + old_key + '"]').val(new_key);
				} else if ( type === 'checkbox' || type === 'radio' ) {
					if ( $(this).is(':checked') ) {
						newOption.find('input[name="' + new_name + '"]').prop('checked', true).attr('checked', 'checked');
					} else {
						newOption.find('[name="' + new_name + '"]').prop('checked', false).attr('checked', false);
					}
				} else if ( $(this).is('select') ) {
					if ( $(this).find('option:selected').length ) {
						var option_value = $(this).find('option:selected').val();
						newOption.find('[name="' + new_name + '"]').find('[value="' + option_value + '"]').prop('selected', true);
					}
				} else {
					if ( $(this).val() !== '' ) {
						newOption.find('[name="' + new_name + '"]').val($(this).val());
					}
				}
			});

			$('.everest-forms-field-options').append(newOption);
			$('#everest-forms-field-option-' + new_key + '-label').val(new_field_label);
			$('#everest-forms-field-option-' + new_key + '-meta-key').val(new_meta_key);

			// Field Clone
			newFieldCloned.attr('class', field.attr('class'));
			newFieldCloned.attr('id', 'everest-forms-field-' + new_key);
			newFieldCloned.attr('data-field-id', new_key);
			newFieldCloned.attr('data-field-type', field_type);
			newFieldCloned.find('.label-title .text').text(new_field_label);
			field.closest( '.evf-admin-grid' ).find( '[data-field-id="' + old_key + '"]' ).after( newFieldCloned );
			$(document).trigger('everest-form-cloned', [ new_key, field_type ] );
			EVFPanelBuilder.switchToFieldOptionPanel(new_key);//switch to cloned field options

			// Trigger an event indicating completion of render_node action for cloning.
			$( document.body ).trigger( 'evf_render_node_complete', [ field_type, new_key, newFieldCloned, newOption ] );
		},
		bindFieldDelete: function () {
			$( 'body' ).on('click', '.everest-forms-preview .everest-forms-field .everest-forms-field-delete', function () {
				var $field       = $( this ).closest( '.everest-forms-field' );
				var field_id     = $field.attr('data-field-id');
				var option_field = $( '#everest-forms-field-option-' + field_id );
				var grid 		 = $( this ).closest( '.evf-admin-grid' );

				if ( $field.hasClass( 'no-delete' ) ) {
					$.alert({
						title: evf_data.i18n_field_locked,
						content: evf_data.i18n_field_locked_msg,
						icon: 'dashicons dashicons-info',
						type: 'blue',
						buttons : {
							confirm : {
								text: evf_data.i18n_close,
								btnClass: 'btn-confirm',
								keys: ['enter']
							}
						}
					});
				} else {
					$.confirm({
						title: false,
						content: evf_data.i18n_delete_field_confirm,
						type: 'red',
						closeIcon: false,
						backgroundDismiss: false,
						icon: 'dashicons dashicons-warning',
						buttons: {
							confirm: {
								text: evf_data.i18n_ok,
								btnClass: 'btn-confirm',
								keys: ['enter'],
								action: function () {
									$( '.evf-panel-fields-button' ).trigger( 'click' );
									$field.fadeOut( 'slow', function () {
										var removed_el_id = $field.attr('data-field-id');
										var field_type = $field.attr('data-field-type');
										$( document.body ).trigger( 'evf_before_field_deleted', [ removed_el_id] );
										$field.remove();
										option_field.remove();
										EVFPanelBuilder.checkEmptyGrid();
										$( '.everest-forms-fields-tab' ).find( 'a' ).removeClass( 'active' );
										$( '.everest-forms-fields-tab' ).find( 'a' ).first().addClass( 'active' );
										$( '.everest-forms-add-fields' ).show();
										EVFPanelBuilder.conditionalLogicRemoveField(removed_el_id);
										EVFPanelBuilder.conditionalLogicRemoveFieldIntegration(removed_el_id);
										EVFPanelBuilder.paymentFieldRemoveFromQuantity(removed_el_id);
									    EVFPanelBuilder.oneTimeDraggableRemoveField(field_type);
									});
								}
							},
							cancel: {
								text: evf_data.i18n_cancel
							}
						}
					} );
				}
			});
		},
		bindFieldDeleteWithKeyEvent: function () {
			$( 'body' ).on( 'keyup', function( e ) {
				var $field = $( '.everest-forms-preview .everest-forms-field.active' );
				if( 46 === e.which && true === $field.hasClass( 'active' ) && false === $field.hasClass( 'evf-delete-event-active' ) ) {
					if( false == $( '.evf-admin-row' ).hasClass( 'evf-hover' ) ) {
						return;
					}
					$field.addClass( 'evf-delete-event-active' );
					var field_id     = $field.attr( 'data-field-id' );
					var option_field = $( '#everest-forms-field-option-' + field_id );
					if ( $field.hasClass( 'no-delete' ) ) {
						$.alert({
							title: evf_data.i18n_field_locked,
							content: evf_data.i18n_field_locked_msg,
							icon: 'dashicons dashicons-info',
							type: 'blue',
							buttons : {
								confirm : {
									text: evf_data.i18n_close,
									btnClass: 'btn-confirm',
									keys: ['enter'],
									action: function () {
										$field.removeClass( 'evf-delete-event-active' );
									}
								}
							}
						});
					} else {
						$.confirm({
							title: false,
							content: evf_data.i18n_delete_field_confirm,
							type: 'red',
							closeIcon: false,
							backgroundDismiss: false,
							icon: 'dashicons dashicons-warning',
							buttons: {
								confirm: {
									text: evf_data.i18n_ok,
									btnClass: 'btn-confirm',
									keys: ['enter'],
									action: function () {
										$( '.evf-panel-fields-button' ).trigger( 'click' );
										$field.fadeOut( 'slow', function () {
											var removed_el_id = $field.attr('data-field-id');
											$( document.body ).trigger( 'evf_before_field_deleted', [ removed_el_id] );
											$field.remove();
											option_field.remove();
											EVFPanelBuilder.checkEmptyGrid();
											$( '.everest-forms-fields-tab' ).find( 'a' ).removeClass( 'active' );
											$( '.everest-forms-fields-tab' ).find( 'a' ).first().addClass( 'active' );
											$( '.everest-forms-add-fields' ).show();
											EVFPanelBuilder.conditionalLogicRemoveField(removed_el_id);
											EVFPanelBuilder.conditionalLogicRemoveFieldIntegration(removed_el_id);
											EVFPanelBuilder.paymentFieldRemoveFromQuantity(removed_el_id);
										});
										$field.removeClass( 'evf-delete-event-active' );
									}
								},
								cancel: {
									text: evf_data.i18n_cancel,
									action: function () {
										$field.removeClass( 'evf-delete-event-active' );
									}
								}
							}
						} );
					}
				}
			});
		},
		bindSaveOption: function () {
			$( 'body' ).on( 'click', '.everest-forms-save-button', function () {
				var $this      = $( this );
				var $form      = $( 'form#everest-forms-builder-form' );
				var structure  = EVFPanelBuilder.getStructure();
				var form_data  = $form.serializeArray();
				var form_title = $( '#evf-edit-form-name' ).val().trim();

				// Save form args.
				$(document).trigger('everest_forms_save_args', [form_data]);

				if ( '' === form_title ) {
					$.alert({
						title: evf_data.i18n_field_title_empty,
						content: evf_data.i18n_field_title_payload,
						icon: 'dashicons dashicons-warning',
						type: 'red',
						buttons: {
							ok: {
								text: evf_data.i18n_ok,
								btnClass: 'btn-confirm',
								keys: [ 'enter' ]
							}
						}
					});
					return;
				}

				// Trigger a handler to let addon manipulate the form data if needed.
				if ( $form.triggerHandler( 'everest_forms_process_ajax_data', [ $this, form_data ] ) ) {
					form_data = $form.triggerHandler( 'everest_forms_process_ajax_data', [ $this, form_data ] );
				}

				$( '.everest-forms-panel-content-wrap' ).block({
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.6
					}
				});

				/* DB unwanted data erase start */
				var rfields_ids = [];
				$( '.everest-forms-field[data-field-id]' ).each( function() {
					rfields_ids.push( $( this ).attr( 'data-field-id' ) );
				});

				var form_data_length = form_data.length;
				while ( form_data_length-- ) {
					if ( form_data[ form_data_length ].name.startsWith( 'form_fields' ) ) {
						var idflag = false;
						rfields_ids.forEach( function( element ) {
							if ( form_data[ form_data_length ].name.startsWith( 'form_fields[' + element + ']' ) ) {
								idflag = true;
							}
						});
						if ( form_data_length > -1 && idflag === false )  {
							form_data.splice( form_data_length, 1 );
						}
					}
				}
				/* DB fix end */

				var new_form_data = form_data.concat( structure );
				var data = {
					action: 'everest_forms_save_form',
					security: evf_data.evf_save_form,
					form_data: JSON.stringify( new_form_data )
				};
				$.ajax({
					url: evf_data.ajax_url,
					data: data,
					type: 'POST',
					beforeSend: function () {
						$this.addClass( 'processing' );
						$this.find( '.loading-dot' ).remove();
						$this.append( '<span class="loading-dot"></span>' );
					},
					success: function ( response ) {
						$this.removeClass( 'processing' );
						$this.find( '.loading-dot' ).remove();

						//Response data of ajax.
						$(document).trigger('everest_forms_save_data',response.data);

						if ( ! response.success ) {
							$.alert({
								title: response.data.errorTitle,
								content: response.data.errorMessage,
								icon: 'dashicons dashicons-warning',
								type: 'red',
								buttons: {
									ok: {
										text: evf_data.i18n_ok,
										btnClass: 'btn-confirm',
										keys: [ 'enter' ]
									}
								}
							});
						}

						$( '.everest-forms-panel-content-wrap' ).unblock();
					}
				});
			});
		},
		bindEmbedOption: function () {
            $( 'body' ).on( 'click', '.everest-forms-embed-button', function () {
				var data = {
					'action' 	: 'everest_forms_embed_form',
					security	: evf_data.evf_embed_form,
				};
				var $this = $(this);

				$.ajax({
					url: evf_data.ajax_url,
					data: data,
					type: 'POST',
					beforeSend: function () {
						$this.addClass( 'processing' );
						$this.find( '.loading-dot' ).remove();
						$this.append( '<span class="loading-dot"></span>' );
					},
					success: function(response){
						$this.removeClass( 'processing' );
						$this.find( '.loading-dot' ).remove();

						var $title          		= '<h4>Embed in Page</h4>'

						var modelContent 			= '';
						var $message    			= '<div class="everest_forms_hide_container"><p>We can help embed your form with just a few clicks!</p>';
						var $selectExistingPage		= '<button class="everest-forms-btn everest-forms-select-existing-page">Select Existing Page</button>';
						var $createNewPage			= '<button class="everest-forms-btn everest-forms-create-new-page">Create New Page</button></div><div class="everest-forms-show-exist-page"></div>';
						modelContent				= $message + $selectExistingPage + $createNewPage;

						$.alert({
							title   : $title,
							content : modelContent,
							type    : 'blue',
							onContentReady: function () {
								var $formId		= $(".everest-forms-embed-button").attr('data-form_id');
								$(".jconfirm-buttons").hide();
								//when clicked on 'Select Existing Page' button
								$( ".everest-forms-select-existing-page" ).click(function () {

									$( ".everest_forms_hide_container" ).hide();
										var $selectStart	= '<div class="everest-forms-select-existing-post-container"><p>Select the page you would like to embed your form in.</p><select name="everest-forms-select-existing-page-name" id="everest-forms-select-existing-page-name">';
										var $option			= '<option disabled selected>Select Page</option>';

										response.data.forEach(page => {
											$option += '<option data-id="' + page.ID + '" value="' + page.ID + '">' + page.post_title + '</option>';
										});

										var $selectEnd		= '</select><button class="everest-forms-lets-go-btn" style="cursor:pointer">Lets Go!</button>';
										var $backBtn 		= '<div style="cursor:pointer" class="everest-forms-show-container">Go Back</div></div>'

										modelContent = $selectStart + $option + $selectEnd + $backBtn;

										$( ".everest-forms-show-exist-page" ).append( modelContent );

										$( ".everest-forms-show-container" ).click(function(){
											$( ".everest_forms_hide_container" ).show();
											$( ".everest-forms-select-existing-post-container" ).remove();
										})

										//When page is selected
										$( ".everest-forms-select-existing-post-container" ).change(function(){
											var $pageId 	= $(this).find(":selected").val()

											$( ".everest-forms-lets-go-btn" ).click(function(){
												var data = {
													'action'	: 'everest_forms_goto_edit_page',
													security	: evf_data.evf_goto_edit_page,
													'page_id'	: $pageId,
													'form_id'	: $formId,
												}
												$.ajax({
													url : evf_data.ajax_url,
													type: 'POST',
													data: data,
													success: function( response ){
														if ( response.success ) {
															window.location = response.data
														}
													}
												})
											})
										})

								});

								//when click on 'Create New Page' button
								$( ".everest-forms-create-new-page" ).click(function(){
									$( ".everest_forms_hide_container" ).hide();

									var $title		= '<div class="everest-forms-select-existing-post-container"><p>What would you like to call the new page?</p>';
									var $pageName 	= '<div><input type="text" name="page_title"/>';
									var $goBtn 		= '<button class="everest-forms-lets-go-btn" style="cursor:pointer">Lets Go!</button></div>';
									var $backBtn 		= '<div style="cursor:pointer" class="everest-forms-show-container">Go Back</div></div>'

									modelContent = $title + $pageName + $goBtn + $backBtn;
									$(" .everest-forms-show-exist-page" ).append( modelContent );

									$( ".everest-forms-show-container" ).click(function(){
										$( ".everest_forms_hide_container" ).show();
										$( ".everest-forms-select-existing-post-container" ).remove();
									})

									$( ".everest-forms-lets-go-btn" ).click(function(){
										var $pageTitle = $( "[name='page_title']" ).val();

										var data = {
											'action'	: 'everest_forms_goto_edit_page',
											security	: evf_data.evf_goto_edit_page,
											page_title	: $pageTitle,
											'form_id'	: $formId,
										}
										$.ajax({
											url		: evf_data.ajax_url,
											type	: 'POST',
											data	: data,
											success	: function( response ){
												if ( response.success ) {
													window.location = response.data
												}
											}
										})
									})
								})
							}
						})
					}
				})

            });
        },
		bindPreviewConfirmation: function () {
				$('.everest-preview-confirmation').each(function() {
					const $checkbox = $(this);
					const $target = $checkbox.closest('.everest-forms-panel-field-toggle').next('.preview-confirm-select-wrapper');

					if ($checkbox.is(":checked")) {
						$target.show();
					} else {
						$target.hide();
					}

					$checkbox.on('change', function() {
						if ($(this).is(":checked")) {
							$target.show();
						} else {
							$target.hide();
						}
					});
			});
		},
		bindSaveOptionWithKeyEvent:function() {
			$('body').on("keydown", function (e) {
				if (e.ctrlKey || e.metaKey) {
					if (
						"s" ===
						String.fromCharCode(e.which).toLowerCase() || 83 === e.which
					) {
						e.preventDefault();
						$('.everest-forms-save-button').trigger('click');
					}
				}
			});
		},
		bindOpenShortcutKeysModalWithKeyEvent: function() {
			$('body').on("keydown", function (e) {
				if ( e.ctrlKey || e.metaKey ) {
					if( 'h' === String.fromCharCode(e.which).toLowerCase() || 72 === e.which ) {
						e.preventDefault();
						var shortcut_keys_html = '';

						$.each(evf_data.i18n_shortcut_keys, function (key, value) {
							shortcut_keys_html += `
								<ul class="evf-shortcut-keyword">
									<li>
										<div class="evf-shortcut-title">${value}</div>
									<div class="evf-key">
										<span>${key.split('+')[0]}</span>
										<span>${key.split('+')[1]}</span>
									</div>
									</li>
								</ul>
							`;
						});

						$.alert({
							title: evf_data.i18n_shortcut_key_title,
							content: shortcut_keys_html,
							icon: 'dashicons dashicons-info',
							type: 'blue',
							boxWidth: '550px',
							buttons : {
								confirm : {
									text: evf_data.i18n_close,
									btnClass: 'btn-confirm',
									keys: ['enter']
								}
							},
							onContentReady: function(){
								$('body').on("keydown", function (e) {
									if( e.ctrlKey || e.metaKey && 'h' === String.fromCharCode(e.which).toLowerCase() || 72 === e.which ) {
										$( '.btn-confirm' ).trigger( 'click' );
									}
								});
							}
						});
					}
				}
			});
		},
		getStructure: function () {
			var wrapper   = $( '.evf-admin-field-wrapper' );
			var structure = [];

			$.each( wrapper.find( '.evf-admin-row' ), function() {
				var $row   = $( this ),
					row_id = $row.attr( 'data-row-id' );

				$.each( $row.find( '.evf-admin-grid' ), function() {
					var $grid   = $( this ),
						grid_id = $grid.attr( 'data-grid-id' );

					var array_index = 0;
					$.each( $grid.find( '.everest-forms-field' ), function() {
						var structure_object = { name: '', value: '' };
						var field_id = $( this ).attr( 'data-field-id' );
						structure_object.name = 'structure[row_' + row_id + '][grid_' + grid_id + '][' + array_index + ']';
						array_index++;
						structure_object.value = field_id;
						structure.push( structure_object );
					});
					if ( $grid.find( '.everest-forms-field' ).length < 1 ) {
						structure.push({ name: 'structure[row_' + row_id + '][grid_' + grid_id + ']', value: '' });
					}
				});
			});

			return structure;
		},
		getFieldArray: function ( grid ) {

			var fields = [];
			$.each(grid.find('.everest-forms-field'), function () {

				var field_id = $(this).attr('data-field-id');
				fields.push(field_id);
			});
			return fields;
		},
		checkEmptyGrid: function( $force ) {
			$.each( $( '.evf-admin-grid' ), function () {
				var $fields = $( this ).find( '.everest-forms-field, .evf-registered-item:not(.ui-draggable-dragging)' );
				if ( $fields.not( '.ui-sortable-helper' ).length < 1 ) {
					$( this ).addClass( 'evf-empty-grid' );
				} else {
					$( this ).removeClass( 'evf-empty-grid' );
				}
			} );
			EVFPanelBuilder.choicesInit();
		},
		bindDefaultTabs: function () {
			$( document ).on( 'click', '.evf-nav-tab-wrapper a', function ( e ) {
				e.preventDefault();
				EVFPanelBuilder.switchTab( $( this ).data( 'panel' ) );
			});
		},
		switchTab: function( panel ) {
			var $panel    = $( '#everest-forms-panel-' + panel ),
				$panelBtn = $( '.evf-panel-' + panel + '-button' );

			$( '.evf-nav-tab-wrapper' ).find( 'a' ).removeClass( 'nav-tab-active' );
			$panelBtn.addClass( 'nav-tab-active' );
			$panel.closest( '.evf-tab-content' ).find( '.everest-forms-panel' ).removeClass( 'active' );
			$panel.addClass( 'active' );

			if ( 'integrations' === panel || 'payments' === panel  ) {
				if ( ! $panel.find( '.everest-forms-panel-sidebar a' ).hasClass( 'active' ) ) {
					$panel.find( '.everest-forms-panel-sidebar a' ).first().addClass( 'active' );
				}

				if ( ! $( '.everest-forms-panel-content' ).find( '.evf-panel-content-section' ).hasClass( 'active' ) ) {
					$( '.everest-forms-panel-content' ).find( '.evf-panel-content-section' ).first().addClass( 'active' );
				}
			}

			history.replaceState({}, null, EVFPanelBuilder.updateQueryString( 'tab', panel ) );
			EVFPanelBuilder.switchPanel(panel);
		},
		updateQueryString: function ( key, value, url ) {
			if ( ! url ) url = window.location.href;
			var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
			hash;

			if ( re.test( url ) ) {
				if ( typeof value !== 'undefined' && value !== null )
					return url.replace(re, '$1' + key + "=" + value + '$2$3');
				else {
					hash = url.split('#');
					url = hash[ 0 ].replace(re, '$1$3').replace(/(&|\?)$/, '');
					if ( typeof hash[ 1 ] !== 'undefined' && hash[ 1 ] !== null )
						url += '#' + hash[ 1 ];
					return url;
				}
			} else {
				if ( typeof value !== 'undefined' && value !== null ) {
					var separator = url.indexOf('?') !== -1 ? '&' : '?';
					hash = url.split('#');
					url = hash[ 0 ] + separator + key + '=' + value;
					if ( typeof hash[ 1 ] !== 'undefined' && hash[ 1 ] !== null )
						url += '#' + hash[ 1 ];
					return url;
				} else {
					return url;
				}
			}
		},
		switchPanel: function ( panel ) {
			if ( panel === 'field-options' ) {
				EVFPanelBuilder.switchToFieldOptionPanel();
			}
		},
		switchToFieldOptionPanel: function ( field_id ) {
			$('.everest-forms-field-options').find('.no-fields').hide();
			$('.evf-admin-field-wrapper .everest-forms-field').removeClass('active');
			$('#everest-forms-panel-fields').addClass('active');
			$('.everest-forms-fields-tab').find('a').removeClass('active');
			$('.everest-forms-fields-tab').find('a').last().addClass('active');
			$('.everest-forms-add-fields').hide();
			$('.everest-forms-field-options').show();
			$('.everest-forms-field-options').find('.everest-forms-field-option').hide();
			$('.evf-tab-lists').find('li a').removeClass('active');
			$('.evf-tab-lists').find('li.evf-panel-field-options-button a').addClass('active');

			$( document.body ).trigger( 'evf-init-switch-field-options' );

			if ( typeof field_id !== 'undefined' ) {
				var $fieldOptions = $( '#everest-forms-field-option-' + field_id );
				if ( $fieldOptions.length > 0 ) {
					$( '#everest-forms-field-option-basic-' + field_id ).find( '.everest-forms-field-option-group-inner').show();
					const $tempLink = $('<a href="#field-options"></a>').appendTo(document.body);

					$tempLink[0].click();

					setTimeout(() => {
						$tempLink.remove();
					}, 100);
				}
				$('#everest-forms-field-option-' + field_id).show();

				/**
				 * Close all field option groups except basic group
				 * This is to ensure that only basic group is open when switching to field options.
				 *
				 * @since 3.2.4
				 */
				$('#everest-forms-field-option-' + field_id).find( '.everest-forms-field-option-group' ).each( function() {
					$field_options_element = $( this );
					if ( ! $field_options_element.hasClass( 'everest-forms-field-option-group-basic' ) ) {
						if ( $field_options_element.hasClass( 'open' ) ) {
							$field_options_element.removeClass( 'open' ).addClass( 'closed' );
							$field_options_element.find( '.everest-forms-field-option-group-inner' ).hide();
						}
					}
				});

				$('#everest-forms-field-' + field_id).addClass('active');
			} else {
				if ( $('.evf-admin-field-wrapper .everest-forms-field').length > 0 ) {
					$('.evf-admin-field-wrapper .everest-forms-field').eq(0).addClass('active');
					$('#everest-forms-field-option-' + $('.evf-admin-field-wrapper .everest-forms-field').eq(0).attr('data-field-id')).show();
				} else {
					$('.everest-forms-field-options').find('.no-fields').show();
				}
			}
		},
		bindFields: function () {
			$( '.evf-admin-field-wrapper' ).sortable({
				items: '.evf-admin-row',
				axis: 'y',
				cursor: 'move',
				opacity: 0.65,
				scrollSensitivity: 40,
				forcePlaceholderSize: true,
				placeholder: 'evf-sortable-placeholder',
				containment: '.everest-forms-panel-content',
				start: function( event, ui ) {
					ui.item.css({
						'backgroundColor': '#f7fafc',
						'border': '1px dashed #5d96ee'
					});
				},
				stop: function( event, ui ) {
					ui.item.removeAttr( 'style' );
				}
			}).disableSelection();

			$( '.evf-admin-grid' ).sortable({
				items: '> .everest-forms-field[data-field-type!="repeater-fields"]',
				delay  : 100,
				opacity: 0.65,
				cursor: 'move',
				scrollSensitivity: 40,
				forcePlaceholderSize: true,
				connectWith: '.evf-admin-grid',
				appendTo: document.body,
				containment: '.everest-forms-field-wrap',

				out: function( event ) {
					$( '.evf-admin-grid' ).removeClass( 'evf-hover' );
					$( event.target ).removeClass( 'evf-item-hover' );
					$( event.target ).closest( '.evf-admin-row' ).removeClass( 'evf-hover' );
					EVFPanelBuilder.checkEmptyGrid();
				},
				over: function( event, ui ) {
					if ( ! ui.item.hasClass('required') ) {
						ui.item.find( '.required' ).remove();
					}
					$( '.evf-admin-grid' ).addClass( 'evf-hover' );
					$( event.target ).addClass( 'evf-item-hover' );
					$( event.target ).closest( '.evf-admin-row' ).addClass( 'evf-hover' );
					EVFPanelBuilder.checkEmptyGrid();
				},
				receive: function( event, ui ) {
					if ( ui.sender.is( 'button' ) ) {
						EVFPanelBuilder.fieldDrop( ui.helper );
					}
				},
				update: function(event, ui) {
					$(document).trigger('evf_sort_update_complete',{event: event,ui:  ui});
				},
				stop: function( event, ui ) {
					if ( !ui.item.hasClass( 'required' ) ) {
						const labelTitle = ui.item.find('.label-title');
						if (labelTitle.length > 0) {
							labelTitle.append('<span class="required">*</span>');
						}
					}
					ui.item.removeAttr( 'style' );
					EVFPanelBuilder.checkEmptyGrid();
				}
			}).disableSelection();

			$( '.evf-registered-buttons button.evf-registered-item' ).draggable({
				delay: 200,
				cancel: false,
				scroll: false,
				revert: 'invalid',
				scrollSensitivity: 40,
				forcePlaceholderSize: true,
				start: function() {
					$( this ).addClass( 'field-dragged' );
				},
				helper: function() {
					return $( this ).clone().insertAfter( $( this ).closest( '.everest-forms-tab-content' ).siblings( '.everest-forms-fields-tab' ) );
				},
				stop: function() {
					$( this ).removeClass( 'field-dragged' );
				},
				opacity: 0.75,
				containment: '#everest-forms-builder',
				connectToSortable: '.evf-admin-grid'
			}).disableSelection();

			// Repeatable grid connect to sortable setter.
			$( ".evf-registered-item.evf-repeater-field" ).draggable( "option", "connectToSortable", ".evf-repeatable-grid" );

			// Adapt hover behaviour on mouse event.
			$( '.evf-admin-row' ).on( 'mouseenter mouseleave', function( event ) {
				if ( 1 > event.buttons ) {
					if ( 'mouseenter' === event.type ) {
						$( this ).addClass( 'evf-hover' );
					} else {
						$( '.evf-admin-row' ).removeClass( 'evf-hover' );
					}
				}
			} );

			// Refresh the position of placeholders on drag scroll.
			$( '.everest-forms-panel-content' ).on( 'scroll', function() {
				$( '.evf-admin-grid' ).sortable( 'refreshPositions' );
				$( '.evf-admin-field-wrapper' ).sortable( 'refreshPositions' );
			} );
		},

		/**
		 * Toggle fields tabs (Add Fields, Field Options).
		 */
		fieldTabChoice: function( id ) {
			$( '.everest-forms-tab-content' ).scrollTop(0);
			$( '.everest-forms-fields-tab a' ).removeClass( 'active' );
			$( '.everest-forms-field, .everest-forms-title-desc' ).removeClass( 'active' );

			$( '#' + id ).addClass( 'active' );

			if ( 'add-fields' === id ) {
				$( '.everest-forms-add-fields' ).show();
				$( '.everest-forms-field-options' ).hide();

			} else {
				if ( 'field-options' === id ) {
					id = $( '.everest-forms-field' ).first().data( 'field-id' );
					$( '.everest-forms-field-options' ).show();
					$( '.everest-forms-field' ).first().addClass( 'active' );
				} else {
					$( '#everest-forms-field-' + id ).addClass( 'active' );

				}
				$( '.everest-forms-field-option' ).hide();
				$( '#everest-forms-field-option-' + id ).show();
				$( '.everest-forms-add-fields' ).hide();
			}
		},
		bindFormPreview: function () {},
		bindFormPreviewWithKeyEvent:function (){
			$( 'body' ).on( 'keydown', function( e ) {
				if (e.ctrlKey || e.metaKey) {
					if ( (
						"p" ===
						String.fromCharCode(e.which).toLowerCase() || 80 === e.which )
					) {
						e.preventDefault();
						 window.open( evf_data.preview_url );
					}
				}

			});
		},
		bindFormEntriesWithKeyEvent:function (){
			$( 'body' ).on( 'keydown', function( e ) {
				if (e.ctrlKey || e.metaKey) {
					if ( (
						"e" ===
						String.fromCharCode(e.which).toLowerCase() || 69 === e.which )
					) {
						e.preventDefault();
						window.open( evf_data.entries_url );
					}
				}

			});
		},
		bindGridSwitcher: function () {
		 	$('body').on('click', '.evf-show-grid', function (e) {
		 		e.stopPropagation();
		 		EVFPanelBuilder.checkEmptyGrid();
		 		$(this).closest('.evf-toggle-row').find('.evf-toggle-row-content').stop(true).slideToggle(200);
		 	});
			$(document).on( 'click', function () {
		 		EVFPanelBuilder.checkEmptyGrid();
		 		$('.evf-show-grid').closest('.evf-toggle-row').find('.evf-toggle-row-content').stop(true).slideUp(200);
		 	});
		 	var max_number_of_grid = 4;
		 	$('body').on('click', '.evf-grid-selector', function () {
		 		var $this_single_row = $(this).closest('.evf-admin-row');
		 		if ( $(this).hasClass('active') ) {
		 			return;
		 		}
		 		var grid_id = parseInt( $( this ).attr( 'data-evf-grid' ), 10 );
		 		if ( grid_id > max_number_of_grid ) {
		 			return;
		 		}

		 		var grid_node = $('<div class="evf-admin-grid evf-grid-' + grid_id + ' ui-sortable evf-empty-grid" />');
		 		var grids = $('<div/>');

		 		$.each($this_single_row.find('.evf-admin-grid'), function () {
		 			$(this).children('*').each(function () {
						grids.append($(this).clone());  // "this" is the current element in the loop
					});
		 		});
		 		$this_single_row.find('.evf-admin-grid').remove();
		 		$this_single_row.find('.evf-clear ').remove();
		 		$this_single_row.append('<div class="clear evf-clear"></div>');

		 		for ( var $grid_number = 1; $grid_number <= grid_id; $grid_number++ ) {

		 			grid_node.attr('data-grid-id', $grid_number);
		 			$this_single_row.append(grid_node.clone());

		 		}
		 		$this_single_row.append('<div class="clear evf-clear"></div>');
		 		$this_single_row.find('.evf-admin-grid').eq(0).append(grids.html());
		 		$this_single_row.find('.evf-grid-selector').removeClass('active');
		 		$(this).addClass('active');
		 		EVFPanelBuilder.bindFields();
		 	});
		},
		fieldDrop: function ( field ) {
			var field_type = field.attr( 'data-field-type' );
			var invalid_fields = ["payment-total"];
			if (
				invalid_fields.includes(
					field_type
				) && field.closest('.evf-admin-row').hasClass('evf-repeater-fields')
			) {
				$.confirm({
					title: false,
					content:'This field cannot be added to Repeater Fields',
					type: 'red',
					closeIcon: false,
					backgroundDismiss: false,
					icon: 'dashicons dashicons-warning',
					buttons: {
						cancel: {
							text: evf_data.i18n_close,
							btnClass: 'btn-default',
						},
					}
				} );

				field.remove();
				return false;
			}

			field.css({
				'left': '0',
				'width': '100%'
			}).append( '<i class="spinner is-active"></i>' );

			$.ajax({
				url: evf_data.ajax_url,
				type: 'POST',
				data: {
					action: 'everest_forms_new_field_' + field_type,
					security: evf_data.evf_field_drop_nonce,
					field_type: field_type,
					form_id: evf_data.form_id
				},
				beforeSend: function() {
					$( document.body ).trigger( 'init_field_options_toggle' );
				},
				success: function( response ) {
					var field_preview = response.data.preview,
						field_options = response.data.options,
						form_field_id = response.data.form_field_id,
						field_type = response.data.field.type,
						dragged_el_id = $( field_preview ).attr( 'id' ),
						dragged_field_id = $( field_preview ).attr( 'data-field-id' );

					$( '#everest-forms-field-id' ).val( form_field_id );
					$( '.everest-forms-field-options' ).find( '.no-fields' ).hide();
					$( '.everest-forms-field-options' ).append( field_options );
					$( '.everest-forms-field-option-row-icon_color input.colorpicker' ).wpColorPicker({
						change: function( event ) {
							var $this    = $( this ),
								value    = $this.val(),
								field_id = $this.closest( '.everest-forms-field-option-row' ).data( 'field-id' );

							$( '#everest-forms-field-' + field_id + ' .rating-icon svg' ).css( 'fill', value );
						}
					});

					field.after( field_preview );

					if ( null !== $( '#everest-forms-panel-field-settings-enable_survey') && $( '#everest-forms-panel-field-settings-enable_survey' ).prop( 'checked' ) ) {
						$( '#everest-forms-field-option-' + dragged_field_id + '-survey_status' ).prop( 'checked', true );
					}

					if ( null !== $( '#everest-forms-panel-field-settings-enable_quiz' ) && $( '#everest-forms-panel-field-settings-enable_quiz' ).prop( 'checked' ) ) {
						$( '#everest-forms-field-option-' + dragged_field_id + '-quiz_status' ).prop( 'checked', true );
						$( '#everest-forms-field-option-' + dragged_field_id + '-quiz_status' ).closest( '.everest-forms-field-option-row-quiz_status' ).siblings( '.everst-forms-field-quiz-settings' ).removeClass( 'everest-forms-hidden' ).addClass( 'everest-forms-show' );
					}

					field.remove();

					// Triggers.
					$( document.body ).trigger( 'init_tooltips' );
					$( document.body ).trigger( 'init_field_options_toggle' );
					$( document.body ).trigger( 'evf_after_field_append', [dragged_el_id] );
					// Conditional logic append rules.
					EVFPanelBuilder.conditionalLogicAppendField( dragged_el_id );
					EVFPanelBuilder.conditionalLogicAppendFieldIntegration( dragged_el_id );
					EVFPanelBuilder.paymentFieldAppendToQuantity( dragged_el_id );
					EVFPanelBuilder.paymentFieldAppendToDropdown( dragged_field_id, field_type );

					//One Time draggable.
					EVFPanelBuilder.oneTimeDraggableField( dragged_field_id, field_type );

					// Initialization Datepickers.
					EVFPanelBuilder.init_datepickers();
					EVFPanelBuilder.init_payment_subscription_plan_field();

					// Hiding time min max options in setting for Datepickers.
					$('#everest-forms-field-option-' + dragged_field_id + '-enable_min_max_time').hide();
					$('label[for=everest-forms-field-option-' + dragged_field_id + '-enable_min_max_time]').hide();
					$('label[for=everest-forms-field-option-' + dragged_field_id + '-select_min_time]').hide();
					$('label[for=everest-forms-field-option-' + dragged_field_id + '-select_max_time]').hide();
					$('#everest-forms-field-option-' + dragged_field_id + '-min_time_hour').parent().hide();
					$('#everest-forms-field-option-' + dragged_field_id + '-max_time_hour').parent().hide();

					// Trigger an event indicating completion of field_drop action.
					$( document.body ).trigger( 'evf_field_drop_complete', [ field_type, dragged_field_id, field_preview, field_options ] );
					EVFPanelBuilder.checkEmptyGrid();
				}
		 	});
		},

		conditionalLogicAppendField: function( id ){
			var dragged_el = $('#' + id);
			var dragged_index = dragged_el.index();

			var fields = $('.evf-field-conditional-field-select');

			var field_type = dragged_el.attr( 'data-field-type' );
			var field_id = dragged_el.attr( 'data-field-id' );
			var field_label = dragged_el.find( '.label-title .text ' ).text();

			$.fn.insertAt = function(elements, index, selected_id ) {
			    var array = $.makeArray(this.children().clone(true));
				array.splice(index, 0, elements);
				$.each( array, function( index, el ) {
					if( selected_id === $( el )[0]['value'] ) {
						$( el )[0]['selected'] = true;
						array[ index ] = el;
					}
				} );
			    this.empty().append(array);
			};
			var dragged_field_id = field_id;
			fields.each(function(index, el) {
				var selected_id = $( el ).val();
				var id_key = id.replace('everest-forms-field-', '');
				var name = $(el).attr('name');
				var name_key = name.substring(
				    name.indexOf("[") + 1,
				    name.indexOf("]")
				);

				if (id_key === name_key) {
					$('.evf-admin-row .evf-admin-grid .everest-forms-field').each( function(){
						var form_field_type  = $( this ).data('field-type'),
							form_field_id    = $( this ).data('field-id'),
							form_field_label = $( this ).find('.label-title span').first().text();
							field_to_be_restricted =[];
							field_to_be_restricted = [
								'html',
								'title',
								'address',
								'image-upload',
								'file-upload',
								'date-time',
								'hidden',
								'scale-rating',
								'likert',
								'yes-no',
							];
						if( $.inArray( form_field_type, field_to_be_restricted ) === -1  && dragged_field_id !== form_field_id ){
							if( 0 === fields.eq(index).find( 'option[data-field_id="'+form_field_id+'"]' ).length ) {
								fields.eq(index).append('<option class="evf-conditional-fields" data-field_type="'+form_field_type+'" data-field_id="'+form_field_id+'" value="'+form_field_id+'">'+form_field_label+'</option>');
							}
						}
					});
				} else {
					var el_to_append = '<option class="evf-conditional-fields" data-field_type="'+field_type+'" data-field_id="'+field_id+'" value="'+field_id+'">'+field_label+'</option>';
					if (
						"html" !== field_type &&
						"title" !== field_type &&
						"address" !== field_type &&
						"image-upload" !== field_type &&
						"file-upload" !== field_type &&
						"hidden" !== field_type &&
						"likert" !== field_type &&
						"scale-rating" !== field_type &&
						"yes-no" !== field_type &&
						"divider" !== field_type
					) {
						fields
							.eq(index)
							.insertAt(el_to_append, 1, selected_id);
					}
				}
				if( fields.eq( index ).find( 'option:not(.evf-conditional-fields)').length > 1 ) {
					fields.eq( index ).find( 'option:not(.evf-conditional-fields):gt(0)').remove();
				}
			});
		},
		conditionalLogicAppendRow: function( id ){

			var new_row_option = $('#everest-forms-row-option-row_' + id);

			var fields = $( '.everest-forms-field' );

			fields.each( function() {
				var field = $(this),
					field_id = field.attr( 'data-field-id' ),
					field_type = field.attr( 'data-field-type' ),
					field_label = '';


				field.find( '.required').remove()
				field_label = field.find( '.label-title').html();

				var el_to_append = '<option class="evf-conditional-fields" data-field_type="'+field_type+'" data-field_id="'+field_id+'" value="'+field_id+'">'+field_label+'</option>';

				if (
					0 ===
						$(document).find(
							'.evf-admin-row[data-row-id="' +
								id +
								'"] #everest-forms-field-' +
								field_id
						).length &&
					0 ===
						new_row_option.find(
							'.evf-field-conditional-field-select option[data-field_id="' +
								field_id +
								'"]'
						).length &&
					"html" !== field_type &&
					"title" !== field_type &&
					"address" !== field_type &&
					"image-upload" !== field_type &&
					"file-upload" !== field_type &&
					"date-time" !== field_type &&
					"hidden" !== field_type &&
					"likert" !== field_type &&
					"scale-rating" !== field_type &&
					"divider" !== field_type
				) {
					new_row_option
						.find(".evf-field-conditional-field-select")
						.append(el_to_append);
				}
				if( new_row_option.find( '.evf-field-conditional-field-select option:not(.evf-conditional-fields)').length > 1 ) {
					new_row_option.find( '.evf-field-conditional-field-select option:not(.evf-conditional-fields):gt(0)').remove();
				}
				new_row_option.hide();
			})
		},

		paymentFieldAppendToQuantity: function( id ) {
			var dragged_el = $( '#' + id );

			var fields = $( '.everest-forms-field-option-row-map_field select' );
			var field_type = dragged_el.attr( 'data-field-type' );
			var field_id = dragged_el.attr( 'data-field-id' );
			var field_label = dragged_el.find( '.label-title .text ' ).text();

			var el_to_append = '<option value="'+field_id+'">'+field_label+'</option>';
			if( 'payment-single' === field_type || 'payment-multiple' === field_type || 'payment-checkbox' === field_type ) {
				fields.append( el_to_append );
			}
		},

		paymentFieldAppendToDropdown: function( dragged_field_id, field_type ){
			if('payment-quantity' === field_type || 'payment-coupon' === field_type || 'payment-subtotal' === field_type ) {
				var match_fields = [ 'payment-checkbox', 'payment-multiple', 'payment-single', 'range-slider' ],
					qty_dropdown = $('#everest-forms-field-option-' + dragged_field_id + '-map_field');
				match_fields.forEach(function(single_field){
					$('.everest-forms-field-'+single_field).each(function(){
						if( 'range-slider' === $(this).attr('data-field-type')) {
							if('true' === ($(this).find('.evf-range-slider-preview').attr('data-enable-payment-slider'))) {
								var id = $(this).attr('data-field-id'),
									label = $(this).find( ".label-title .text" ).text();
								var el_to_append = '<option value="'+id+'">'+label+'</option>';
							}else{
								return;
							}
						}
						var id = $(this).attr('data-field-id'),
							label = $(this).find( ".label-title .text" ).text();
						var el_to_append = '<option value="'+id+'">'+label+'</option>';
						qty_dropdown.append( el_to_append );
					});
				});
			}
		},

		oneTimeDraggableField: function( dragged_field_id, field_type ){
			var singleDraggableFields = evf_data.form_one_time_draggable_fields;
			var draggedFieldElement = $('#everest-forms-add-fields-' + field_type);

			if (singleDraggableFields.length > 0 && $.inArray(field_type, singleDraggableFields) >= 0 && draggedFieldElement.length) {
				draggedFieldElement.addClass('evf-one-time-draggable-field');
			}

		},

		conditionalLogicAppendFieldIntegration: function( id ){
			var dragged_el = $('#' + id);
			var dragged_index = dragged_el.index();

			var fields = $( '.evf-provider-conditional' ).find('.evf-conditional-field-select');

			var field_type = dragged_el.attr( 'data-field-type' );
			var field_id = dragged_el.attr( 'data-field-id' );
			var field_label = dragged_el.find( '.label-title .text ' ).text();

			$.fn.insertAt = function(elements, index) {
			    var array = $.makeArray(this.children().clone(true));
			    array.splice(index, 0, elements);
			    this.empty().append(array);
			};

			fields.each(function(index, el) {
				var id_key = id.replace('everest-forms-field-', '');
				var name = $(el).attr('name');
				var name_key = name.substring(
				    name.indexOf("[") + 1,
				    name.indexOf("]")
				);

				if (id_key === name_key) {
					$('.evf-admin-row .evf-admin-grid .everest-forms-field').each( function(){
						var field_type  = $( this ).data('field-type'),
							field_id    = $( this ).data('field-id'),
							field_label = $( this ).find('.label-title span').first().text();
							field_to_be_restricted =[];
							field_to_be_restricted = [
								"html",
								"title",
								"address",
								"image-upload",
								"file-upload",
								"signature",
								"divider",
								"date-time",
								"hidden",
								"scale-rating",
								"likert",
								"yes-no",
								dragged_el.attr("data-field-type"),
							];

						if( $.inArray( field_type, field_to_be_restricted ) === -1 ){
							fields.eq(index).append('<option class="evf-conditional-fields" data-field_type="'+field_type+'" data-field_id="'+field_id+'" value="'+field_id+'">'+field_label+'</option>');
						}
					});
				} else {
					var el_to_append = '<option class="evf-conditional-fields" data-field_type="'+field_type+'" data-field_id="'+field_id+'" value="'+field_id+'">'+field_label+'</option>';
					if( 'html' !== field_type && 'title' !== field_type && 'address' !== field_type && 'image-upload' !== field_type && 'file-upload' !== field_type && 'date-time' !== field_type && 'hidden' !== field_type && 'likert' !== field_type && 'scale-rating' !== field_type && 'yes-no' !== field_type ) {
						fields.eq(index).insertAt( el_to_append, dragged_index );
					}
				}
			});
		 },

		conditionalLogicRemoveField: function( id ){
			$( '.evf-field-conditional-field-select option[value = ' +id +' ]' ).remove();
		},

		conditionalLogicRemoveFieldIntegration: function( id ){
			$( '.evf-provider-conditional .evf-conditional-field-select option[value = ' +id +' ]' ).remove();
		},

		paymentFieldRemoveFromQuantity: function( id ) {
			$('.everest-forms-field-option-row-map_field select option[value = ' +id +' ]').remove();
		},

		oneTimeDraggableRemoveField : function (field_type ) {
			var dragged_field_id = $('#everest-forms-add-fields-' + field_type);
			if (dragged_field_id.hasClass('evf-one-time-draggable-field')) {
				dragged_field_id.removeClass('upgrade-modal');
				dragged_field_id.removeClass('evf-one-time-draggable-field');
			}
		},

		bindFieldSettings: function () {
			$( 'body' ).on( 'click', '.everest-forms-preview .everest-forms-field, .everest-forms-preview .everest-forms-field .everest-forms-field-setting', function(e) {
				e.preventDefault();
				var field_id = $( this ).closest( '.everest-forms-field' ).attr( 'data-field-id' );
				$( '.everest-forms-tab-content' ).scrollTop(0);
				EVFPanelBuilder.switchToFieldOptionPanel( field_id );
			} );
		},

		toggleLabelEdit: function( label, input ) {
			$( label ).toggleClass( 'everest-forms-hidden' );
			$( input ).toggleClass( 'everest-forms-hidden' );

			if ( $( input ).is( ':visible' ) ) {
				$( input ).focus();
			}
		},

		bindToggleHandleActions: function () {
			$( 'body' ).on( 'click', '.toggle-handle', function ( e ) {
				var label = $( this ).data( 'label' ),
					input = $( this ).data( 'input' );

				if ( ! $( input ).is(':visible') ) {
					EVFPanelBuilder.toggleLabelEdit( label, input );
				}
			});
		},

		bindLabelEditInputActions: function () {
			$( 'body' ).on( 'focusout', '.label-edit-input', function ( e ) {
				var label = $( this ).data( 'label' ),
					input = this;

				EVFPanelBuilder.toggleLabelEdit( label, input );
			});
		},

		/**
		 * Sync an input element with other elements like labels. An element with `sync-input` class will be synced to the elements
		 * specified in `sync-targets` data.
		 *
		 * `Warning:` This is an one way sync, meaning only the text `sync-targets` will be updated when the source element's value changes
		 * and the source element's value will not be updated if the value of `sync-targets` changes.
		 */
		bindSyncedInputActions: function () {
			$( 'body' ).on( 'input', '.sync-input', function ( e ) {
				var changed_value = $( this ).val(),
					sync_targets = $( this ).data( 'sync-targets' );

				if ( changed_value && sync_targets ) {
					$( sync_targets ).text( changed_value );
				}
			});
		},
		/**
		 * Akismet anti-spam protection.
		 *
		 * @since 2.4.0
		 */
		bindAkismetInit:function(){
			var akismetEnabler = $(document).find('#everest-forms-panel-field-settings-akismet');
			EVFPanelBuilder.akismetTogger(akismetEnabler);
			$(document).on('change', '#everest-forms-panel-field-settings-akismet', function(){
				EVFPanelBuilder.akismetTogger($(this));
			})
		},
		/**
		 * Akismet Toggler.
		 *
		 * @param {object} akismetEnabler
		 */
		akismetTogger:function(akismetEnabler){
			if($(akismetEnabler).is(':checked')){
				$(document).find('.everest-forms-akismet-protection-type').show();
			}else{
				$(document).find('.everest-forms-akismet-protection-type').hide();
			}
		},

		/**
		 * Form Submission minimum waiting time.
		 *
		 * @since 3.0.2
		 */
		bindFormSubmissionMinWaitingTime:function(){
			var submissionWaitingTimeEnabler = $(document).find('#everest-forms-panel-field-settings-form_submission_min_waiting_time');
			EVFPanelBuilder.formSubmissionMinTimeToggler(submissionWaitingTimeEnabler);
			$(document).on('change', '#everest-forms-panel-field-settings-form_submission_min_waiting_time', function(){
				EVFPanelBuilder.formSubmissionMinTimeToggler($(this));
			})
		},
		/**
		 * Form Submission waiting time Toggler.
		 *
		 * @param {object} submissionWaitingTimeEnabler
		 */
		formSubmissionMinTimeToggler:function(submissionWaitingTimeEnabler){
			if($(submissionWaitingTimeEnabler).is(':checked')){
				$(document).find('.everest-forms-form-submission-minimum-waiting-time').show();
			}else{
				$(document).find('.everest-forms-form-submission-minimum-waiting-time').hide();
			}
		},
		bindEditMetaKey: function( field_id = '') {
			$(document).on('click', '.evf-meta-key-copy-btn', function () {
				const $wrapper = $(this).closest('.evf-meta-key-input-wrapper');
				const $input = $wrapper.find('.evf-input-meta-key');
				const metaKey = $input.val();

				$( this ).tooltipster( 'content', $( this ).attr( 'data-copied' ) ).trigger( 'mouseenter' ).on( 'mouseleave', function() {
					var $this = $( this );

					setTimeout( function() {
						$this.tooltipster( 'content', $this.attr( 'data-tip' ) );
					}, 1000 );
				} );

				navigator.clipboard.writeText(metaKey);
			});

			if ( '' === field_id ) {
				$(document).find('.evf-input-meta-key').each(function () {
					var $this = $(this);

					appendEditIcon( $this );
				});
			}else{
				var $this = $( '#everest-forms-field-option-' + field_id + '-meta-key' );
				appendEditIcon( $this );
			}

			function appendEditIcon($this) {
				$this.wrap('<div class="evf-meta-key-input-wrapper"></div>');

				$this.before(`<span class="evf-edit-meta-key-icon" data-meta_key="${$this.val()}">Edit</span>`);

				const $copyBtn = $(`
					<span class="evf-meta-key-copy-btn" data-copied="Copied!" data-tip="Copy to clipboard">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M15.002 5.99902H7.50195C6.67353 5.99902 6.00195 6.6706 6.00195 7.49902V14.999C6.00195 15.8274 6.67353 16.499 7.50195 16.499H15.002C15.8304 16.499 16.502 15.8274 16.502 14.999V7.49902C16.502 6.6706 15.8304 5.99902 15.002 5.99902Z" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M3.00195 11.999C2.17695 11.999 1.50195 11.324 1.50195 10.499V2.99902C1.50195 2.17402 2.17695 1.49902 3.00195 1.49902H10.502C11.327 1.49902 12.002 2.17402 12.002 2.99902" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</span>
				`);

				$this.after($copyBtn);

				// Initialize Tooltipster
				$copyBtn.tooltipster({
					theme: 'tooltipster-default',
					delay: 100,
					side: 'top',
					updateAnimation: 'null'
				});
			}

		},

		bindPrivacyPolicyActions: function() {
			// Consent message change handler.
			$( document.body ).on( 'input', '.everest-forms-field-option .evf-privacy-policy-consent-message', function ( e ) {
				var new_message = EVFPanelBuilder.processSyntaxes( $( this ).val() );

				// Update with the new processed consent message.
				$( '.everest-forms-field.active' ).find( '.evf-privacy-policy-consent-message' ).html( new_message );
			});

			// Local page add handler.
			$( document.body ).on( 'click', '.everest-forms-field-option .evf-add-local-privacy-policy-page', function ( e ) {
				var new_message = $( '.everest-forms-field-option:visible .evf-privacy-policy-consent-message' ).val(),
					selected_page_id = $( '.everest-forms-field-option:visible .evf-select-local-privacy-policy-page' ).val(),
					selected_page_title = $( '.everest-forms-field-option:visible .evf-select-local-privacy-policy-page option:selected' ).html();

				// Append a hyperlink syntax containing the selected page to the consent message.
				if ( selected_page_id ) {
					new_message += '[' + selected_page_title + '](?page_id=' + selected_page_id + ')';

					// Update with the new consent message.
					$( '.everest-forms-field-option:visible .evf-privacy-policy-consent-message' ).val( new_message );
					new_message = EVFPanelBuilder.processSyntaxes( new_message );
					$( '.everest-forms-field.active' ).find( '.evf-privacy-policy-consent-message' ).html( new_message );
				}
			});

			// Custom page add handler.
			$( document.body ).on( 'click', '.everest-forms-field-option .evf-privacy-policy-add-custom-url', function ( e ) {
				var new_message = $( '.everest-forms-field-option:visible .evf-privacy-policy-consent-message' ).val(),
					label = $( '.everest-forms-field-option:visible .evf-privacy-policy-custom-link-label' ).val().trim(),
					url = $( '.everest-forms-field-option:visible .evf-privacy-policy-custom-link-url' ).val().trim();

				// Prepend `http` protocol in the url.
				if ( url.search( 'http' ) < 0 ) {
					url = 'http://' + url;
				}

				// Append a hyperlink syntax containing the custom URL to the consent message.
				if ( '' !== url ) {
					new_message += '[' + label + '](' + url + ')';

					// Update with the new consent message.
					$( '.everest-forms-field-option:visible .evf-privacy-policy-consent-message' ).val( new_message );
					new_message = EVFPanelBuilder.processSyntaxes( new_message );
					$( '.everest-forms-field.active' ).find( '.evf-privacy-policy-consent-message' ).html( new_message );

					// Empty the input fields.
					$( '.everest-forms-field-option:visible .evf-privacy-policy-custom-link-label' ).val( '' );
					$( '.everest-forms-field-option:visible .evf-privacy-policy-custom-link-url' ).val( '' );
				}
			});
		},
		/**
		 * Process syntaxes in a text.
		 *
		 * @since 1.7.0
		 *
		 * @param {string} text Text to be processed.
		 * @param {bool}   escape_html Whether to escape all the htmls before processing or not.
		 *
		 * @return {string} Processed text.
		 */
		processSyntaxes: function( text ) {
			text = text.replace( /^\s+/g, '' );
			text = EVFPanelBuilder.processHyperlinkSyntax( text );
			text = EVFPanelBuilder.process_italic_syntax( text );
			text = EVFPanelBuilder.process_bold_syntax( text );
			text = EVFPanelBuilder.process_underline_syntax( text );
			text = EVFPanelBuilder.process_new_lines( text );
			return text;
		},

		/**
		 * Process hyperlink syntaxes in a text.
		 * The syntax used for hyperlink is: [Link Label](Link URL)
		 * Example: [Google Search Page](https://google.com)
		 *
		 * @since 1.7.0
		 *
		 * @param {string} text Text to process.
		 *
		 * @return {string} Processed text.
		 */
		processHyperlinkSyntax: function( text ) {
			var regex = new RegExp( /(\[[^\[\]]*\])(\([^\(\)]*\))/g );

			// Process all the hyperlink syntax.
			while ( matches = regex.exec( text ) ) {
				var matched_string = matches[0];
				var label          = matches[1];
				var link           = matches[2];

				// Trim brackets.
				label = label.substring( 1, label.length - 1 );
				link = link.substring( 1, link.length - 1 );

				// Proceed only if label or link is not empty.
				if ( '' !== label || '' !== link ) {

					// Use hash(#) if the link is empty.
					if ( '' === link ) {
						link = '#';
					}

					// Use link as label if it's empty.
					if ( '' === label ) {
						label = link;
					}

					// Insert hyperlink html.
					var html = '<a href="' + link + '">' + label + '</a>';
					text = text.replace( matched_string, html );
				} else {
					// If both label and link are empty then replace it with empty string.
					text = text.replace( matched_string, '' );
				}
			}
			return text;
		},

		/**
		 * Process italic syntaxes in a text.
		 * The syntax used for italic text is: `text`
		 * Just wrap the text with back tick characters. To escape a backtick insert a backslash(\) before the character like "\`".
		 *
		 * @since 1.7.0
		 *
		 * @param {string} text Text to process.
		 *
		 * @return {string} Processed text.
		 */
		process_italic_syntax: function( text ) {
			var regex = new RegExp( /`[^`]+`/g );
			text = text.split( '\\`' ).join( '<&&&&&>' ); // To preserve an escaped special character '`'.

			while ( matches = regex.exec( text ) ) {
				var matched_string = matches[0];
				var label = matched_string.trim().substring( 1, matched_string.length - 1 );
				var html = '<i>' + label + '</i>';
				text = text.replace( matched_string, html );
			}
			return text.split( '<&&&&&>' ).join( '`' );
		},

		/**
		 * Process bold syntaxes in a text.
		 * The syntax used for bold text is: *text*
		 * Just wrap the text with asterisk characters. To escape an asterisk insert a backslash(\) before the character like "\*".
		 *
		 * @since 1.7.0
		 *
		 * @param {string} text Text to process.
		 *
		 * @return {string} Processed text.
		 */
		process_bold_syntax: function( text ) {
			var regex = new RegExp( /\*[^*]+\*/g );
			text = text.split( '\\*' ).join( '<&&&&&>' ); // To preserve an escaped special character '*'.

			while ( matches = regex.exec( text ) ) {
				var matched_string = matches[0];
				var label = matched_string.trim().substring( 1, matched_string.length - 1 );
				var html = '<b>' + label + '</b>';
				text = text.replace( matched_string, html );
			}
			return text.split( '<&&&&&>' ).join( '*' );
		},

		/**
		 * Process underline syntaxes in a text.
		 * The syntax used for bold text is: __text__
		 * Wrap the text with double underscore characters. To escape an underscore insert a backslash(\) before the character like "\_".
		 *
		 * @since 1.7.0
		 *
		 * @param {string} text Text to process.
		 *
		 * @return {string} Processed text.
		 */
		process_underline_syntax: function( text ) {
			var regex = new RegExp( /__[^_]+__/g );
			text = text.split( '\\_' ).join( '<&&&&&>' ); // To preserve an escaped special character '_'.

			while ( matches = regex.exec( text ) ) {
				var matched_string = matches[0];
				var label = matched_string.trim().substring( 2, matched_string.length - 2 );
				var html = '<u>' + label + '</u>';
				text = text.replace( matched_string, html );
			}
			return text.split( '<&&&&&>' ).join( '_' );
		},

		/**
		 * It replaces `\n` characters with `<br/>` tag because new line `\n` character is not supported in html.
		 *
		 * @since 1.7.0
		 *
		 * @param {string} text
		 *
		 * @return {string} Processed text.
		 */
		process_new_lines: function( text ) {
			//Ref: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
			return text.split( '\n' ).join( '<br/>' );
		},
		livePreviewNumberOfRating : function( el ) {
			var $this  = $( el ),
			value  = $this.val();
			if( value.length == 0 || value <= 0){
				value = 1 ;
			}
			var id    = $this.parent().data( 'field-id' ),
				icons = $( '#everest-forms-field-'+id +' .rating-icon' ).first();
			if ( value <= 100 ) {
				$( '#everest-forms-field-'+id +' .rating-icon' ).remove();
				for ( var $i = 1; $i <= value; $i++ ) {
					$( '#everest-forms-field-'+id +'').append( icons.clone() );
				}
			}
		},
		bindFormTags: function() {

		}

	};

	EVFPanelBuilder.init();
})(jQuery, window.evf_data);

jQuery(function ($) {

	if ( $('#everest-forms-panel-field-settingsemail-evf_send_confirmation_email').attr("checked") != 'checked' )	{
		$('#everest-forms-panel-field-settingsemail-evf_send_confirmation_email-wrap').nextAll().hide();
	}

	$( '#everest-forms-panel-field-settingsemail-evf_send_confirmation_email' ).on( 'change', function () {

		if ( $( this ).attr('checked') != 'checked') {
			$('#everest-forms-panel-field-settingsemail-evf_send_confirmation_email-wrap').nextAll().hide();
		} else {
			$('#everest-forms-panel-field-settingsemail-evf_send_confirmation_email-wrap').nextAll().show();
		}
	});

	window.pageType = function(el, redirectTo) {
		var outerWrapper = $(el).closest('.evf-confirmation-wrap');

		// If the element isn't checked, return early.
		if (!el.is(':checked')) {
			return;
		}

		// Show the appropriate settings based on redirect type.
		switch (redirectTo) {
			case 'same':
				$(outerWrapper).find('.same-page-setting').show();
				outerWrapper.find('.external-page-setting, .custom-page-setting').hide();
				outerWrapper.find('.custom-and-external-page-setting').hide();

				// Handle form state type changes.
				var el = outerWrapper.find('.form-state-type:checked');
				var initialValue = el.val();

				toggleMessageLocations(el, initialValue);
				previewType(el, outerWrapper);

				outerWrapper.off('change', '.form-state-type').on('change', '.form-state-type', function() {
					toggleMessageLocations($(this), $(this).val());
				});

				outerWrapper.on('change', '.everest-preview-confirmation', function(){
					var html = '';
					if($(this).is(':checked')) {
						var options =[{value:'top', label: 'Above Form Summary'}, {value:"bottom", label:'Below Form Summary'}, {value:'popup', label:'As Popup'}];
					}else{
						var options =[{value:'hide', label: 'Shown Message in Place of Form'}, {value:'popup', label:'As Popup'}];
					}

					var select = outerWrapper.find('.form-state-hide select');

					select.empty();

					$.each(options, function(index, option) {
						html += `<option value="${option.value}">${option.label}</option>`;
					});

					select.html(html);
					setTimeout(function() {
								select.trigger('change');
							}, 50);

				})
				break;
			case 'custom_page':
				outerWrapper.find('.custom-page-setting').show();
				outerWrapper.find('.custom-and-external-page-setting').show();
				outerWrapper.find('.same-page-setting, .external-page-setting').hide();

				toggleAppendQueryString(outerWrapper);
				break;
			case 'external_url':
				outerWrapper.find('.external-page-setting').show();
				outerWrapper.find('.custom-and-external-page-setting').show();
				outerWrapper.find('.same-page-setting, .custom-page-setting').hide();

				toggleAppendQueryString(outerWrapper);
				break;
			default:
				console.warn('Unknown redirect type:', redirectTo);
				break;
		}
	}

	// Initialize on page load
	$(function($) {

		// Get initial value and apply
		$('.confirmation-redirect-to').each(function(){
			var initialValue = $(this).val();
			window.pageType($(this), initialValue);
		});

		// Handle changes
		$(document).on('change', '.confirmation-redirect-to', function() {
			window.pageType($(this), $(this).val());
		});
	});


	// Function to toggle message locations based on form state
	function toggleMessageLocations(el, state) {
		var wrapper = $(el).closest('.everest-forms-border-container');
		wrapper.find('.form-state-hide, .form-state-reset').hide();

		if (state === 'hide') {
			wrapper.find('.form-state-hide').show();
			wrapper.find('.preview-confirmation-toggle-wrapper').show();
			if(wrapper.find('.everest-preview-confirmation').is(':checked')) {
				wrapper.find('.preview-confirm-select-wrapper').show();
			}else{
				wrapper.find('.preview-confirm-select-wrapper').hide();
			}
		} else if (state === 'reset') {
			wrapper.find('.preview-confirmation-toggle-wrapper').hide();
			wrapper.find('.preview-confirm-select-wrapper').hide();
			wrapper.find('.form-state-reset').show();
		}
	}

	// Handle query string toggle
	function toggleAppendQueryString(outerWrapper) {
		var queryStringWrap = outerWrapper.find('.query-string-wrap');
		var appendInput = outerWrapper.find('.append-query-string-input');
		queryStringWrap.toggle(appendInput.is(':checked'));

		outerWrapper.on('change', '.append-query-string-input', function() {
			queryStringWrap.toggle($(this).is(':checked'));
		});
	}

	function previewType(el, outerWrapper) {
		var queryStringWrap = outerWrapper.find('.preview-confirm-select-wrapper');

		if(el.val() == 'reset') {
		  queryStringWrap.toggle(false);
		  return;
		}

		var appendInput = outerWrapper.find('.everest-preview-confirmation');
		queryStringWrap.toggle(appendInput.is(':checked'));

		outerWrapper.on('change', '.everest-preview-confirmation', function() {
			queryStringWrap.toggle($(this).is(':checked'));
		});
	}

	$( '.evf-panel-field-options-button.evf-disabled-tab' ).hide();
});

jQuery( function ( $ ) {

	// Add Fields - Open/close.
	$( document.body ).on( 'init_add_fields_toogle', function() {
		$( '.everest-forms-add-fields' ).on( 'click', '.everest-forms-add-fields-group > a', function( event ) {
			event.preventDefault();
			$( this ).parent( '.everest-forms-add-fields-group' ).toggleClass( 'closed' ).toggleClass( 'open' );
		});
		$( '.everest-forms-add-fields' ).on( 'click', '.everest-forms-add-fields-group a', function() {
			$( this ).next( '.evf-registered-buttons' ).stop().slideToggle();
		});
		$( '.everest-forms-add-fields-group.closed' ).each( function() {
			$( this ).find( '.evf-registered-buttons' ).hide();
		});
	} ).trigger( 'init_add_fields_toogle' );

	// Fields Options - Open/close.
	$( document.body ).on( 'click', '.everest-forms-field-option .everest-forms-field-option-group > a', function( event ) {
		event.preventDefault();
		var $fielOption = $( this ).closest( '.everest-forms-field-option-group' ).closest('.everest-forms-field-option');
		var currentElement = $( this ),
		    currentElementId = currentElement.parent( '.everest-forms-field-option-group').attr( 'id');

		$fielOption.find( '.everest-forms-field-option-group' ).each( function() {
			var selectedID = $( this ).attr( 'id' );
			if ( currentElementId !== selectedID ) {
				$( this ).removeClass( 'open' ).addClass( 'closed' );
			}
		});

		$( this ).parent( '.everest-forms-field-option-group' ).toggleClass( 'closed' ).toggleClass( 'open' );
		$( '.everest-forms-field-option-group.closed' ).each( function() {
			$( this ).find( '.everest-forms-field-option-group-inner' ).hide();
		});
	});
	$( document.body ).on( 'click', '.everest-forms-field-option .everest-forms-field-option-group a', function( event ) {
		// If the user clicks on some form input inside, the box should not be toggled.
		if ( $( event.target ).filter( ':input, option, .sort' ).length ) {
			return;
		}
		$( this ).next( '.everest-forms-field-option-group-inner' ).stop().slideToggle();

		/**
		 * If the field option group is not basic, then auto scroll to top.
		 *
		 * @since 3.3.0
		 */
		var $el = $( this ).closest('.everest-forms-field-option-group');

		if ( $el.length && ! $el.hasClass( 'everest-forms-field-option-group-basic' ) ) {
			var targetId = 'field-options';
			var dynamicLink = $('<a>', {
				id: 'evf-temp-link',
				href: '#' + targetId
			});

			dynamicLink.insertBefore($el);

			dynamicLink[0].click();

			setTimeout(function() {
				dynamicLink.remove();
			}, 100);
		}

	});
	$( document.body ).on( 'init_field_options_toggle', function() {
		$( '.everest-forms-field-option-group.closed' ).each( function() {
			$( this ).find( '.everest-forms-field-option-group-inner' ).hide();
		});
	} ).trigger( 'init_field_options_toggle' );

	$( document ).on( 'click', function() {
		$( '.evf-smart-tag-lists' ).hide();
	});

	$( '.evf-smart-tag-lists' ).hide();

	// Toggle Smart Tags.
	$( document.body ).on('click', '.evf-toggle-smart-tag-display', function(e) {
		e.stopPropagation();
		$('.evf-smart-tag-lists').hide();
		$('.evf-smart-tag-lists ul').empty();
		$( this ).parent().find('.evf-smart-tag-lists').toggle('show');

		var type = $( this ).data('type');

		var allowed_field = $ ( this ).data( 'fields' );
		get_all_available_field( allowed_field, type , $( this ) );
	});

	$( document.body ).on('click', '.smart-tag-field', function(e) {

		var field_id    			= $( this ).data('field_id'),
            field_label 			= $( this ).text(),
            type        			= $( this ).data('type'),
			$parent     			= $ ( this ).parent().parent().parent(),
			$input      			= $parent.find('input[type=text]'),
			$textarea   			= $parent.find('textarea'),
			$calculationCodeMirror	= $parent.find( '.CodeMirror');

		//Return when calculation smart tag is clicked because we use codeMirror
		if( 0 != $calculationCodeMirror.length ){
			return;
		}

		if ( field_id !== 'fullname' && field_id !== 'email' && field_id !== 'subject' && field_id !== 'message' && 'other' !== type ) {
			field_label = field_label.split(/[\s-_]/);
		    for(var i = 0 ; i < field_label.length ; i++){
		    	if ( i === 0 ) {
		    		field_label[i] = field_label[i].charAt(0).toLowerCase() + field_label[i].substr(1);
		    	} else {
		        	field_label[i] = field_label[i].charAt(0).toUpperCase() + field_label[i].substr(1);
		    	}
		    }
			field_label = field_label.join('');
			field_id = field_label+'_'+field_id;
		} else {
			field_id = field_id;
		}
		if ( 'field' === type ) {
			$input.val( $input.val() + '{field_id="'+field_id+'"}' );
			$textarea.val($textarea.val()+'{field_id="'+field_id+'"}' );
			$textarea.trigger('change');
		} else if ( 'other' === type ) {
			$input.val( $input.val() + '{'+field_id+'}' );
			$textarea.val($textarea.val() + '{'+field_id+'}' );
		} else if ( 'regex' === type ) {
			$input.val($input.val() + field_id.replace(field_label+'_','') );
			$textarea.val( $textarea.val() + field_id.replace(field_label+'_','') );
		}
	});

	// Toggle form status.
	$( document ).on( 'change', '.wp-list-table .everest-forms-toggle-form input', function(e) {
		e.stopPropagation();
		/**
		 * Disable row when form is disabled.
		 *
		 * @since 3.2.0
		 */
		if ( ! $( this ).prop( 'checked' ) ) {
			$(this).closest('tr').find('td').not('.has-row-actions').addClass('evf-disable-row');
			var str = $( document ).find('.everest-forms-list-filters-row').find( '.inactive' ).find( 'span.count' ).text();
			var newStr = str.replace(/\((\d+)\)/, function(match, p1) {
				var number = parseInt(p1, 10);
				number += 1;
				return "(" + number + ")";
			});
			$( document ).find('.everest-forms-list-filters-row').find( '.inactive' ).find( 'span.count' ).text( newStr )
		}else{
			$(this).closest('tr').find('td').not('.has-row-actions').removeClass('evf-disable-row');
			var str = $( document ).find('.everest-forms-list-filters-row').find( '.inactive' ).find( 'span.count' ).text();
			var newStr = str.replace(/\((\d+)\)/, function(match, p1) {
				var number = parseInt(p1, 10);
				number -= 1;
				return "(" + number + ")";
			});
			$( document ).find('.everest-forms-list-filters-row').find( '.inactive' ).find( 'span.count' ).text( newStr )
		}

		$.post( evf_data.ajax_url, {
			action: 'everest_forms_enabled_form',
			security: evf_data.evf_enabled_form,
			form_id: $( this ).data( 'form_id' ),
			enabled: $( this ).prop( 'checked' ) ? 1 : 0
		});
	});

	// Toggle email notification.
	$( document ).on( 'change', '.evf-content-email-settings .evf-toggle-switch input', function(e) {
		var $this = $( this ),
			value = $this.prop( 'checked' ),
			connection_id = $this.data('connection-id');
		if ( false === value ) {
			$this.val('');
			$this.closest( '.evf-content-email-settings' ).find( '.email-disable-message' ).remove();
			$this.closest( '.evf-content-section-title' ).find('.evf-enable-email-toggle').removeClass('everest-forms-hidden');
			$this.closest( '.evf-content-section-title' ).siblings( '.evf-content-email-settings-inner' ).addClass( 'everest-forms-hidden' );
			$( '<p class="email-disable-message everest-forms-notice everest-forms-notice-info">' + evf_data.i18n_email_disable_message + '</p>' ).insertAfter( $this.closest( '.evf-content-section-title' ) );
			$('input[data-connection-id="' + connection_id + '"]').prop('checked',false);
		} else if ( true === value ) {
			$this.val('1');
			$this.closest( '.evf-content-section-title' ).siblings( '.evf-content-email-settings-inner' ).removeClass( 'everest-forms-hidden' );
			$this.closest( '.evf-content-email-settings' ).find( '.email-disable-message' ).remove();
			$this.closest( '.evf-content-section-title' ).find('.evf-enable-email-toggle').addClass('everest-forms-hidden');
			$('input[data-connection-id="' + connection_id + '"]').prop('checked',true);
		}
	});

	$( document ).on( 'change', '.evf-email-toggle', function(e) {
		var $this = $( this ),
			connection_id = $this.data('connection-id');
			if($this.prop( 'checked' )){
				$this.val('1');
				$('.evf-content-email-settings').find('input[type="checkbox"][data-connection-id="' + connection_id + '"]').prop('checked',true).trigger('change');
			} else {
				$this.val('');
				$('.evf-content-email-settings').find('input[type="checkbox"][data-connection-id="' + connection_id + '"]').prop('checked',false).trigger('change');
			}
	});


	$( document ).on( 'click', '.everest-forms-min-max-date-format input', function() {
		var minDate = $( this ).closest( '.everest-forms-date' ).find( '.everest-forms-min-date' ).val();
		var maxDate = $(this).closest('.everest-forms-date').find('.everest-forms-min-date').val();

		if ( $( this ).is( ':checked' ) ) {
			var setDateRange = $( this ).parent().parent().parent().next( '.everest-forms-min-max-date-range-format' );
			if( setDateRange.find( 'input[type="checkbox"]' ).is( ':checked' ) ) {
				setDateRange.next( '.everest-forms-min-max-date-option' ).addClass( 'everest-forms-hidden' );
				setDateRange.next().next( '.everest-forms-min-max-date-range-option' ).removeClass( 'everest-forms-hidden' );
			} else {
				setDateRange.next( '.everest-forms-min-max-date-option' ).removeClass( 'everest-forms-hidden' );
				setDateRange.next().next( '.everest-forms-min-max-date-range-option' ).addClass( 'everest-forms-hidden' );
			}

			$( this ).parent().parent().parent().next( '.everest-forms-min-max-date-range-format' ).removeClass( 'everest-forms-hidden' );

			if( '' === minDate ){
				$('.everest-forms-min-date').addClass('flatpickr-field').flatpickr({
					disableMobile : true,
					onChange      : function(selectedDates, dateStr, instance) {
						$( '.everest-forms-min-date' ).val(dateStr);
					},
					onOpen: function(selectedDates, dateStr, instance) {
						instance.set('maxDate', $('.everest-forms-max-date').val());
					},
				});
			}
			if('' === maxDate ){
				$( '.everest-forms-max-date' ).addClass( 'flatpickr-field' ).flatpickr({
					disableMobile : true,
					onChange      : function(selectedDates, dateStr, instance) {
						$( '.everest-forms-max-date' ).val(dateStr);
					},
					onOpen: function(selectedDates, dateStr, instance) {
						instance.set('minDate', $( '.everest-forms-min-date' ).val());
					},
				});
			}
		} else {
			$( this ).parent().parent().parent().next().next( '.everest-forms-min-max-date-option' ).addClass( 'everest-forms-hidden' );
			$( this ).parent().parent().parent().next().next().next( '.everest-forms-min-max-date-range-option' ).addClass( 'everest-forms-hidden' );
			$( this ).parent().parent().parent().next( '.everest-forms-min-max-date-range-format' ).addClass( 'everest-forms-hidden' );
		}
	});

	$( document ).on( 'click', '.everest-forms-min-max-date-range-format input[type="checkbox"]', function() {
		if ( $( this ).is( ':checked' ) ) {
			$( this ).parent().parent().parent().next( '.everest-forms-min-max-date-option' ).addClass( 'everest-forms-hidden' );
			$( this ).parent().parent().parent().next().next( '.everest-forms-min-max-date-range-option' ).removeClass( 'everest-forms-hidden' );
		} else {
			$( this ).parent().parent().parent().next( '.everest-forms-min-max-date-option' ).removeClass( 'everest-forms-hidden' );
			$( this ).parent().parent().parent().next().next( '.everest-forms-min-max-date-range-option' ).addClass( 'everest-forms-hidden' );
		}
	});
	/**
	 * Real-time updates for Google Calendar.
	 *
	 * @since 2.0.6
	 */
	$(document).on( 'change', '.appt-sched-google-calendar-advanced', function(e) {
		var $this = $( this );
		if ( ! $this.is( ':checked' ) ) {
			$( '.everest-form-appt-sched-google-event-section' ).addClass( 'everest-forms-hidden' );
		} else {
			$( '.everest-form-appt-sched-google-event-section' ).removeClass( 'everest-forms-hidden' );
		}
	});
	/**
	 * Real-time updates the field for google calendar when we drag the new field on builder.
	 *
	 * @since 2.0.6
	 */
	$(document).on('focus', '.appt-sched-google-calendar-event-title-field', function(e){
		var selectedItems = $('.evf-admin-field-wrapper').find('.everest-forms-field');
		appt_sched_event_title_field_list($(this),selectedItems);
	});
	$(document).on('focus', '.appt-sched-google-calendar-event-desc-field', function(e){
		var selectedItems = $('.evf-admin-field-wrapper').find('.everest-forms-field');
		appt_sched_event_title_field_list($(this),selectedItems);
	});
	/**
	 * Function to updates google event title when we drag the new field on builder.
	 *
	 * @since 2.0.6
	 */
	function appt_sched_event_title_field_list($this, selectedItems){
		var html ='<option value=""> -- Select Field -- </option>';
		const allowedField = ['first-name', 'last-name', 'text', 'textarea'];
			$.each(selectedItems,function(index,element) {
				var fieldType = $(element).data('field-type');
				if(allowedField.includes(fieldType)){
					var content = $(element).find('.label-title');
					var label = $(content).find('.text').text();
					var fieldName = $(element).data('field-id');

					html += "<option value="+fieldName+">"+label+"</option>";
				}
			});
		$($this).html(html);
	}

	function get_all_available_field( allowed_field, type , el ) {
		var all_fields_without_email = [];
		var all_fields = [];
		var email_field = [];
		var phone_field = [];
		$('.evf-admin-row .evf-admin-grid .everest-forms-field').each( function(){
			var field_type = $( this ).data('field-type');
			var field_id = $( this ).data('field-id');
					if ( 'email' === field_type ){
					var e_field_label = $( this ).find('.label-title span').first().text();
					var e_field_id = field_id;
					email_field[ e_field_id ] = e_field_label;
				} else if( 'phone' === field_type){
					var e_field_label = $( this ).find('.label-title span').first().text();
					var e_field_id = field_id;
					phone_field[ e_field_id ] = e_field_label;
				} else {
					var field_label = $( this ).find('.label-title span').first().text();
					all_fields_without_email[ field_id ] = field_label;
				}
			all_fields[ field_id ] = $( this ).find('.label-title span').first().text();
		});

		if( 'other' === type || 'all' === type ){
			var other_smart_tags = evf_data.smart_tags_other;
			for( var key in other_smart_tags ) {
				$(el).parent().find('.evf-smart-tag-lists .evf-others').append('<li class = "smart-tag-field" data-type="other" data-field_id="'+key+'">'+other_smart_tags[key]+'</li>');
			}
		}


		if( 'regex' == type ){
			var regex_lists = evf_data.regex_expression_lists;
			regex_lists.forEach(function(key,value) {
				$(el).parent().find('.evf-smart-tag-lists .evf-regex').append('<li class = "smart-tag-field" data-type="regex" data-field_id="'+key.value+'">'+key.text+'</li>');
			});
		}

		if ( 'fields' === type || 'all' === type ) {
			if ( allowed_field === 'email' ) {
				if ( Object.keys(email_field).length < 1 ){
					$(el).parent().find('.evf-smart-tag-lists .smart-tag-title:not(".other-tag-title")').addClass('everest-forms-hidden');
				} else {
					$(el).parent().find('.evf-smart-tag-lists .smart-tag-title:not(".other-tag-title")').removeClass('everest-forms-hidden');
				}
				$(el).parent().find('.evf-smart-tag-lists .other-tag-title').remove();
				$(el).parent().find('.evf-smart-tag-lists .evf-others').remove();
				$(el).parent().find('.evf-smart-tag-lists').append('<div class="smart-tag-title other-tag-title">Others</div><ul class="evf-others"></ul>');
				$(el).parent().find('.evf-smart-tag-lists .evf-others').append('<li class="smart-tag-field" data-type="other" data-field_id="admin_email">Site Admin Email</li><li class="smart-tag-field" data-type="other" data-field_id="user_email">User Email</li>');
				for (var key in email_field ) {
					$(el).parent().find('.evf-smart-tag-lists .evf-fields').append('<li class = "smart-tag-field" data-type="field" data-field_id="'+key+'">'+email_field[key]+'</li>');
				}
			} else if ( allowed_field === 'phone' ) {
				if ( Object.keys(phone_field).length < 1 ){
					$(el).parent().find('.evf-smart-tag-lists .smart-tag-title:not(".other-tag-title")').addClass('everest-forms-hidden');
				} else {
					$(el).parent().find('.evf-smart-tag-lists .smart-tag-title:not(".other-tag-title")').removeClass('everest-forms-hidden');
				}
				$(el).parent().find('.evf-smart-tag-lists .other-tag-title').remove();
				$(el).parent().find('.evf-smart-tag-lists .evf-others').remove();
				for (var key in phone_field ) {
					$(el).parent().find('.evf-smart-tag-lists .evf-fields').append('<li class = "smart-tag-field" data-type="field" data-field_id="'+key+'">'+phone_field[key]+'</li>');
				}
			} else {
				if ( Object.keys(all_fields).length < 1 ){
					$(el).parent().find('.evf-smart-tag-lists .smart-tag-title:not(".other-tag-title")').addClass('everest-forms-hidden');
				} else {
					$(el).parent().find('.evf-smart-tag-lists .smart-tag-title:not(".other-tag-title")').removeClass('everest-forms-hidden');
				}
				for (var meta in all_fields ) {
					$(el).parent().find('.evf-smart-tag-lists .evf-fields').append('<li class = "smart-tag-field" data-type="field" data-field_id="'+meta+'">'+all_fields[meta]+'</li>');
				}
			}
		}

		if ( 'calculations' === type ) {
			var calculations = [
				"number",
				"payment-single",
				"range-slider",
				"payment-checkbox",
				"payment-multiple",
				"select",
				"payment-total",
				"radio",
				'first-name',
				'text',
				'last-name',
				'email',
				'url'
			];
			$(document).find('.everest-forms-field').each(function() {
				$fieldId = $(this).attr('data-field-id').split("-");
				if( calculations.includes($(this).attr('data-field-type')) && $(el).parents('.everest-forms-field-option-row-calculation_field').attr('data-field-id') !== $(this).attr('data-field-id')) {
					$(el).parent().find('.evf-smart-tag-lists .calculations').append('<li class = "smart-tag-field" data-type="field" data-field_id="'+ $fieldId[1] +'">'+$(this).find('.label-title .text').text()+'</li>');
				}
			})
		}

		if ( 'ai-fields' === type ) {
			var aiFields = [
				"text",
				"select",
				"radio",
			];
			$(document).find('.everest-forms-field').each(function() {
				if( aiFields.includes($(this).attr('data-field-type')) && $(el).parents('.everest-forms-field-option-row-ai_chatbot_input').attr('data-field-id') !== $(this).attr('data-field-id')) {
					$(el).parent().find('.evf-smart-tag-lists .evf-fields-ai').append('<li class = "smart-tag-field" data-type="field" data-field_id="'+$(this).attr('data-field-id')+'">'+$(this).find('.label-title .text').text()+'</li>');
				}
			})
		}
	}
});

jQuery(function ($) {
	$(document).ready(function () {
		// Custom CSS
		const customCssElement = $('#everest-forms-panel-field-settings-evf-custom-css');
		if (customCssElement.length && typeof wp.CodeMirror !== 'undefined') {
			var cssEditor = wp.CodeMirror.fromTextArea(customCssElement[0], {
				"indentUnit": 2,
				"indentWithTabs": true,
				"inputStyle": "contenteditable",
				"lineNumbers": true,
				"lineWrapping": true,
				"styleActiveLine": true,
				"continueComments": true,
				"extraKeys": {
					"Ctrl-Space": "autocomplete",
					"Ctrl-/": "toggleComment",
					"Cmd-/": "toggleComment",
					"Alt-F": "findPersistent",
					"Ctrl-F": "findPersistent",
					"Cmd-F": "findPersistent"
				},
				"direction": "ltr",
				"gutters": [],
				"mode": "text/css",
				"lint": false,
				"autoCloseBrackets": true,
				"autoCloseTags": true,
				"autoRefresh": true,
				"matchTags": {
					"bothTags": true
				},
				"tabSize": 2,
				"theme": 'default',
			});

			cssEditor.on('change', function () {
				customCssElement.html(cssEditor.getValue().replace(/<\s*script/gi, '').replace(/\s+on\w+\s*=/gi, ' '));
			});
		}

		// Custom JS
		const customJsElement = $('#everest-forms-panel-field-settings-evf-custom-js');
		if (customJsElement.length && typeof wp.CodeMirror !== 'undefined') {
			var jsEditor = wp.CodeMirror.fromTextArea(customJsElement[0], {
				"indentUnit": 2,
				"indentWithTabs": true,
				"inputStyle": "contenteditable",
				"lineNumbers": true,
				"lineWrapping": true,
				"styleActiveLine": true,
				"continueComments": true,
				"extraKeys": {
					"Ctrl-Space": "autocomplete",
					"Ctrl-/": "toggleComment",
					"Cmd-/": "toggleComment",
					"Alt-F": "findPersistent",
					"Ctrl-F": "findPersistent",
					"Cmd-F": "findPersistent"
				},
				"direction": "ltr",
				"gutters": [],
				"mode": "javascript",
				"lint": false,
				"autoCloseBrackets": true,
				"autoCloseTags": true,
				"autoRefresh": true,
				"matchTags": {
					"bothTags": true
				},
				"tabSize": 2,
			});

			jsEditor.on('change', function () {
				customJsElement.html(jsEditor.getValue().replace(/<\s*script/gi, '').replace(/\s+on\w+\s*=/gi, ' '));
			});
		}

		$('#everest-forms-panel-field-settings-evf-enable-custom-css, #everest-forms-panel-field-settings-evf-enable-custom-js').on('change', e => {
			showHideEditors();
		});

		showHideEditors();

		// Show/Hide the custom CSS and JS input boxes based on the enabled/disabled state.
		function showHideEditors() {
			if ($('#everest-forms-panel-field-settings-evf-enable-custom-css').is(':checked')) {
				$('#everest-forms-panel-field-settings-evf-custom-css-wrap').show(500);
			} else {
				$('#everest-forms-panel-field-settings-evf-custom-css-wrap').hide(500);
			}

			if ($('#everest-forms-panel-field-settings-evf-enable-custom-js').is(':checked')) {
				$('#everest-forms-panel-field-settings-evf-custom-js-wrap').show(500);
			} else {
				$('#everest-forms-panel-field-settings-evf-custom-js-wrap').hide(500);
			}
		}
	});

});
