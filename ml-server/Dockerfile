FROM bitnami/pytorch:2.0.1

WORKDIR /app

COPY Pipfile* .

RUN pip install pipenv  \
    && pipenv requirements > requirements.txt \
    && pip install -r requirements.txt

COPY app app
COPY mlmodels mlmodels
COPY main.py .

ARG CACHE_DIR=./.cache
ENV TRANSFORMERS_CACHE=${CACHE_DIR}
RUN mkdir ${CACHE_DIR} && chmod 777 ${CACHE_DIR}

EXPOSE 8001

CMD ["python", "main.py"]
