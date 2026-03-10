package main

import (
	"log"
	"os"
	"strconv"
	"time"

	"kha10/backend/internal/server"
	"kha10/backend/internal/telemetry"
)

func main() {
	port := getEnvInt("PORT", 8080)
	allowedOrigin := os.Getenv("WS_ALLOWED_ORIGIN")

	generator := telemetry.NewGenerator(time.Now().UnixNano(), time.Now().Add(-14*24*time.Hour))
	router := server.New(generator, allowedOrigin).Router()

	addr := ":" + strconv.Itoa(port)
	log.Printf("backend listening on %s", addr)

	if err := router.Run(addr); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}

func getEnvInt(key string, fallback int) int {
	raw := os.Getenv(key)
	if raw == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(raw)
	if err != nil {
		return fallback
	}

	return parsed
}
