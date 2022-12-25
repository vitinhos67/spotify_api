FROM node:19.0.0

WORKDIR /src

ADD package.json /src
RUN npm install 
ADD . /src

EXPOSE 80


CMD ["npm", "start"]
