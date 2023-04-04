import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';

@extensionName('text')
class TextExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			group: [ExtensionTag.Inline].join(' '),
		};
	}
}

export default TextExtension;
