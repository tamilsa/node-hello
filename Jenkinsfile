pipeline {
    agent any
    environment {
        AWS_REGION = "us-east-2"
        ECR_REPO_NAME = "demo-ecr-repo"
        IMAGE_TAG = "latest"
        AWS_ACCOUNT_ID = "559050232518"
    }
    stages {
    //    stage("Checkout Code") {
    //        steps {
                // Clone the GitHub repository
    //            git branch: 'main', url: 'https://github.com/tamilsa/node-hello.git'
    //        }
    //    }
        stage("Build Docker Image") {
            steps {
                script {
                    // Login to AWS ECR
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                    
                    // Build and tag the Docker image for ECR
                    sh """
                        docker build -t ${ECR_REPO_NAME}:${IMAGE_TAG} .
                        docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
        stage("Push Docker Image to ECR") {
            steps {
                script {
                    // Push the image to ECR
                    sh """
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
        stage("Deploy to EKS") {
            steps {
                script {
                    // Update kubeconfig to interact with the EKS cluster
                    sh """
                        aws eks update-kubeconfig --region ${AWS_REGION} --name eks-cluster
                    """
                    
                    // Update the image in the Kubernetes deployment and apply service configuration
                    sh """
                        kubectl apply -f k8s-deployment.yaml
                        kubectl set image deployment/node-hello node-hello=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${IMAGE_TAG} --record
                        kubectl apply -f k8s-deployment.yaml
                        kubectl apply -f k8s-service.yaml
                    """
                }
            }
        }
    }
 //   post {
 //       always {
 //           cleanWs() // Clean the workspace after the build
 //       }
 //   }
}
