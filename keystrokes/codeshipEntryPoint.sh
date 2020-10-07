#!/bin/sh

firebase emulators:start --import=./test-db-seed &
yarn start &

while ! nc -z localhost 3000; do
  >&2 echo "webapp not up - sleeping"
  sleep 3
done

while ! nc -z localhost 9000; do
  >&2 echo "emulators not up - sleeping"
  sleep 3
done

yarn cypress