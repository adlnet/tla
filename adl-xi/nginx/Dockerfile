FROM nginx:alpine

ARG HOSTNAME

# Move our configuration into place.
COPY default.conf /etc/nginx/nginx.conf
COPY proxy_headers.conf /etc/nginx/proxy_headers.conf

#COPY default_nossl.conf /etc/nginx/nginx.conf
#COPY proxy_headers_nossl.conf /etc/nginx/proxy_headers.conf

# Swap our environment variables.
RUN cat /etc/nginx/nginx.conf | envsubst '$HOSTNAME' | tee /tmp/nginx.conf
RUN mv /tmp/nginx.conf /etc/nginx/nginx.conf

