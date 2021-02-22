FROM nginx:alpine

ARG CONTENT_HOST

# Move our configuration into place
#
COPY default.conf /etc/nginx/nginx.conf
#COPY default.conf /etc/nginx/conf.d/default.conf
COPY proxy_headers.conf /etc/nginx/proxy_headers.conf

# Swap our environment variables
#
RUN cat /etc/nginx/nginx.conf | envsubst '$CONTENT_HOST' | tee /tmp/nginx.conf
RUN mv /tmp/nginx.conf /etc/nginx/nginx.conf

