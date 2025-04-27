pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PYTHON_VERSION = '3.9'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the latest code from the repository
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('.') {
                    // Install required Python dependencies and run the backend app
                    sh '''
                    pip install -r requirements.txt
                    python3 app.py &
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    // Install npm dependencies and build the frontend
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
            // Clean up workspace after the job completes
            cleanWs()
        }
    }
}
