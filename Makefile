push: lint;
	git push

build:
	npm run build

dev:
	npm run dev

surge: build;
	surge -p ./dist -d rss-reader-post.surge.sh

surge-test: dev;
	surge -p ./dist -d rss-reader-post-test.surge.sh

test:
	npm test

lint:
	npm run eslint .