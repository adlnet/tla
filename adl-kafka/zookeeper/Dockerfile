FROM confluentinc/cp-zookeeper:7.0.1-3-ubi8

ARG KAFKA_SASL_USER
ARG KAFKA_SASL_PASS

RUN echo "Server { \n\
   org.apache.kafka.common.security.plain.PlainLoginModule required  \n\
   username="$KAFKA_SASL_USER" \n\
   password="$KAFKA_SASL_PASS" \n\
   user_$KAFKA_SASL_USER="$KAFKA_SASL_PASS"; \n\
};" > /var/lib/zookeeper/login-config.txt
