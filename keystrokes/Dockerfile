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
# maybe include service account, or make it its own thing im not sure
COPY serviceAccount.json ./ 
COPY .firebaserc ./
COPY test-db-seed ./test-db-seed
COPY .firebase ./
COPY functions ./functions
COPY public ./public
COPY database.rules.json ./
COPY dockerEntryPoint.sh ./


COPY cypress ./cypress
RUN yarn
RUN npm install -g firebase-tools
RUN node_modules/cypress/bin/cypress install
# RUN firebase emulators:exec --import=./test-db-seed yarn start 

# CMD [ "firebase", "emulators:start --import=./test-db-seed &" ]
# CMD [ "yarn", "start &" ]
# CMD [ "node_modules/cypress/bin/cypress", "install" ]
CMD [ "./dockerEntryPoint.sh"]