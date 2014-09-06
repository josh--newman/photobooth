FROM node

COPY . /src
CMD ["cd", "/src"]
CMD ["npm", "install"]

EXPOSE 8080
CMD ["node", "/src/index.js"]
