# ADL Discovery Service

This is a basic API configured to allow searching for content and downloading the global env for tla projects.


## Installation
1. Run `sudo bash ./install-reqs.sh`
2. Configure your `local.env` have your to desired database credentials and server URL.
3. Run the following commands
	```
	sudo bash ./init-ssl.sh
	sudo bash ./rebuild.sh
	```
4. In a browser navagate to `https://<ServerURL>/_utils` and sign in with your set credentials.
5. Create 2 databases `services` and `env`.
6. To `env`, upload an empty object, and attach your desired env file.
7. In the `services` database, create 2 new views
     1. type
		```
		function (doc) {
		  emit(doc.type, doc);
		}
		```

     2. name
  
		```
		function (doc) {
		  emit(doc.name, doc);
		}
		```
8. To `services` upload all of your service information, following the below template:
	```
	"name": STRING,
	"endpoint": STRING (URL),
	"webhook": STRING (URL, may be null),
	"type": STRING (enum [cms, lp, xlrs, alrs, nlrs, stream, sso, lms, xi]),
	"ip": STRING (IP or rootURL),
	"port": int (port to use)
	```

### Sample Statement
```
{
  "_id": "e3346f96992a5bee61189b97ad002a99",
  "_rev": "1-ed6a30af139437d58882c401d0829a7f",
  "name": "CaSS",
  "endpoint": "https://tla-dev-cass.usalearning.net/api/data?q=@type:Competency",
  "webhook": "",
  "type": "cms",
  "ip": "tla-dev-cass.usalearning.net",
  "port": "80"
}
```

## Querying the API
The database can now be queried, using the basicAuth configuration set up in step 2, querying on type or name.
1. Query on type: `https://<RootURL>/discovery/_design/type_view/_view/type?key="<Type>"`
2. Query on name: `https://<RootURL>/discovery/_design/type_view/_view/name?key="<Name>"`

For more information on building new views and queires, please see the [CouchDB documentation](https://docs.couchdb.org/en/stable/config/index.html)
