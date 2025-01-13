FROM    alpine:3.19.4

# Updating the existing package
RUN		[ "apk", "update" ]
RUN		[ "apk", "upgrade" ]

# Installing and setup NGINX
RUN		[ "apk", "add", "nginx" ]
RUN		[ "mkdir", "-p", "/etc/nginx/ssl" ]

# Installing and setup OpenSSL
RUN		[ "apk", "add", "openssl" ]

# openssl	: Call openssl
# req		: Make a request for a selfsigned certificate
# -x509		: Ask to create a certificate that complies to the x509 format
# -nodes	: Tell to not encrypt the private key
# -out		: Specify where the certificate will be save at
# -keyout	: Specify where the private key will be stored
# -subj		: Give more information about the certificate (Country, State, Locality, Organisation, Common Name, User ID)
RUN		[ "openssl", "req", "-x509", "-nodes", 												 \
			"-out", "/etc/nginx/ssl/inception.crt",											 \
			"-keyout", "/etc/nginx/ssl/inception.key",										 \
			"-subj", "/C=FR/ST=Charente/L=Angouleme/O=42/OU=42/CN=mhaouas.42.fr/UID=mhaouas" ]

# Remove and replace the configuration file for NGINX
RUN		["rm", "-f", "/etc/nginx/http.d/default.conf" ]
COPY	[ "conf/inception.conf", "/etc/nginx/http.d/inception.conf" ]

# Execute NGINX if foreground
CMD		[ "nginx", "-g", "daemon off;" ]
