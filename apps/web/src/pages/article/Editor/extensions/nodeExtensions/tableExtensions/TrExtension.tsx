import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { NodeExtension } from '../../type';
import { TdExtension } from './TdExtension';
import { ThExtension } from './ThExtension';

@extensionName('tr')
export class TrExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			tableRole: 'row',
			content: `(${TdExtension.extensionName}|${ThExtension.extensionName})*`,
			parseDOM: [
				{
					tag: 'tr',
				},
			],
			toDOM() {
				return ['tr', 0];
			},
		};
	}
}
