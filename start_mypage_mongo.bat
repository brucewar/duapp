@echo on
mongod --dbpath=%cd%\db --logpath=%cd%\log\mongodb.log
pause