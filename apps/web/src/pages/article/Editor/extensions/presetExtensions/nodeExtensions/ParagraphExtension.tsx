import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { ExtensionTag, NodeExtension } from '../../type';

@extensionName('paragraph')
class ParagraphExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			draggable: false,
			content: `${ExtensionTag.Inline}*`,
			group: [
				ExtensionTag.LastNodeCompatible,
				ExtensionTag.TextBlock,
				ExtensionTag.Block,
				ExtensionTag.FormattingNode,
			].join(' '),
			parseDOM: [
				{
					tag: 'p',
				},
			],
			toDOM() {
				return ['p', 0];
			},
		};
	}
}

export default ParagraphExtension;
