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

       stage('Install Dependencies & Build Angular App') {
    steps {
        script {

            sh 'npm install -g @angular/cli'
            sh 'npm install'
            sh 'ng version'
            sh 'ng build e-commerce --output-path=front --configuration=production'
            sh 'ls -l front'
            sh 'ls -l front/browser'
            sh 'mv front/browser/index.csr.html front/browser/index.html'
            
        }
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
            }
        }

        stage("Docker Build & Push") {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh "docker build -t hafssa260/ecom-app:latest ."
                        sh "docker push hafssa260/ecom-app:latest"
                    }
                }
            }
        }


        stage("TRIVY"){
            steps{
                sh "trivy image hafssa260/ecom-app:latest > trivyimage.txt" 
            }
        }
    }
}
