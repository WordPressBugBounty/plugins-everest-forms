<?php
/**
 * EverestForms Admin Deactivation Feedback Class
 *
 * @package EverestForms\Admin
 * @version 1.9.8
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'EVF_Admin_Deactivation_Feedback', false ) ) :

	/**
	 * EVF_Admin_Deactivation_Feedback Class
	 */
	class EVF_Admin_Deactivation_Feedback {

		const FEEDBACK_URL = 'https://stats.wpeverest.com/wp-json/tgreporting/v1/deactivation/';

		/**
		 * Class constructor.
		 * Attaches the necessary actions and filters for the deactivate feedback feature.
		 * Adds an action to enqueue scripts on the plugins screen.
		 * Adds an action to handle the AJAX request for sending deactivate feedback.
		 */
		public function __construct() {
			add_action(
				'current_screen',
				function () {
					if ( ! $this->is_plugins_screen() ) {
						return;
					}

					add_action( 'admin_enqueue_scripts', array( $this, 'scripts' ) );
				}
			);

			// Ajax.
			add_action( 'wp_ajax_evf_deactivate_feedback', array( $this, 'send' ) );
		}

		/**
		 * Enqueue scripts.
		 */
		public function scripts() {
			add_action( 'admin_footer', array( $this, 'feedback_html' ) );

			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

			wp_enqueue_script(
				'evf-admin-deactivation-feedback',
				evf()->plugin_url() . '/assets/js/admin/deactivation-feedback' . $suffix . '.js',
				array(
					'jquery'
				),
				EVF_VERSION,
				true
			);

			wp_enqueue_style(
				'evf-admin-deactivation-feedback',
				evf()->plugin_url() . '/assets/css/deactivation-feedback.css',
				array(),
				EVF_VERSION
			);

			wp_localize_script(
				'evf-admin-deactivation-feedback',
				'evf_plugins_params',
				array(
					'ajax_url' => admin_url( 'admin-ajax.php' ),
				)
			);

		}


		/**
		 * Deactivation Feedback HTML.
		 *
		 * @return void
		 */
		public function feedback_html() {
			$deactivate_reasons = array(
				'feature_unavailable'    => array(
					'title'             => esc_html__( 'I didn’t find the feature I was looking for', 'everest-forms' ),
					'input_placeholder' => esc_html__( 'If possible, please elaborate on this', 'everest-forms' ),
				),
				'complex_to_use'         => array(
					'title'             => esc_html__( 'I found the plugin complex to use', 'everest-forms' ),
					'input_placeholder' => esc_html__( 'If possible, please elaborate on this', 'everest-forms' ),
				),
				'couldnt_build_the_form' => array(
					'title'             => esc_html__( 'I couldn\'t build the form', 'everest-forms' ),
					'input_placeholder' => esc_html__( 'If possible, please elaborate on this', 'everest-forms' ),
				),
				'found_a_better_plugin'  => array(
					'title'             => esc_html__( 'I found better alternative', 'everest-forms' ),
					'input_placeholder' => esc_html__( 'If possible, please mention the alternatives', 'everest-forms' ),
				),
				'temporary_deactivation' => array(
					'title'             => esc_html__( 'Temporary deactivation', 'everest-forms' ),
					'input_placeholder' => '',
				),
				'no_longer_needed'       => array(
					'title'             => esc_html__( 'I no longer need the plugin', 'everest-forms' ),
					'input_placeholder' => '',
				),
				'other'                  => array(
					'title'             => esc_html__( 'Other', 'everest-forms' ),
					'input_placeholder' => esc_html__( 'If possible, please elaborate on this', 'everest-forms' ),
				),
			);

			include_once EVF_ABSPATH . 'includes/admin/views/html-deactivation-popup.php';

		}

		/**
		 * Send API Request.
		 *
		 * @return void
		 */
		public function send() {
			if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), '_evf_deactivate_feedback_nonce' ) ) {
				wp_send_json_error();
			}

			$reason_text = '';
			$reason_slug = '';

			if ( ! empty( $_POST['reason_slug'] ) ) {
				$reason_slug = sanitize_text_field( wp_unslash( $_POST['reason_slug'] ) );
			}

			if ( ! empty( $_POST[ "reason_{$reason_slug}" ] ) ) {
				$reason_text = sanitize_text_field( wp_unslash( $_POST[ "reason_{$reason_slug}" ] ) );
			}

			$deactivation_data = array(
				'reason_slug'  => $reason_slug,
				'reason_text'  => $reason_text,
				'admin_email'  => get_bloginfo( 'admin_email' ),
				'website_url'  => esc_url_raw( get_bloginfo( 'url' ) ),
				'base_product' => 'everest-forms/everest-forms.php',
			);

			$this->send_api_request( $deactivation_data );

			wp_send_json_success();
		}

		/**
		 * Get api stats url.
		 *
		 * @return string
		 */
		private function get_stats_api_url() {
			$url = '';
			// Ingore for development mode.
			if ( defined( 'EVF_DEV' ) && EVF_DEV ) {
				if ( defined( 'TG_USERS_TRACKING_VERSION' ) ) {
					$url = rest_url() . 'tgreporting/v1/deactivation/';
				};
			} else {
				$url = self::FEEDBACK_URL;
			}

			return $url;
		}

		/**
		 * Sends an API request with deactivation data.
		 *
		 * @param array $deactivation_data Deactivation Data.
		 * @return string The response body from the API request.
		 */
		private function send_api_request( $deactivation_data ) {
			$stats_api_url = $this->get_stats_api_url();

			if ( '' === $stats_api_url ) {
				return;
			}
			$headers = array(
				'user-agent' => 'EverestForms/' . evf()->version . '; ' . get_bloginfo( 'url' ),
			);

			$response = wp_remote_post(
				$stats_api_url,
				array(
					'method'      => 'POST',
					'timeout'     => 45,
					'redirection' => 5,
					'httpversion' => '1.0',
					'blocking'    => true,
					'headers'     => $headers,
					'body'        => array( 'deactivation_data' => $deactivation_data )
				)
			);
			return wp_remote_retrieve_body( $response );
		}

		/**
		 * Check if the current screen is the plugins screen and returns a boolean.
		 *
		 * @return boolean
		 */
		private function is_plugins_screen() {
			return in_array( get_current_screen()->id, array( 'plugins', 'plugins-network' ), true );
		}
	}

	new EVF_Admin_Deactivation_Feedback();
endif;
