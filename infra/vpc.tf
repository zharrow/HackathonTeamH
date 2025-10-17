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

module "autoscaling" {
  source  = "terraform-aws-modules/autoscaling/aws"
  version = "~> 9.0"

  for_each = {
    # On-demand instances
    ex_1 = {
      instance_type              = "t3.medium"
      use_mixed_instances_policy = false
      mixed_instances_policy     = null
      user_data                  = <<-EOT
        #!/bin/bash

        cat <<'EOF' >> /etc/ecs/ecs.config
        ECS_CLUSTER= ${module.ecs_cluster.cluster_name}
        EOF
      EOT
    }
  }

  

  min_size = 1
  max_size = 4

  name = "${module.ecs_cluster.cluster_name}-${each.key}"
  


  image_id      = jsondecode(data.aws_ssm_parameter.ecs_optimized_ami.value)["image_id"]
  instance_type = each.value.instance_type

  security_groups                 = [module.autoscaling_sg.security_group_id]
  user_data                       = base64encode(each.value.user_data)
  ignore_desired_capacity_changes = true

  create_iam_instance_profile = true
  iam_role_name               = "${module.ecs_cluster.cluster_name}"
  iam_role_description        = "ECS role for ${module.ecs_cluster.cluster_name}"
  iam_role_policies = {
    AmazonEC2ContainerServiceforEC2Role = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
    AmazonSSMManagedInstanceCore        = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  }

  vpc_zone_identifier = module.vpc.private_subnets
  health_check_type   = "EC2"
  desired_capacity    = 2

  # https://github.com/hashicorp/terraform-provider-aws/issues/12582
  autoscaling_group_tags = {
    AmazonECSManaged = true
  }

  # Required for  managed_termination_protection = "ENABLED"
  protect_from_scale_in = true

  # Spot instances
  use_mixed_instances_policy = each.value.use_mixed_instances_policy
  mixed_instances_policy     = each.value.mixed_instances_policy

}

module "ecs_cluster" {
  source = "terraform-aws-modules/ecs/aws"

  cluster_name = "cluster-ecs"
  default_capacity_provider_strategy = {
    ex_1 = {
      weight = 100
      base   = 1
    }
  }
  autoscaling_capacity_providers = {
    # On-demand instances
    ex_1 = {
      auto_scaling_group_arn         = module.autoscaling["ex_1"].autoscaling_group_arn
      managed_draining               = "ENABLED"
     

      managed_scaling = {
        maximum_scaling_step_size = 5
        minimum_scaling_step_size = 1
        status                    = "ENABLED"
        target_capacity           = 100
      }
    }
  }
}

 
data "aws_ssm_parameter" "ecs_optimized_ami" {
  name = "/aws/service/ecs/optimized-ami/amazon-linux-2023/recommended"
}



module "ecs_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  # Service
  name        = "web"
  cluster_arn = module.ecs_cluster.cluster_arn
  subnet_ids = module.vpc.private_subnets


  # Task Definition
  requires_compatibilities = ["EC2"]
  capacity_provider_strategy = {  
    # On-demand instances
    ex_1 = {
      capacity_provider = module.ecs_cluster.autoscaling_capacity_providers["ex_1"].name
      weight            = 100
      base              = 1
    }
  }

  volume_configuration = {
    name = "ebs-volume"
    managed_ebs_volume = {
      encrypted        = true
      file_system_type = "xfs"
      size_in_gb       = 5
      volume_type      = "gp3"
    }
  }

  volume = {
    my-vol = {},
    ebs-volume = {
      name                = "ebs-volume"
      configure_at_launch = true
    }
  }

  # Container definition(s)
  container_definitions = {
    "${local.container_name}" = {
      image = "nginx:latest"
      portMappings = [
        {
          name          = "${local.container_name}"
          containerPort = "${local.container_port}"
          hostPort      = "${local.container_port}"
          protocol      = "tcp"
        }
      ]

      mountPoints = [
        {
          sourceVolume  = "my-vol",
          containerPath = "/var/www/my-vol"
        },
        {
          sourceVolume  = "ebs-volume"
          containerPath = "/ebs/data"
        }
      ]

      # Example image used requires access to write to root filesystem
      readonlyRootFilesystem = false

      enable_cloudwatch_logging              = true
      create_cloudwatch_log_group            = true
      cloudwatch_log_group_name              = "/aws/ecs/${module.ecs_cluster.cluster_name}/${local.container_name}"
      cloudwatch_log_group_retention_in_days = 7

      logLonfiguration = {
        logDriver = "awslogs"
      }
    }
  }

  /*load_balancer = {
    service = {
      target_group_arn = module.alb.target_groups["ex_ecs"].arn
      container_name   = local.container_name
      container_port   = local.container_port
    }
  }

  subnet_ids = module.vpc.private_subnets
  security_group_ingress_rules = {
    alb_http = {
      from_port                    = local.container_port
      description                  = "Service port"
      referenced_security_group_id = module.alb.security_group_id
    }
  }*/
}

