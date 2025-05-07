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


        stage("SonarQube Analysis") {
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
    
 
        stage("Docker Build") {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh "docker build -t hafssa260/ecom-app:latest ."
                    }
                }
            }
        }

        stage("TRIVY Image Scan"){
            steps{
                sh "trivy image hafssa260/ecom-app:latest > trivyimage.txt" 
            }
        }
        
         
        stage("Docker  Push") {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh "docker push hafssa260/ecom-app:latest"
                    }
                }
            }
        }
        
       
    
    
    
    
    
    stage('Deploy App on k8s') {
  steps {
    // Assurez-vous que le fichier Hafsapp.yaml existe ici
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
            def applyStatus = sh (
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

    
    
    
    
    
    
        
        

        
    }
}
