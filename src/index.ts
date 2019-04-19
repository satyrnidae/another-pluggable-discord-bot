import i18n = require('i18n');
import * as fs from 'fs';
import { Module, ModuleInfo, Container, SERVICE_IDENTIFIERS, Version } from '../api';
import { Client } from 'discord.js';
import { CommandRegistry, Configuration } from '../api/entity';


i18n.configure({
    locales: ['en'],
    fallbacks: {'*': 'en'},
    directory: `${__dirname}/locale`,
    logDebugFn: (msg) => console.debug(msg),
    logWarnFn: (msg) => console.warn(msg),
    logErrorFn: (msg) => console.error(msg)
});

var client = new Client();
var commandRegistry = Container.get<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
var moduleRegistry: Module[] = []
var configuration = Container.get<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION);

const moduleDirectory = `${__dirname}/../modules`;
fs.readdir(moduleDirectory, (err, items) =>{
    if(err) {
        return console.error(i18n.__('Unable to access module directory %s: %s', moduleDirectory, `${err}`));
    }
    items.forEach(item => {
        try {
            const modulePath = `${moduleDirectory}/${item}`;
            if(!fs.lstatSync(modulePath).isDirectory) {
                return console.warn(i18n.__('Skipped non-directory file "%s".', item));
            }
            var moduleConfig = fs.readdirSync(modulePath).filter(fn => fn.match(/^module\.json$/))[0];
            if(!moduleConfig) {
                return console.warn(i18n.__('Module "%s" is not a valid module.', item));
            }
            var moduleInfo = JSON.parse(fs.readFileSync(`${modulePath}/${moduleConfig}`).toString()) as ModuleInfo;
            if(!moduleInfo) {
                return console.warn(i18n.__('Module "%s" information file is not in the proper format.', item));
            }
            if(moduleInfo.details.apiVersion.toLowerCase().trim() != Version.toLowerCase().trim()) {
                return console.warn(i18n.__('Module "%s" was not created against the correct API version (expected %s; got %s)', item, Version, moduleInfo.details.apiVersion));
            }
            let entryPoint = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
            if(!fs.existsSync(entryPoint)) {
                entryPoint = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                if(!fs.existsSync(entryPoint)) {
                    return console.warn(i18n.__('Failed to load entry point for module "%s"', item));
                }
            }
            var moduleEntryPoint = require(entryPoint);
            var moduleInstance = new moduleEntryPoint.default() as Module;
            if(!moduleInstance) {
                return console.warn(i18n.__('Failed to load module "%s" instance', item));
            }
            moduleRegistry.push(moduleInstance);
        } catch (ex) {
            return console.error(i18n.__('An unexpected error occurred while loading module %s: %s', item, ex));
        }
    })
});

moduleRegistry.forEach(module => module.initialize(client));

client.login(configuration.token);
