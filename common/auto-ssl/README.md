## Preliminary Setup Notes
- The user running `crontab -e` and the user who owns the project directory must match.
- The automatic renewal script must be executable:
```
ls -l /path/to/script
chmod +x /path/to/script
```
- If crontab is not being run as the root user, that user must be in the same group as Docker:
```
sudo usermod -aG docker $USER
```

## Automatic Certificate Renewal - Crontab Example Syntax
```
PATH=/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin
0 2 * * 1 ~/path/to/script >> ~/path/to/log 2>&1
```

## Explanation
The `PATH` definition line is required as written; crontab needs this in order to execute Docker/Docker Compose commands.

In line 2 the script is set to run every Monday at 0200, and the console output is pushed to a log file.

`/path/to/script` and `/path/to/log` should be replaced with the **absolute paths** to the actual `.sh` script file and `.log` log file locations.


## Automatic Certificate Renewal - Script Example Syntax
```
#!/bin/bash

bash ~/path/to/certbot/renew.sh ~/path/to/docker-compose.yml
docker-compose -f ~/path/to/docker-compose.yml restart nginx

<Repeat as needed.>
```

## Explanation
All file arguments must use absolute pathing. The Nginx container needs to be restarted after the certificate is renewed (done in line 2).

`docker-compose -f` is used here to get the absolute path to the default Docker Compose file. This is a necessary workaround for crontab.


## Automatic Certificate Renewal - Base Renew Script Example
```
#!/bin/bash

docker-compose -f $1 run certbot renew ...
```

## Explanation
The `renew.sh` script in the `certbot` directory must be changed to add `-f $1` after `docker-compose` to accommodate the chain of execution.