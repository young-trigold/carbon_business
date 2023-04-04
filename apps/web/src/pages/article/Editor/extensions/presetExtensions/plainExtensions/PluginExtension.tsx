import { Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import { extensionName } from '../../decorators/extensionName';
import { Extension, PlainExtension } from '../../type';

@extensionName('plugin')
class PluginExtension extends PlainExtension {
	onEditorStoreCreate(): void {
		if (!this.editorStore) return;
		const createPlugins = (extension: Extension) => extension.createPlugins?.();
		const markPlugins = this.editorStore.markExtensions.map(createPlugins);
		const nodePlugins = this.editorStore.nodeExtensions.map(createPlugins);
		const plainPlugins = this.editorStore.plainExtensions.map(createPlugins);
		const plugins = [...markPlugins, ...nodePlugins, ...plainPlugins].flat().filter(Boolean);
		this.editorStore.plugins = plugins as ProseMirrorPlugin[];
	}
}

export default PluginExtension;
