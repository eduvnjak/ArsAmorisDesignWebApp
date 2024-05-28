# Stage 1: Build the frontend
FROM node:latest AS frontend-build
WORKDIR /app/frontend

# Copy frontend source code and install dependencies
COPY ars-amoris-design-app/package*.json ./
RUN npm install
COPY ars-amoris-design-app ./
RUN npm run build

# Stage 2: Build the backend and copy frontend build output
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend-build
WORKDIR /app/backend

# Copy csproj and restore as distinct layers
COPY ArsAmorisDesignApi/*.csproj ./
RUN dotnet restore

# Copy everything else and build backend
COPY ArsAmorisDesignApi ./
RUN dotnet publish -c Release -o out

# Copy and seed images
COPY images.sh /usr/local/bin/copy_images.sh
COPY ./container_images/ ./source_images
RUN mkdir -p target_directory
RUN chmod +x /usr/local/bin/copy_images.sh
RUN /usr/local/bin/copy_images.sh

# Stage 3: Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/backend/out .
RUN mkdir Images
COPY --from=backend-build /app/backend/target_directory ./Images

# Copy frontend build output to wwwroot folder
WORKDIR /app/wwwroot
COPY --from=frontend-build /app/frontend/dist ./

WORKDIR /app
EXPOSE 80 

# Command to run the application
# CMD ["dotnet", "ArsAmorisDesignApi.dll"] CMD ili ENTRYPOINT
ENTRYPOINT ["dotnet","ArsAmorisDesignApi.dll"]
