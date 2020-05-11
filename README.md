# Charpstar's 3D asset management system
The contents of this repository were developed as part of the KTH course DD1393 Mjukvarukonstruktion (MVK) / Software Construction. While  extensive project documentation written in Word has been provided to Charpstar, below aims to provide more technical supporting materials. This README file covers:

* Docker containerisation,
* Reverse proxy protection, 
* PostgreSQL database setup,
* Postman data.

# Docker instructions
Docker provides containerisation to facilitate mobility and migration of the contents on the server. 

To create the containers, run first 01-buildImage.sh and then 02-createContainer.sh in both client and server folder

The client container will be called `ui` and the server container will be called `backend`

All uploaded files are located in /charpstarfiles

* To start a container, run `docker start $NAME`
* To stop a container, run `docker stop $NAME`
* To see container status, run `docker ps`
* for more docker commands, see the [Docker documentation](https://docs.docker.com/get-started/overview/)

# Reverse proxy
TBD

# PostgreSQL
pg_dump

# Postman
A link to the postman file illustrating the back-end end-points can be found here. These end-points are used as an API by the front-end and thus constitute the backbone of the platform.
