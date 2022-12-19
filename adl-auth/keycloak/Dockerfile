ARG KC_VERSION=20.0

# Builder Setup
#
# The newer Keycloak images (17+) recommend building Keycloak within
# a separate image and then moving the built service into a runner image.
# This removes the lengthy startup process that Keycloak has famously
# needed to perform after each restart, but does add an additional step
# to the Dockerfile.
#
FROM quay.io/keycloak/keycloak:${KC_VERSION} as builder

RUN /opt/keycloak/bin/kc.sh build

# Runner Setup
#
# Once the image is built, we can drop in the themes and other plugins
# directly into this image.
#
# Note that the /deployments folder has been renamed to /providers
#
FROM quay.io/keycloak/keycloak:${KC_VERSION}

COPY --from=builder /opt/keycloak/lib/quarkus/ /opt/keycloak/lib/quarkus/
COPY themes/. /opt/keycloak/themes/
COPY deployments/. /opt/keycloak/providers/

WORKDIR /opt/keycloak


ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--http-relative-path", "/auth"]
