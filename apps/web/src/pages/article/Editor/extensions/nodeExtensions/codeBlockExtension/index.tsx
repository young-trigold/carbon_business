import { NodeSpec } from 'prosemirror-model';
import { NodeViewConstructor } from 'prosemirror-view';
import { extensionName } from '../../decorators/extensionName';
import TextExtension from '../../presetExtensions/nodeExtensions/TextExtension';
import { ExtensionTag, NodeExtension } from '../../type';
import { CodeBlockView } from './CodeBlockView';

@extensionName('code_block')
export class CodeBlockExtension extends NodeExtension {
  createNodeSpec(): NodeSpec {
    return {
      defining: true,
      isolating: true,
      draggable: false,
      code: true,
      marks: '',
      group: [ExtensionTag.Block].join(' '),
      content: `${TextExtension.extensionName}*`,
      parseDOM: [
        {
          tag: 'pre',
          preserveWhitespace: 'full',
        },
      ],
      toDOM() {
        return ['pre', ['code', 0]];
      },
    };
  }

  createNodeView() {
    const nodeViewConstructor: NodeViewConstructor = (node, view, getPos) =>
      new CodeBlockView(node, view, getPos);
    return nodeViewConstructor;
  }
}
