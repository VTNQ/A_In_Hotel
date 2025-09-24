# Sử dụng image JDK để build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Sử dụng JDK nhẹ để chạy app
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/be-0.0.1-SNAPSHOT.jar app.jar

# Expose port (khớp với server.port=8585 trong application.properties)
EXPOSE 8585

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]

