import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec } from 'prosemirror-model';
import { MarkPasteRule } from 'prosemirror-paste-rules';
import { Command } from 'prosemirror-state';
import { environment } from '../../utils/enviroment';
import { markInputRule } from '../../utils/inputRule';
import { extensionName } from '../decorators/extensionName';
import {
	CommandType,
	ExtensionTag,
	FunctionKeys,
	KeyMap,
	LetterKeys,
	MarkExtension,
} from '../type';

@extensionName('italic')
export class ItalicExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		return {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			parseDOM: [
				{
					tag: 'em',
				},
				{
					tag: 'i',
				},
			],
			toDOM() {
				return ['em', 0];
			},
		};
	}

	createInputRules(): InputRule[] {
		return [markInputRule(/_(\S(?:|.*?\S))_$/, this.type)];
	}

	createPasteRules(): MarkPasteRule[] {
		return [
			{ type: 'mark', markType: this.type, regexp: /(?:^|\W)_([^_]+)_/g },
			{ type: 'mark', markType: this.type, regexp: /\*([^*]+)\*/g },
		];
	}

	toggleItalic() {
		return toggleMark(this.type);
	}

	createCommands(): Record<string, (...args: any[]) => Command> {
		return {
			toggle: this.toggleItalic.bind(this),
		};
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.i}`]: this.toggleItalic(),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.i}`]: this.toggleItalic(),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}

declare global {
	namespace EditorStore {
		interface Commands {
			italic: CommandType<ItalicExtension>;
		}
	}
}
