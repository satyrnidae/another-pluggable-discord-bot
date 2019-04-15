import { Container } from 'inversify';
import SERVICE_IDENTIFIERS from './service-identifiers';
import { CommandRegistry } from './entity';

let container = new Container();

var commandRegistry = require('../src/entity/command-registry');

container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(new commandRegistry.default()).inSingletonScope();

export default container;