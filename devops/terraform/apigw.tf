#region [VPC LINK]
resource "aws_api_gateway_vpc_link" "upload_service" {
  name        = "upload-service-apigw-vpclink"
  description = "Upload service API Gateway VPC Link. Managed by Terraform."
  target_arns = [local.loadbalancer_arn]
}
#endregion
#region /v1/presigned-url
resource "aws_api_gateway_resource" "presigned_url" {
  rest_api_id = local.apigw_id
  parent_id   = local.apigw_root_resource_id
  path_part   = "presigned-url"
}

resource "aws_api_gateway_method" "get_presigned_url" {
  rest_api_id   = local.apigw_id
  resource_id   = aws_api_gateway_resource.presigned_url.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy"           = true
    "method.request.header.Authorization" = true
  }
}

resource "aws_api_gateway_integration" "get_presigned_url" {
  rest_api_id = local.apigw_id
  resource_id = aws_api_gateway_resource.presigned_url.id
  http_method = "GET"

  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${local.loadbalancer_dns_name}/v1/presigned-url"
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"

  request_parameters = {
    "integration.request.path.proxy"           = "method.request.path.proxy"
    "integration.request.header.Accept"        = "'application/json'"
    "integration.request.header.Authorization" = "method.request.header.Authorization"
  }

  connection_type = "VPC_LINK"
  connection_id   = aws_api_gateway_vpc_link.upload_service.id
}
#endregion
