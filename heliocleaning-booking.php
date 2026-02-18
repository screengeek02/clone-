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

if ( ! defined( 'HELIO_CLEANING_TEST_PLUGIN_VERSION' ) ) {
	define( 'HELIO_CLEANING_TEST_PLUGIN_VERSION', '1.0.0' );
}

if ( ! defined( 'HELIO_CLEANING_TEST_PLUGIN_DB_VERSION_OPTION' ) ) {
	define( 'HELIO_CLEANING_TEST_PLUGIN_DB_VERSION_OPTION', 'helio_cleaning_test_plugin_db_version' );
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
	helio_cleaning_test_plugin_maybe_update_database();
}
register_activation_hook( __FILE__, 'helio_cleaning_test_plugin_activate' );

/**
 * Render the [heliotest] shortcode output.
 *
 * @return string
 */
function helio_cleaning_test_plugin_shortcode() {
	global $wpdb;

	$table_name = $wpdb->prefix . 'hc_bookings';
	$message    = '';

	if ( isset( $_POST['helio_submit'] ) ) {
		$client_name   = isset( $_POST['helio_client_name'] ) ? sanitize_text_field( wp_unslash( $_POST['helio_client_name'] ) ) : '';
		$phone         = isset( $_POST['helio_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['helio_phone'] ) ) : '';
		$service_type  = isset( $_POST['helio_service_type'] ) ? sanitize_text_field( wp_unslash( $_POST['helio_service_type'] ) ) : '';
		$property_type = isset( $_POST['helio_property_type'] ) ? sanitize_text_field( wp_unslash( $_POST['helio_property_type'] ) ) : '';
		$booking_date  = isset( $_POST['helio_booking_date'] ) ? sanitize_text_field( wp_unslash( $_POST['helio_booking_date'] ) ) : '';

		$allowed_services  = array( 'Standard Cleaning', 'Deep Cleaning', 'Villa Cleaning' );
		$allowed_properties = array( 'Apartment', 'Villa' );

		if ( '' !== $client_name && '' !== $phone && in_array( $service_type, $allowed_services, true ) && in_array( $property_type, $allowed_properties, true ) ) {
			$columns = $wpdb->get_col( "SHOW COLUMNS FROM `{$table_name}`" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared
			$columns = is_array( $columns ) ? $columns : array();

			$insert_data = array(
				'name'        => $client_name,
				'phone'       => $phone,
				'service'     => $service_type,
				'status'      => 'pending',
				'created_at'  => current_time( 'mysql' ),
			);

			if ( '' !== $booking_date ) {
				$insert_data['booking_date'] = $booking_date;
			}

			if ( in_array( 'property_type', $columns, true ) ) {
				$insert_data['property_type'] = $property_type;
			} elseif ( in_array( 'message', $columns, true ) ) {
				$insert_data['message'] = 'Property Type: ' . $property_type;
			}

			if ( in_array( 'price', $columns, true ) ) {
				$insert_data['price'] = '0.00';
			}

			$formats = array_fill( 0, count( $insert_data ), '%s' );
			$inserted = $wpdb->insert( $table_name, $insert_data, $formats ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery

			if ( false !== $inserted ) {
				$message = '<div style="background:#dcfce7;border:1px solid #16a34a;color:#166534;padding:12px;border-radius:8px;margin-bottom:12px;font-weight:600;">' . esc_html__( 'Booking submitted successfully.', 'helio-cleaning-test-plugin' ) . '</div>';
			}
		}
	}

	$output  = '<div class="helio-cleaning-test-shortcode" style="max-width:520px;background:#f8fafc;border:1px solid #dbeafe;padding:20px;border-radius:10px;">';
	$output .= $message;
	$output .= '<form method="post" style="display:grid;gap:12px;">';
	$output .= '<label style="font-weight:600;">' . esc_html__( 'Client Name', 'helio-cleaning-test-plugin' ) . ' <input type="text" name="helio_client_name" required style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:6px;" /></label>';
	$output .= '<label style="font-weight:600;">' . esc_html__( 'Phone', 'helio-cleaning-test-plugin' ) . ' <input type="text" name="helio_phone" required style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:6px;" /></label>';
	$output .= '<label style="font-weight:600;">' . esc_html__( 'Service Type', 'helio-cleaning-test-plugin' ) . ' <select name="helio_service_type" required style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:6px;"><option value="Standard Cleaning">' . esc_html__( 'Standard Cleaning', 'helio-cleaning-test-plugin' ) . '</option><option value="Deep Cleaning">' . esc_html__( 'Deep Cleaning', 'helio-cleaning-test-plugin' ) . '</option><option value="Villa Cleaning">' . esc_html__( 'Villa Cleaning', 'helio-cleaning-test-plugin' ) . '</option></select></label>';
	$output .= '<label style="font-weight:600;">' . esc_html__( 'Property Type', 'helio-cleaning-test-plugin' ) . ' <select name="helio_property_type" required style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:6px;"><option value="Apartment">' . esc_html__( 'Apartment', 'helio-cleaning-test-plugin' ) . '</option><option value="Villa">' . esc_html__( 'Villa', 'helio-cleaning-test-plugin' ) . '</option></select></label>';
	$output .= '<label style="font-weight:600;">' . esc_html__( 'Booking Date', 'helio-cleaning-test-plugin' ) . ' <input type="date" name="helio_booking_date" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:6px;" /></label>';
	$output .= '<button type="submit" name="helio_submit" value="1" style="background:#2563eb;color:#fff;padding:10px 14px;border:0;border-radius:6px;font-weight:600;cursor:pointer;">' . esc_html__( 'Submit Booking', 'helio-cleaning-test-plugin' ) . '</button>';
	$output .= '</form></div>';

	return $output;
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
 * Render the Helio bookings admin page using core admin table styling.
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


/**
 * Build the SQL statement for the hc_bookings table.
 *
 * @return string
 */
function helio_cleaning_test_plugin_get_bookings_table_schema() {
	global $wpdb;

	$table_name      = 'hc_bookings';
	$charset_collate = $wpdb->get_charset_collate();

	return "CREATE TABLE {$table_name} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		name varchar(255) DEFAULT '' NOT NULL,
		first_name varchar(191) DEFAULT '' NOT NULL,
		last_name varchar(191) DEFAULT '' NOT NULL,
		email varchar(191) DEFAULT '' NOT NULL,
		phone varchar(50) DEFAULT '' NOT NULL,
		service varchar(191) DEFAULT '' NOT NULL,
		booking_date date DEFAULT NULL,
		booking_time time DEFAULT NULL,
		address text DEFAULT NULL,
		notes text DEFAULT NULL,
		message text DEFAULT NULL,
		status varchar(50) DEFAULT 'pending' NOT NULL,
		created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		PRIMARY KEY  (id),
		KEY created_at (created_at)
	) {$charset_collate};";
}

/**
 * Run dbDelta when plugin DB version changes.
 */
function helio_cleaning_test_plugin_maybe_update_database() {
	$current_version = get_option( HELIO_CLEANING_TEST_PLUGIN_DB_VERSION_OPTION, '' );

	if ( HELIO_CLEANING_TEST_PLUGIN_VERSION === $current_version ) {
		return;
	}

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';

	$schema = helio_cleaning_test_plugin_get_bookings_table_schema();
	dbDelta( $schema );

	update_option( HELIO_CLEANING_TEST_PLUGIN_DB_VERSION_OPTION, HELIO_CLEANING_TEST_PLUGIN_VERSION );
}
add_action( 'plugins_loaded', 'helio_cleaning_test_plugin_maybe_update_database' );


/**
 * Register Helio Cleaning top-level admin menu and Bookings submenu.
 */
function helio_cleaning_test_plugin_register_helio_cleaning_menu() {
	add_menu_page(
		esc_html__( 'Helio Cleaning', 'helio-cleaning-test-plugin' ),
		esc_html__( 'Helio Cleaning', 'helio-cleaning-test-plugin' ),
		'manage_options',
		'helio-cleaning',
		'helio_cleaning_test_plugin_render_cleaning_bookings_page',
		'dashicons-admin-home',
		57
	);

	add_submenu_page(
		'helio-cleaning',
		esc_html__( 'Bookings', 'helio-cleaning-test-plugin' ),
		esc_html__( 'Bookings', 'helio-cleaning-test-plugin' ),
		'manage_options',
		'helio-cleaning-bookings',
		'helio_cleaning_test_plugin_render_cleaning_bookings_page'
	);
}
add_action( 'admin_menu', 'helio_cleaning_test_plugin_register_helio_cleaning_menu' );

/**
 * Render Helio Cleaning > Bookings view-only table.
 */
function helio_cleaning_test_plugin_render_cleaning_bookings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	global $wpdb;

	$table_name = $wpdb->prefix . 'hc_bookings';
	$rows       = $wpdb->get_results( "SELECT * FROM `{$table_name}` ORDER BY created_at DESC", ARRAY_A ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared
	?>
	<div class="wrap">
		<h1><?php echo esc_html__( 'Bookings', 'helio-cleaning-test-plugin' ); ?></h1>

		<?php if ( isset( $_GET['helio_status_updated'] ) && '1' === sanitize_key( wp_unslash( $_GET['helio_status_updated'] ) ) ) : ?>
			<div class="notice notice-success is-dismissible"><p><?php echo esc_html__( 'Booking status updated.', 'helio-cleaning-test-plugin' ); ?></p></div>
		<?php endif; ?>
		<table class="widefat striped">
			<thead>
				<tr>
					<th><?php echo esc_html__( 'ID', 'helio-cleaning-test-plugin' ); ?></th>
					<th><?php echo esc_html__( 'Client Name', 'helio-cleaning-test-plugin' ); ?></th>
					<th><?php echo esc_html__( 'Phone', 'helio-cleaning-test-plugin' ); ?></th>
					<th><?php echo esc_html__( 'Service Type', 'helio-cleaning-test-plugin' ); ?></th>
					<th><?php echo esc_html__( 'Property Type', 'helio-cleaning-test-plugin' ); ?></th>
					<th><?php echo esc_html__( 'Booking Date', 'helio-cleaning-test-plugin' ); ?></th>
					<th><?php echo esc_html__( 'Status', 'helio-cleaning-test-plugin' ); ?></th>
					<th><?php echo esc_html__( 'Created At', 'helio-cleaning-test-plugin' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php if ( empty( $rows ) ) : ?>
					<tr>
						<td colspan="8"><?php echo esc_html__( 'No bookings found.', 'helio-cleaning-test-plugin' ); ?></td>
					</tr>
				<?php else : ?>
					<?php foreach ( $rows as $row ) : ?>
						<?php
						$property_type = '';
						if ( isset( $row['property_type'] ) ) {
							$property_type = (string) $row['property_type'];
						} elseif ( isset( $row['message'] ) && 0 === strpos( (string) $row['message'], 'Property Type: ' ) ) {
							$property_type = str_replace( 'Property Type: ', '', (string) $row['message'] );
						}
						?>
						<tr>
							<td><?php echo esc_html( isset( $row['id'] ) ? (string) $row['id'] : '' ); ?></td>
							<td><?php echo esc_html( isset( $row['name'] ) ? (string) $row['name'] : '' ); ?></td>
							<td><?php echo esc_html( isset( $row['phone'] ) ? (string) $row['phone'] : '' ); ?></td>
							<td><?php echo esc_html( isset( $row['service'] ) ? (string) $row['service'] : '' ); ?></td>
							<td><?php echo esc_html( $property_type ); ?></td>
							<td><?php echo esc_html( isset( $row['booking_date'] ) ? (string) $row['booking_date'] : '' ); ?></td>
							<td>
								<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin:0;">
									<input type="hidden" name="action" value="helio_update_booking_status" />
									<input type="hidden" name="booking_id" value="<?php echo esc_attr( isset( $row['id'] ) ? (string) $row['id'] : '' ); ?>" />
									<?php wp_nonce_field( 'helio_update_booking_status_action', 'helio_update_booking_status_nonce' ); ?>
									<select name="booking_status" onchange="this.form.submit();" style="min-width:120px;">
										<?php
										$current_status = isset( $row['status'] ) ? (string) $row['status'] : 'pending';
										$status_options = array( 'pending', 'confirmed', 'completed', 'cancelled' );
										foreach ( $status_options as $status_option ) :
										?>
											<option value="<?php echo esc_attr( $status_option ); ?>" <?php selected( $current_status, $status_option ); ?>><?php echo esc_html( ucfirst( $status_option ) ); ?></option>
										<?php endforeach; ?>
									</select>
								</form>
							</td>
							<td><?php echo esc_html( isset( $row['created_at'] ) ? (string) $row['created_at'] : '' ); ?></td>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
	<?php
}


/**
 * Update booking status from the admin bookings table.
 */
function helio_cleaning_test_plugin_handle_booking_status_update() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to perform this action.', 'helio-cleaning-test-plugin' ) );
	}

	check_admin_referer( 'helio_update_booking_status_action', 'helio_update_booking_status_nonce' );

	$booking_id     = isset( $_POST['booking_id'] ) ? absint( wp_unslash( $_POST['booking_id'] ) ) : 0;
	$booking_status = isset( $_POST['booking_status'] ) ? sanitize_key( wp_unslash( $_POST['booking_status'] ) ) : '';
	$allowed_status = array( 'pending', 'confirmed', 'completed', 'cancelled' );

	if ( $booking_id > 0 && in_array( $booking_status, $allowed_status, true ) ) {
		global $wpdb;

		$table_name = $wpdb->prefix . 'hc_bookings';
		$wpdb->update(
			$table_name,
			array( 'status' => $booking_status ),
			array( 'id' => $booking_id ),
			array( '%s' ),
			array( '%d' )
		);
	}

	wp_safe_redirect(
		add_query_arg(
			'helio_status_updated',
			'1',
			admin_url( 'admin.php?page=helio-cleaning-bookings' )
		)
	);
	exit;
}
add_action( 'admin_post_helio_update_booking_status', 'helio_cleaning_test_plugin_handle_booking_status_update' );
