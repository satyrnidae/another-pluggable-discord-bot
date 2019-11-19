import 'reflect-metadata';
import * as inversify from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const Container = new inversify.Container();
const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = getDecorators(Container, false);

export { Container, lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject };
