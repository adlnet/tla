CREATE ROLE root WITH PASSWORD 'pg_password from config';
ALTER ROLE root WITH LOGIN;
CREATE DATABASE keycloak;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO root;
