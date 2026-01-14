---
title: Infrastructure as Code with Terraform
description: Learn how to manage cloud infrastructure declaratively using Terraform with practical AWS examples
date: 2026-01-05
tags:
  - terraform
  - iac
  - aws
readingTime: 7
---

Infrastructure as Code (IaC) transforms how we manage cloud resources. Terraform, by HashiCorp, is the most popular tool for this job. Let's dive in.

## Why Terraform?

- **Declarative syntax** - Describe what you want, not how to build it
- **Multi-cloud** - Works with AWS, Azure, GCP, and 100+ providers
- **State management** - Tracks what infrastructure exists
- **Plan before apply** - Preview changes before making them

## Project Structure

A well-organized Terraform project:

```
infrastructure/
├── main.tf           # Main configuration
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── terraform.tfvars  # Variable values (gitignored)
├── providers.tf      # Provider configuration
└── modules/
    └── vpc/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

## Basic Configuration

### Provider Setup

```bash
# providers.tf
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}
```

### Variables

```bash
# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}
```

### Creating Resources

```bash
# main.tf
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  
  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  
  tags = {
    Name = "${var.environment}-public-subnet"
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public.id
  
  tags = {
    Name = "${var.environment}-web-server"
  }
}
```

### Data Sources

```bash
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}
```

### Outputs

```bash
# outputs.tf
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "instance_public_ip" {
  description = "Public IP of web server"
  value       = aws_instance.web.public_ip
}
```

## Common Commands

```bash
# Initialize working directory
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure
terraform destroy

# Format code
terraform fmt

# Validate configuration
terraform validate
```

## Best Practices

### 1. Use Remote State

Store state in S3 with DynamoDB locking:

```bash
backend "s3" {
  bucket         = "my-terraform-state"
  key            = "prod/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-locks"
}
```

### 2. Use Modules

Reusable modules reduce duplication:

```bash
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  cidr_block  = "10.0.0.0/16"
}
```

### 3. Use Workspaces

Manage multiple environments:

```bash
terraform workspace new staging
terraform workspace new production
terraform workspace select staging
```

### 4. Lock Provider Versions

Prevent unexpected updates:

```bash
required_providers {
  aws = {
    source  = "hashicorp/aws"
    version = "~> 5.0"  # Only minor updates
  }
}
```

## Key Takeaways

- Terraform enables declarative infrastructure management
- Always use remote state with locking
- Structure projects with modules for reusability
- Run `terraform plan` before every apply
- Version control everything except secrets

Infrastructure, but reproducible! 🏗️
