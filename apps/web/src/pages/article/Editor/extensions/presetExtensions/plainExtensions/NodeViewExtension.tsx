import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeViewConstructor } from 'prosemirror-view';
import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

@extensionName('node_view')
class NodeViewExtension extends PlainExtension {
	createPlugins() {
		if (!this.editorStore) return [];
		const key = new PluginKey(NodeViewExtension.extensionName);
		const nodeViews = this.editorStore.nodeExtensions.reduce((result, extension) => {
			if (extension.createNodeView) result[extension.name] = extension.createNodeView();
			return result;
		}, {} as Record<string, NodeViewConstructor>);

		const plugin = new Plugin({
			key,
			props: {
				nodeViews,
			},
		});

		return [plugin];
	}
}

export default NodeViewExtension;
