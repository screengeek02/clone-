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

function hc_booking_activate() {
    global $wpdb;

    $table_name = hc_booking_get_table_name();
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table_name} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        phone varchar(50) NOT NULL,
        service varchar(191) NOT NULL,
        property_type varchar(191) NOT NULL,
        booking_date date NULL,
        status varchar(50) NOT NULL DEFAULT 'pending',
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) {$charset_collate};";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'hc_booking_activate');

function hc_booking_get_services() {
    return array(
        'Standard Cleaning',
        'Deep Cleaning',
        'Villa Cleaning',
    );
}

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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        return array('handled' => false, 'message' => '');
    }

    if (!isset($_POST['hc_booking_submit'])) {
        return array('handled' => false, 'message' => '');
    }

    if (!isset($_POST['hc_booking_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['hc_booking_nonce'])), 'hc_booking_submit')) {
        return array('handled' => true, 'message' => esc_html__('Security check failed. Please try again.', 'helio-cleaning-booking'));
    }

    $name = isset($_POST['hc_name']) ? sanitize_text_field(wp_unslash($_POST['hc_name'])) : '';
    $phone = isset($_POST['hc_phone']) ? sanitize_text_field(wp_unslash($_POST['hc_phone'])) : '';
    $email = isset($_POST['hc_email']) ? sanitize_email(wp_unslash($_POST['hc_email'])) : '';
    $service = isset($_POST['hc_service']) ? sanitize_text_field(wp_unslash($_POST['hc_service'])) : '';
    $property_type = isset($_POST['hc_property_type']) ? sanitize_text_field(wp_unslash($_POST['hc_property_type'])) : '';
    $booking_date_raw = isset($_POST['hc_booking_date']) ? sanitize_text_field(wp_unslash($_POST['hc_booking_date'])) : '';

    $valid_services = hc_booking_get_services();
    $valid_property_types = hc_booking_get_property_types();

    if (empty($name) || empty($phone) || empty($service) || empty($property_type)) {
        return array('handled' => true, 'message' => esc_html__('Please fill in all required fields.', 'helio-cleaning-booking'));
    }

    if (!empty($email) && !is_email($email)) {
        return array('handled' => true, 'message' => esc_html__('Please enter a valid email address.', 'helio-cleaning-booking'));
    }

    if (!in_array($service, $valid_services, true)) {
        return array('handled' => true, 'message' => esc_html__('Invalid service selected.', 'helio-cleaning-booking'));
    }

    if (!in_array($property_type, $valid_property_types, true)) {
        return array('handled' => true, 'message' => esc_html__('Invalid property type selected.', 'helio-cleaning-booking'));
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
    $inserted = $wpdb->insert(
        hc_booking_get_table_name(),
        array(
            'name' => $name,
            'phone' => $phone,
            'service' => $service,
            'property_type' => $property_type,
            'booking_date' => $booking_date,
            'status' => 'pending',
        ),
        array('%s', '%s', '%s', '%s', '%s', '%s')
    );

    if ($inserted === false) {
        return array('handled' => true, 'message' => esc_html__('Unable to save booking. Please try again later.', 'helio-cleaning-booking'));
    }

    $status = 'pending';

    $admin_email_subject = 'New Booking Received – Helio Cleaning';
    $admin_email_headers = array('Content-Type: text/html; charset=UTF-8');
    $admin_email_body =
        '<h2>New Booking Received</h2>' .
        '<p><strong>Client Name:</strong> ' . esc_html($name) . '</p>' .
        '<p><strong>Phone:</strong> ' . esc_html($phone) . '</p>' .
        '<p><strong>Email:</strong> ' . esc_html($email) . '</p>' .
        '<p><strong>Service:</strong> ' . esc_html($service) . '</p>' .
        '<p><strong>Property Type:</strong> ' . esc_html($property_type) . '</p>' .
        '<p><strong>Booking Date:</strong> ' . esc_html((string) $booking_date) . '</p>' .
        '<p><strong>Status:</strong> ' . esc_html($status) . '</p>';

    wp_mail('info@heliocleaning.com', $admin_email_subject, $admin_email_body, $admin_email_headers);

    if (!empty($email) && is_email($email)) {
        $customer_email_subject = 'Your Cleaning Booking Is Received – Helio Cleaning';
        $customer_email_headers = array('Content-Type: text/html; charset=UTF-8');
        $whatsapp_message = rawurlencode(
            'Hello Helio Cleaning, I would like to confirm my booking. ' .
            'Client Name: ' . $name . '. ' .
            'Service: ' . $service . '. ' .
            'Booking Date: ' . (string) $booking_date
        );
        $whatsapp_url = 'https://wa.me/18098408313?text=' . $whatsapp_message;
        $customer_email_body =
            '<h2>Your Booking Has Been Received</h2>' .
            '<p>Hi ' . esc_html($name) . ',</p>' .
            '<p>Thank you for booking with Helio Cleaning. Here are your booking details:</p>' .
            '<p><strong>Client Name:</strong> ' . esc_html($name) . '</p>' .
            '<p><strong>Service:</strong> ' . esc_html($service) . '</p>' .
            '<p><strong>Property Type:</strong> ' . esc_html($property_type) . '</p>' .
            '<p><strong>Booking Date:</strong> ' . esc_html((string) $booking_date) . '</p>' .
            '<p>WhatsApp: <strong>+1 809 840 8313</strong></p>' .
            '<p><a href="' . esc_url($whatsapp_url) . '">Send us a WhatsApp message with your booking details</a></p>';

        wp_mail($email, $customer_email_subject, $customer_email_body, $customer_email_headers);
    }

    wp_safe_redirect('https://heliocleaning.com/thank-you/');
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
            <label for="hc_email"><?php esc_html_e('Email', 'helio-cleaning-booking'); ?></label><br>
            <input type="email" id="hc_email" name="hc_email">
        </p>

        <p>
            <label for="hc_service"><?php esc_html_e('Service', 'helio-cleaning-booking'); ?></label><br>
            <select id="hc_service" name="hc_service" required>
                <option value=""><?php esc_html_e('Select Service', 'helio-cleaning-booking'); ?></option>
                <?php foreach (hc_booking_get_services() as $service) : ?>
                    <option value="<?php echo esc_attr($service); ?>"><?php echo esc_html($service); ?></option>
                <?php endforeach; ?>
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

    add_submenu_page(
        'hc-bookings',
        __('Bookings', 'helio-cleaning-booking'),
        __('Bookings', 'helio-cleaning-booking'),
        'manage_options',
        'hc-bookings',
        'hc_booking_render_bookings_page'
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
    $bookings = $wpdb->get_results(
        "SELECT id, name, phone, service, property_type, booking_date, status, created_at
         FROM " . hc_booking_get_table_name() . "
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
                    <th><?php esc_html_e('Name', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Phone', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Service', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Property Type', 'helio-cleaning-booking'); ?></th>
                    <th><?php esc_html_e('Booking Date', 'helio-cleaning-booking'); ?></th>
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
                            <td><?php echo esc_html((string) $booking->booking_date); ?></td>
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
    $status = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

    if ($booking_id < 1) {
        wp_die(esc_html__('Invalid booking ID.', 'helio-cleaning-booking'));
    }

    if (!isset($_POST['hc_update_status_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['hc_update_status_nonce'])), 'hc_update_status_' . $booking_id)) {
        wp_die(esc_html__('Security check failed.', 'helio-cleaning-booking'));
    }

    if (!in_array($status, hc_booking_get_statuses(), true)) {
        wp_die(esc_html__('Invalid status.', 'helio-cleaning-booking'));
    }

    global $wpdb;
    $wpdb->update(
        hc_booking_get_table_name(),
        array('status' => $status),
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
