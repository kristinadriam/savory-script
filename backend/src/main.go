package main

import (
	"savory-script/internal/controllers"
)

var server = controllers.Server{}

func main() {
	server.Initialize()
	server.Run()
}