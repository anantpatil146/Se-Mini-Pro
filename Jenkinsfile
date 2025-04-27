pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        BACKEND_PORT = '5000'
    }

    stages {
        // Checkout code
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Backend Build
        stage('Build Backend') {
            steps {
                dir('.') {
                    sh 'pip install -r requirements.txt'
                    sh 'python -m pytest tests/'  // Optional tests
                }
            }
        }

        // Frontend Build
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        // Deploy Backend (Flask)
        stage('Deploy Backend') {
            steps {
                sh """
                # Start Flask with Gunicorn
                nohup gunicorn --bind 0.0.0.0:${BACKEND_PORT} app:app --workers 4 --timeout 120 &
                """
            }
        }

        // Deploy Frontend (S3/NGINX)
        stage('Deploy Frontend') {
            steps {
                dir('frontend') {
                    sh 'aws s3 sync ./dist s3://sefrontend --delete'
                }
            }
        }
    }

    post {
        always {
            cleanWs()  // Clean workspace
        }
    }
}
