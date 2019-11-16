FROM openjdk:11

ADD app.jar /app/
WORKDIR /app

CMD ["java", "-jar", "/app/app.jar"]

EXPOSE 5000
