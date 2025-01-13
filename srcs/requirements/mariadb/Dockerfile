FROM        alpine:3.19.4

# Updating the existing package
RUN			[ "apk", "update" ]
RUN			[ "apk", "upgrade" ]

# Install Mariadb and OpenRC
RUN			[ "apk", "add", "mariadb", "mariadb-client", "mariadb-common" ]
RUN			[ "apk", "add", "openrc" ]

# Replace the mariadb configuration file by the modified one
RUN			[ "rm", "-f", "/etc/my.cnf.d/mariadb-server.cnf" ]
COPY		[ "conf/mariadb-server.cnf", "/etc/my.cnf.d/mariadb-server.cnf" ]

# [mysqld]							: The header that specify that the info under is for the Mysql server
# socket=/run/mysqld/mysqld.sock	: Set the path to the Socket which help for local clients connection
# port=3306							: Set the incoming port connection
# datadir=/usr/local/mysql/var		: Set the path where mysql while put all he need to work
# user=mysql						: Set the user under which the server will run
# bind-address=*					: Set which IP adress the server will listen, in our case the '*' mean all adress 

# Setup OpenRC
RUN			[ "openrc" ]
RUN			[ "touch", "/run/openrc/softlevel" ]

# Add and start the Bash scrypt start_service.sh
ADD			[ "tools/start_service.sh", "." ]
RUN			[ "chmod", "777", "./start_service.sh" ]
CMD     	["./start_service.sh"]
