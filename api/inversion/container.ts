import "reflect-metadata";
import { Container } from 'inversify';
import SERVICE_IDENTIFIERS from './service-identifiers';
import { ModuleRegistry } from '../modules';
import { CommandRegistry, Configuration } from '../entity';

let container = new Container();

var commandRegistryArchetype = require('../../src/archetypes/command-registry-archetype');
var configurationArchetype = require('../../src/archetypes/configuration-archetype');
var moduleRegistryArchetype = require('../../src/archetypes/module-registry-archetype');

container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(commandRegistryArchetype.default).inSingletonScope();
container.bind<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION).to(configurationArchetype.default).inSingletonScope();
container.bind<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY).to(moduleRegistryArchetype.default).inSingletonScope();

export default container;
