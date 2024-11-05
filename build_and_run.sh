#!/bin/bash

# Passo 1: Build da imagem frontend
echo "Building frontend image..."
docker build -t frontend ./frontend || error_exit "Erro ao construir a imagem do frontend"
echo "Frontend image built successfully."

# Passo 2: Build da imagem backend
echo "Building backend image..."
docker build -t backend ./backend || error_exit "Erro ao construir a imagem do backend"
echo "Backend image built successfully."

# Passo 3: Subir os containers com Docker Compose
echo "Starting containers with Docker Compose..."
cd ./connections || error_exit "Não foi possível acessar o diretório do Docker Compose"
docker-compose up --build || error_exit "Erro ao iniciar containers com Docker Compose"
echo "Containers started successfully."

# Fim do script
echo "Build and container startup completed successfully!"
