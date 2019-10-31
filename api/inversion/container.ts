import "reflect-metadata";
import { Container } from 'inversify';
import SERVICE_IDENTIFIERS from './service-identifiers';
import { ModuleRegistry } from '../modules';
import { CommandRegistry, Configuration } from '../entity';

let container = new Container();

var commandRegistry = require('../../src/base/command-registry-base');
var configuration = require('../../src/base/configuration-base');
var moduleRegistry = require('../../src/base/module-registry-base');

container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(commandRegistry.default).inSingletonScope();
container.bind<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION).to(configuration.default).inSingletonScope();
container.bind<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY).to(moduleRegistry.default).inSingletonScope();

export default container;
