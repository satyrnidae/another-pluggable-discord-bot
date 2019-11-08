import "reflect-metadata";
import { Container } from 'inversify';
import { CommandRegistry, Configuration, SERVICE_IDENTIFIERS, ModuleRegistry } from 'api'

let container = new Container();

var commandRegistry = require('core/command-registry-base');
var configuration = require('core/configuration-base');
var moduleRegistry = require('core/module-registry-base');

container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(commandRegistry.default).inSingletonScope();
container.bind<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION).to(configuration.default).inSingletonScope();
container.bind<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY).to(moduleRegistry.default).inSingletonScope();

export default container;
