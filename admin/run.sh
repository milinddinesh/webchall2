#!/bin/sh

#pwntools gmpy2 pycryptodome and requests have been pre installed

cd admin

#Uncomment below line and add install dependencies
#apt-get -qq -y install package-name-goes-here

#Add your py dependencies below
pip3 install -r requirements.txt

#bash example of connecting to service
curl $(echo $CI_REGISTRY_IMAGE | sed "s/\//-/g")

#solve script here
python3 solve.py
