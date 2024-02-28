#!/bin/bash
cd /home/ec2-user/AgileWebApplication/
git pull origin main
npm install &&
npm run build &&
pm2 restart AgileWebApplication
