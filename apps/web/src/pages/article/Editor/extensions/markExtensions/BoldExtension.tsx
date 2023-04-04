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
	LetterKeys,
	MarkExtension,
} from '../type';

@extensionName('bold')
export class BoldExtension extends MarkExtension {
	createMarkSpec(): MarkSpec {
		return {
			group: [ExtensionTag.FormattingMark, ExtensionTag.FontStyle].join(' '),
			parseDOM: [
				{
					tag: 'strong',
				},
				{
					tag: 'b',
				},
			],
			toDOM() {
				return ['strong', 0];
			},
		};
	}

	createInputRules(): InputRule[] {
		return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.type)];
	}

	createPasteRules(): MarkPasteRule[] {
		return [
			{ type: 'mark', markType: this.type, regexp: /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g },
			{ type: 'mark', markType: this.type, regexp: /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g },
		];
	}

	toggleBold() {
		return toggleMark(this.type);
	}

	createCommands() {
		return {
			toggle: this.toggleBold.bind(this),
		};
	}

	createKeyMap(): KeyMap {
		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.b}`]: this.toggleBold(),
		};

		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.b}`]: this.toggleBold(),
		};

		return environment.isMac ? keyMapForMac : keyMapForWin;
	}
}

declare global {
	namespace EditorStore {
		interface Commands {
			bold: CommandType<BoldExtension>;
		}
	}
}
