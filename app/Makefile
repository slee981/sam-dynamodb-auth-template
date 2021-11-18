NETWORK_NAME=auth-template-network
REGION=us-east-1
STACK_NAME=simple-auth-app

start: 
	sam local start-api --docker-network $(NETWORK_NAME)

deploy-guided: 
	sam deploy --guided

deploy: 
	sam deploy 

validate: 
	sam validate

teardown: 
	aws cloudformation delete-stack --stack-name $(STACK_NAME) --region $(REGION)
