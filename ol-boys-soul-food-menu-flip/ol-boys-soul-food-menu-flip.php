<?php
/**
 * Plugin Name: OL Boys Soul Food Menu Flip
 * Description: Tabbed, animated menu display for Ol' Boy's Soul Food with custom menu items and shortcode support.
 * Version: 1.0.0
 * Author: OL Boys
 * Text Domain: ol-boys-soul-food-menu-flip
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

final class OL_Boys_Soul_Food_Menu_Flip {
    const POST_TYPE = 'ob_menu_items';
    const TAXONOMY  = 'ob_menu_category';

    /**
     * Seed data from provided menu boards.
     *
     * @var array<string, array<int, array<string, string>>>
     */
    private $seed_data = array(
        'platters'   => array(
            array( 'title' => 'Baked Turkey Wings', 'price' => '18', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Chicken Wings (Ol Boy BBQ / Jamaican Jerk BBQ / General Tso)', 'price' => '18', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Beef Short Ribs', 'price' => '25', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Fish - Whiting', 'price' => '17', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Fish - Tilapia', 'price' => '18', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Fish - Salmon', 'price' => '25', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Fried Boneless Chicken Breast', 'price' => '18', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Fried Chicken (Wings or Breast)', 'price' => '17', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Fried Rice - Chicken', 'price' => '18', 'description' => 'No sides.' ),
            array( 'title' => 'Fried Rice - Fish', 'price' => '18', 'description' => 'No sides.' ),
            array( 'title' => 'Fried Rice - Salmon', 'price' => '21', 'description' => 'No sides.' ),
            array( 'title' => 'Fried Rice - Lamb', 'price' => '25', 'description' => 'No sides.' ),
            array( 'title' => 'Fried Jumbo Shrimp', 'price' => '21', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Lamb Chops', 'price' => '25', 'description' => 'Served with (2) sides and cornbread.' ),
            array( 'title' => 'Shrimp & Chicken Alfredo', 'price' => '25', 'description' => 'No sides.' ),
            array( 'title' => 'Turkey Meatloaf', 'price' => '18', 'description' => 'Served with (2) sides and cornbread.' ),
        ),
        'sandwiches' => array(
            array( 'title' => 'Baked Turkey Wings Sandwich', 'price' => '10', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Beef Short Ribs Sandwich', 'price' => '13', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Chicken (Fried or BBQ) Sandwich', 'price' => '8', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Chicken (Ol Boy Wings) Sandwich', 'price' => '12', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Chicken (Boneless Breast) Sandwich', 'price' => '10', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Fish (Whiting) Sandwich', 'price' => '10', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Fish (Tilapia) Sandwich', 'price' => '11', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Baby Back Beef Ribs Sandwich', 'price' => '13', 'description' => 'White or wheat bread.' ),
            array( 'title' => 'Turkey Meatloaf Sandwich', 'price' => '12', 'description' => 'White or wheat bread.' ),
        ),
        'sides'      => array(
            array( 'title' => 'Baked Macaroni & Cheese', 'price' => '5', 'description' => 'Per side.' ),
            array( 'title' => 'Cabbage', 'price' => '5', 'description' => 'Per side.' ),
            array( 'title' => 'Candied Yams', 'price' => '5', 'description' => 'Per side.' ),
            array( 'title' => 'Collard Greens', 'price' => '5', 'description' => 'Per side.' ),
            array( 'title' => 'Macaroni Tuna Salad', 'price' => '6', 'description' => 'Per side.' ),
            array( 'title' => 'Potato Salad', 'price' => '5', 'description' => 'Per side.' ),
            array( 'title' => 'Rice w/Gravy', 'price' => '5', 'description' => 'Per side.' ),
            array( 'title' => 'String Beans', 'price' => '5', 'description' => 'Per side.' ),
        ),
        'desserts'   => array(
            array( 'title' => 'Sweet Potato Pie', 'price' => '6', 'description' => 'Per dessert.' ),
            array( 'title' => 'Sweet Potato Cheesecake', 'price' => '7', 'description' => 'Per dessert.' ),
            array( 'title' => 'Carrot Cake', 'price' => '7', 'description' => 'Per dessert.' ),
            array( 'title' => 'Chocolate Cake', 'price' => '6', 'description' => 'Per dessert.' ),
            array( 'title' => 'Lemon Cake', 'price' => '6', 'description' => 'Per dessert.' ),
            array( 'title' => 'Strawberry Cake', 'price' => '6', 'description' => 'Per dessert.' ),
            array( 'title' => 'Banana Pudding', 'price' => '6', 'description' => 'Per dessert.' ),
        ),
        'specials'   => array(
            array( 'title' => 'Chicken & Waffles', 'price' => '15', 'description' => 'Daily special.' ),
            array( 'title' => 'Ground Turkey Spaghetti', 'price' => '16', 'description' => 'Daily special.' ),
            array( 'title' => 'Fried Shrimp (6)', 'price' => '15', 'description' => 'Daily special.' ),
            array( 'title' => 'Ask About Daily Specials', 'price' => '0', 'description' => 'Seasonal and rotating specials available.' ),
        ),
    );

    public function __construct() {
        add_action( 'init', array( $this, 'register_post_type_and_taxonomy' ) );
        add_action( 'init', array( $this, 'register_shortcode' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ) );

        add_action( 'add_meta_boxes', array( $this, 'add_price_meta_box' ) );
        add_action( 'save_post_' . self::POST_TYPE, array( $this, 'save_price_meta' ) );

        register_activation_hook( __FILE__, array( __CLASS__, 'activate' ) );
        register_deactivation_hook( __FILE__, array( __CLASS__, 'deactivate' ) );
    }

    public static function activate() {
        $plugin = new self();
        $plugin->register_post_type_and_taxonomy();
        $plugin->insert_default_terms();
        $plugin->insert_seed_menu_items();
        flush_rewrite_rules();
    }

    public static function deactivate() {
        flush_rewrite_rules();
    }

    public function register_post_type_and_taxonomy() {
        $labels = array(
            'name'               => __( 'Menu Items', 'ol-boys-soul-food-menu-flip' ),
            'singular_name'      => __( 'Menu Item', 'ol-boys-soul-food-menu-flip' ),
            'add_new'            => __( 'Add New', 'ol-boys-soul-food-menu-flip' ),
            'add_new_item'       => __( 'Add New Menu Item', 'ol-boys-soul-food-menu-flip' ),
            'edit_item'          => __( 'Edit Menu Item', 'ol-boys-soul-food-menu-flip' ),
            'new_item'           => __( 'New Menu Item', 'ol-boys-soul-food-menu-flip' ),
            'view_item'          => __( 'View Menu Item', 'ol-boys-soul-food-menu-flip' ),
            'search_items'       => __( 'Search Menu Items', 'ol-boys-soul-food-menu-flip' ),
            'not_found'          => __( 'No menu items found.', 'ol-boys-soul-food-menu-flip' ),
            'not_found_in_trash' => __( 'No menu items found in Trash.', 'ol-boys-soul-food-menu-flip' ),
            'menu_name'          => __( 'OL Boys Menu', 'ol-boys-soul-food-menu-flip' ),
        );

        register_post_type(
            self::POST_TYPE,
            array(
                'labels'             => $labels,
                'public'             => false,
                'show_ui'            => true,
                'show_in_menu'       => true,
                'show_in_rest'       => true,
                'menu_icon'          => 'dashicons-food',
                'supports'           => array( 'title', 'editor', 'thumbnail' ),
                'has_archive'        => false,
                'rewrite'            => false,
                'exclude_from_search'=> true,
            )
        );

        register_taxonomy(
            self::TAXONOMY,
            self::POST_TYPE,
            array(
                'labels'            => array(
                    'name'          => __( 'Menu Categories', 'ol-boys-soul-food-menu-flip' ),
                    'singular_name' => __( 'Menu Category', 'ol-boys-soul-food-menu-flip' ),
                ),
                'public'            => false,
                'show_ui'           => true,
                'show_admin_column' => true,
                'show_in_rest'      => true,
                'hierarchical'      => true,
                'rewrite'           => false,
            )
        );

        $this->insert_default_terms();
    }

    private function insert_default_terms() {
        $terms = array(
            'platters'   => 'Platters',
            'sandwiches' => 'Sandwiches',
            'sides'      => 'Sides',
            'desserts'   => 'Desserts',
            'specials'   => 'Specials',
        );

        foreach ( $terms as $slug => $name ) {
            if ( ! term_exists( $slug, self::TAXONOMY ) ) {
                wp_insert_term(
                    $name,
                    self::TAXONOMY,
                    array(
                        'slug' => $slug,
                    )
                );
            }
        }
    }

    private function insert_seed_menu_items() {
        $existing = new WP_Query(
            array(
                'post_type'      => self::POST_TYPE,
                'post_status'    => 'any',
                'posts_per_page' => 1,
                'fields'         => 'ids',
            )
        );

        if ( $existing->have_posts() ) {
            return;
        }

        foreach ( $this->seed_data as $slug => $items ) {
            foreach ( $items as $item ) {
                $post_id = wp_insert_post(
                    array(
                        'post_type'    => self::POST_TYPE,
                        'post_status'  => 'publish',
                        'post_title'   => wp_strip_all_tags( $item['title'] ),
                        'post_content' => wp_kses_post( $item['description'] ),
                    ),
                    true
                );

                if ( is_wp_error( $post_id ) || ! $post_id ) {
                    continue;
                }

                wp_set_object_terms( $post_id, $slug, self::TAXONOMY, false );

                update_post_meta( $post_id, '_ob_menu_price', sanitize_text_field( $item['price'] ) );
            }
        }
    }

    public function add_price_meta_box() {
        add_meta_box(
            'ob_menu_price_meta',
            __( 'Menu Item Price', 'ol-boys-soul-food-menu-flip' ),
            array( $this, 'render_price_meta_box' ),
            self::POST_TYPE,
            'side',
            'default'
        );
    }

    public function render_price_meta_box( $post ) {
        wp_nonce_field( 'ob_menu_price_nonce_action', 'ob_menu_price_nonce' );
        $price = get_post_meta( $post->ID, '_ob_menu_price', true );
        ?>
        <p>
            <label for="ob_menu_price"><strong><?php esc_html_e( 'Price', 'ol-boys-soul-food-menu-flip' ); ?></strong></label>
        </p>
        <p>
            <input type="text" id="ob_menu_price" name="ob_menu_price" value="<?php echo esc_attr( $price ); ?>" class="widefat" placeholder="e.g. 18" />
        </p>
        <?php
    }

    public function save_price_meta( $post_id ) {
        if ( ! isset( $_POST['ob_menu_price_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ob_menu_price_nonce'] ) ), 'ob_menu_price_nonce_action' ) ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        if ( isset( $_POST['ob_menu_price'] ) ) {
            $price = sanitize_text_field( wp_unslash( $_POST['ob_menu_price'] ) );
            update_post_meta( $post_id, '_ob_menu_price', $price );
        }
    }

    public function register_assets() {
        wp_register_style(
            'ob-menu-flip-style',
            plugin_dir_url( __FILE__ ) . 'assets/css/ob-menu.css',
            array(),
            '1.0.0'
        );

        wp_register_script(
            'ob-menu-flip-script',
            plugin_dir_url( __FILE__ ) . 'assets/js/ob-menu.js',
            array(),
            '1.0.0',
            true
        );
    }

    public function register_shortcode() {
        add_shortcode( 'olboys_menu', array( $this, 'render_shortcode' ) );
    }

    public function render_shortcode() {
        wp_enqueue_style( 'ob-menu-flip-style' );
        wp_enqueue_script( 'ob-menu-flip-script' );

        $tabs = array(
            'platters'   => 'Platters',
            'sandwiches' => 'Sandwiches',
            'sides'      => 'Sides',
            'desserts'   => 'Desserts',
            'specials'   => 'Specials',
        );

        ob_start();
        ?>
        <section class="ob-menu-wrapper" aria-label="Ol Boys Soul Food Menu">
            <nav class="ob-menu-tabs" aria-label="Menu Categories">
                <?php foreach ( $tabs as $slug => $label ) : ?>
                    <button class="ob-menu-tab<?php echo ( 'platters' === $slug ) ? ' is-active' : ''; ?>" data-target="<?php echo esc_attr( $slug ); ?>" type="button">
                        <?php echo esc_html( $label ); ?>
                    </button>
                <?php endforeach; ?>
            </nav>

            <div class="ob-menu-content">
                <?php foreach ( $tabs as $slug => $label ) : ?>
                    <div class="ob-menu-panel<?php echo ( 'platters' === $slug ) ? ' is-active' : ''; ?>" data-panel="<?php echo esc_attr( $slug ); ?>" role="region" aria-label="<?php echo esc_attr( $label ); ?>">
                        <?php $items = $this->get_menu_items_by_category( $slug ); ?>
                        <?php if ( ! empty( $items ) ) : ?>
                            <div class="ob-menu-grid">
                                <?php foreach ( $items as $item ) : ?>
                                    <article class="ob-menu-card">
                                        <?php if ( ! empty( $item['image'] ) ) : ?>
                                            <div class="ob-menu-card-media">
                                                <img src="<?php echo esc_url( $item['image'] ); ?>" alt="<?php echo esc_attr( $item['title'] ); ?>" loading="lazy" />
                                            </div>
                                        <?php endif; ?>
                                        <div class="ob-menu-card-body">
                                            <h3 class="ob-menu-item-title"><?php echo esc_html( $item['title'] ); ?></h3>
                                            <?php if ( ! empty( $item['description'] ) ) : ?>
                                                <p class="ob-menu-item-description"><?php echo esc_html( $item['description'] ); ?></p>
                                            <?php endif; ?>
                                            <?php if ( '' !== $item['price'] ) : ?>
                                                <p class="ob-menu-item-price">$<?php echo esc_html( $item['price'] ); ?></p>
                                            <?php endif; ?>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        <?php else : ?>
                            <p class="ob-menu-empty"><?php esc_html_e( 'No menu items found in this category.', 'ol-boys-soul-food-menu-flip' ); ?></p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php

        return ob_get_clean();
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function get_menu_items_by_category( $slug ) {
        $query = new WP_Query(
            array(
                'post_type'      => self::POST_TYPE,
                'post_status'    => 'publish',
                'posts_per_page' => -1,
                'orderby'        => 'title',
                'order'          => 'ASC',
                'tax_query'      => array(
                    array(
                        'taxonomy' => self::TAXONOMY,
                        'field'    => 'slug',
                        'terms'    => $slug,
                    ),
                ),
            )
        );

        $items = array();

        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                $post_id = get_the_ID();

                $items[] = array(
                    'title'       => get_the_title( $post_id ),
                    'description' => wp_strip_all_tags( (string) get_post_field( 'post_content', $post_id ) ),
                    'price'       => (string) get_post_meta( $post_id, '_ob_menu_price', true ),
                    'image'       => get_the_post_thumbnail_url( $post_id, 'medium' ) ? (string) get_the_post_thumbnail_url( $post_id, 'medium' ) : '',
                );
            }
        }

        wp_reset_postdata();

        return $items;
    }
}

new OL_Boys_Soul_Food_Menu_Flip();
