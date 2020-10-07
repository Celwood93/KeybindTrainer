FROM cypress/base:10

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean;
RUN apt-get install -y netcat;

COPY src ./src
COPY cypress.json ./
COPY package.json ./
COPY firebase.json ./
COPY .firebaserc ./
COPY test-db-seed ./test-db-seed
COPY .firebase ./
COPY functions ./functions
COPY public ./public
COPY database.rules.json ./
COPY codeshipEntryPoint.sh ./
COPY .env.encrypted ./
COPY cypress ./cypress

RUN yarn
RUN npm install -g firebase-tools
RUN node_modules/cypress/bin/cypress install