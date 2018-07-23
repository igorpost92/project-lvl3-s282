push: lint;
	git push

build:
	npm run build

dev:
	npm run dev

surge:
	surge -p ./dist -d rss-reader-post.surge.sh

test:
	npm test

lint:
	npm run eslint .