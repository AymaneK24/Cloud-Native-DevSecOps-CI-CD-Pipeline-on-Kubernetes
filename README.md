# 🛒 E-commerce App — Cloud Native DevSecOps CI/CD Pipeline on Kubernetes 
Welcome to our  DevSecOps journey! 💥 \
\
This project demonstrates how to build a DevSecOps pipeline that automates the deployment of our Cloud Native application onto a **Kubernetes cluster**☸️ hosted on AWS **EC2** instances. 

## 🤔 What kind of app are we deploying?
It’s a dynamic e-commerce web application 🛒 developed with:
![Diagramme vierge (3)](https://github.com/user-attachments/assets/2adb7f10-b412-4be9-892b-cda4fe524018)

🅰️ Angular 18 – for the frontend

🔥 Firebase – handling backend services like authentication and database


## 🔄 A Global View on the Pipeline Workflow


🛠️ Tools check : 

- **Jenkins** for CI/CD automation

- **SonarQube** for static code analysis

- **OWASP** Dependency-Check and **Trivy** for security scanning

- **Docker** for containerization

- **Kubernetes** for deployment

## ☁️ **And guess what ?** All of that is configured and hosted on AWS EC2 instances
![draw1](https://github.com/user-attachments/assets/043ecbd2-26d7-4645-b8d0-cd394295b953)



## ⚙️ Step 1 : Setting up AWS EC2 instances

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


- **Architecture**: 1 control plane node + 2 worker nodes
- **Environment**: AWS EC2 instances (t2.medium) with 10 GB EBS Volume
- **Container Runtime**: containerd
- **Network Plugin**: Calico


1. ** Go Create 3 EC2 Instances of type t2.medium **
   - 1 control plane node
   - 2 worker nodes

2. **Security Group Configuration**:
   - **Ingress**: SSH + all traffic from the security group
   - **Egress**: Allow all traffic

### Installation Steps

#### 1. First SSH To All Nodes

Run these steps on **all nodes** as the root/sudo user:
```bash
sudo su
```

##### 1.1 Set Hostnames (Optional)

```bash
# On control plane
hostnamectl set-hostname controlplane
# On worker 1
hostnamectl set-hostname worker1
# On worker 2
hostnamectl set-hostname worker2
```

##### 1.2 Verify Unique MAC and Product UUID

```bash
ip link
cat /sys/class/dmi/id/product_uuid
```

##### 1.3 Disable Swap

```bash
# for kubelet to work 
swapoff -a
```

##### 1.4 Configure & Enabling IPv4 Packet Forwarding

```bash
echo "net.ipv4.ip_forward = 1" | tee /etc/sysctl.d/k8s.conf
sysctl --system 
sysctl net.ipv4.ip_forward  # Verify
```

##### 1.5 Install Container Runtime (containerd)
Docker also support containerd
```bash
apt update && apt upgrade -y
apt-get install containerd
ctr --version  # Verify installation
```

##### 1.6 Install CNI Plugins

```bash
# Manual Installation 
mkdir -p /opt/cni/bin

wget -q https://github.com/containernetworking/plugins/releases/download/v1.7.1/cni-plugins-linux-amd64-v1.7.1.tgz

tar Cxzf /opt/cni/bin cni-plugins-linux-amd64-v1.7.1.tgz
```

##### 1.7 Configure containerd

Generate config :
```bash
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```

Verify CRI is enabled:
```bash
head /etc/containerd/config.toml
#disabled_plugins list should be empty
```

Configure systemd cgroup driver:
 
```bash
# use vi or nano it's your choice mate
# Update in [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]:
# SystemdCgroup = true

vi /etc/containerd/config.toml


# Update in [plugins."io.containerd.grpc.v1.cri"]:
# sandbox_image = "registry.k8s.io/pause:3.10"

systemctl restart containerd
```

##### 1.8 Install Kubernetes Tools

```bash
apt-get update

apt-get install -y apt-transport-https ca-certificates curl gpg


apt-get install -y apt-transport-https ca-certificates curl gpg

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.33/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg


echo deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.33/deb/ / |  tee /etc/apt/sources.list.d/kubernetes.list

apt-get update

apt-get install -y kubelet kubeadm

```

##### 1.9 Install kubectl (control plane | Master node only) 

```bash
apt-get install -y kubectl
```

#### 2. Create the Kubernetes Cluster

##### 2.1 Initialize Control Plane

On the control plane node:
> ⚠️ **Note**: Save the join command that will be displayed in the output!
```bash
#for the cidr see your vpc aws settings  if you see there /16 the commands below in fine mate, your are good to go, if not don't specify the network it's kinda optional but a good idea

kubeadm init --pod-network-cidr=192.168.0.0/16

```
> ⚠️ **Note**: Save all the output there is some commands 



##### 2.2 Join Worker Nodes

On each worker node, run the join command from the previous step:
```bash
# This is just an example of output , you have your own output displayed in master=control plane node
kubeadm join 172.31.25.150:6443 --token 2i8vrs.wsshnhe5zf87rhhu --discovery-token-ca-cert-hash sha256:eacbaf01cc58203f3ddd69061db2ef8e64f450748aef5620ec04308eac44bd77
```


##### 2.5 Install Networking Plugin (Calico)
There's a lot of networking plugins, here i choosed Calico cause it's simple

On the control plane:
```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.29.1/manifests/tigera-operator.yaml

kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.29.1/manifests/custom-resources.yaml
watch kubectl get pods -n calico-system
```

#### 3. Making the User Ubuntu able to use Kubectl (Master) Not Only the root


##### 3.1 Copy the Cluster Configuration as the non root user 
logout or exsit from the root user and use the ubuntu user 

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config


# so everything is fine do this !!
sudo cat /etc/kubernetes/admin.conf #copy the output
nano config2 # and past here save and close
sudo mv config2 .kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config


kubectl get nodes
# congrats baby !!
```

#### Troubleshooting

- Ensure security groups allow traffic between nodes
- Check pod network CIDR if using a network plugin other than Calico
- Verify container runtime is properly configured
- See in security groups ALL ICMP Traffic is allowed (Connectivity between nodes : this will make workers able to join and communicate between theme)


## Step 3 : Jenkins Setup & initial pipeline
### 🧩 Plugins :


- SonarQube Scanner

- NodeJS Plugin

- SSH Agent

- Docker plugins (Docker , Docker Commons , Docker Pipeline , Docker API ,..)
  
- OWASP Dependency-Check

We will also need to add **nodejs20** and **jdk21** to **global config tools**\
Simply add them using available installations options

### 🔐 Jenkins Credentials Configuration

Go to **Manage Jenkins → Credentials → Global → Add Credentials**, and add:

- 🧪 **SonarQube Token**  
  - Type: *Secret Text*  
  - 🆔 ID: `Sonar-token`

- 🐳 **DockerHub Credentials**  
  - Type: *Username and Password* (or Secret Text with token)  
  - 🆔 ID: `docker`
 
🔁 Alright people , let's move  to our jenkins initial **Jenkinsfile** version 
Here we would be executing all stages till pushing the image to dockerhub (remember the workflow , try to identify each stage and match it 🕵️‍♀️) \
Don't forget to change the image ``dockerhub-user/image-name:latest``


```javascript title=Jenkinsfile

pipeline {

    agent any
    
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    tools {
        jdk 'jdk21'
        nodejs 'nodejs20'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Check Node Version') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/master']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: 'github-token',
                        url: 'https://github.com/HafssaRaoui/e-commerce-app.git'
                    ]]
                )
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectName=e-commerce-website \
                    -Dsonar.projectKey=e-commerce-website \
                    -Dsonar.sources=src \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'''
                }
                script {
                    echo "SonarQube analysis complete. Check results at: http://51.44.85.43:9000/dashboard?id=e-commerce-website"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install -g @angular/cli@19.2.11 --force'
                    sh 'npm install'
                    sh 'ng version'
                }
            }
        }

        stage('Build Angular App') {
            steps {
                script {
                    sh 'ng build e-commerce --output-path=front --configuration=production'
                    sh 'ls -l front'
                    sh 'ls -l front/browser'
                    sh 'mv front/browser/index.csr.html front/browser/index.html'
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Scanning With Trivy') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh "docker build -t hafssa260/ecom-app:latest ."
                    }
                }
            }
        }

        stage('TRIVY Image Scan') {
            steps {
                sh "trivy image hafssa260/ecom-app:latest > trivyimage.txt"
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh "docker push scan image"
                    }
                }
            }
        }

    }
}
```

✅ If the build passes  at first try (which is defenitly not the case ) then congrats 🎊
\
1️⃣ Head to checkout the sonar analysis :
![WhatsApp Image 2025-05-07 at 19 21 40](https://github.com/user-attachments/assets/74d327eb-827a-4b32-98c8-f60417039540)

\
2️⃣You should be able to have a look on depency check results as well
\
\
![WhatsApp Image 2025-05-07 at 19 24 30](https://github.com/user-attachments/assets/1793aa62-b0c8-46bd-bf59-414822b1fd35)


\
3️⃣ Go check if the image has been pushed and test it too :
![Screenshot from 2025-05-07 01-02-19](https://github.com/user-attachments/assets/97e70151-09b7-4484-8837-ca8c763d0fe6)

## Step 4 : Deploy to Kubernetes ☸️


We will deploy our ecom-app on Kubernetes by defining the  deployment and then expose it using a **LoadBalancer Service**.\
Checkout the [.yaml file](https://github.com/HafssaRaoui/e-commerce-app/blob/master/Hafssap.yaml)

\
Add the following stage to the previous pipeline.
```javascript
stage('Deploy App on k8s') {
    steps {
        writeFile file: 'Hafsapp.yaml', text: '''
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecom-app
  labels:
    app: ecom-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ecom-app
  template:
    metadata:
      labels:
        app: ecom-app
    spec:
      containers:
      - name: ecom-app
        image: hafssa260/ecom-app:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: ecom-app
spec:
  selector:
    app: ecom-app
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
'''

        sshagent(['kube']) {
            sh "scp -o StrictHostKeyChecking=no Hafsapp.yaml ubuntu@13.38.72.213:/home/ubuntu"

            script {
                def applyStatus = sh(
                    script: "ssh ubuntu@13.38.72.213 'kubectl apply -f /home/ubuntu/Hafsapp.yaml'",
                    returnStatus: true
                )

                if (applyStatus != 0) {
                    error("Deployment failed!")
                }
            }
        }
    }
}

```


- Wer're basically **copying our yaml file**  to the Kubernetes master node : ``13.38.72.213``  
- Wer're using as well **SSH credentials** to connect to kubernetes server

  Once connected the script applies the deployment via the command :
 ```
kubectl apply -f /home/ubuntu/Hafsapp.yaml
```

So far we have done a really good work 💪😄

Trigger a build and check if the deployment passes , in that case the website should be accessible on both nodes 
- Node1 , IP ``51.44.25.127`` 
![WhatsApp Image 2025-05-07 at 19 20 45](https://github.com/user-attachments/assets/eb971fb0-66d7-4d75-9a54-9092be8eddd0)
- Node1 , IP ``51.44.183.33``
![WhatsApp Image 2025-05-07 at 19 20 46](https://github.com/user-attachments/assets/ce137ba4-02cd-4d4c-9db6-cbff25908d4e)

- You can examine as well the nodes and  pods running on your kubernetes cluster
![WhatsApp Image 2025-05-07 at 19 29 39](https://github.com/user-attachments/assets/de6fc945-8741-4603-923a-13f4247ecda6)

🌐 As a final enhancement we will integrate a load balancer

- The ALB listens on HTTP port 80.
- Incoming traffic is forwarded to a target group that contains the Kubernetes nodes.
- Each node in the target group receives traffic on NodePort 31965, which is mapped to the Kubernetes service exposing the app.
![WhatsApp Image 2025-05-07 at 20 20 56](https://github.com/user-attachments/assets/81237abc-0a40-4853-9be2-a787d316c25a)

- 🔥 Finally: Test the Access! ``http://<your-alb-dns-name>`` 
![WhatsApp Image 2025-05-07 at 20 18 35](https://github.com/user-attachments/assets/d04122d0-7fca-4e7b-a2d6-713b107ebb0a)




  




 

