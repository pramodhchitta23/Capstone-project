pipeline {
    agent any

    environment {
        // Define docker-compose path if necessary, or let Jenkins pick it from system PATH.
        COMPOSE_EXE = 'docker compose'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from source repository...'
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                echo 'Verifying Docker and Docker Compose availability...'
                sh 'docker --version'
                sh '${COMPOSE_EXE} version'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images for Backend and Frontend...'
                sh '${COMPOSE_EXE} build'
            }
        }

        stage('Deploy/Run Containers') {
            steps {
                echo 'Starting up containers in detached mode...'
                sh '${COMPOSE_EXE} up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Awaiting few seconds for services to properly start...'
                sleep 5
                
                echo 'Checking running containers...'
                sh 'docker ps'
                
                echo 'Verifying frontend response...'
                sh 'curl -f http://localhost:5173 || exit 1'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Tearing down services to free up port/resources (optional for actual CD, good for CI testing).'
            // sh '${COMPOSE_EXE} down'
        }
        success {
            echo 'All stages completed successfully. Application is healthy!'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
    }
}
