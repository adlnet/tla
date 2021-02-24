2019 TLA Learning Event Management (LEM) Services (Reference)
===

This repo contains the source code used for each LEM component from ADL's 2019 TLA reference implementation.  Additionally, it also contains the code for two helper services used to simplify API syntax that we disliked using.  

This repo is here **solely 👏 for 👏 reference** -- these services will do nothing interesting by themselves.

With that said, let's see what's going on here.

## xAPI Processing
The MOM has a few rules on how statements need to be interpretted but remains intentionally vague on *how* that happens.  

The general idea for the workflow below is that an LRP should be able to send xAPI statements with minimal enclave-specific modifications -- ideally none.  This might sound a bit `"well, 🤔 of course"`, but the 2017 and 2018 implementations had an unusual snake-eating-its-tail problem.  For those systems, LRPs needed to know how they were registered within the enclave itself before sending their statements, making activity registration somewhat annoying.

For 2019, we wanted to try interpretting raw statements from an LRP with respect to the enclave's own activity definitions.  For this, we routed all xAPI statements through an Apache Kafka cluster in real-time, where Kafka-consuming services would process them.

Statements were divided into 4 non-mutually-exclusive topics:
- `learner-xapi` (Noisy, contains every statement in our setup)
- `resolve-pending` (candidates for resolution, see below)
- `resolved-xapi` (Transactional)
- `authority-xapi` (Authoritative)

A simplified diagram (and slighty-dated):

![Image of LEM xAPI processing](https://i.imgur.com/r7xYecW.png)

with each service block being fairly simple.

## LEM Services
As indicated by the diagram, "The LEM" in is actually several smaller services in a trenchcoat.  

### Mail Sorter ✉
This is the very first service in the chain and the only thing actually subscribed to `learner-xapi`.

Nothing of note here, it just checks the statement structure against the MOM profile to and the statement's extensions.  If necessary, this statement will be published to one of the other 3 topics for processing downstream.

### Resolver 📚
This is the only service subscribed to `resolve-pending`.

This will check if the statements `object.id` is relevant to something in the enclave's Experience Index.

### Scheduler 📅
Reads from `resolved-xapi`.

Interprets the schedule-relevant statements within the MOM profile and updates that part of a learner's profile.

### Assertion Generator ✒ (not on this server, but painfully simple)
Reads from `resolved-xapi`.
Writes to `authority-xapi`.

Interprets the completion-relevant statements and generates competency assertions based on that activity's definition in the Experience Index.  **There is no logic here**, it just attributes anything associated with that entry.

### Goal Service ✔
Reads from `resolved-xapi` and `authority-xapi`.

Checks for goal-relevant MOM statements, either creating a goal for the learner or updating an existing one.

## Other Services We Stuck Here Because There Was Room
In addition to the entire Kafka cluster and the LEM, there are a few other things on this server.

### Demo Portal 💻 (and "Mobile version")
A painfully simple portal that communicates with the implementation services to schedule and monitor learner activity.

Unless you want a few worst-practice tips in EJS and bad middleware, this isn't useful.

### Learner Profile 🎴
A fairly staightforward profile implementation that interacts with the competency, goal, and scheduling portions of the LEM.  

This technically has a web version, but it's done entirely with auto-generated EJS stubs and a proprietary SQLite3 modeling library.  This service was written in a fairly short amount of time and hasn't been touched since.

### MOM Helper 👩
Small service built around [an NPM module](https://www.npmjs.com/package/tla-mom-proto) to assist with MOM compliance.

This basically just lists MOM verbs and has a rudementary statement sender.

### Nginx and Certbot
Container routing and SSL generation.  

## Thoughts ☕
As mentioned, this is here as a reference for how we built out our LEM implementation and isn't intended to be stood up elsewhere in any capacity (can't stop you from trying, though).  Nothing here is production-viable as-is -- if the SQLite obsession wasn't clear enough -- but the general idea worked well.

We're looking forward to taking this idea and actually fleshing out the implementation in the future.
