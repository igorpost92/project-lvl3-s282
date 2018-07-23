install:
	npm install

compile:
	npm run build -- --watch

push: lint test;
	git push
	
publish: push;
	npm publish

build:
	npm run build	

test:
	npm test

test-cover:
	npm test -- --coverage

lint:
	npm run eslint .