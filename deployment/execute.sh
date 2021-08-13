#!/bin/bash
service mysql restart
service nginx start
node /app/index.js

