import { Plugin } from 'prosemirror-state';
import { trailingNode } from 'prosemirror-trailing-node';
import { extensionName } from '../../decorators/extensionName';
import { OrderedListExtension } from '../../nodeExtensions/listExtensions/OrderedListExtension';
import { UnorderedListExtension } from '../../nodeExtensions/listExtensions/UnorderedListExtension';
import { PlainExtension } from '../../type';
import ParagraphExtension from '../nodeExtensions/paragraphExtension';

@extensionName('trailing_node')
export class TrailingNodeExtension extends PlainExtension {
	createPlugins() {
		const plugin = trailingNode({
			ignoredNodes: [OrderedListExtension, UnorderedListExtension].map(
				(Extension) => Extension.extensionName,
			),
			nodeName: ParagraphExtension.extensionName,
		});
		return [plugin];
	}
}
