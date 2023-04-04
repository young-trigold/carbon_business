import store from '@/app/store';
import themes from '@/app/theme/themes';
import { PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Root, createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { SelectionTooltipPluginState } from '.';
import { SelectionTooltip } from './SelectionTooltip';

export class SelectionTooltipView implements PluginView {
  root: null | Root = null;
  pluginKey: null | PluginKey<SelectionTooltipPluginState> = null;

  constructor(view: EditorView, pluginKey: PluginKey) {
    const container = document.createElement('div');
    view.dom.parentElement?.appendChild(container);
    this.root = createRoot(container);
    this.pluginKey = pluginKey;
  }

  update(view: EditorView) {
    const { state } = view;
    const { selection } = state;
    const { $head } = selection;
    const cursorPositionToViewPort = view.coordsAtPos($head.pos);
    const editorContainerPositionToViewPort = view.dom.parentElement!.getBoundingClientRect();
    const { themeMode } = store.getState().themeMode;
    this.root?.render(
      <ThemeProvider theme={themes[themeMode]}>
        <SelectionTooltip
          position={{
            left: cursorPositionToViewPort.left - editorContainerPositionToViewPort.left,
            top: cursorPositionToViewPort.top - editorContainerPositionToViewPort.top,
          }}
          visible={this.pluginKey?.getState(state)?.visible ?? false}
        />
      </ThemeProvider>,
    );
  }

  destroy() {
    this.root?.unmount();
  }
}
