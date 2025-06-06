<?php
/**
 * Everest Forms form selector block.
 *
 * @since 2.0.9
 * @package everest-forms
 */

defined( 'ABSPATH' ) || exit;
/**
 * Block form selector class.
 */
class EVF_Blocks_Form_Selector extends EVF_Blocks_Abstract {
	/**
	 * Block name.
	 *
	 * @var string Block name.
	 */
	protected $block_name = 'form-selector';

	/**
	 * Build html.
	 *
	 * @param string $content Build html content.
	 * @return string
	 */
	protected function build_html( $content ) {
		$attr    = $this->attributes;
		$form_id = ! empty( $attr['formId'] ) ? absint( $attr['formId'] ) : 0;

		if ( empty( $form_id ) ) {
			return '';
		}

		// Wrapper classes.
		$classes = 'everest-forms';
		if ( isset( $attr['className'] ) ) {
			$classes .= ' ' . $attr['className'];
		}

		$is_gb_editor       = defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context']; // phpcs:ignore WordPress.Security.NonceVerification
		$title              = ! empty( $attr['displayTitle'] ) ? true : false;
		$description        = ! empty( $attr['displayDescription'] ) ? true : false;
		$popup              = ! empty( $attr['displayPopup'] ) ? true : false;
		$popup_type         = ! empty( $attr['popupType'] ) ? $attr['popupType'] : 'none';
		$popup_text         = ! empty( $attr['popupButtonText'] ) ? $attr['popupButtonText'] : 'View Form';
		$popup_size         = ! empty( $attr['popupSize'] ) ? $attr['popupSize'] : 'default';
		$popup_header_title = ! empty( $attr['popupHeaderTitle'] ) ? $attr['popupHeaderTitle'] : '';
		$popup_header_desc  = ! empty( $attr['popupHeaderDesc'] ) ? $attr['popupHeaderDesc'] : '';
		$popup_footer_title = ! empty( $attr['popupFooterTitle'] ) ? $attr['popupFooterTitle'] : '';
		$popup_footer_desc  = ! empty( $attr['popupFooterDesc'] ) ? $attr['popupFooterDesc'] : '';

		if ( 'none' !== $popup_type && ! defined( 'EFP_VERSION' ) ) {
			$popup_type = 'none';
		}

		// Disable form fields if called from the Gutenberg editor.
		if ( $is_gb_editor ) {
			add_filter(
				'everest_forms_frontend_container_class',
				function ( $classes ) {
					$classes[] = 'evf-gutenberg-form-selector';
					$classes[] = 'evf-container-full';
					return $classes;
				}
			);
			add_action(
				'everest_forms_frontend_output',
				function () {
					echo '<fieldset disabled>';
				},
				3
			);
			add_action(
				'everest_forms_frontend_output',
				function () {
					echo '</fieldset>';
				},
				30
			);
		}

		return EVF_Shortcodes::shortcode_wrapper(
			array( 'EVF_Shortcode_Form', 'output' ),
			array(
				'id'           => $form_id,
				'title'        => $title,
				'description'  => $description,
				'type'         => $popup_type,
				'text'         => $popup_text,
				'size'         => $popup_size,
				'header_title' => $popup_header_title,
				'footer_title' => $popup_footer_title,
				'header_desc'  => $popup_header_desc,
				'footer_desc'  => $popup_footer_desc,

			),
			array(
				'class' => evf_sanitize_classes( $classes ),
			)
		);

	}
}
