locals {
  apigw_id               = data.aws_api_gateway_rest_api.backend.id
  apigw_root_resource_id = data.aws_api_gateway_resource.v1.id
  loadbalancer_arn       = data.aws_lb.load_balancer.arn
  loadbalancer_dns_name  = data.aws_lb.load_balancer.dns_name
} 