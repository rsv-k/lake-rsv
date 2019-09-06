const additional = require('../additional');
exports.run = (msg, args, playlist, guildMusic) => {
    let description = `
    \_\_\*\*МУЗЫКАЛЬНЫЕ КОМАНДЫ\*\*\_\_\

\`--p link.\` link - ссылка на плейлист или одиночное видео ютюба
\`--j.\` Зайти в канал написавшего человека
\`--lv.\` Покинуть канал в котором находится бот
\`--q.\` Показать текующую очередь треков
\`--np.\` Показать текущий воспроизводящийся трек
\`--c.\` Очистить всю очередь включая играющий трек
\`--v number.\` number - значение(число) громкости проигрывателя
\`--pause.\` Поставить воспроизведение на паузу
\`--reume.\` Возобновить воспроизведение трека
\`--s [number].\` Пропустить один трек или заданное number-количество
\`--sf.\` Перемешать всю очередь
\`--seek time.\` Перемотать трек. Где time - в формате 00:00:00 или 00:00(минуты или секунды)
\`--ps link.\` Вставить вне очереди. link - ссылка на видео ютуба
\_\_\*\*АДМИН КОМАНДЫ\*\*\_\_\

\`--ds @user @user ...user.\` Выкинуть из голосового чата пользовател(я/ей)
\`--ma.\` Замутить всех в канале написавшего
\`--move channel1 to channel2.\` Переместить всех в канале channel1 в канал channel2
\`--ua.\` Размутить всех в канале написавшего`;

    additional.embedInfo(msg, 'COMMANDS', 0xE9A4AF, description);
}