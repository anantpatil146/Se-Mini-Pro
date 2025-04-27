pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PYTHON_VERSION = '3.9'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Tools') {
            steps {
                // Install Python and Node.js
                sh '''
                sudo apt-get update -y
                sudo apt-get install -y python3-pip python3-venv nodejs npm
                python3 -m pip install --upgrade pip
                '''
            }
        }

        stage('Build Backend') {
            steps {
                dir('.') {
                    sh '''
                    pip install -r requirements.txt
                    python app.py
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Add your deployment commands here
                    echo "Deployment would happen here"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
