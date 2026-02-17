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

/**
 * Register a temporary admin page for test inserts.
 */
function helio_cleaning_test_plugin_register_admin_menu() {
	add_menu_page(
		esc_html__( 'Helio Test Insert', 'helio-cleaning-test-plugin' ),
		esc_html__( 'Helio Test Insert', 'helio-cleaning-test-plugin' ),
		'manage_options',
		'helio-test-insert',
		'helio_cleaning_test_plugin_render_insert_page',
		'dashicons-database-add',
		58
	);
}
add_action( 'admin_menu', 'helio_cleaning_test_plugin_register_admin_menu' );

/**
 * Render the temporary admin page content.
 */
function helio_cleaning_test_plugin_render_insert_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$status = isset( $_GET['helio_insert_status'] ) ? sanitize_key( wp_unslash( $_GET['helio_insert_status'] ) ) : '';
	?>
	<div class="wrap">
		<h1><?php echo esc_html__( 'Helio Test Insert', 'helio-cleaning-test-plugin' ); ?></h1>

		<?php if ( 'success' === $status ) : ?>
			<div class="notice notice-success is-dismissible"><p><?php echo esc_html__( 'Dummy booking row inserted successfully.', 'helio-cleaning-test-plugin' ); ?></p></div>
		<?php elseif ( 'error' === $status ) : ?>
			<div class="notice notice-error is-dismissible"><p><?php echo esc_html__( 'Unable to insert dummy booking row. Please verify the hc_bookings table exists and has compatible defaults.', 'helio-cleaning-test-plugin' ); ?></p></div>
		<?php endif; ?>

		<p><?php echo esc_html__( 'Use this temporary tool to insert one dummy booking row into hc_bookings for testing.', 'helio-cleaning-test-plugin' ); ?></p>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="helio_test_insert_booking">
			<?php wp_nonce_field( 'helio_test_insert_booking_action', 'helio_test_insert_booking_nonce' ); ?>
			<?php submit_button( esc_html__( 'Insert Dummy Booking', 'helio-cleaning-test-plugin' ) ); ?>
		</form>
	</div>
	<?php
}

/**
 * Handle insertion of one dummy booking record into hc_bookings.
 */
function helio_cleaning_test_plugin_handle_insert_booking() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to perform this action.', 'helio-cleaning-test-plugin' ) );
	}

	check_admin_referer( 'helio_test_insert_booking_action', 'helio_test_insert_booking_nonce' );

	global $wpdb;

	$table_name = 'hc_bookings';
	$inserted   = $wpdb->query( "INSERT INTO `{$table_name}` () VALUES ()" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared
	$status     = false !== $inserted ? 'success' : 'error';

	wp_safe_redirect(
		add_query_arg(
			'helio_insert_status',
			$status,
			admin_url( 'admin.php?page=helio-test-insert' )
		)
	);
	exit;
}
add_action( 'admin_post_helio_test_insert_booking', 'helio_cleaning_test_plugin_handle_insert_booking' );


/**
 * Insert sanitized booking data into the hc_bookings table.
 *
 * @param array<string, mixed> $data Raw booking data.
 * @return int|false Inserted row ID on success, otherwise false.
 */
function helio_cleaning_insert_booking( $data ) {
	if ( ! is_array( $data ) || empty( $data ) ) {
		return false;
	}

	global $wpdb;

	$table_name   = 'hc_bookings';
	$allowed_cols = array(
		'name',
		'first_name',
		'last_name',
		'email',
		'phone',
		'service',
		'booking_date',
		'booking_time',
		'address',
		'notes',
		'message',
		'status',
		'created_at',
	);

	$insert_data = array();
	$formats     = array();

	foreach ( $data as $column => $value ) {
		$column = sanitize_key( $column );

		if ( ! in_array( $column, $allowed_cols, true ) || null === $value ) {
			continue;
		}

		if ( is_email( (string) $value ) && 'email' === $column ) {
			$insert_data[ $column ] = sanitize_email( (string) $value );
			$formats[]              = '%s';
		} elseif ( in_array( $column, array( 'booking_date', 'booking_time', 'created_at' ), true ) ) {
			$insert_data[ $column ] = sanitize_text_field( (string) $value );
			$formats[]              = '%s';
		} elseif ( is_numeric( $value ) ) {
			$insert_data[ $column ] = (string) $value;
			$formats[]              = '%s';
		} elseif ( in_array( $column, array( 'notes', 'message', 'address' ), true ) ) {
			$insert_data[ $column ] = sanitize_textarea_field( (string) $value );
			$formats[]              = '%s';
		} else {
			$insert_data[ $column ] = sanitize_text_field( (string) $value );
			$formats[]              = '%s';
		}
	}

	if ( empty( $insert_data ) ) {
		return false;
	}

	$inserted = $wpdb->insert( $table_name, $insert_data, $formats ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery

	if ( false === $inserted ) {
		return false;
	}

	return (int) $wpdb->insert_id;
}


/**
 * Register an admin menu page for viewing Helio bookings.
 */
function helio_cleaning_test_plugin_register_bookings_menu() {
	add_menu_page(
		esc_html__( 'Helio Bookings', 'helio-cleaning-test-plugin' ),
		esc_html__( 'Helio Bookings', 'helio-cleaning-test-plugin' ),
		'manage_options',
		'helio-bookings',
		'helio_cleaning_test_plugin_render_bookings_page',
		'dashicons-list-view',
		59
	);
}
add_action( 'admin_menu', 'helio_cleaning_test_plugin_register_bookings_menu' );

/**
 * Render the Helio bookings admin page.
 */
function helio_cleaning_test_plugin_render_bookings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	global $wpdb;

	$table_name = 'hc_bookings';
	$rows       = $wpdb->get_results( "SELECT * FROM `{$table_name}` ORDER BY created_at DESC", ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared
	$columns    = ! empty( $rows ) ? array_keys( $rows[0] ) : array();
	?>
	<div class="wrap">
		<h1><?php echo esc_html__( 'Helio Bookings', 'helio-cleaning-test-plugin' ); ?></h1>

		<?php if ( empty( $rows ) ) : ?>
			<p><?php echo esc_html__( 'No bookings found in hc_bookings.', 'helio-cleaning-test-plugin' ); ?></p>
		<?php else : ?>
			<table class="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<?php foreach ( $columns as $column ) : ?>
							<th scope="col"><?php echo esc_html( $column ); ?></th>
						<?php endforeach; ?>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $rows as $row ) : ?>
						<tr>
							<?php foreach ( $columns as $column ) : ?>
								<td><?php echo esc_html( (string) ( isset( $row[ $column ] ) ? $row[ $column ] : '' ) ); ?></td>
							<?php endforeach; ?>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
	</div>
	<?php
}
