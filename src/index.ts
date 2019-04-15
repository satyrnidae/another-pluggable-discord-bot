import * as fs from 'fs';
import * as api from '../api';
import { Client } from 'discord.js';


i18n.configure({
    locales: ['en'],
    fallbacks: {'*': 'en'},
    directory: `${__dirname}/locale`,
    logDebugFn: (msg) => console.debug(msg),
    logWarnFn: (msg) => console.warn(msg),
    logErrorFn: (msg) => console.error(msg)
});

var client = new Client();
