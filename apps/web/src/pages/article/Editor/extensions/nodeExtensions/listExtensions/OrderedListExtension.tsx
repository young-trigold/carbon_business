import { InputRule, wrappingInputRule } from 'prosemirror-inputrules';
import { NodeSpec } from 'prosemirror-model';
import { findParentNode, toggleList, wrapSelectedItems } from '../../../utils/command';
import { extensionName } from '../../decorators/extensionName';
import { CommandType, ExtensionTag, NodeExtension } from '../../type';
import { ListItemExtension } from './ListItemExtension';

@extensionName('ordered_list')
export class OrderedListExtension extends NodeExtension {
  createNodeSpec(): NodeSpec {
    return {
      draggable: false,
      attrs: {
        order: {
          default: 1,
        },
      },
      group: [ExtensionTag.Block, ExtensionTag.ListContainerNode].join(' '),
      content: `${ListItemExtension.extensionName}+`,
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(node) {
            if (!(node instanceof HTMLOListElement)) return false;
            return { order: Number.parseInt(node.getAttribute('data-start') ?? '1', 10) };
          },
        },
      ],
      toDOM(node) {
        return node.attrs.order === 1 ? ['ol', 0] : ['ol', { 'data-start': node.attrs.order }, 0];
      },
    };
  }

  createInputRules(): InputRule[] {
    const regexp = /^(\d+)\.\s$/;

    return [
      wrappingInputRule(
        regexp,
        this.type,
        (match) => ({ order: Number.parseInt(match[1] ?? '1', 10) }),
        (match, node) =>
          node.childCount + (node.attrs.order as number) === Number.parseInt(match[1], 10),
      ),

      new InputRule(regexp, (state, match, start, end) => {
        const tr = state.tr;
        tr.deleteRange(start, end);
        const canUpdate = wrapSelectedItems({
          listType: this.type,
          itemType: this.editorStore!.schema!.nodes[ListItemExtension.extensionName]!,
          tr,
        });

        if (!canUpdate) {
          return null;
        }

        const order = Number.parseInt(match[1], 10);

        if (order !== 1) {
          const found = findParentNode({
            predicate: (node) => node.type.name === this.type.name,
            selection: tr.selection,
          });

          if (found) {
            tr.setNodeMarkup(found.pos, undefined, { order });
          }
        }

        return tr;
      }),
    ];
  }

  toggleOrderedList() {
    return toggleList(this.type, this.editorStore?.schema?.nodes[ListItemExtension.extensionName]!);
  }

  createCommands() {
    return {
      toggle: this.toggleOrderedList.bind(this),
    };
  }
}

declare global {
  namespace EditorStore {
    interface Commands {
      ordered_list: CommandType<OrderedListExtension>;
    }
  }
}
