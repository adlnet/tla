## Automatic Certificate Renewal - Crontab Example Syntax
```
PATH=/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin
0 2 * * 1 ~/path/to/script/certbot-renew.sh >> ~/path/to/log/renew.log 2>&1
```

## Explanation
The `PATH` definition line is explicitly required, as crontab needs this in order to perform standard Docker/Docker Compose commands.

In the second line, the example `certbot-renew` script is run every Monday at 0200, and the console output is pushed to a log file.

The only changes that need to be made to the example crontab syntax involve providing the **absolute paths** to the location of the script and the desired location of the log file, as crontabs require this pathing.


## Automatic Certificate Renewal - Script Example Syntax
```
#!/bin/bash

bash ~/path/to/certbot/renew.sh ~/path/to/docker-compose.yml
docker-compose -f ~/path/to/docker-compose.yml restart nginx

<Repeat as needed.>
```

## Explanation
Because the script itself is being run by a crontab, all file paths must be absolute. The `renew` script in the project's `certbot` directory must also be changed so that `docker-compose` is extended with `-f` followed by the absolute path to the `docker-compose.yml` file of the base project.

For each Certbot instance that needs to be monitored for automatic renewal, the first line runs the `renew` script and the second line restarts the Nginx container, a required step after the new certificate is potentially created. These two lines can be repeated for each project as long as the correct absolute paths are provided.