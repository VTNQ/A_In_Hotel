FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY target/be-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8585
ENTRYPOINT ["java","-jar","app.jar"]
