resource "aws_s3_bucket" "server_release_bucket" {
  bucket = "${var.project_name}-server-bucket"
  tags   = merge(var.mandatory_tags, { Name = "${var.project_name}-server-bucket" })
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.server_release_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_elastic_beanstalk_application" "server_app" {
  name        = "${var.project_name}-api"
  description = "Beanstalk application"
}

resource "aws_elastic_beanstalk_environment" "server_env" {
  name                = "${var.project_name}-api"
  application         = aws_elastic_beanstalk_application.server_app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.3.3 running Docker"
  cname_prefix        = "${var.project_name}-api"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.vpc.id
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.private_subnets[*].id)
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", aws_subnet.public_subnets[*].id)
  }
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }
  # setting {
  #   namespace = "aws:ec2:vpc"
  #   name      = "AssociatePublicIpAddress"
  #   value     = true
  # }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "2"
  }

  setting {
    namespace = "aws:elbv2:loadbalancer"
    name      = "IdleTimeout"
    value     = "60"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.ec2_instance_profile.name
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_security_group_ec2.id
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service_role.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "basic"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "HealthCheckPath"
    value     = "/health"
  }

  # setting {
  #   namespace = "aws:elbv2:listener:443"
  #   name      = "Protocol"
  #   value     = "HTTPS"
  # }

  # setting {
  #   namespace = "aws:elbv2:listener:443"
  #   name      = "ListenerEnabled"
  #   value     = "true"
  # }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "DefaultProcess"
    value     = "default"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "Protocol"
    value     = "HTTP"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "ListenerEnabled"
    value     = "true"
  }

  setting {
    namespace = "aws:elbv2:loadbalancer"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_security_group_lb.id
  }

  # setting {
  #   namespace = "aws:elbv2:listener:443"
  #   name      = "SSLCertificateArns"
  #   value     = "arn:aws:acm:eu-west-1:387198229710:certificate/cea7404e-5990-47b8-8735-06d666dd39e6" # Replace with your SSL certificate ARN
  # }

  # Optional: redirect HTTP to HTTPS
  # setting {
  #   namespace = "aws:elbv2:listener:80"
  #   name      = "Rules"
  #   value     = "Redirect HTTP to HTTPS"
  # }

  # setting {
  #   namespace = "aws:elbv2:listener:Redirect HTTP to HTTPS"
  #   name      = "Rules"
  #   value     = "path-pattern /* -> redirect: HTTPS://#{host}:443/#{path}?#{query}"
  # }

}
