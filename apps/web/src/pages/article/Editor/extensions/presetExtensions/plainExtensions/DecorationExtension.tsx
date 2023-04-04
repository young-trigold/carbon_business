import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

@extensionName('decoration')
class DecorationExtension extends PlainExtension {
	onEditorStoreCreate?(): void {}
}

export default DecorationExtension;
