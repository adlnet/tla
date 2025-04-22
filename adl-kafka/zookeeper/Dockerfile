FROM confluentinc/cp-zookeeper:7.3.0

ARG KAFKA_SASL_USER
ARG KAFKA_SASL_PASS

# Create the login-config.txt file in /var/lib/zookeeper/ with proper newlines
RUN echo -e "Server {\n\
    org.apache.kafka.common.security.plain.PlainLoginModule required\n\
    username=\"$KAFKA_SASL_USER\"\n\
    password=\"$KAFKA_SASL_PASS\"\n\
    user_$KAFKA_SASL_USER=\"$KAFKA_SASL_PASS\";\n\
 };\n\
 KafkaClient {\n\
    org.apache.kafka.common.security.plain.PlainLoginModule required\n\
    username=\"$KAFKA_SASL_USER\"\n\
    password=\"$KAFKA_SASL_PASS\";\n\
 };" > /var/lib/zookeeper/login-config.txt

# Set ownership and permissions
RUN chown appuser:appuser /var/lib/zookeeper/login-config.txt && \
    chmod 600 /var/lib/zookeeper/login-config.txt
