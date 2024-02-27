#!/bin/bash
cd /home/ec2-user/AgileWebApplication/
git pull origin master
yarn install &&
yarn build &&
pm2 restart AgileWebApplication
