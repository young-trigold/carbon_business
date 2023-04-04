import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import { extensionName } from '../../decorators/extensionName';
import { PlainExtension } from '../../type';

@extensionName('schema')
class SchemaExtension extends PlainExtension {
	onEditorStoreCreate(): void {
		if (!this.editorStore) return;

		const marks = this.editorStore.markExtensions.reduce((result, extension) => {
			result[extension.name] = extension.createMarkSpec();
			return result;
		}, {} as Record<string, MarkSpec>);

		const nodes = this.editorStore.nodeExtensions.reduce((result, extension) => {
			result[extension.name] = extension.createNodeSpec();
			return result;
		}, {} as Record<string, NodeSpec>);

		const mySchema = new Schema({
			marks,
			nodes,
			topNode: 'doc',
		});
		this.editorStore.schema = mySchema;
	}
}

export default SchemaExtension;
