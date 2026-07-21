# 🚀 Gowreesh Portfolio V2 (Next.js + Docker + AWS EC2)

A modern, high-performance portfolio website built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Three.js**, **GSAP**, and **Framer Motion**. Fully containerized with **Docker** and ready for deployment on **AWS EC2**.

---

## 📋 Table of Contents
1. [💻 Local Development & Testing](#-local-development--testing)
2. [☁️ AWS EC2 Setup (GUI Steps)](#️-aws-ec2-setup-gui-steps)
3. [🖥️ Server Setup & Docker Installation (Terminal Steps)](#️-server-setup--docker-installation-terminal-steps)
4. [🚀 Deploying the Application](#-deploying-the-application)
5. [🎉 Accessing Your Live Website](#-accessing-your-live-website)
6. [🛠️ Maintenance & Useful Commands](#️-maintenance--useful-commands)

---

## 💻 Local Development & Testing

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Gowreesh-VT/Portfolio_V2.git
cd Portfolio_V2
npm install
```

### 2. Set Up Local Environment Variables
Create a `.env` file in the root folder:
```bash
cp .env.example .env
```
Edit `.env` to include your Nodemailer credentials for the contact form:
```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ AWS EC2 Setup (GUI Steps)

Follow these step-by-step instructions in the AWS Management Console to set up your server.

### Step 1: Open AWS EC2 Console
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. In the top search bar, search for **EC2** and click on it.
3. Make sure your region (top-right corner, e.g., *us-east-1 (N. Virginia)* or *ap-south-1 (Mumbai)*) is selected.

---

### Step 2: Launch a New Instance
1. Click the orange **Launch Instance** button.
2. **Name and tags**: Enter `gowreesh-portfolio`.
3. **Application and OS Images (AMI)**:
   - Select **Ubuntu**.
   - Choose **Ubuntu Server 24.04 LTS** or **Ubuntu Server 22.04 LTS** (64-bit x86).
4. **Instance Type**:
   - Select **t2.micro** or **t3.micro** (Free tier eligible).
   - *(Optional Recommendation)*: **t3.small** (2 GB RAM) provides faster Docker builds.
5. **Key pair (login)**:
   - Click **Create new key pair**.
   - Key pair name: `portfolio-ec2-key`.
   - Private key file format: `.pem`.
   - Click **Create key pair** and download the `.pem` file to your computer (e.g., `~/Downloads/portfolio-ec2-key.pem`).

---

### Step 3: Configure Network Settings (Security Group)
In the **Network settings** section:
1. Select **Create security group**.
2. Check the following boxes:
   - ✅ **Allow SSH traffic from** -> Select *Anywhere (`0.0.0.0/0`)* or *My IP*.
   - ✅ **Allow HTTP traffic from the internet** (`0.0.0.0/0`).
   - ✅ **Allow HTTPS traffic from the internet** (`0.0.0.0/0`).
3. Click **Edit** (top right of Network settings) and add an additional rule:
   - Click **Add security group rule**.
   - **Type**: Custom TCP
   - **Port range**: `3000`
   - **Source type**: Anywhere (`0.0.0.0/0`)

---

### Step 4: Launch & Get Public IP
1. Click **Launch Instance** at the bottom right.
2. Click **View all instances**.
3. Select your instance (`gowreesh-portfolio`).
4. Copy the **Public IPv4 address** (e.g., `54.210.12.34`).

---

## 🖥️ Server Setup & Docker Installation (Terminal Steps)

### Step 5: Connect to your EC2 Instance via SSH
Open your Mac / Linux terminal (or Git Bash on Windows):

1. Set strict permissions for your key file:
   ```bash
   chmod 400 ~/Downloads/portfolio-ec2-key.pem
   ```
2. Connect to your instance (replace `<YOUR_EC2_PUBLIC_IP>` with your copied Public IP):
   ```bash
   ssh -i ~/Downloads/portfolio-ec2-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```

---

### Step 6: Install Docker & Docker Compose on EC2
Once connected to the EC2 terminal, run the following commands:

1. Update package manager:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
2. Install Docker and Docker Compose plugin:
   ```bash
   sudo apt install -y docker.io docker-compose-v2
   ```
3. Enable Docker service and add user permissions:
   ```bash
   sudo systemctl enable --now docker
   sudo usermod -aG docker ubuntu
   newgrp docker
   ```
4. Verify installation:
   ```bash
   docker --version
   docker compose version
   ```

---

## 🚀 Deploying the Application

### Step 7: Clone Repository on EC2
```bash
git clone https://github.com/Gowreesh-VT/Portfolio_V2.git
cd Portfolio_V2
```

### Step 8: Create Environment File (`.env`)
Create the `.env` file on your EC2 instance:
```bash
nano .env
```
Paste your Nodemailer email credentials:
```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
```
*(Press `Ctrl + O`, hit `Enter` to save, then press `Ctrl + X` to exit).*

---

### Step 9: Build and Launch Docker Container
Run the following command to build the image and start the container in the background:
```bash
docker compose up --build -d
```
*(The build process will take about 1-2 minutes).*

Verify the container is running:
```bash
docker ps
```
You should see `gowreesh-portfolio` running with ports `0.0.0.0:80->3000/tcp` and `0.0.0.0:3000->3000/tcp`.

---

## 🎉 Accessing Your Live Website

Your website is now live! Open any browser and go directly to your EC2 Public IP address:

```text
http://<YOUR_EC2_PUBLIC_IP>
```
*(e.g., `http://54.210.12.34`)*

*(No port number is required because port 80 is mapped directly to the container).*

---

## 🛠️ Maintenance & Useful Commands

### Check Live Application Logs
```bash
docker compose logs -f
```

### Restart Application
```bash
docker compose restart
```

### Stop Application
```bash
docker compose down
```

### Update Application (After Pushing New Code to GitHub)
```bash
git pull
docker compose up --build -d
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
