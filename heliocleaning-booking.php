<?php
/**
 * Plugin Name:       Helio Cleaning Test Plugin
 * Plugin URI:        https://example.com/
 * Description:       A production-ready test plugin for Helio Cleaning.
 * Version:           1.0.0
 * Author:            Don Pacaud
 * Author URI:        https://example.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       helio-cleaning-test-plugin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Display an admin notice when the plugin is activated.
 */
function helio_cleaning_test_plugin_activation_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( get_transient( 'helio_cleaning_test_plugin_activated' ) ) {
		delete_transient( 'helio_cleaning_test_plugin_activated' );

		echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Helio Cleaning Test Plugin activated successfully.', 'helio-cleaning-test-plugin' ) . '</p></div>';
	}
}
add_action( 'admin_notices', 'helio_cleaning_test_plugin_activation_notice' );

/**
 * Set an activation transient used for a one-time admin notice.
 */
function helio_cleaning_test_plugin_activate() {
	set_transient( 'helio_cleaning_test_plugin_activated', 1, 30 );
}
register_activation_hook( __FILE__, 'helio_cleaning_test_plugin_activate' );

/**
 * Render the [heliotest] shortcode output.
 *
 * @return string
 */
function helio_cleaning_test_plugin_shortcode() {
	return '<div class="helio-cleaning-test-shortcode">' . esc_html__( 'Helio Cleaning Test Plugin shortcode is working.', 'helio-cleaning-test-plugin' ) . '</div>';
}
add_shortcode( 'heliotest', 'helio_cleaning_test_plugin_shortcode' );
