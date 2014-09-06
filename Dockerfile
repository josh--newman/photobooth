FROM node

COPY . /src
RUN cd /src
RUN npm install

EXPOSE 8080
CMD ["node", "/src/index.js"]
