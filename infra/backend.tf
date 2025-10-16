terraform {
  backend "s3" {
    bucket = "tf-state-404infra"
    key    = "state"
    region = "eu-west-3"
  }
}
