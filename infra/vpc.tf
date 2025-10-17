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
      image = "907099097883.dkr.ecr.eu-west-3.amazonaws.com/404infra/web:latest"
      portMappings = [
        {
          name          = "${local.container_name}"
          containerPort = "${local.container_port}"
          hostPort      = "${local.container_port}"
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          "name": "NEXT_PUBLIC_APP_URL",
          "value": "http://404infra.aws.corentinptrl.dev:3000"
        
        
          "name": "BETTER_AUTH_URL",
          "value": "https://404infra.aws.corentinptrl.dev"
        
        
          "name": "NEXT_PUBLIC_APP_URL" ,
          "value": "https://404infra.aws.corentinptrl.dev"
        
          "name": "BETTER_AUTH_SECRET",
          "value": "votre-secret-fort-32-caracteres-minimum" 
        
        
          "name": "DATABASE_URL" ,
          "value": "postgresql://adminuser:MyStrongPassword@replica-postgresql-master.c5q6sgo20rt2.eu-west-3.rds.amazonaws.com:5432/hackathon"
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



  load_balancer = {
    service = {
      target_group_arn = "${module.alb.target_groups}"["ex_ecs"].arn
      container_name   = "${local.container_name}"
      container_port   = "${local.container_port}"
    }
  }

  security_group_ingress_rules = {
    alb_http = {
      from_port                    = "${local.container_port}"
      description                  = "Service port"
      referenced_security_group_id = "${module.alb.security_group_id}"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
}



  module "autoscaling_sg" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 5.0"

  name        = "${local.name_as_sg}"
  description = "Autoscaling group security group"
  vpc_id      = module.vpc.vpc_id

  computed_ingress_with_source_security_group_id = [
    {
      rule                     = "https-443-tcp"
      source_security_group_id = "${module.alb.security_group_id}"
    }
  ]
  number_of_computed_ingress_with_source_security_group_id = 1

  egress_rules = ["all-all"]

}

module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 9.0"

  name = local.name_alb

  load_balancer_type = "application"

  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets

  # For example only
  enable_deletion_protection = false

  # Security Group
  security_group_ingress_rules = {
    all_http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
    all_https = {
      from_port   = 443
      to_port     = 443
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = module.vpc.vpc_cidr_block
    }
  }

  listeners = {
    http-https-redirect = {
      port     = 80
      protocol = "HTTP"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
    ex_https = {
      port     = 443
      protocol = "HTTPS"
      certificate_arn = aws_acm_certificate.mycert_acm.arn
      forward = {
        target_group_key = "ex_ecs"
      }
    }
  }

  target_groups = {
    ex_ecs = {
      backend_protocol                  = "HTTPS"
      backend_port                      = 443
      target_type                       = "ip"
      deregistration_delay              = 5
      load_balancing_cross_zone_enabled = true

      health_check = {
        enabled             = true
        healthy_threshold   = 5
        interval            = 30
        matcher             = "200"
        path                = "/"
        port                = "traffic-port"
        protocol            = "HTTPS"
        timeout             = 5
        unhealthy_threshold = 2
      }

      # Theres nothing to attach here in this definition. Instead,
      # ECS will attach the IPs of the tasks to this target group
      create_attachment = false
    }
  }

}



#### Certificat ACM ####

resource "aws_acm_certificate" "mycert_acm" {
  domain_name               = "404infra.${local.domain_name}"

  validation_method = "DNS"
  key_algorithm = "RSA_2048"

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "selected_zone" {
  name         = "${local.domain_name}."
}

resource "aws_route53_record" "cert_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.mycert_acm.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.selected_zone.zone_id
}

resource "aws_acm_certificate_validation" "cert_validation" {
  timeouts {
    create = "5m"
  }
  certificate_arn         = aws_acm_certificate.mycert_acm.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation_record : record.fqdn]
}

resource "aws_route53_record" "route53_A_record" {
  zone_id = data.aws_route53_zone.selected_zone.zone_id
  name    = "404infra.${local.domain_name}"
  type    = "A"
  alias {
    name                   = module.alb.dns_name
    zone_id                = module.alb.zone_id
    evaluate_target_health = true
  }
}
