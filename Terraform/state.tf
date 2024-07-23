# State bucket for storing and sharing terraform state
terraform {
  backend "s3" {
    bucket  = "object-database-state-12"
    key     = "terraform-state/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}

# resource "aws_s3_bucket" "state_bucket" {
#   bucket = "${var.project_name}-state-12" # Change to your unique bucket name
#   tags   = merge(var.mandatory_tags, { Name = "${var.project_name}-state-12" })
# }
