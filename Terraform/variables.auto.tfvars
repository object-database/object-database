mandatory_tags = {
  owner         = "bryce.grahn@bbd.co.za"
  created-using = "terraform"
}

account_number = "804180393465"

repo = "object-database/object-database"

region = "eu-west-1"

project_name = "object-database"

vpc_public_subnets = [
  {
    cidr_block = "15.0.1.0/24"
    az         = "eu-west-1a"
  },
  {
    cidr_block = "15.0.3.0/24"
    az         = "eu-west-1b"
}]

vpc_private_subnets = [
  {
    cidr_block = "15.0.5.0/24"
    az         = "eu-west-1a"
  },
  {
    cidr_block = "15.0.7.0/24"
    az         = "eu-west-1b"
}]

eb_port_server = 80


