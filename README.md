This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Next.js VPS Deployment Guide

This guide documents the full setup used to deploy multiple Next.js applications on a Linux VPS using:

- Ubuntu
- Node.js via NVM
- PM2
- Nginx
- GoDaddy DNS
- Let's Encrypt SSL via Certbot

This setup supports hosting multiple Next.js websites on the same VPS.

---

## 1. Connect to the VPS

From macOS Terminal:

```bash
ssh root@YOUR_SERVER_IP
```

The first time you connect, confirm the SSH fingerprint:

```text
yes
```

Then enter the root password provided by the VPS provider.

---

## 2. Update the server

Update package information:

```bash
apt update
```

Install available updates:

```bash
apt upgrade -y
```

Install required tools:

```bash
apt install -y git curl unzip nginx ufw
```

---

## 3. Configure the firewall

Allow SSH:

```bash
ufw allow OpenSSH
```

Allow HTTP:

```bash
ufw allow 80
```

Allow HTTPS:

```bash
ufw allow 443
```

Enable the firewall:

```bash
ufw enable
```

Check the firewall:

```bash
ufw status
```

Expected ports:

```text
22/tcp   ALLOW
80/tcp   ALLOW
443/tcp  ALLOW
```

Do not expose Next.js ports such as `3000` or `3001` publicly.

Nginx will communicate with those ports internally.

---

## 4. Install Node.js using NVM

Install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Reload the shell:

```bash
source ~/.bashrc
```

Verify NVM:

```bash
nvm --version
```

Install the latest Node.js LTS version:

```bash
nvm install --lts
```

Set it as the default version:

```bash
nvm alias default 'lts/*'
```

Verify Node.js:

```bash
node -v
```

Verify npm:

```bash
npm -v
```

---

## 5. Install PM2

Install PM2 globally:

```bash
npm install -g pm2
```

Verify:

```bash
pm2 --version
```

PM2 keeps Node.js applications running after the SSH session is closed.

---

## 6. Create application folders

Example:

```bash
mkdir -p /var/www/tajweed
mkdir -p /var/www/salawat
```

Application structure:

```text
/var/www/
├── tajweed
└── salawat
```

---

## 7. Clone applications from GitHub

Go to the web applications directory:

```bash
cd /var/www
```

Clone the first repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git tajweed
```

Clone the second repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_SECOND_REPOSITORY.git salawat
```

---

## 8. Install and build the first application

Go to the first application:

```bash
cd /var/www/tajweed
```

Install dependencies:

```bash
npm install
```

Build the Next.js application:

```bash
npm run build
```

Test the application manually:

```bash
npm run start -- -p 3000
```

Stop it with:

```text
Ctrl + C
```

Start it using PM2:

```bash
pm2 start npm --name "tajweed" -- start -- -p 3000
```

Check status:

```bash
pm2 status
```

Expected:

```text
tajweed    online
```

---

## 9. Install and build the second application

Go to the second application:

```bash
cd /var/www/site2
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Run it on a different port:

```bash
pm2 start npm --name "site2" -- start -- -p 3001
```

Check:

```bash
pm2 status
```

Example:

```text
tajweed    online
site2      online
```

---

## 10. Configure PM2 startup after reboot

Run:

```bash
pm2 startup
```

When PM2 is being run as root, it may automatically create and enable:

```text
/etc/systemd/system/pm2-root.service
```

Save the running applications:

```bash
pm2 save
```

Verify:

```bash
pm2 status
```

You can also inspect the startup service:

```bash
systemctl status pm2-root
```

After a VPS reboot, PM2 should automatically restore the saved applications.

---

## 11. Configure Nginx for the first domain

Example domain:

```text
example1.com
```

Create the Nginx configuration:

```bash
nano /etc/nginx/sites-available/example1.com
```

Add:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name example1.com www.example1.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save in nano:

```text
Ctrl + O
Enter
Ctrl + X
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/example1.com /etc/nginx/sites-enabled/
```

---

## 12. Configure Nginx for the second domain

Create:

```bash
nano /etc/nginx/sites-available/example2.com
```

Add:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name example2.com www.example2.com;

    location / {
        proxy_pass http://127.0.0.1:3001;

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it:

```bash
ln -s /etc/nginx/sites-available/example2.com /etc/nginx/sites-enabled/
```

---

## 13. Remove the default Nginx site

Run:

```bash
rm -f /etc/nginx/sites-enabled/default
```

Test Nginx:

```bash
nginx -t
```

Expected output:

```text
syntax is ok
test is successful
```

Reload Nginx:

```bash
systemctl reload nginx
```

---

## 14. Configure GoDaddy DNS

For each domain, update the DNS records.

### Root domain

```text
Type: A
Name: @
Value: YOUR_SERVER_IPV4
TTL: 1 Hour
```

### www

```text
Type: CNAME
Name: www
Value: example.com
TTL: 1 Hour
```

Example:

```text
A       @      178.xxx.xxx.xxx
CNAME   www    example.com
```

Both domains can point to the same VPS IP.

Nginx determines which application to serve based on the requested hostname.

---

## 15. Remove old hosting DNS records

If the website was previously hosted on another platform, update or remove old DNS records.

For example, if `www` still points to Netlify:

```text
www → example.netlify.app
```

change it to:

```text
www → example.com
```

Also check for old `AAAA` records if IPv6 is not configured on the VPS.

---

## 16. Verify DNS

From macOS:

```bash
dig +short example.com
```

Expected:

```text
YOUR_SERVER_IPV4
```

Check `www`:

```bash
dig +short www.example.com
```

You can also check the CNAME directly:

```bash
dig +short CNAME www.example.com
```

Expected:

```text
example.com.
```

If DNS was recently changed, wait for propagation before continuing.

---

## 17. Verify the website over HTTP

Open:

```text
http://example.com
```

and:

```text
http://www.example.com
```

The website should load correctly before SSL is configured.

Useful checks:

```bash
pm2 status
```

```bash
systemctl status nginx
```

```bash
curl http://127.0.0.1:3000
```

For the second application:

```bash
curl http://127.0.0.1:3001
```

---

## 18. Install free SSL certificates

Install Certbot:

```bash
apt install -y certbot python3-certbot-nginx
```

For the first domain:

```bash
certbot --nginx \
  -d example1.com \
  -d www.example1.com
```

For the second domain:

```bash
certbot --nginx \
  -d example2.com \
  -d www.example2.com
```

Certbot automatically updates the Nginx configuration.

After completion, the websites should work at:

```text
https://example1.com
https://www.example1.com
https://example2.com
https://www.example2.com
```

---

## 19. Test SSL renewal

Run:

```bash
certbot renew --dry-run
```

If successful, automatic SSL renewal is configured correctly.

---

## 20. Add environment variables

Go to the application directory:

```bash
cd /var/www/tajweed
```

Create a production environment file:

```bash
nano .env.production
```

Example:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=your_database_connection
API_SECRET=your_secret
```

Important:

Variables beginning with:

```text
NEXT_PUBLIC_
```

are exposed to the browser.

Never place passwords or secrets in a `NEXT_PUBLIC_` variable.

Save the file and rebuild:

```bash
npm run build
```

Restart the PM2 process:

```bash
pm2 restart tajweed
```

Make sure environment files are excluded from Git:

```gitignore
.env
.env.local
.env.production
```

---

## 21. Manual redeployment after code changes

After pushing new changes to GitHub, connect to the VPS:

```bash
ssh root@YOUR_SERVER_IP
```

Go to the application:

```bash
cd /var/www/tajweed
```

Pull the latest code:

```bash
git pull
```

Install dependencies:

```bash
npm install
```

Rebuild:

```bash
npm run build
```

Restart:

```bash
pm2 restart tajweed
```

Check:

```bash
pm2 status
```

Typical deployment flow:

```text
git pull
→ npm install
→ npm run build
→ pm2 restart
```

---

## 22. Useful PM2 commands

Check applications:

```bash
pm2 status
```

View logs:

```bash
pm2 logs
```

View logs for one application:

```bash
pm2 logs tajweed
```

Restart one application:

```bash
pm2 restart tajweed
```

Restart all applications:

```bash
pm2 restart all
```

Save the process list:

```bash
pm2 save
```

---

## 23. Useful Nginx commands

Check configuration:

```bash
nginx -t
```

Check status:

```bash
systemctl status nginx
```

Reload configuration:

```bash
systemctl reload nginx
```

Restart:

```bash
systemctl restart nginx
```

---

## 24. Useful server commands

Check RAM:

```bash
free -h
```

Check disk space:

```bash
df -h
```

Check firewall:

```bash
ufw status
```

Install updates:

```bash
apt update
apt upgrade -y
```

---

## 25. Final architecture

```text
                    Internet
                       |
          +------------+------------+
          |                         |
     domain1.com                domain2.com
          |                         |
          +------------+------------+
                       |
                  VPS Public IP
                       |
                     Nginx
                  HTTPS / SSL
                 /           \
                /             \
             :3000           :3001
               |               |
        Next.js App 1     Next.js App 2
               |               |
              PM2             PM2
```

---

## Notes

- Multiple domains can point to the same VPS IP.
- Each Next.js application should run on a different internal port.
- Nginx routes domains to the correct application.
- SSL certificates are free through Let's Encrypt.
- PM2 keeps applications running after SSH is disconnected.
- `pm2 save` is required so applications can be restored after a reboot.
- Do not commit `.env` or `.env.production` files to Git.
- Do not expose internal application ports such as `3000` or `3001` publicly.
