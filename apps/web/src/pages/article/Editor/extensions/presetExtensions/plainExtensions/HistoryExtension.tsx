import { history, redo, undo } from 'prosemirror-history';
import { environment } from '../../../utils/enviroment';
import { extensionName } from '../../decorators/extensionName';
import { FunctionKeys, KeyMap, LetterKeys, PlainExtension } from '../../type';

@extensionName('history')
class HistoryExtension extends PlainExtension {
	createKeyMap(): KeyMap {
		const keyMapForMac: KeyMap = {
			[`${FunctionKeys.Mod}-${LetterKeys.z}`]: undo,
			[`${FunctionKeys.Mod}-${LetterKeys.y}`]: redo,
		};

		const keyMapForWin: KeyMap = {
			[`${FunctionKeys.Ctrl}-${LetterKeys.z}`]: undo,
			[`${FunctionKeys.Ctrl}-${LetterKeys.y}`]: redo,
		};

		const finalKeyMap = environment.isMac ? keyMapForMac : keyMapForWin;
		return finalKeyMap;
	}

	createPlugins() {
		return [history()];
	}
}

export default HistoryExtension;
