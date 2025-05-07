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
            // Installer Angular CLI globalement
            sh 'npm install -g @angular/cli'
            
            // Installer les dépendances du projet
            sh 'npm install'
            
            // Vérifier la version d'Angular CLI
            sh 'ng version'
            
            // Exécuter le build
            sh 'ng build e-commerce --output-path=front --configuration=production'
            sh 'mv front/e-commerce/browser/index.csr.html front/e-commerce/browser/index.html'
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
    }
}
