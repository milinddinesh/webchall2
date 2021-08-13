FROM ubuntu:latest
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y node.js npm mysql-server nginx iputils-ping

COPY deployment/ecorp /app
RUN ls /app
COPY deployment/script.sh .
COPY deployment/execute.sh .
COPY deployment/default /etc/nginx/sites-enabled/
COPY deployment/flag.txt /root/

EXPOSE 3306 
RUN npm --prefix ./app install ./app
RUN usermod -d /var/lib/mysql/ mysql
RUN chmod +x ./script.sh && bash ./script.sh


ENTRYPOINT [ "bash" ]
CMD [ "execute.sh" ]

 
EXPOSE 8080



