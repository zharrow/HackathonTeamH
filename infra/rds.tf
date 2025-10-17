resource "aws_db_subnet_group" "default" {
  name       = "main"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "My DB subnet group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier           = "rds-master"
  allocated_storage    = local.allocated_storage
  engine               = local.engine
  instance_class       = local.instance_class
  db_name              = "hackathon"
  username             = "adminuser"
  password             = "MyStrongPassword"
  skip_final_snapshot = true
  publicly_accessible = true
  db_subnet_group_name = aws_db_subnet_group.default.name
}
