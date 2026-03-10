package server

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"kha10/backend/internal/telemetry"
)

const (
	writeTimeout = 10 * time.Second
	readTimeout  = 60 * time.Second
)

type Server struct {
	generator     *telemetry.Generator
	allowedOrigin string
	upgrader      websocket.Upgrader
}

func New(generator *telemetry.Generator, allowedOrigin string) *Server {
	instance := &Server{
		generator:     generator,
		allowedOrigin: allowedOrigin,
	}

	instance.upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     instance.checkOrigin,
	}

	return instance
}

func (s *Server) Router() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())

	router.GET("/healthz", s.handleHealth)
	router.GET("/api/v1/stream", s.handleSnapshot)
	router.GET("/api/v1/ws/stream", s.handleWebsocket)

	return router
}

func (s *Server) handleHealth(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (s *Server) handleSnapshot(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, s.generator.Snapshot(time.Now()))
}

func (s *Server) handleWebsocket(ctx *gin.Context) {
	conn, err := s.upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	_ = conn.SetReadDeadline(time.Now().Add(readTimeout))
	conn.SetPongHandler(func(string) error {
		return conn.SetReadDeadline(time.Now().Add(readTimeout))
	})

	if err := s.writeSnapshot(conn); err != nil {
		return
	}

	ticker := time.NewTicker(2 * time.Second)
	pingTicker := time.NewTicker(20 * time.Second)
	defer ticker.Stop()
	defer pingTicker.Stop()

	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			if _, _, readErr := conn.ReadMessage(); readErr != nil {
				return
			}
		}
	}()

	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			if err := s.writeSnapshot(conn); err != nil {
				return
			}
		case <-pingTicker.C:
			if err := conn.WriteControl(websocket.PingMessage, []byte("ping"), time.Now().Add(writeTimeout)); err != nil {
				return
			}
		}
	}
}

func (s *Server) writeSnapshot(conn *websocket.Conn) error {
	envelope := telemetry.Envelope{
		Type:    "snapshot",
		Payload: s.generator.Snapshot(time.Now()),
	}

	if err := conn.SetWriteDeadline(time.Now().Add(writeTimeout)); err != nil {
		return err
	}

	return conn.WriteJSON(envelope)
}

func (s *Server) checkOrigin(request *http.Request) bool {
	if s.allowedOrigin == "" {
		return true
	}

	return request.Header.Get("Origin") == s.allowedOrigin
}
