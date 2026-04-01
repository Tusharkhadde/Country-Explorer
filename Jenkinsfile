pipeline {
    agent any

    stages {

        stage("Code") {
            steps {
                echo "Pulling code from GitHub"
                git url: "https://github.com/PrathmeshAdhav2006/Country-Explorer-for-k8s.git",
                    branch: "deployment-branch"
            }
        }

        stage("Build") {
            steps {
                sh "docker build -t myapp ."
            }
        }

        stage("Test") {
            steps {
                echo "Test done"
            }
        }

        stage("Push to Docker Hub") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DockerHubCreds',
                    usernameVariable: 'dockerHubUser',
                    passwordVariable: 'dockerHubPass'
                )]) {

                    sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
                    sh "docker image tag myapp ${env.dockerHubUser}/country-explorer-app:v1"
                    sh "docker push ${env.dockerHubUser}/country-explorer-app:v1"

                }
            }
        }
        
        stage("Create Namespace"){
            steps{
                sh "kubectl apply -f k8s/namespace.yaml"
            }
        }
        
        stage("Create Deployment"){
            steps{
                sh "kubectl apply -f k8s/deployment.yml"
            }
        }
        
        stage("Create Service"){
            steps{
                sh "kubectl apply -f k8s/service.yml"
            }
        }
        
        stage("Expose via Ingress"){
            steps{
                sh "kubectl apply -f k8s/ingress.yml"
            }
        }
    }
}
