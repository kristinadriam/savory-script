package utils

import (
	"fmt"

	log "github.com/sirupsen/logrus"
)

func LogInfof(tag string, messageFormat string, args ...interface{}) {
	prefixedMessage := fmt.Sprintf("[%s] %s", tag, messageFormat)
	log.Infof(prefixedMessage, args...)
}

func LogWarnf(tag string, messageFormat string, args ...interface{}) {
	prefixedMessage := fmt.Sprintf("[%s] %s", tag, messageFormat)
	log.Warnf(prefixedMessage, args...)
}

func LogErrorf(tag string, messageFormat string, args ...interface{}) {
	prefixedMessage := fmt.Sprintf("[%s] %s", tag, messageFormat)
	log.Errorf(prefixedMessage, args...)
}

func LogFatalf(tag string, messageFormat string, args ...interface{}) {
	prefixedMessage := fmt.Sprintf("[%s] %s", tag, messageFormat)
	log.Fatalf(prefixedMessage, args...)
}
