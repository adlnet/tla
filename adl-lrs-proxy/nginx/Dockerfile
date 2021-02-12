FROM nginx:alpine

ARG PROXY_LRS_ROOT
ARG PROXY_HOST_NAME
ARG PROXY_PORT

# Move our configuration into place
#
COPY default.conf /etc/nginx/nginx.conf
COPY proxy_headers.conf /etc/nginx/proxy_headers.conf

# Set up our nginx logs
RUN mkdir /opt/lrs
RUN mkdir /opt/lrs/logs
RUN mkdir /opt/lrs/logs/nginx

# Set up our LRS' static content
COPY admin-static /opt/lrs/admin-static
COPY ep-static /opt/lrs/ep-static
COPY lrs-static /opt/lrs/lrs-static

# Swap our environment variables
#
RUN cat /etc/nginx/nginx.conf \
	| envsubst '$PROXY_LRS_ROOT' \
	| envsubst '$PROXY_HOST_NAME' \
	| envsubst '$PROXY_PORT' \
	| tee /tmp/nginx.conf
RUN mv /tmp/nginx.conf /etc/nginx/nginx.conf
