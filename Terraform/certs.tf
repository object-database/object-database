resource "aws_acm_certificate" "server_cert" {
  domain_name       = "meet.projects.bbdgrad.com" # Change to your domain
  validation_method = "DNS"
}
