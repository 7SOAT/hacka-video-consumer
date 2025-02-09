data "aws_api_gateway_rest_api" "backend" {
  name = "backend-apigw"
}

data "aws_api_gateway_resource" "v1" {
  rest_api_id = data.aws_api_gateway_rest_api.backend.id 
  path = "/v1"
}

data "aws_lb" "load_balancer" {
  tags = {
    "kubernetes.io/service-name" = "default/hacka-video-uploader-svc"
  }
}