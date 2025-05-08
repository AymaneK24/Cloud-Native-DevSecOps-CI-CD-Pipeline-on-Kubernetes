# 🛒 E-commerce App — Cloud Native DevSecOps CI/CD Pipeline on Kubernetes 
Welcome to our  DevSecOps journey! 💥 \
\
This project demonstrates how to build a DevSecOps pipeline that automates the deployment of our Cloud Native application onto a **Kubernetes cluster**☸️ hosted on AWS **EC2** instances. 

## 🤔 What kind of app are we deploying?
It’s a dynamic e-commerce web application 🛒 developed with:

🅰️ Angular 18 – for a fast, modern, and component-based frontend

🔥 Firebase – handling backend services like authentication, database, and hosting


## 🔄 A Global View of the Pipeline Workflow

![Diagramme vierge (2)](https://github.com/user-attachments/assets/5c1c37c1-717d-476c-a988-36ae8ce97b2e)

🛠️ Tools check : 

- **Jenkins** for CI/CD automation

- **SonarQube** for static code analysis

- **OWASP** Dependency-Check and **Trivy** for security scanning

- **Docker** for containerization

- **Kubernetes** for orchestration

☁️ **And guess what ?** All of that is configured and hosted on AWS EC2 instances

## ⚙️ Step1 : Setting up AWS EC2 instances

![Screenshot from 2025-05-07 18-41-32](https://github.com/user-attachments/assets/cf77ab7a-8e37-47b3-adb9-00cae0c1566d)

**We provisioned 5 EC2 instances** :

- Master (t2.medium): acts as the control node in the Kubernetes cluster.

- Node1 and Node2 (t2.medium): worker nodes for the Kubernetes cluster.

- Jenkins Instance (t2.large): hosts Jenkins, Docker, and Trivy .

- Sonar Instance (t2.medium): hosts SonarQube.

To configure the Jenkins and SonarQube instances, connect to them either via SSH or directly through the AWS Console.
\Make sure to allow **inbound traffic** on the necessary ports (e.g., 8080 for Jenkins, 9000 for SonarQube) in the **security group settings** to ensure external access to the services

( for installations just follow instructions on Docs )

![WhatsApp Image 2025-05-07 at 19 32 31](https://github.com/user-attachments/assets/fac6375f-e4a4-4f99-8102-042ef34284b9)


## Step2 : Now time to set up the Kubernetes cluster 🚀

![WhatsApp Image 2025-05-07 at 21 02 23 (1)](https://github.com/user-attachments/assets/a561c47e-a171-4890-9dcf-3eb60e81d21a)

## Step3 : Jenkins Setup
### 🧩 Plugins :


- SonarQube Scanner

- NodeJS Plugin

- Docker plugins (Docker , Docker Commons , Docker Pipeline , Docker API ,..)
  
- OWASP Dependency-Check




