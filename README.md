# mvk-projekt
Repository for KTH course DD1393 Mjukvarukonstruktion (MVK) / Software Construction

# Docker instructions
To create the containers, run first 01-buildImage.sh and then 02-createContainer.sh in both client and server folder

The client container will be called `ui`
and the server container will be called `backend`

* To start a container, run `docker start $NAME`
* To stop a container, run `docker stop $NAME`
* To see container status, run `docker ps`
* for more docker commands, see the [Docker documentation](https://docs.docker.com/get-started/overview/)