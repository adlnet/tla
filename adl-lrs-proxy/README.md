Kafka-Forwarding Docker Implementation of the ADL LRS
=================
Automated Docker installer for the ADL LRS.

If you have been struggling to stand up a local version of the ADL LRS, then this might be the place for you.  The goal of this project is to streamline the installation of the public ADL LRS and further the accessibility of xAPI by automating the lengthy steps required to stand one up.  

This project uses a direct clone of official ADL repository with a single, minor modification to the `fabfile.py` for the sake of convenience when working with Docker.

## Recent Updates 🌟
The container structure has changed a bit, with the inclusion of Certbot, a more modern forwarding approach for the LRS itself, and a local network for the Docker Compose setup.  If you upgrade from an earlier version of this repo, you may need to do the SSL step shown below with the 🌟 symbol.

## Things to Note
- **This project is in development and should be used with caution.**
- **This project DOES NOT include SMTP configuration!**
- **This project DOES NOT create a Django superuser by default.**

For the Django site admin, this can be created easily and is outlined below.

## What's in the box?
This project will create Docker containers for the following services:
- A Django web service (the ADL LRS) with uWSGI.
- An nginx proxy handling HTTP/HTTPS traffic on ports 80/443
- Postgres DB (LRS information and user accounts)
- RabbitMQ (enabling Celery and AMQP)

## How to Use
As this project is centered around Docker, there's very little setup required on the host machine. 

### TL;DR
1. `git clone https://github.com/vbhayden/adl-lrs-docker`
1. `cd adl-lrs-docker`
1. `sudo ./install-reqs.sh`
1. `sudo ./init-ssl.sh localhost` (🌟 NEW)
1. `sudo ./rebuild.sh`

(optional) 
- `sudo ./create-admin.sh` (once the LRS is available, **which can take awhile!**)

### A bit more detail
Once you clone the repository, move to its root folder.  Here, you'll install all the necessary prerequisites and then run the actual build itself.  

Once the containers have finished building, the LRS service will need some time to start.  This is because of a strange visibility issue with Django's runtime and the Docker containers for RabbitMQ and Postgres, requiring that all containers be live before Django will believe they exist and interact.

To monitor the LRS setup process, you can use:
```
sudo docker logs -f docker_lrs
```
Once complete, the LRS should be visible at `https://localhost`.

### Adding an Admin Account
When the LRS is available (**which can take awhile**), you may wish to create a superuser for the LRS.  This is done by navigating to the root directory of the project and running:
```
sudo ./create-admin.sh
```
This user only needs to be created **once**, as the Postgres container will persist through sessions.

### Setting up SSL
The project includes a basic Certbot container for generating a proper SSL certificate from a publicly available domain.  To do this, run:
```
sudo ./certbot/generate.sh <your-domain-name>
```
This will retrieve a certificate and restart your nginx container to use it.  

**Note: If this fails for any reason, you will need to restore the temporary SSL cert using:**
```
sudo ./init-ssl.sh <your-domain-name>
```
