pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/Amit9031/university-entry-system'
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run') {
            steps {
                sh 'node app.js || true'
            }
        }
    }
}
