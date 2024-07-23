

data "aws_iam_policy_document" "eb_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["elasticbeanstalk.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "eb_service_role" {
  name               = "${var.project_name}-eb-service-role"
  assume_role_policy = data.aws_iam_policy_document.eb_assume_role.json
}

resource "aws_iam_role_policy_attachment" "eb_service_role_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth"
  role       = aws_iam_role.eb_service_role.name
}

resource "aws_iam_role_policy_attachment" "elastic_beanstalk_managed_updates_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy"
  role       = aws_iam_role.eb_service_role.name
}

resource "aws_iam_role_policy_attachment" "eb_acm_role_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AWSCertificateManagerFullAccess"
  role       = aws_iam_role.eb_service_role.name
}


data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "ec2_instance_role" {
  name               = "${var.project_name}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "${var.project_name}-ec2-instance-profile"
  role = aws_iam_role.ec2_instance_role.name
}

resource "aws_iam_role_policy_attachment" "eb_rds_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSFullAccess"
  role       = aws_iam_role.ec2_instance_role.name
}

resource "aws_iam_role_policy_attachment" "eb_s3_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role       = aws_iam_role.ec2_instance_role.name
}

resource "aws_iam_role_policy_attachment" "eb_ssm_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.ec2_instance_role.name
}

resource "aws_iam_role_policy_attachment" "eb_secrets_manager_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
  role       = aws_iam_role.ec2_instance_role.name
}

resource "aws_iam_role" "api_key_role" {
  name = "APIKeyRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "*" # Replace ACCOUNT_ID with the AWS account ID that can assume this role
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "api_key_access_policy" {
  name        = "APIKeyAccessPolicy"
  description = "Policy to allow fetching API keys"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue", # Adjust based on where your API keys are stored
          "ssm:GetParameter"               # Adjust based on where your API keys are stored
        ]
        Resource = "*" # Replace with the specific resource ARNs where your API keys are stored
        # Resource  = "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-api-keys"  // Replace with the ARN of your secret in Secrets Manager
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_key_role_attachment" {
  role       = aws_iam_role.api_key_role.name
  policy_arn = aws_iam_policy.api_key_access_policy.arn
}

