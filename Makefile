NETWORK_NAME=todo-app-network
REGION=us-east-1
STACK_NAME=simple-auth-app

start: 
	sam local start-api --docker-network $(NETWORK_NAME)

deploy: 
	sam deploy --guided

teardown: 
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION)
