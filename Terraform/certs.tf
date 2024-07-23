resource "aws_acm_certificate" "server_cert" {
  domain_name       = "api.objectdb.projects.bbdgrad.com" # Change to your domain
  validation_method = "DNS"
}
