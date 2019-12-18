import 'reflect-metadata';
import * as Inversify from 'inversify';
import getDecorators from 'inversify-inject-decorators';

/**
 * The IOC container instance
 */
const Container = new Inversify.Container();
const injectors = getDecorators(Container, false);

/**
 * Injects an instance from the container into a property on first access
 */
const lazyInject = injectors.lazyInject;

export { Container, lazyInject };
