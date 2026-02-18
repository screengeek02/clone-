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
        price varchar(50) NOT NULL DEFAULT '',
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
        '6500|Villa & Home Cleaning',
        '2500|Airbnb Turnover',
        '0|Office Cleaning',
        '2000|Window Cleaning',
        '10000|Pool Cleaning',
        '4000|Upholstery & Deep Cleaning',
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

function hc_booking_parse_service_value($raw_service) {
    $parts = explode('|', $raw_service, 2);

    if (count($parts) !== 2) {
        return false;
    }

    $price = sanitize_text_field($parts[0]);
    $service_name = sanitize_text_field($parts[1]);

    return array(
        'price' => $price,
        'service_name' => $service_name,
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

    $client_name = isset($_POST['hc_name']) ? sanitize_text_field(wp_unslash($_POST['hc_name'])) : '';
    $phone = isset($_POST['hc_phone']) ? sanitize_text_field(wp_unslash($_POST['hc_phone'])) : '';
    $email = isset($_POST['hc_email']) ? sanitize_email(wp_unslash($_POST['hc_email'])) : '';
    $raw_service = isset($_POST['helio_service']) ? sanitize_text_field(wp_unslash($_POST['helio_service'])) : '';
    $property_type = isset($_POST['hc_property_type']) ? sanitize_text_field(wp_unslash($_POST['hc_property_type'])) : '';
    $booking_date_raw = isset($_POST['hc_booking_date']) ? sanitize_text_field(wp_unslash($_POST['hc_booking_date'])) : '';

    $valid_services = hc_booking_get_services();
    $valid_property_types = hc_booking_get_property_types();

    if (empty($client_name) || empty($phone) || empty($raw_service) || empty($property_type)) {
        return array('handled' => true, 'message' => esc_html__('Please fill in all required fields.', 'helio-cleaning-booking'));
    }

    if (!empty($email) && !is_email($email)) {
        return array('handled' => true, 'message' => esc_html__('Please enter a valid email address.', 'helio-cleaning-booking'));
    }

    if (!in_array($raw_service, $valid_services, true)) {
        return array('handled' => true, 'message' => esc_html__('Invalid service selected.', 'helio-cleaning-booking'));
    }

    if (!in_array($property_type, $valid_property_types, true)) {
        return array('handled' => true, 'message' => esc_html__('Invalid property type selected.', 'helio-cleaning-booking'));
    }

    $service_parts = hc_booking_parse_service_value($raw_service);
    if ($service_parts === false) {
        return array('handled' => true, 'message' => esc_html__('Invalid service selected.', 'helio-cleaning-booking'));
    }

    $price = $service_parts['price'];
    $service_name = $service_parts['service_name'];

    if (empty($service_name)) {
        return '<div>Service missing</div>';
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

    $insert_data = array(
        'name' => $client_name,
        'phone' => $phone,
        'service' => $service_name,
        'property_type' => $property_type,
        'price' => $price,
        'booking_date' => $booking_date,
        'status' => 'pending',
        'created_at' => current_time('mysql'),
    );

    $inserted = $wpdb->insert(
        $table_name,
        $insert_data,
        array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
    );

    if ($inserted === false) {
        return array('handled' => true, 'message' => esc_html__('Unable to save booking. Please try again later.', 'helio-cleaning-booking'));
    }

    $status = 'pending';

    $admin_email_subject = 'New Booking Received – Helio Cleaning';
    $admin_email_headers = array('Content-Type: text/html; charset=UTF-8');
    $admin_email_body =
        '<h2>New Booking Received</h2>' .
        '<p><strong>Client Name:</strong> ' . esc_html($client_name) . '</p>' .
        '<p><strong>Phone:</strong> ' . esc_html($phone) . '</p>' .
        '<p><strong>Email:</strong> ' . esc_html($email) . '</p>' .
        '<p><strong>Service:</strong> ' . esc_html($service_name) . '</p>' .
        '<p><strong>Property Type:</strong> ' . esc_html($property_type) . '</p>' .
        '<p><strong>Booking Date:</strong> ' . esc_html((string) $booking_date) . '</p>' .
        '<p><strong>Status:</strong> ' . esc_html($status) . '</p>' .
        '<p><strong>Total Price:</strong> ' . (($price !== '0' && $price !== '0.00') ? 'RD$ ' . esc_html(number_format((float) $price, 2)) : 'Custom Quote Requested') . '</p>';

    wp_mail('info@heliocleaning.com', $admin_email_subject, $admin_email_body, $admin_email_headers);

    if (!empty($email) && is_email($email)) {
        $customer_email_subject = 'Your Cleaning Booking Is Received – Helio Cleaning';
        $customer_email_headers = array('Content-Type: text/html; charset=UTF-8');

        if ($price !== '0' && $price !== '0.00') {
            $whatsapp_price_text = 'Base Price: RD$ ' . number_format((float) $price, 2);
            $customer_price_html = '<p><strong>Base Price:</strong> RD$ ' . esc_html(number_format((float) $price, 2)) . '</p>';
        } else {
            $whatsapp_price_text = 'Office Cleaning – Custom Quote Requested';
            $customer_price_html = '<p><strong>Base Price:</strong> Custom Quote Requested</p>';
        }

        $whatsapp_message = rawurlencode(
            'Hello Helio Cleaning, I would like to confirm my booking. ' .
            'Client Name: ' . $client_name . '. ' .
            'Service Selected: ' . $service_name . '. ' .
            $whatsapp_price_text . '. ' .
            'Booking Date: ' . (string) $booking_date
        );

        $whatsapp_url = 'https://wa.me/18098408313?text=' . $whatsapp_message;

        $customer_email_body =
            '<h2>Your Booking Has Been Received</h2>' .
            '<p>Hi ' . esc_html($client_name) . ',</p>' .
            '<p>Thank you for booking with Helio Cleaning. Here are your booking details:</p>' .
            '<p><strong>Client Name:</strong> ' . esc_html($client_name) . '</p>' .
            '<p><strong>Service:</strong> ' . esc_html($service_name) . '</p>' .
            '<p><strong>Property Type:</strong> ' . esc_html($property_type) . '</p>' .
            '<p><strong>Booking Date:</strong> ' . esc_html((string) $booking_date) . '</p>' .
            $customer_price_html .
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

    $message = '';
    if (is_array($result) && !empty($result['message'])) {
        $message = $result['message'];
    } elseif (is_string($result) && $result !== '') {
        $message = $result;
    }

    if (!empty($message)) {
        echo '<div class="hc-booking-message">' . wp_kses_post($message) . '</div>';
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
            <label for="helio_service"><?php esc_html_e('Service', 'helio-cleaning-booking'); ?></label><br>
            <select id="helio_service" name="helio_service" required>
                <option value=""><?php esc_html_e('Select Service', 'helio-cleaning-booking'); ?></option>
                <?php foreach (hc_booking_get_services() as $service_option) : ?>
                    <?php
                    $service_parts = hc_booking_parse_service_value($service_option);
                    if ($service_parts === false) {
                        continue;
                    }
                    $service_label = $service_parts['service_name'] . ' – ' . (($service_parts['price'] !== '0' && $service_parts['price'] !== '0.00') ? 'RD$ ' . number_format((float) $service_parts['price'], 0) : 'Custom Quote');
                    ?>
                    <option value="<?php echo esc_attr($service_option); ?>"><?php echo esc_html($service_label); ?></option>
                <?php endforeach; ?>
            </select>
        </p>

        <input type="hidden" name="helio_base_price" id="helio_base_price" value="0">

        <div id="helio_live_total" style="font-weight:800;font-size:20px;margin-top:10px;"> Total: RD$0 </div>

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

    <script>
        (function () {
            const serviceSelect = document.getElementById('helio_service');
            const basePriceInput = document.getElementById('helio_base_price');
            const liveTotal = document.getElementById('helio_live_total');

            function formatWithCommas(value) {
                return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            function updateLivePrice() {
                if (!serviceSelect || !basePriceInput || !liveTotal) {
                    return;
                }

                const selectedValue = serviceSelect.value || '';
                const parts = selectedValue.split('|');
                const parsedPrice = parts.length > 1 ? parseFloat(parts[0]) : 0;
                const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;

                basePriceInput.value = price.toFixed(2);

                if (price === 0) {
                    liveTotal.style.display = 'block';
                    liveTotal.textContent = 'Custom quote — we will contact you.';
                    return;
                }

                liveTotal.style.display = 'block';
                liveTotal.textContent = 'Total: RD$' + formatWithCommas(Math.round(price));
            }

            if (serviceSelect) {
                serviceSelect.addEventListener('change', updateLivePrice);
            }

            updateLivePrice();
        })();
    </script>
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
