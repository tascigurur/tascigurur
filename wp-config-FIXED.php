<?php

define( 'WP_CACHE', true ); // Added by WP Rocket

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'sariyer5_onespace' );

/** Database username */
define( 'DB_USER', 'sariyer5_onespace' );

/** Database password */
define( 'DB_PASSWORD', 'OM{v7E14Ha%d' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         ':YH|M}YDbm1Z#e.wprJ#iN<g?UoD:@X|cA8Lp!eq~7|0nfd#>Aji8 d;Bc^T/S/T' );
define( 'SECURE_AUTH_KEY',  '+OJz:-QsMp<@H?RS{Z?_g#_`U^,g.--3jrq1_B{?/KfH@*=cU7XGH:bf9Nd:?iuk' );
define( 'LOGGED_IN_KEY',    'V&F.Z>5p3U7NG&W~]Z+2X)4mh8S(=-j/rqecI5loFq5B7]f4~dQ[.>l$XqbAN*ll' );
define( 'NONCE_KEY',        '9T+[G`l*|6lo3#> LhL%y*cR9vj[gG~}g<DLQef2)bN!DHmlRfQ5GTxkz8v6 B9N' );
define( 'AUTH_SALT',        '0ixnIi0LsVnu92D)#GvsPlY{c>etx-y5ODR^LH4j!6|HU:SRg%a`ZMF9b/q`b+~E' );
define( 'SECURE_AUTH_SALT', '*0b_b ssWq_RuAdU6Ji@XxW)x%q8.4KKR@Ci5_P+Ijxhb(4`1Z6@CMgsA(&x^?4Z' );
define( 'LOGGED_IN_SALT',   '?f4vy_;xU5;}:4Yg/:{P5RK}yv=<UH[))W$m*4EopIt]^,G%TW5SNn}djWFu9G1 ' );
define( 'NONCE_SALT',       't:cZB}m:YXP4$VaR)k`<b9!y]9%I7Q_b&pcLIKYlT:b{B8n@S|eiWm%NZ5+k<RDf' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */

// WordPress Site URL Configuration
define( 'WP_HOME', 'https://onespace.qudigital.com.tr' );
define( 'WP_SITEURL', 'https://onespace.qudigital.com.tr' );

// Force HTTPS if behind a proxy/load balancer
if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ) {
	$_SERVER['HTTPS'] = 'on';
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
