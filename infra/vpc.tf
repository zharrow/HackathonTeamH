module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "Hackathon-pc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-west-3a", "eu-west-3b", "eu-west-3c"]
  database_subnets = ["10.0.9.0/24", "10.0.10.0/24", "10.0.11.0/24"]
  private_subnets = ["10.0.5.0/24", "10.0.6.0/24", "10.0.7.0/24"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]

  enable_nat_gateway = true

  tags = {
    Terraform = "true"
    Environment = "dev"
  }
}
