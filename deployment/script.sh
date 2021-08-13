#!/bin/bash
service mysql start
/usr/bin/mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
/usr/bin/mysql -e "flush privileges;"
/usr/bin/mysql -e "create database if not exists zeltron; use zeltron; create table if not exists \`users\`(\`username\` VARCHAR(25) NOT NULL, \`password\` VARCHAR(50) NOT NULL, \`cookie\` int not null); insert into \`users\` (\`username\`,\`password\`, \`cookie\`) values ('admin','dskhnsdlvnlwenvlk',1340);"

