import { javascript } from '@codemirror/lang-javascript';
import {
  EditorState as CodeMirrorState,
  Transaction as CodeMirrorTransaction,
} from '@codemirror/state';
import { Command, EditorView as CodeMirrorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { exitCode } from 'prosemirror-commands';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';
import { EditorView as ProseMirrorView, NodeView } from 'prosemirror-view';

interface ComputeChange {
  from: number;
  to: number;
  text: string;
}

const computeChange = (oldVal: string, newVal: string): ComputeChange | null => {
  if (oldVal === newVal) {
    return null;
  }

  let start = 0;
  let oldEnd = oldVal.length;
  let newEnd = newVal.length;

  while (start < oldEnd && oldVal.charCodeAt(start) === newVal.charCodeAt(start)) {
    start += 1;
  }

  while (
    oldEnd > start &&
    newEnd > start &&
    oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)
  ) {
    oldEnd -= 1;
    newEnd -= 1;
  }

  return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) };
};

export class CodeBlockView implements NodeView {
  node: ProseMirrorNode;

  view: ProseMirrorView;

  dom: HTMLElement;

  codeMirrorView: CodeMirrorView;

  getPos: () => number;

  updating = false;

  constructor(node: ProseMirrorNode, view: ProseMirrorView, getPos: () => number) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    const codeMirrorState = CodeMirrorState.create({
      doc: this.node.textContent,
      extensions: [
        basicSetup,
        javascript(),
        CodeMirrorState.changeFilter.of((tr) => {
          if (!tr.docChanged && !this.updating) {
            this.forwardSelection();
          }
          return true;
        }),
        keymap.of([
          {
            key: 'ArrowUp',
            run: this.mayBeEscape('line', -1),
          },
          {
            key: 'ArrowLeft',
            run: this.mayBeEscape('char', -1),
          },
          {
            key: 'ArrowDown',
            run: this.mayBeEscape('line', 1),
          },
          {
            key: 'ArrowRight',
            run: this.mayBeEscape('char', 1),
          },
          {
            key: 'Ctrl-Enter',
            run: () => {
              if (exitCode(this.view.state, this.view.dispatch)) {
                this.view.focus();
                return true;
              }
              return false;
            },
          },
        ]),
      ],
    });

    this.codeMirrorView = new CodeMirrorView({
      state: codeMirrorState,
      dispatch: this.dispatch.bind(this),
    });

    this.dom = this.codeMirrorView.dom;
  }

  forwardSelection() {
    if (!this.codeMirrorView.hasFocus) {
      return;
    }

    const { state } = this.view;
    const selection = this.asProseMirrorSelection(state.doc);

    if (!selection.eq(state.selection)) {
      this.view.dispatch(state.tr.setSelection(selection));
    }
  }

  asProseMirrorSelection(doc: ProseMirrorNode) {
    const offset = this.getPos() + 1;
    const { anchor, head } = this.codeMirrorView.state.selection.main;
    return TextSelection.create(doc, anchor + offset, head + offset);
  }

  dispatch(cmTr: CodeMirrorTransaction) {
    this.codeMirrorView.setState(cmTr.state);

    if (cmTr.docChanged && !this.updating) {
      const start = this.getPos() + 1;

      const cmValue = cmTr.state.doc.toString();
      const change = computeChange(this.node.textContent, cmValue);

      if (!change) {
        return;
      }

      const content = change.text ? this.view.state.schema.text(change.text) : null;

      const tr = this.view.state.tr.replaceWith(
        change.from + start,
        change.to + start,
        content as ProseMirrorNode,
      );
      this.view.dispatch(tr);
      this.forwardSelection();
    }
  }

  mayBeEscape(unit: 'char' | 'line', dir: -1 | 1): Command {
    return (view) => {
      const { state } = view;
      const { selection } = state;

      const offsetToPos = () => {
        const offset = selection.main.from;
        const line = state.doc.lineAt(offset);
        return { line: line.number, ch: offset - line.from };
      };

      const pos = offsetToPos();
      const hasSelection = state.selection.ranges.some((r) => !r.empty);

      const firstLine = 1;
      const lastLine = state.doc.lineAt(state.doc.length).number;

      if (
        hasSelection ||
        pos.line !== (dir < 0 ? firstLine : lastLine) ||
        (unit === 'char' && pos.ch !== (dir < 0 ? 0 : state.doc.line(pos.line).length))
      ) {
        return false;
      }

      const targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize);
      const pmSelection = Selection.near(this.view.state.doc.resolve(targetPos), dir);
      this.view.dispatch(this.view.state.tr.setSelection(pmSelection).scrollIntoView());
      this.view.focus();
      return true;
    };
  }

  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    const change = computeChange(this.codeMirrorView.state.doc.toString(), node.textContent);

    if (change) {
      this.updating = true;
      this.codeMirrorView.dispatch({
        changes: { from: change.from, to: change.to, insert: change.text },
      });
      this.updating = false;
    }

    return true;
  }

  setSelection(anchor: number, head: number): void {
    this.focus();
    this.updating = true;
    this.codeMirrorView.dispatch({ selection: { anchor, head } });
    this.updating = false;
  }

  focus() {
    this.codeMirrorView.focus();
    this.forwardSelection();
  }

  selectNode() {
    this.focus();
  }

  stopEvent() {
    return true;
  }

  destroy() {
    this.codeMirrorView.destroy();
  }
}
