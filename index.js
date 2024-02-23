'use strict'
//Для получения агрументов консольного вызова в виде объекта используем библиотеку yargs
const yargs = require('yargs/yargs')
const hideBin  = require('yargs/helpers').hideBin;

//Описываем настройки агрументов командной строки: 
const argv = yargs(hideBin(process.argv))
.option('city', { //создаем альясы для запланированных действий:
    alias: "c", 
    description: "Название города.",
    type: "string",
    })
.alias('help', 'h') //Добавим альяс для help
.argv;

//Обрабатываем переданный параметр, если параметр передали, то делаем запрос прогноза погоды:
if  (argv.hasOwnProperty('city')) {
    const http = require('http')
    const myAPIKey = process.env.myAPIKey;
    const url = `http://api.weatherstack.com/current?access_key=${myAPIKey}&query=${argv.city}`;
    http.get(url, (res) => {
        const {statusCode} = res
        if (statusCode !== 200){
            console.log(`statusCode: ${statusCode}`)
            return;
        }
    
        res.setEncoding('utf8')
        let rowData = ''
        res.on('data', (chunk) => rowData += chunk)
        res.on('end', () => {
            let parseData = JSON.parse(rowData);
            if (parseData.hasOwnProperty('current')) {
                console.log(`Описание текущей погоды в городе ${argv.city}: ${parseData.current.weather_descriptions}.`);
                console.log(`Температура      :${parseData.current.temperature}.`);
                console.log(`Ощущается как    :${parseData.current.feelslike}.`);
                console.log(`Влажность        :${parseData.current.humidity}.`);
                console.log(`Скорость ветра   :${parseData.current.wind_speed}.`);
                console.log(`Направление ветра:${parseData.current.wind_dir}.`);
                console.log(`Видимость        :${parseData.current.visibility}.`);
            }
            if (parseData.hasOwnProperty('success')) {
                if (parseData.success = 'false') {
                    if (parseData.hasOwnProperty('error')) {
                        console.log(`Сервер сообщил об ошибке: ${parseData.error.code}, описание ошибки: ${parseData.error.info}.`);
                    }

                }
            }
        })
    }).on('error', (err) => {
        console.error(err)
    })
}
else {
    console.log('Укажите параметр c\\city.')
}
