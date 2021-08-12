FROM ubuntu:latest
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y node.js npm mysql-server

COPY deployment/ /app
COPY db.sql .
COPY script.sh .
COPY execute.sh .

EXPOSE 3306 
RUN npm --prefix ./app install ./app
RUN usermod -d /var/lib/mysql/ mysql
RUN chmod +x ./script.sh && bash ./script.sh


ENTRYPOINT [ "bash" ]
CMD [ "execute.sh" ]

 
EXPOSE 8080



