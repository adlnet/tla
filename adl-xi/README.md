## Experience Index Lite
Simplified implementation of an Experience Index (XI) initially developed as a test appliance DAU sandbox.

This repo contains a Docker Compose setup for standing up a simple XI, with Expess proxied behind Nginx for SSL and the common ENV variables ready to be configured.  The scripts here assume an Ubuntu-like OS, but can be modified for others without much issue.


## Setup
Setup is pretty straightforward, we need to ensure that Docker is installed and then it handles the rest.  SSL is also pretty quick, but does take a few more steps.

### tl;dr:
- `git clone https://github.com/adlnet/xi-lite`
- `cd xi-lite`
- `sudo ./install-reqs.sh`
- `cp example.env .env`
- `cp xi/config.example.js xi/config.js`
- Populate the `.env` file (see below)
- `sudo ./init-ssl.sh <HOSTNAME>` (see below)
- `sudo docker-compose up -d --build`

### Setting the Config Values
The repo comes with an `example.env` file that you will want to (but really should) configure.  Each service has a few properties exposed by default, but you can refer to the Docker Hub docs for each to add more.

Service|Variable|Why am I setting this?
-|-|-
**Nginx**|`HOSTNAME`|Domain name of the machine used to host this stack, can be `localhost`
**XI**|`DB_CONTAINER`|Name of the database container for reference. Can also be a path
**^**|`DB_NAME`|Name of the database in the database container.
**^**|`COLLECTION_NAME`|Name of the mongo db collection.
**^**|`SITE_ROOT`|Url root for the XI service, optional.
**^**|`SITE_NAME`|Name for the html title.
**^**|`KEYCLOAK_URL`|Root path for the intended Keycloak server.
**^**|`KEYCLOAK_REALM`|Realm name for the Keycloak instance.
**^**|`KEYCLOAK_CLIENT`|Client name for the Keycloak instance.
**^**|`API_SECRET`|The secret that will be used for API queries with the XI.
**^**|`EXACT_RESOLUTION_MATCH`|Whether or not the competency and URL filtering will require exact string matches.

### Setting up SSL
This stack uses Certbot and Nginx to handle SSL, including temporary self-signed certs to help the process along.  We run the `init-ssl.sh` script during setup to place these into a directory corresponding to Nginx's `HOSTNAME` variable.  

With that, the stack can start without issue but to get an actual SSL cert from Certbot:
```
sudo ./certbot/generate.sh <HOSTNAME>
```

## API Usage
The API for this service is pretty basic, as there are really just two endpoints that will be used by external things like competency services or LEM xAPI-XI resolution.

For the paths below, `<root>` refers to whatever the site's basic root path is.  Usually, this will have the form `https://some.domain.net/xi`.

#### `<root>/api/v1/experiences`
Primary endpoint for retrieving and filtering the XI entries.  This endpoint accepts a few arguments, depending on its use-case.

Argument|Default|Description
-|-|-
**secret**|None|API password for querying entries outside of a SSO context, configurable with the ENV file.
**competency**|None|A competency URI to filter the entries.  <br><br>When present, will only return entries that defined this competency within their `educationalAlignment` array.
**url**|None|The URL for the piece of content assigned to this entry.  <br><br>When present, will only return entries with a matching `url`.
**limit**|1000|The maximum number of entries to return.
**offset**|0|The offset / pagination index for the entries to return.

#### `<root>/api/v1/experiences/<id>`
Returns a single entry whose ID matches the path param.  Each entry's `handle` property will be a URL with this format for retrieving it directly.

Argument|Default|Description
-|-|-
**secret**|None|API password for querying entries outside of a SSO context, configurable with the ENV file.

