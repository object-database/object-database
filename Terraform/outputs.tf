
output "github_action_role_arn" {
  value = aws_iam_role.github_action_role.arn
}

output "aws_region" {
  value = var.region
}

output "server_release_bucket_name" {
  value = aws_s3_bucket.server_release_bucket.bucket
}

output "server_cert" {
  value = aws_acm_certificate.server_cert.certificate_body
}

output "server_app_name" {
  value = aws_elastic_beanstalk_application.server_app.name
}

output "server_env_name" {
  value = aws_elastic_beanstalk_environment.server_env.name
}


