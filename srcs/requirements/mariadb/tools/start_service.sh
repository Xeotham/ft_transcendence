#!/bin/sh

# Install the Mariadb database 
mariadb-install-db

# Start the service
service mariadb start;

# Create the database named $MARIADB_DATABASE if it does not exist
mariadb -e "CREATE DATABASE IF NOT EXISTS \`${MARIADB_DATABASE}\`;"

# Create a new Mariadb user with it's Password
mariadb -e "CREATE USER IF NOT EXISTS \`${MARIADB_USER}\`@'%' IDENTIFIED BY '${MARIADB_PASSWORD}';"

# Grant all privilage to the user on the specified database
mariadb -e "GRANT ALL PRIVILEGES ON \`${MARIADB_DATABASE}\`.* TO \`${MARIADB_USER}\`@'%' ;"

# Reload the privilege to assur the user now have the permissions
mariadb -e "FLUSH PRIVILEGES;"

# Shutdown the server
mariadb-admin -u root shutdown

# Restart the server
exec mariadbd-safe
