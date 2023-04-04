import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { MarkPasteRule } from 'prosemirror-paste-rules';
import { environment } from '../../utils/enviroment';
import { markInputRule } from '../../utils/inputRule';
import { extensionName } from '../decorators/extensionName';
import {
	CommandType,
	ExtensionTag,
	FunctionKeys,
	KeyMap,
	MarkExtension,
	SymbolKeys,
} from '../type';

@extensionName('code')
export class CodeExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		return {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			excludes: '_',
			parseDOM: [
				{
					tag: 'code',
				},
			],
			toDOM() {
				return ['code', 0];
			},
		};
	}

	createInputRules(): InputRule[] {
		return [markInputRule(new RegExp(`(?:\`)([^\`\uFFFC]+)(?:\`)$`), this.type)];
	}

	createPasteRules(): MarkPasteRule[] {
		return [{ type: 'mark', markType: this.type, regexp: /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g }];
	}

	toggleCode() {
		return toggleMark(this.type);
	}

	createCommands() {
		return {
			toggle: this.toggleCode.bind(this),
		};
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${SymbolKeys['`']}`]: this.toggleCode(),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${SymbolKeys['`']}`]: this.toggleCode(),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}

declare global {
	namespace EditorStore {
		interface Commands {
			code: CommandType<CodeExtension>;
		}
	}
}
