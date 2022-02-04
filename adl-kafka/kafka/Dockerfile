FROM confluentinc/cp-kafka:5.5.3

ARG KAFKA_SASL_USER
ARG KAFKA_SASL_PASS

RUN echo "KafkaClient { \n\
   org.apache.kafka.common.security.plain.PlainLoginModule required\n\
   username="$KAFKA_SASL_USER"\n\
   password="$KAFKA_SASL_PASS";\n\
};\n\n\
Client {\n\
   org.apache.kafka.common.security.plain.PlainLoginModule required\n\
   username="$KAFKA_SASL_USER"\n\
   password="$KAFKA_SASL_PASS";\n\
};" > /var/lib/kafka/server-config.txt

RUN echo "KafkaServer {\n\
   org.apache.kafka.common.security.plain.PlainLoginModule required\n\
   username="$KAFKA_SASL_USER"\n\
   password="$KAFKA_SASL_PASS"\n\
   user_$KAFKA_SASL_USER="$KAFKA_SASL_PASS";\n\
};\n\n\
KafkaClient {\n\
   org.apache.kafka.common.security.plain.PlainLoginModule required\n\
   username="$KAFKA_SASL_USER"\n\
   password="$KAFKA_SASL_PASS";\n\
};\n\n\
Client {\n\
   org.apache.kafka.common.security.plain.PlainLoginModule required\n\
   username="$KAFKA_SASL_USER"\n\
   password="$KAFKA_SASL_PASS";\n\
};" > /var/lib/kafka/server-config.txt
