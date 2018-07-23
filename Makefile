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

surge:
	surge -p ./dist --domain rss-reader-post.surge.sh

test:
	npm test

test-cover:
	npm test -- --coverage

lint:
	npm run eslint .