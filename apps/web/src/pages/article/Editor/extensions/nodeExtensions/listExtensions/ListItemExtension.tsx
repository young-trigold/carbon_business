import { NodeSpec } from 'prosemirror-model';
import { liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { extensionName } from '../../decorators/extensionName';
import ParagraphExtension from '../../presetExtensions/nodeExtensions/ParagraphExtension';
import { ExtensionTag, FunctionKeys, KeyMap, NodeExtension } from '../../type';

@extensionName('list_item')
export class ListItemExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			defining: true,
			content: `${ParagraphExtension.extensionName} ${ExtensionTag.Block}*`,
			parseDOM: [{ tag: 'li' }],
			toDOM() {
				return ['li', 0];
			},
		};
	}

	createKeyMap(): KeyMap {
		return {
			[`${FunctionKeys.Enter}`]: {
				priority: 2,
				command: splitListItem(this.type),
			},
			[`${FunctionKeys.Tab}`]: {
				priority: 2,
				command: sinkListItem(this.type),
			},
			[`${FunctionKeys.Shift}-${FunctionKeys.Tab}`]: {
				priority: 2,
				command: liftListItem(this.type),
			},
		};
	}
}
