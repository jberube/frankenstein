MOCHA = ./node_modules/.bin/mocha
NPM_VER = $(shell npm --version)

node: 
	node --version
	sudo apt-get install python-software-properties
	sudo add-apt-repository ppa:chris-lea/node.js
	sudo apt-get update
	sudo apt-get install nodejs nodejs-dev npm
	node --version
	npm --version

packages:
	npm install

deps: node packages

test:
	${MOCHA} --reporter spec

deploy: test clean
	mkdir ../../Web/test
	cp -r -u -t ../../Web/test web

clean:
	rm -r -d ../../Web/test/

run: deploy
	node server/server

.PHONY: test