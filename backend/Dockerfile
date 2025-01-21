FROM --platform=linux/arm64 golang:1.23

WORKDIR /app

COPY src/go.mod src/go.sum ./
RUN go mod download
COPY src .

RUN GOOS=linux GOARCH=arm64 go build -o main .
RUN chmod +x main

EXPOSE 8060

CMD ["./main"]
