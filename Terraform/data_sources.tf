data "aws_lb" "eb_lb" {
  arn = aws_elastic_beanstalk_environment.server_env.load_balancers[0]
}
