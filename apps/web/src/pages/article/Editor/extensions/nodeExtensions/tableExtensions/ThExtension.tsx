import { NodeSpec } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import TextExtension from '../../presetExtensions/nodeExtensions/TextExtension';
import { NodeExtension } from '../../type';
import { cellAttrs, getCellAttrs, setCellAttrs } from './uitls';

@extensionName('th')
export class ThExtension extends NodeExtension {
	createNodeSpec(): NodeSpec {
		return {
			attrs: cellAttrs,
			tableRole: 'header_cell',
			isolating: true,
			content: `${TextExtension.extensionName}*`,
			parseDOM: [
				{
					tag: 'th',
					getAttrs: (dom: Node | string) => getCellAttrs(dom as HTMLElement, cellAttrs),
				},
			],
			toDOM(node) {
				return ['th', setCellAttrs(node, cellAttrs), 0];
			},
		};
	}
}
