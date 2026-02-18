<?php
/**
 * Plugin Name: Helio Cleaning Booking
 * Description: Booking form and admin management for Helio Cleaning.
 * Version: 1.0.0
 * Author: Helio Cleaning
 * License: GPL-2.0-or-later
 * Text Domain: helio-cleaning-booking
 */

if (!defined('ABSPATH')) {
    exit;
}

function hc_booking_get_table_name() {
    global $wpdb;

    return $wpdb->prefix . 'hc_bookings';
}

function helio_cleaning_get_bookings_schema() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'hc_bookings';
    $charset_collate = $wpdb->get_charset_collate();

    return "CREATE TABLE $table_name (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service VARCHAR(191) NOT NULL,
        property_type VARCHAR(191) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        booking_date DATE NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY created_at (created_at)
    ) $charset_collate;";
}

function hc_booking_activate() {
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta(helio_cleaning_get_bookings_schema());
}
register_activation_hook(__FILE__, 'hc_booking_activate');

function hc_booking_get_property_types() {
    return array(
        'Apartment',
        'Villa',
    );
}

function hc_booking_get_statuses() {
    return array(
        'pending',
        'confirmed',
        'completed',
        'cancelled',
    );
}

function hc_booking_handle_frontend_submission() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['hc_booking_submit'])) {
        return array('handled' => false, 'message' => '');
    }

    if (!isset($_POST['hc_booking_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['hc_booking_nonce'])), 'hc_booking_submit')) {
        return array('handled' => true, 'message' => esc_html__('Security check failed. Please try again.', 'helio-cleaning-booking'));
    }

    $client_name = isset($_POST['hc_name']) ? sanitize_text_field(wp_unslash($_POST['hc_name'])) : '';
    $phone = isset($_POST['hc_phone']) ? sanitize_text_field(wp_unslash($_POST['hc_phone'])) : '';
    $property_type = isset($_POST['hc_property_type']) ? sanitize_text_field(wp_unslash($_POST['hc_property_type'])) : '';
    $booking_date_raw = isset($_POST['hc_booking_date']) ? sanitize_text_field(wp_unslash($_POST['hc_booking_date'])) : '';
    $raw_service = isset($_POST['helio_service']) ? sanitize_text_field(wp_unslash($_POST['helio_service'])) : '';

    if (empty($client_name) || empty($phone) || empty($raw_service) || empty($property_type)) {
        return array('handled' => true, 'message' => esc_html__('Please fill in all required fields.', 'helio-cleaning-booking'));
    }

    if (!in_array($property_type, hc_booking_get_property_types(), true)) {
        return array('handled' => true, 'message' => esc_html__('Invalid property type selected.', 'helio-cleaning-booking'));
    }

    $valid_services = array(
        '6500|Villa & Home Cleaning',
        '2500|Airbnb Turnover',
        '0|Office Cleaning',
        '2000|Window Cleaning',
        '10000|Pool Cleaning',
        '4000|Upholstery & Deep Cleaning',
    );

    if (!in_array($raw_service, $valid_services, true) || strpos($raw_service, '|') === false) {
        return array('handled' => true, 'message' => esc_html__('Invalid service selected.', 'helio-cleaning-booking'));
    }

    list($service_price, $service_name) = explode('|', $raw_service, 2);
    $service_price = floatval(sanitize_text_field($service_price));
    $service_name = sanitize_text_field($service_name);

    if ($service_name === '') {
        return array('handled' => true, 'message' => esc_html__('Service missing.', 'helio-cleaning-booking'));
    }

    $booking_date = null;
    if (!empty($booking_date_raw)) {
        $date_obj = DateTime::createFromFormat('Y-m-d', $booking_date_raw);
        if (!$date_obj || $date_obj->format('Y-m-d') !== $booking_date_raw) {
            return array('handled' => true, 'message' => esc_html__('Invalid booking date format.', 'helio-cleaning-booking'));
        }
        $booking_date = $booking_date_raw;
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'hc_bookings';

    $inserted = $wpdb->insert(
        $table_name,
        array(
            'name' => $client_name,
            'phone' => $phone,
            'service' => $service_name,
            'property_type' => $property_type,
            'price' => floatval($service_price),
            'booking_date' => $booking_date,
            'status' => 'pending',
            'created_at' => current_time('mysql'),
        ),
        array('%s', '%s', '%s', '%s', '%f', '%s', '%s', '%s')
    );

    if ($inserted === false) {
        return array('handled' => true, 'message' => esc_html__('Unable to save booking. Please try again later.', 'helio-cleaning-booking'));
    }

    do_action('helio_booking_created', $wpdb->insert_id);

    wp_safe_redirect(home_url('/thank-you/'));
    exit;
}

function hc_booking_shortcode() {
    $result = hc_booking_handle_frontend_submission();

    ob_start();

    if (!empty($result['message'])) {
        echo '<div class="hc-booking-message">' . esc_html($result['message']) . '</div>';
    }
    ?>
    <form method="post" action="">
        <?php wp_nonce_field('hc_booking_submit', 'hc_booking_nonce'); ?>

        <p>
            <label for="hc_name"><?php esc_html_e('Name', 'helio-cleaning-booking'); ?></label><br>
            <input type="text" id="hc_name" name="hc_name" required>
        </p>

        <p>
            <label for="hc_phone"><?php esc_html_e('Phone', 'helio-cleaning-booking'); ?></label><br>
            <input type="text" id="hc_phone" name="hc_phone" required>
        </p>

        <p>
            <label for="helio_service"><?php esc_html_e('Service', 'helio-cleaning-booking'); ?></label><br>
            <select name="helio_service" id="helio_service" required>
                <option value=""><?php esc_html_e('Select Service', 'helio-cleaning-booking'); ?></option>
                <option value="6500|Villa & Home Cleaning"><?php esc_html_e('Villa & Home Cleaning – From RD$6,500', 'helio-cleaning-booking'); ?></option>
                <option value="2500|Airbnb Turnover"><?php esc_html_e('Airbnb Turnover – From RD$2,500', 'helio-cleaning-booking'); ?></option>
                <option value="0|Office Cleaning"><?php esc_html_e('Office Cleaning – Custom Quote', 'helio-cleaning-booking'); ?></option>
                <option value="2000|Window Cleaning"><?php esc_html_e('Window Cleaning – From RD$2,000', 'helio-cleaning-booking'); ?></option>
                <option value="10000|Pool Cleaning"><?php esc_html_e('Pool Cleaning – From RD$10,000', 'helio-cleaning-booking'); ?></option>
                <option value="4000|Upholstery & Deep Cleaning"><?php esc_html_e('Upholstery & Deep Cleaning – From RD$4,000', 'helio-cleaning-booking'); ?></option>
            </select>
        </p>

        <p>
            <label for="hc_property_type"><?php esc_html_e('Property Type', 'helio-cleaning-booking'); ?></label><br>
            <select id="hc_property_type" name="hc_property_type" required>
                <option value=""><?php esc_html_e('Select Property Type', 'helio-cleaning-booking'); ?></option>
                <?php foreach (hc_booking_get_property_types() as $property_type) : ?>
                    <option value="<?php echo esc_attr($property_type); ?>"><?php echo esc_html($property_type); ?></option>
                <?php endforeach; ?>
            </select>
        </p>

        <p>
            <label for="hc_booking_date"><?php esc_html_e('Booking Date', 'helio-cleaning-booking'); ?></label><br>
            <input type="date" id="hc_booking_date" name="hc_booking_date">
        </p>

        <p>
            <button type="submit" name="hc_booking_submit" value="1"><?php esc_html_e('Submit Booking', 'helio-cleaning-booking'); ?></button>
        </p>
    </form>
    <?php

    return ob_get_clean();
}
add_shortcode('heliobooking', 'hc_booking_shortcode');

function hc_booking_register_admin_menu() {
    add_menu_page(
        __('Helio Cleaning', 'helio-cleaning-booking'),
        __('Helio Cleaning', 'helio-cleaning-booking'),
        'manage_options',
        'hc-bookings',
        'hc_booking_render_bookings_page',
        'dashicons-calendar-alt',
        26
    );
}
add_action('admin_menu', 'hc_booking_register_admin_menu');

function hc_booking_render_admin_notice() {
    if (!isset($_GET['page']) || sanitize_text_field(wp_unslash($_GET['page'])) !== 'hc-bookings') {
        return;
    }

    if (!isset($_GET['hc_updated']) || sanitize_text_field(wp_unslash($_GET['hc_updated'])) !== '1') {
        return;
    }

    echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Booking status updated.', 'helio-cleaning-booking') . '</p></div>';
}
add_action('admin_notices', 'hc_booking_render_admin_notice');

function hc_booking_render_bookings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'hc_bookings';
    $bookings = $wpdb->get_results(
        "SELECT id, name, phone, service, property_type, price, status, created_at
         FROM {$table_name}
         ORDER BY created_at DESC"
    );
    $statuses = hc_booking_get_statuses();
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Bookings', 'helio-cleaning-booking'); ?></h1>

        <table class="widefat fixed striped">
            <thead>
                <tr>
                    <th><?php esc_html_e('ID', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Client Name', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Phone', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Service', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Property Type', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Price', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Status', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Created At', 'helio-cleaning-booking'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($bookings)) : ?>
                    <tr>
                        <td colspan="8"><?php esc_html_e('No bookings found.', 'helio-cleaning-booking'); ?></td>
                    </tr>
                <?php else : ?>
                    <?php foreach ($bookings as $booking) : ?>
                        <tr>
                            <td><?php echo esc_html((string) $booking->id); ?></td>
                            <td><?php echo esc_html($booking->name); ?></td>
                            <td><?php echo esc_html($booking->phone); ?></td>
                            <td><?php echo esc_html($booking->service); ?></td>
                            <td><?php echo esc_html($booking->property_type); ?></td>
                            <td><?php echo esc_html(number_format((float) $booking->price, 2)); ?></td>
                            <td>
                                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                                    <input type="hidden" name="action" value="hc_update_booking_status">
                                    <input type="hidden" name="booking_id" value="<?php echo esc_attr((string) $booking->id); ?>">
                                    <?php wp_nonce_field('hc_update_status_' . $booking->id, 'hc_update_status_nonce'); ?>
                                    <select name="status">
                                        <?php foreach ($statuses as $status) : ?>
                                            <option value="<?php echo esc_attr($status); ?>" <?php selected($booking->status, $status); ?>>
                                                <?php echo esc_html(ucfirst($status)); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <button type="submit" class="button button-small"><?php esc_html_e('Update', 'helio-cleaning-booking'); ?></button>
                                </form>
                            </td>
                            <td><?php echo esc_html($booking->created_at); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

function hc_booking_handle_status_update() {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to perform this action.', 'helio-cleaning-booking'));
    }

    $booking_id = isset($_POST['booking_id']) ? absint($_POST['booking_id']) : 0;
    $booking_status = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

    if ($booking_id < 1) {
        wp_die(esc_html__('Invalid booking ID.', 'helio-cleaning-booking'));
    }

    if (!isset($_POST['hc_update_status_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['hc_update_status_nonce'])), 'hc_update_status_' . $booking_id)) {
        wp_die(esc_html__('Security check failed.', 'helio-cleaning-booking'));
    }

    if (!in_array($booking_status, hc_booking_get_statuses(), true)) {
        wp_die(esc_html__('Invalid status.', 'helio-cleaning-booking'));
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'hc_bookings';

    $wpdb->update(
        $table_name,
        array('status' => $booking_status),
        array('id' => $booking_id),
        array('%s'),
        array('%d')
    );

    $redirect_url = add_query_arg(
        array(
            'page' => 'hc-bookings',
            'hc_updated' => '1',
        ),
        admin_url('admin.php')
    );

    wp_safe_redirect($redirect_url);
    exit;
}
add_action('admin_post_hc_update_booking_status', 'hc_booking_handle_status_update');
