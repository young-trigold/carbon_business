import { Plugin, PluginKey } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';
import { SelectionTooltipView } from './SelectionTooltipView';

export interface SelectionTooltipPluginState {
  visible: boolean;
  onMouseDowned: boolean;
}

@extensionName('selection_tooltip')
export class SelectionTooltipExtension extends PlainExtension {
  pluginKey = new PluginKey<SelectionTooltipPluginState>('selection_tooltip');

  createPlugins(): Plugin<any>[] {
    return [
      new Plugin<SelectionTooltipPluginState>({
        key: this.pluginKey,
        state: {
          init() {
            return {
              visible: false,
              onMouseDowned: false,
            };
          },
          apply: (tr, value) => {
            const { selection } = tr;
            const { empty } = selection;
            return {
              visible: (tr.getMeta(this.pluginKey) ?? value.onMouseDowned) && !empty,
              onMouseDowned: tr.getMeta(this.pluginKey),
            };
          },
        },
        props: {
          handleDOMEvents: {
            mousedown: (editorView) => {
              const { state } = editorView;
              const { tr } = state;
              editorView.dispatch(tr.setMeta(this.pluginKey, { onMouseDowned: true }));
            },
            mouseup: (editorView) => {
              const { state } = editorView;
              const { tr } = state;
              editorView.dispatch(tr.setMeta(this.pluginKey, { onMouseDowned: false }));
            },
          },
        },
        view: (view) => new SelectionTooltipView(view, this.pluginKey),
      }),
    ];
  }
}
