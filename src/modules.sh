#!/bin/bash

npm install;																																			# install node package manager
npm update npm -g;																																# update it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash;
nvm install 22;																																		# update it again
node -v;																																					# Should print "v22.13.1".
npm install --save-dev ts-node-dev typescript @types/node;
npm install -D typescript;
npm i fastify;																																		# install fastify
npm i @fastify/websocket;																													# install websockets
npm install @fastify/static;																											# install static Handler
npm install @fastify/formbody;
npm install better-sqlite3;																												# install better-sqlite3 for the DataBase
npm i --save-dev @types/better-sqlite3;
npm i @types/ws -D;																																# definitions for websockets for typescript
npm install path;																																	# install node path extension
npm install dotenv --save;																												# install dotenv to handle environment variables
npm install @fastify/cors;																												# install cors
npm i glob;
npm i minimatch;
npm i commonjs;
npm init -y;
npm audit fix;																																		# automatically fixes problems if any are encountered
