# Docker & AWS EC2 Deployment Guide

This guide explains how to build, run, and deploy this Next.js application using Docker on an **AWS EC2 instance**.

---

## 🛠️ Files Created for Dockerization

- **[next.config.ts](file:///Users/gowreeshvt/Documents/GitHub/Portfolio_V2/next.config.ts)**: Configured with `output: 'standalone'` to generate a minimal production server.
- **[Dockerfile](file:///Users/gowreeshvt/Documents/GitHub/Portfolio_V2/Dockerfile)**: Multi-stage Alpine Linux build (`deps` -> `builder` -> `runner`) producing a ~150MB image.
- **[.dockerignore](file:///Users/gowreeshvt/Documents/GitHub/Portfolio_V2/.dockerignore)**: Excludes `node_modules`, `.next`, and `.git` from the Docker context.
- **[docker-compose.yml](file:///Users/gowreeshvt/Documents/GitHub/Portfolio_V2/docker-compose.yml)**: Manages container lifecycle, port binding (`3000:3000`), and automatic restart policies.

---

## 🚀 Step-by-Step AWS EC2 Deployment Instructions

### Prerequisites
1. An AWS Account.
2. An AWS EC2 Instance running **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS** (t2.micro / t3.micro is sufficient for basic traffic, t3.small recommended for builds).
3. An SSH key pair to access your instance.

---

### Step 1: Configure AWS Security Group
In your AWS EC2 Console, edit the **Security Group** attached to your instance and add the following **Inbound Rules**:

| Type | Protocol | Port Range | Source | Purpose |
|---|---|---|---|---|
| **SSH** | TCP | 22 | My IP (or `0.0.0.0/0`) | Accessing terminal via SSH |
| **HTTP** | TCP | 80 | `0.0.0.0/0` | Web access |
| **HTTPS** | TCP | 443 | `0.0.0.0/0` | Secure Web access |
| **Custom TCP** | TCP | 3000 | `0.0.0.0/0` | Direct Docker app port access |

---

### Step 2: Connect to your EC2 Instance & Install Docker

1. **Connect via SSH**:
   ```bash
   ssh -i /path/to/your-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```

2. **Update system packages**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Docker and Docker Compose**:
   ```bash
   # Install Docker
   sudo apt install -y docker.io

   # Enable and start Docker service
   sudo systemctl enable --now docker

   # Allow ubuntu user to run Docker without sudo
   sudo usermod -aG docker ubuntu
   newgrp docker

   # Install Docker Compose plugin
   sudo apt install -y docker-compose-v2
   ```

4. **Verify Docker Installation**:
   ```bash
   docker --version
   docker compose version
   ```

---

### Step 3: Deploy the Portfolio Application

#### Option A: Deploy via GitHub Repository (Recommended)

1. **Clone your repository on the EC2 instance**:
   ```bash
   git clone https://github.com/Gowreesh-VT/Portfolio_V2.git
   cd Portfolio_V2
   ```

2. **Create the environment file**:
   ```bash
   nano .env
   ```
   Paste your environment credentials:
   ```env
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```
   *Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit.*

3. **Build and start the container in detached mode**:
   ```bash
   docker compose up --build -d
   ```

4. **Verify the container is running**:
   ```bash
   docker ps
   ```
   You can now visit your website in a browser at:
   `http://<YOUR_EC2_PUBLIC_IP>:3000`

---

#### Option B: Deploy via Docker Hub / Container Registry

If you prefer building locally or in CI/CD (GitHub Actions) and pushing to Docker Hub:

1. **Build and push from local machine or GitHub Actions**:
   ```bash
   docker build -t your-dockerhub-username/portfolio-v2:latest .
   docker push your-dockerhub-username/portfolio-v2:latest
   ```

2. **On EC2, pull and run**:
   ```bash
   docker run -d \
     --name gowreesh-portfolio \
     --restart always \
     -p 3000:3000 \
     --env-file .env \
     your-dockerhub-username/portfolio-v2:latest
   ```

---

### Step 4: Set Up Nginx & SSL Certificate (Domain & HTTPS)

To map standard HTTP (port 80) and HTTPS (port 443) to your Docker app running on port 3000 and enable SSL:

1. **Install Nginx & Certbot**:
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

2. **Configure Nginx Reverse Proxy**:
   Create a new site configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/portfolio
   ```
   Add the following content (replace `yourdomain.com` with your actual domain or EC2 public DNS):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable configuration & restart Nginx**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Obtain Free SSL Certificate via Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

Now your website will automatically redirect HTTP traffic to secure `https://yourdomain.com`!

---

## 🛠️ Useful Management Commands

- **View Live Container Logs**:
  ```bash
  docker compose logs -f
  ```
- **Stop Application**:
  ```bash
  docker compose down
  ```
- **Restart Application**:
  ```bash
  docker compose restart
  ```
- **Rebuild and Update Container**:
  ```bash
  git pull
  docker compose up --build -d
  ```
