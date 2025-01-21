package fs

import (
	"encoding/json"
	"fmt"
	"os"
	"savory-script/internal/utils"
	"sync"
	"time"
)

const logTag = "fs"

type Fs struct {
	DirectoryPath string
	Entities      Entities
	Mu            sync.Mutex
}

func NewFs(directoryPath string) *Fs {
	err := os.MkdirAll(directoryPath, os.ModePerm)
	if err != nil {
		utils.LogErrorf(logTag, "Error while creating deirectory: %v", err)
	}

	return &Fs{
		DirectoryPath: directoryPath,
		Entities: Entities{
			Entities: []Entity{},
		},
		Mu: sync.Mutex{},
	}
}

func (fs *Fs) getFilename() string {
	timestamp := time.Now().Format("20060102_150405")
	return fmt.Sprintf("%s_.json", timestamp)
}

func (fs *Fs) getFilePath() string {
	return fmt.Sprintf("%s/%s", fs.DirectoryPath, fs.getFilename())
}

func (fs *Fs) SaveEntities() {
	utils.LogInfof(logTag, "Start to save entities")

	f, err := os.OpenFile(fs.getFilePath(), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		utils.LogErrorf(logTag, "Error of creating file: %s", err)
		return
	}
	defer f.Close()

	data, err := json.MarshalIndent(fs.Entities, "", "    ")
	if _, err := f.Write(data); err != nil {
		utils.LogErrorf(logTag, "Error of writing to file: %s", err)
	} else {
		utils.LogInfof(logTag, "Successfully write entities to file")
	}
	fs.ClearEntities()
}

func (fs *Fs) AddEntity(writeType OperationType, jsonBody string) {
	fs.Mu.Lock()
	utils.LogInfof(logTag, "Entity added")
	fs.Entities.Entities = append(fs.Entities.Entities, NewEntity(jsonBody, writeType))
	fs.Mu.Unlock()
}

func (fs *Fs) ClearEntities() {
	fs.Mu.Lock()
	utils.LogInfof(logTag, "Entities cleared")
	fs.Entities = Entities{}
	fs.Mu.Unlock()
}

func (fs *Fs) StartFs() {
	utils.LogInfof(logTag, "Fs started")
	go func() {
		for {
			time.Sleep(1 * time.Minute)
			fs.SaveEntities()
		}
	}()
}
