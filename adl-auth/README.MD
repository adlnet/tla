ADL Auth Server 
==============

This folder contains the auth server components:

- Keycloak Authentication Service (Quay's 11.0.3 version)
- Service Registry

Server Setup
------------

Like the other servers provisioned for the TLA demos, this one uses Docker and Docker Compose.  While this **should** promise a no-hassle installation process, please contact the ADL team if you encounter issues.

### Log into the Server
You can do this either by SSH (if it's an external machine) or just directly (if it's a VM / Metal).

### TL;DR
1. `git clone https://github.com/adlnet/tla`
1. `cd tla/adl-auth`
1. `sudo ./install-reqs.sh`
1. `sudo ./rebuild.sh`

#### Correcting SSL Behavior
By default, the master realm for Keycloak required HTTPS for external requests.  Unless you configure your server / containers to use SSL, then Keycloak is rendered inoperational.  You should have corrected this by entering the above `fix-ssl` command, but if this behavior persists then something has gone wrong with setup.

### Confirm Server is Operational
Once the `./rebuild.sh` script finishes, the docker containers will be spinning up.  This does not necessarily mean that everything is running perfectly, though.  While the Service Registry is a NodeJS application that should never encounter problems, the Keycloak service is bundled into the Wildfly instance.  You can check the status of this server with:

```
sudo docker logs docker_keycloak
```

If you see white / yellow text that ends with "Starting with X services (Y passive / on-demand, Z lazy)", then the process started fine.
If you see a flood of red text or the ASCII java block repeating, then the service is failing and needs to be debugged.

Keycloak Setup
------------

Once the server is running, navigating to <server-location>:8081 should redirect you to a landing page for Keycloak.  If you're here, then things probably went smoothly during setup.  You will now need to set up clients for your Keycloak-protected services to use.
