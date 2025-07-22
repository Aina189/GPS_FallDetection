FROM openjdk:25-ea-21-jdk
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar","--DATABASE_IP_URL=my_db","--DATABASE_PORT_URL=3306"]