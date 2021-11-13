NETWORK_NAME=todo-app-network

start: 
	sam local start-api --docker-network $(NETWORK_NAME)
