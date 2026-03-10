package telemetry

type Metric struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Delta string `json:"delta"`
	Trend string `json:"trend"`
}

type Node struct {
	Name             string `json:"name"`
	Role             string `json:"role"`
	Region           string `json:"region"`
	Load             int    `json:"load"`
	HeartbeatSeconds int    `json:"heartbeatSeconds"`
	Status           string `json:"status"`
}

type Connection struct {
	Name      string `json:"name"`
	Channel   string `json:"channel"`
	LatencyMs int    `json:"latencyMs"`
	Status    string `json:"status"`
}

type Activity struct {
	Title     string `json:"title"`
	Detail    string `json:"detail"`
	Timestamp string `json:"timestamp"`
	Status    string `json:"status"`
}

type Snapshot struct {
	GeneratedAt      string       `json:"generatedAt"`
	Cluster          string       `json:"cluster"`
	Environment      string       `json:"environment"`
	Uptime           string       `json:"uptime"`
	ThroughputPerMin int          `json:"throughputPerMin"`
	ErrorRate        float64      `json:"errorRate"`
	Metrics          []Metric     `json:"metrics"`
	Nodes            []Node       `json:"nodes"`
	Connections      []Connection `json:"connections"`
	Activity         []Activity   `json:"activity"`
}

type Envelope struct {
	Type    string   `json:"type"`
	Payload Snapshot `json:"payload"`
}
