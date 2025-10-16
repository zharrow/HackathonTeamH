terraform {
  backend "s3" {
    bucket = "tf-state-404infra"
    key    = "state"
    region = "eu-west-3"
    profile = "Florian-dev"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3"
  profile = "Florian-dev"
}