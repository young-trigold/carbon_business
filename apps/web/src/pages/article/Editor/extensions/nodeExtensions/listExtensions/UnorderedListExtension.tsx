import { InputRule, wrappingInputRule } from 'prosemirror-inputrules';
import { NodeSpec } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { toggleList } from '../../../utils/command';
import { extensionName } from '../../decorators/extensionName';
import { CommandType, ExtensionTag, NodeExtension } from '../../type';
import { ListItemExtension } from './ListItemExtension';

@extensionName('unordered_list')
export class UnorderedListExtension extends NodeExtension {
  createNodeSpec(): NodeSpec {
    return {
      draggable: false,
      group: [ExtensionTag.Block, ExtensionTag.ListContainerNode].join(' '),
      content: `${ListItemExtension.extensionName}+`,
      parseDOM: [{ tag: 'ul' }],
      toDOM() {
        return ['ul', 0];
      },
    };
  }

  createInputRules(): InputRule[] {
    return [wrappingInputRule(/^\s*([-+*])\s$/, this.type)];
  }

  toggleUnorderedList() {
    return toggleList(this.type, this.editorStore?.schema?.nodes[ListItemExtension.extensionName]!);
  }

  createCommands() {
    return {
      toggle: this.toggleUnorderedList.bind(this),
    };
  }
}

declare global {
  namespace EditorStore {
    interface Commands {
      unordered_list: CommandType<UnorderedListExtension>;
    }
  }
}
