DB_NAME=auth-template-db
VOLUME_NAME=auth-template-volume
NETWORK_NAME=auth-template-network
NETWORK_ALIAS=dynamodb
PORT=8000

start: 
	docker run --detach --rm -v $(VOLUME_NAME):/home/dynamodblocal --network $(NETWORK_NAME) --network-alias=$(NETWORK_ALIAS) --name $(DB_NAME) -p $(PORT):8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -dbPath /home/dynamodblocal

stop: 
	docker stop $(DB_NAME)

setup: 
	docker volume create --name $(VOLUME_NAME)
	docker network create $(NETWORK_NAME) 

teardown: 
	docker volume rm $(VOLUME_NAME) 
	docker network rm $(NETWORK_NAME)   

# local operations 

list-tables:
	aws dynamodb list-tables --endpoint-url http://localhost:$(PORT)

scan: 
	aws dynamodb scan --table-name TodoAppTable --endpoint-url http://localhost:$(PORT)

