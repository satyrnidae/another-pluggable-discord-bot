import 'reflect-metadata';
import * as Inversify from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const Container = new Inversify.Container();
const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = getDecorators(Container, false);

export { Container, lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject };
