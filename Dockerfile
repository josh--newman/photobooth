# DOCKER-VERSION 1.0.0
FROM resin/rpi-raspbian

# install required packages
RUN apt-get update
RUN apt-get install -y wget dialog

# install nodejs
RUN wget http://node-arm.herokuapp.com/node_latest_armhf.deb
RUN dpkg -i node_latest_armhf.deb

COPY . /src
RUN cd /src; npm install

# run application
EXPOSE 8080
CMD ["node", "/src/index.js"]
