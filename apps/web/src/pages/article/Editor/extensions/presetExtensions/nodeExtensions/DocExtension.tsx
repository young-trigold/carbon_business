import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';

@extensionName('doc')
class DocExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			content: `${ExtensionTag.Block}+`,
		};
	}
}

export default DocExtension;
