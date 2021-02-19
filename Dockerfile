FROM node:lts-alpine3.12 as builder

# switch user
USER node

# Create app directory
WORKDIR /home/node

# Install app dependencies & setup
COPY --chown=node:node . .
RUN npm install

RUN npm run compile:docker

FROM node:lts-slim as runner
# switch user
USER node

# Create app directory
WORKDIR /home/node

COPY --from=builder ./home/node/dist/ .
COPY --from=builder ./home/node/package*.json ./

RUN npm install --production
# Expose
EXPOSE 3000 4200

# Command to run
CMD [ "node", "server.js" ]
