FROM node:18-alpine
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package.json ./

RUN npm install
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 5687
CMD ["npm", "start"]