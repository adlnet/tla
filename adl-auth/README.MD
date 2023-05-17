ADL Auth Server 
==============

This folder contains the auth server components:

- Keycloak Authentication Service (Quay's 11.0.3 version)
- An in-house Keycloak Helper API
- Service Registry

Server Setup
------------

Like anything else we write, this server uses Docker and Docker Compose.  While this **should** promise a no-hassle installation process, please contact the ADL team if you encounter issues.

### TL;DR
1. `git clone https://github.com/adlnet/tla`
1. `cd tla/adl-auth`
1. `sudo ./install-reqs.sh`
1. `sudo ./init-ssl.sh <domain-name>`
1. Copy example env file to `.env`
1. `sudo ./rebuild.sh`
1. `sudo ./certbot/generate.sh <domain-name>`

### Confirm Server is Operational
Once the SSL generation script runs, the Keycloak server will be available at `https://<domain-name>/auth`.  As Keycloak server itself can take a bit to spin up, it may be helpful to track the progress with:

```
sudo docker logs -f docker_keycloak
```

If you see white / yellow text that ends with "Starting with X services (Y passive / on-demand, Z lazy)", then the process started fine.
If you see a flood of red text or the ASCII java block repeating, then the service is failing and needs to be debugged.
