FROM confluentinc/cp-kafka:7.3.0

ARG KAFKA_SASL_USER
ARG KAFKA_SASL_PASS

RUN echo "KafkaServer { \n\
   org.apache.kafka.common.security.plain.PlainLoginModule required \n\
   username=\"$KAFKA_SASL_USER\" \n\
   password=\"$KAFKA_SASL_PASS\" \n\
   user_$KAFKA_SASL_USER=\"$KAFKA_SASL_PASS\"; \n\
}; \n\
KafkaClient { \n\
   org.apache.kafka.common.security.plain.PlainLoginModule required \n\
   username=\"$KAFKA_SASL_USER\" \n\
   password=\"$KAFKA_SASL_PASS\"; \n\
};" > /var/lib/kafka/server-config.txt && \
chown appuser:appuser /var/lib/kafka/server-config.txt && \
chmod 600 /var/lib/kafka/server-config.txt
