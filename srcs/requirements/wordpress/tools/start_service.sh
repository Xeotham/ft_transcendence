#!/bin/sh

# Configure WordPress if it isn't already set
if [ ! -f /var/www/html/wp-config.php ]; then
    cd  /var/www/html/
    if [ ! -f index.php ]; then
        wp-cli.phar core download
    fi
	# Create the base configuration file
	wp-cli.phar config create   --dbname="$MARIADB_DATABASE" --dbuser="$MARIADB_USER" --dbpass="$MARIADB_PASSWORD" --dbhost=mariadb
	
	# Create the admin user 
	wp-cli.phar core install    --url="mhaouas.42.fr" --title="mhaouas-Inception" --admin_user="$ADMIN_USR" --admin_password="$ADMIN_PWD" --admin_email="$ADMIN_MAIL"
	# Create the second user
	wp-cli.phar user create     "$USER_USR" "$USER_MAIL" --role=author --user_pass="$USER_PWD"

	# Set Redis (Bonus)
	wp-cli.phar config set WP_REDIS_HOST "redis" --allow-root
	wp-cli.phar config set WP_REDIS_PORT 6379 --raw --allow-root
    wp-cli.phar config set WP_REDIS_DATABASE 0 --allow-root
    wp-cli.phar config set WP_REDIS_TIMEOUT 1 --allow-root
    wp-cli.phar config set WP_REDIS_READ_TIMEOUT 1 --allow-root
	wp-cli.phar config set WP_REDIS_CLIENT phpredis --allow-root
    wp-cli.phar config set WP_CACHE true --allow-root
	wp-cli.phar config set WP_CACHE_KEY_SALT "mhaouas.42.fr" --allow-root
    wp-cli.phar plugin install redis-cache --activate --allow-root
    wp-cli.phar redis enable --allow-root

	# Give the User the own of the folder
	chown -R ${GL_USER}:${GL_USER} /var/www/html

	cd /
fi

# Start PhP
php-fpm82 -F