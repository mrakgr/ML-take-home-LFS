# TODO: This works to dockerize the ML server, but it creates a 7.6gb image due to all the
# Cuda dependencies despite Torch itself being CPU only right now.
# Instead of using this Python image as the base, I should be using a PyTorch one instead to
# shortcut the package installation process.
FROM python:3.11.4-slim

WORKDIR /app

COPY Pipfile* .

RUN pip install pipenv  \
    && pipenv requirements > requirements.txt \
    && pip install -r requirements.txt

COPY app app
COPY mlmodels mlmodels
COPY main.py .

EXPOSE 8001

CMD ["python", "main.py"]
