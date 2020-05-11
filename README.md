# Charpstar's 3D asset management system
The contents of this repository were developed as part of the KTH course DD1393 Mjukvarukonstruktion (MVK) / Software Construction. While [extensive project documentation](https://docs.google.com/document/d/1Dzq1DD2ReBc3ONjUZBLnNpn3k4-_u1khyI2tl0223ac/edit#) has been provided, below aims to provide more technical supporting materials. This README file covers:

* Docker containerisation
* Reverse proxy protection 
* PostgreSQL database setup
* Postman data
* UI routes

# Docker
Docker provides containerisation to facilitate mobility and migration of the contents on the server. 

To create the containers, run first 01-buildImage.sh and then 02-createContainer.sh in both client and server folder. The client container will be called `ui` and the server container will be called `backend`. All uploaded files are located in /charpstarfiles

Core functionalities:
* To start a container, run `docker start $NAME`
* To stop a container, run `docker stop $NAME`
* To see container status, run `docker ps`
* For more docker commands, see the [Docker documentation](https://docs.docker.com/get-started/overview/)

# Reverse proxy
TBD

# PostgreSQL
The `pg_dump` command has been executed to recreate the [database schema](https://github.com/officialmugi/mvk-projekt/blob/master/database.sql). Executing the PostgreSQL code can recreate the database, including its relations, enums and views. No data is recreated.

# Postman
The [postman file](https://github.com/officialmugi/mvk-projekt/blob/master/Charpstar.postman_collection.json) illustrates the back-end end-points, which are used by the front-end AS an API and thus constitute the backbone of the platform. See the [postman webpage](https://www.postman.com/) for more information.

# UI routes
The routes used for the UI are:

```
/ -> login  
/home -> admin panel
/modeller/:id -> modeller model list
/user/:id -> user view
/user/:id/orders -> user orders
/order/:id -> order overview
/order/:id/models -> order models
/model/:id -> model products 
```
