import 'reflect-metadata';
import * as inversify from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const Container = new inversify.Container();
const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = getDecorators(Container, false);

const SERVICE_IDENTIFIERS = {
    COMMAND_REGISTRY: Symbol.for('COMMAND_REGISTRY'),
    CONFIGURATION: Symbol.for('CONFIGURATION'),
    MODULE_REGISTRY: Symbol.for('MODULE_REGISTRY'),
    DB_CONNECTION: Symbol.for('DATABASE_CONNECTION'),
    CLIENT: Symbol.for('CLIENT'),
    COMMAND_SERVICE: Symbol.for('COMMAND_SERVICE')
};

export { Container, lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject, SERVICE_IDENTIFIERS };
