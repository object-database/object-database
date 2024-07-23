# Define security group for the EC2 instance
resource "aws_security_group" "eb_security_group_ec2" {
  vpc_id      = aws_vpc.vpc.id
  name        = "${var.project_name}-eb-security-group-ec2"
  description = "Security group for eb"

  # Define inbound rules to allow traffic from anywhere to the EC2 instance on port 8080 (for Spring Boot)
  ingress {
    from_port   = var.eb_port_server
    to_port     = var.eb_port_server
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Define inbound rules to allow traffic from anywhere to the EC2 instance on port 22 (for SSH)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Define outbound rules to allow the EC2 instance to communicate with the RDS database
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.mandatory_tags, { Name = "${var.project_name}-eb-security-group-ec2" })
}

resource "aws_security_group" "eb_security_group_lb" {
  vpc_id      = aws_vpc.vpc.id
  name        = "${var.project_name}-eb-security-group-lb"
  description = "Security group for lb"

  # Define inbound rules to allow traffic from anywhere to the EC2 instance on port 8080 (for Spring Boot)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = var.eb_port_server
    to_port     = var.eb_port_server
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Define inbound rules to allow traffic from anywhere to the EC2 instance on port 22 (for SSH)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Define outbound rules to allow the EC2 instance to communicate with the RDS database
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.mandatory_tags, { Name = "${var.project_name}-eb-security-group-lb" })
}
