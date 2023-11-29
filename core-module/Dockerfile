# Step 1: Specify the base image. Here, we're using the latest version of Node.
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json (if available) files
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of your app's source code
COPY . .

# Step 6: Your app binds to port 3000, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3005

# Step 7: Define the command to run your app using CMD which defines your runtime
CMD ["npm","start"]
