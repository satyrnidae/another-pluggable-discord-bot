import "reflect-metadata";
import { Container } from 'inversify';
import { CommandRegistry, Configuration } from './entity';
import SERVICE_IDENTIFIERS from './service-identifiers';

let container = new Container();

var commandRegistryArchetype = require('../src/archetypes/command-registry-archetype');
var configurationArchetype = require('../src/archetypes/configuration-archetype');

container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(commandRegistryArchetype.default).inSingletonScope();
container.bind<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION).to(configurationArchetype.default).inSingletonScope();

export default container;
