## Automated SSL Renewal
ADL services are typically deployed with containers, with HTTP served by the usual pairing of Nginx and Certbot.  While this has provided a clean way of configuring machines without explicit host OS installs of either, it does complicate the automated SSL renewal usually provided by Certbot.

This guide will walk through how to automate the SSL certificate renewal process for our servers.

### TL;DR
1. Open the root crontab `sudo crontab -e`
1. Paste the following lines:
```
PATH=/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin
0 2 * * 1 ~/tla/common/auto-ssl/auto-renew.sh ~/tla/<server>
```
replacing `~/tla/<server>` with the proper folder path (i.e. `~/tla/adl-auth`).  

**Note:** If crontab is not being run as the root user, you'll need to add them to the Docker group:
```
sudo usermod -aG docker $USER
```

### Using in Other Projects
This setup can be used with any other ADL server setup (since we always use this container setup), but the paths will need to be swapped out ofc.
