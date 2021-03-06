# Протокол обмена

## Общая информация:

Протокол для обмена информацией со стойками. [Проект с прошивкой для стоек](https://github.com/andreymaznyak/led_control_panel)

### Описание пакетов клиента:

1. CLIENT_INFO - id сообщения 1

   Событие происходит при открытии клиенсткого сокета и при запросе информации клиент отсылает свой идентификатор(номер стойки), ip - Адресс ip-v4, getChipId, getFreeHeap

   Размер пакета 16 байт  
   | 1 байт - id сообщения | 2 - 5 байты - id aдрес | 6 байт - номер стойки | 7 - 10 байт - id чипа | 11 - 14 байт размер свободной памяти | 15 - 16 байт версия прошивки |

1. PRESS_BUTTON id сообщения 2

   Если нажата кнопка на сервер отсылается индекс нажатой кнопки

   Размер пакета 2 байта

   | 1 байт - id сообщения | 2 байт - данные о номере |

   Данные о номере:

   | Первые 5 бит - индекс номера | 6-8 бит не используется |

### Описание пакетов сервера:

1. SET_DIGIT_COMPLETED - id сообщения 3

   Пакет говорящий что какой то номер должен замигать, или наоборот перестать мигать

   Размер пакета 2 байта  
   | 1 байт - id сообщения | 2 байт - данные о номере |

   Данные о номере:  
   | Первые 5 бит - индекс номера | 6-7 бит не используется | 8 бит - мигать или нет |

1. UPDATE_ARR_NUMBERS_AND_COMPLETED_STATUS - id сообщения 4  
   Пакет передающий всю информацию о номерах которые нужно отображать

   Размер пакета 49 байт  
   | 1 байт - id сообщения | 2 - 49 - данные о клиентах |  
   Данные о клиентах:
   24 блока по 2 байта (Данные о клиенте)

   Данные о клиенте:  
   | Первые 14 бит - число - номер клиента | 15 бит не используется | 16 бит - мигать или нет |

1. RESTART - id сообщения 5  
   Пакет говорящий стойке что бы она перезагрузилась

   Размер пакета 1 байт  
   | 1 байт - id сообщения |

1. GET_INFO - id сообщения 6

   Пакет запрашивающий системные данные ( размер свободной памяти и т.п. ), в ответ клиент должен послать пакет CLIENT_INFO  
   Размер пакета 1 байт  
   | 1 байт - id сообщения |

## Пример использования библиотеки

Смотрите файлы в директории test  
`npm run test`

How install it:  
`npm install led-array-tcp-protocol`  
How use it:

```javascript
const net = require("net");

const {
  ClientPackageTypes,
  ClientInfoPackage,
  PressButtonPackage,
  ServerPackageTypes,
  GetInfoPackage,
  RestartPackage,
  UpdateNumbersPackage,
  SetDigitCompletedPackage
} = require("led-array-tcp-protocol");

const server = net.createServer(function(socket) {
  socket.on("data", data => {
    let parsedLength = 0; // Длина обработанного сообщения
    while (parsedLength < data.byteLength) {
      // В chunk может быть сразу несколько сообщений
      const messageId = new Uint8Array(data.buffer, parsedLength, 1)[0];
      console.log("messageId", messageId);
      console.log("data", data);
      switch (messageId) {
        case ClientPackageTypes.CLIENT_INFO: {
          const package = ClientInfoPackage(
            Buffer.from(data.buffer, parsedLength, 16)
          );
          parsedLength += 16;
          console.log("package", JSON.stringify(package, null, 4));
          break;
        }
        case ClientPackageTypes.PRESS_BUTTON: {
          const package = PressButtonPackage(
            Buffer.from(data.buffer, parsedLength, 2)
          );
          parsedLength += 2;
          console.log("package", JSON.stringify(package, null, 4));
          break;
        }
        default: {
          console.warn(new Error("unknow package id"));
        }
      }
    }
  });
});
server.listen(1899, "127.0.0.1");

const client = new net.Socket();
client.connect(1899, "127.0.0.1", function() {
  console.log("Connected");
});
const pressButtonPackage = PressButtonPackage();
pressButtonPackage.pressButtonIndex = 14;
client.write(Buffer.from(pressButtonPackage.buff));
client.end();
```
