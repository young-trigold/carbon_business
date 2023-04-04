import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec, NodeSpec } from 'prosemirror-model';
import { PasteRule } from 'prosemirror-paste-rules';
import { Command, PluginKey, Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import { NodeView, NodeViewConstructor } from 'prosemirror-view';
import EditorStore from '../store';

export abstract class Extension {
	editorStore: EditorStore | null = null;
	static extensionName: string;
	get name() {
		return Extension.extensionName;
	}

	onEditorStoreCreate?(): void;
	onEditorViewCreate?(): void;
	createPlugins?(): ProseMirrorPlugin[];
	createKeyMap?(): KeyMap;
	createCommands?(): {
		[commandName: string]: (...args: any[]) => Command;
	};
}

export type CommandType<T extends Extension> = {
	[commandName in keyof ReturnType<NonNullable<T['createCommands']>>]: (
		...args: Parameters<ReturnType<NonNullable<T['createCommands']>>[commandName]>
	) => void;
};

export abstract class MarkExtension extends Extension {
	get type() {
		return this.editorStore?.schema?.marks[this.name]!;
	}

	abstract createMarkSpec(): MarkSpec;
	createInputRules?(): InputRule[];
	createPasteRules?(): PasteRule[];
}

export abstract class NodeExtension extends Extension {
	get type() {
		return this.editorStore?.schema?.nodes[this.name]!;
	}
	abstract createNodeSpec(): NodeSpec;
	createInputRules?(): InputRule[];
	createPasteRules?(): PasteRule[];
	createNodeView?(): NodeViewConstructor;
}

export abstract class PlainExtension extends Extension {
	createSpecCommonPart?(): Record<string, string>[];
}

export enum FunctionKeys {
	Mod = 'Mod',
	Ctrl = 'Ctrl',
	Shift = 'Shift',
	Alt = 'Alt',
	Backspace = 'Backspace',
	Tab = 'Tab',
	Enter = 'Enter',
}
export enum LetterKeys {
	z = 'z',
	y = 'y',
	b = 'b',
	i = 'i',
	u = 'u',
	m = 'm',
	// =========== 大写 ============
	Z = 'Z',
	Y = 'Y',
	B = 'B',
	I = 'I',
	U = 'U',
	M = 'M',
}
export enum SymbolKeys {
	'`' = '`',
}

export type KeyMap = {
	[key: string]:
		| Command
		| {
				priority: number;
				command: Command;
		  };
};

export enum ExtensionTag {
	LastNodeCompatible = 'lastNodeCompatible',
	FormattingMark = 'formattingMark',
	FormattingNode = 'formattingNode',
	NodeCursor = 'nodeCursor',
	FontStyle = 'fontStyle',
	Link = 'link',
	Color = 'color',
	Alignment = 'alignment',
	Indentation = 'indentation',
	Behavior = 'behavior',
	Code = 'code',
	Inline = 'inline',
	Block = 'block',
	ListContainerNode = 'listContainer',
	ListItemNode = 'listItemNode',
	TextBlock = 'textBlock',
	ExcludeInputRules = 'excludeFromInputRules',
	PreventExits = 'preventsExits',
	Media = 'media',
}
