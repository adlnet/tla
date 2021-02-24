FROM ubuntu:16.04

ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USERNAME
ARG SMTP_PASSWORD
ARG SMTP_USE_SSL
ARG SMTP_USE_TLS

ENV UWSGI_PIP_VERSION 2.0.13.1 

# Install our reqs
RUN apt-get update && apt-get install -y git fabric \
	python-setuptools python-dev python-virtualenv \
	libxml2-dev libxslt1-dev libpq-dev upstart-sysv gcc gettext

RUN easy_install pip

# Clone the repo
RUN mkdir /opt/lrs
RUN git clone https://github.com/adlnet/ADL_LRS /opt/lrs/ADL_LRS

# Prepare the configuration
COPY uwsgi/lrs_uwsgi.ini /etc/uwsgi/vassals/lrs_uwsgi.ini
COPY uwsgi/lrs.service /lib/systemd/system/lrs.service

COPY settings.ini /opt/lrs/ADL_LRS/adl_lrs/settings_temp.ini
COPY modified-fabfile.py /opt/lrs/ADL_LRS/fabfile.py

RUN cat /opt/lrs/ADL_LRS/adl_lrs/settings_temp.ini \
	| envsubst '$SMTP_HOST' \
	| envsubst '$SMTP_PORT' \
	| envsubst '$SMTP_USERNAME' \
	| envsubst '$SMTP_PASSWORD' \
	| envsubst '$SMTP_USE_TLS' \
	| envsubst '$SMTP_USE_SSL' \
	| tee /opt/lrs/ADL_LRS/adl_lrs/settings.ini

# We'll need to run the setup
COPY setup-lrs.sh /bin/setup-lrs.sh
COPY test-lrs.sh /bin/test-lrs.sh

CMD ["/bin/setup-lrs.sh"]
