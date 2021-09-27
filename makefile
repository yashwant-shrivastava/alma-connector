build:
	cd api && docker build -t alma-connector-api:latest -f api-dockerfile .
	cd client && docker build -t alma-connector-client:latest -f client-dockerfile .