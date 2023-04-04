import { baseKeymap, chainCommands } from 'prosemirror-commands';
import { keydownHandler } from 'prosemirror-keymap';
import { Command, Plugin, PluginKey } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { Extension, KeyMap, PlainExtension } from '../../type';

@extensionName('key_map')
class KeyMapExtension extends PlainExtension {
	sortedKeyMap: Map<string, { command: Command; priority: number }[]> = new Map();
	mergedKeyMap: {
		[shortCutName: string]: Command;
	} = {};

	createPlugins() {
		this.sortKeyMap().mergeKeyMap();
		const key = new PluginKey(KeyMapExtension.extensionName);
		const plugin = new Plugin({
			key,
			props: {
				handleKeyDown: (view, event) => {
					return keydownHandler(this.mergedKeyMap)(view, event);
				},
			},
		});
		return [plugin];
	}

	sortKeyMap() {
		if (!this.editorStore) {
			return this;
		}
		const storeKeyMapToMap = (keymap: KeyMap) => {
			Object.entries(keymap).forEach(([shortcutName, command]) => {
				const processedCommand = command instanceof Function ? { priority: 1, command } : command;
				if (this.sortedKeyMap.has(shortcutName)) {
					this.sortedKeyMap.set(shortcutName, [
						...this.sortedKeyMap.get(shortcutName)!,
						processedCommand,
					]);
				} else {
					this.sortedKeyMap.set(shortcutName, [processedCommand]);
				}
			});
		};
		const storeKeyMapOfExtensionToMap = (extension: Extension) => {
			if (extension.createKeyMap) {
				const keymap = extension.createKeyMap();
				storeKeyMapToMap(keymap);
			}
		};
		this.editorStore.markExtensions.forEach(storeKeyMapOfExtensionToMap);
		this.editorStore.nodeExtensions.forEach(storeKeyMapOfExtensionToMap);
		this.editorStore.plainExtensions.forEach(storeKeyMapOfExtensionToMap);
		storeKeyMapToMap(baseKeymap);

		for (const [shortcutName, commands] of this.sortedKeyMap.entries()) {
			this.sortedKeyMap.set(
				shortcutName,
				commands.sort((a, b) => b.priority - a.priority),
			);
		}
		return this;
	}

	mergeKeyMap() {
		this.mergedKeyMap = [...this.sortedKeyMap.entries()].reduce(
			(result, [shortcutName, commands]) => {
				result[shortcutName] = chainCommands(...commands.map((command) => command.command));
				return result;
			},
			{} as {
				[shortCutName: string]: Command;
			},
		);
		return this;
	}
}

export default KeyMapExtension;
